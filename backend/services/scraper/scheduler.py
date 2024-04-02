from scrape import Scraper
from mongo import Mongo
import schedule
import time
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def run_scheduled_job():
    logging.info('Running scheduled task: Scrape SMU course mappings...')
    scraper = Scraper(headless=True)
    scraper.scrape_course_mappings()
    scraper._quit()

def write_to_mongo():
    logging.info('Running scheduled task: Write to mongo...')
    mongo = Mongo()
    mongo.get_latest_output()
    mongo.write_to_mongodb()

if __name__ == '__main__':
    schedule.every(16).weeks.do(write_to_mongo)
    write_to_mongo()
    while True:
        schedule.run_pending()
        time.sleep(1)