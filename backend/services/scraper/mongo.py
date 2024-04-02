import pandas as pd
import os
import logging
from dotenv import load_dotenv
from datetime import datetime

# Mongo
from pymongo import MongoClient
from pymongo import UpdateOne

class Mongo:
    mongo_host = os.environ.get('MONGO_HOST')
    mongo_port = os.environ.get('MONGO_PORT')
    mongo_user = os.environ.get('MONGO_INITDB_ROOT_USERNAME')
    mongo_pwd = os.environ.get('MONGO_INITDB_ROOT_PASSWORD')
    mongo_db = os.environ.get('MONGO_INITDB_DATABASE')

    def __init__(self) -> None:
        load_dotenv()
        self.conn = MongoClient(f'mongodb://%s:%s@{self.mongo_host}:{self.mongo_port}' % (self.mongo_user, self.mongo_pwd))
        logging.info('MongoDB connection opened')

        self.db = self.conn['uniexplorers']
        self.coll = self.db['CourseMapping']

    def _close(self):
        self.conn.close()
        logging.info('MongoDB connection closed')

    def get_latest_output(self):
        folders = [x[0] for x in os.walk('output') if x[0] != 'output']
        datelist = [f.split('output/')[1] for f in folders]

        if len(datelist) == 0:
            return pd.read_parquet('./output/course_data_AllData_base.parquet')
        
        datestr = max(datelist)
        target_path = f'output/{datestr}'

        df = pd.DataFrame()
        for f in os.listdir(target_path):
            df_curr = pd.read_parquet(f'{target_path}/{f}')
            df = pd.concat([df, df_curr])
        
        # Write consolidated file to path
        df['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        df.to_parquet(f'{target_path}/course_data_AllData_{datestr}.parquet', index=False)
        return df

    def write_to_mongodb(self):
        logging.info('Writing SMU course mapping to MongoDB...')
        df = self.get_latest_output()
        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        data = df.to_dict('records')

        operations = []
        for row in data:
            query = {'course_title': row['course_title'], 'university': row['university'], 'course_area': row['course_area'], 'country': row['country']}
            operations.append(UpdateOne(query, {'$set': row}, upsert=True))

        result = self.coll.bulk_write(operations)

        if result.acknowledged:
            result = result.bulk_api_result
            del result['upserted']
            logging.info(f'Successfully write to MongoDB: {result}')
        else:
            logging.error('Unknown exception occurred. Failed write to MongoDB')
        
        self._close()
