# pip install pandas openpyxl python-dotenv sqlalchemy psycopg2
import os
import time
from pathlib import Path
from typing import List, Tuple

import psycopg2
import pandas as pd
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine

from const import *

load_dotenv(find_dotenv())

if not UNI_GPAS_XLSX_PATH.exists() or not UNI_GPAS_XLSX_PATH.is_file():
    print("Please ensure uni GPAS Excel file exists and is in the path data/gpas.xlsx")

if not UNI_COURSES_CSV_PATH.exists() or not UNI_COURSES_CSV_PATH.is_file():
    print("Please ensure uni data CSV exists and is in the path data/data.csv")

if not UNI_TAGS_JSON_PATH.exists() or not UNI_TAGS_JSON_PATH.is_file():
    print("Please ensure uni tags JSON exists and is in the path data/out_uni_tags.json")


def get_uni_connstring() -> None | str:
    POSTGRES_USER: str | None = os.getenv("UNI_DB_USER")
    POSTGRES_PASSWORD: str | None = os.getenv("UNI_DB_PASSWORD")
    POSTGRES_PORT: int | None = int(os.getenv("UNI_DB_PORT"))
    POSTGRES_HOST: str | None = os.getenv("UNI_DB_HOST")
    # POSTGRES_HOST: str = "localhost"
    POSTGRES_DATABASE: str | None = os.getenv("UNI_DB_NAME")

    return f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DATABASE}"


def get_forum_connstring() -> None | str:
    POSTGRES_USER: str | None = os.getenv("FORUM_DB_USER")
    POSTGRES_PASSWORD: str | None = os.getenv("FORUM_DB_PASSWORD")
    POSTGRES_PORT: int | None = int(os.getenv("FORUM_DB_PORT"))
    POSTGRES_HOST: str | None = os.getenv("FORUM_DB_HOST")
    # POSTGRES_HOST: str = "localhost"
    POSTGRES_DATABASE: str | None = os.getenv("FORUM_DB_NAME")

    return f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DATABASE}"


def insert_uni_data(uni_gpas_df: pd.DataFrame, connstring: str) -> None:
    conn = create_engine(connstring)
    uni_gpas_df.to_sql('university', con=conn, if_exists="append", index=False)
    print("University data inserted")
    conn.dispose()


def insert_major_data(uni_major_df: pd.DataFrame, connstring: str) -> None:
    conn = create_engine(connstring)
    # tags_df: pd.DataFrame = pd.DataFrame(ALL_TAGS, columns=['name'])
    # tags_df.to_sql('tag', con=conn, if_exists="append", index=False)
    # print("Tags inserted")
    uni_major_df.to_sql('uni_major', con=conn, if_exists="append", index=False)
    print("University majors inserted")
    conn.dispose()


def insert_uni_tag_data(uni_gpas_df: pd.DataFrame, uni_tags_df: pd.DataFrame, connstring: str) -> None:
    conn = create_engine(connstring)
    # tags_df: pd.DataFrame = pd.DataFrame(ALL_TAGS, columns=['name'])
    # tags_df.to_sql('tag', con=conn, if_exists="append", index=False)
    # print("Tags inserted")
    filtered_uni_tags_df = pd.merge(uni_tags_df, uni_gpas_df[['name']], left_on='university_name', right_on='name', how='inner')
    filtered_uni_tags_df = filtered_uni_tags_df.drop('name', axis=1)
    filtered_uni_tags_df.to_sql('uni_tag', con=conn, if_exists="append", index=False)
    print("University tags inserted")
    conn.dispose()


def insert_forum_data(uni_gpas_df: pd.DataFrame, connstring: str) -> None:
    conn = psycopg2.connect(connstring)
    cursor = conn.cursor()

    forum_details: List[Tuple[str, str]] = [
        ('Budget', 'Discuss and share information about the university budget.'),
        ('Accommodation', 'Find and share information about accommodation options.'),
        ('AMA', 'Ask Me Anything! Get to know more about the university.'),
        ("Who's going", 'Connect with other students who are going to this university.'),
        ('What to do', 'Share and discuss things to do around the university.')
    ]

    for index, row in uni_gpas_df.iterrows():
        uni_name: str = row["name"]
        insert_query: str = """
        INSERT INTO uni_forum_thread (university_name, forum_title, forum_text, forum_text_raw, user_email)
        VALUES (%s, %s, %s, %s, %s);
        """

        for title, text in forum_details:
            cursor.execute(insert_query, (uni_name, title, text, text, 'admin@uniexplorers.com'))
    
    conn.commit()
    cursor.close()
    conn.close()

    print("Forum data seeded")



# def insert_course_mapping(course_mapping_df: pd.DataFrame, connstring: str) -> None:
#     conn = create_engine(connstring)
#     course_mapping_df.to_sql('course_mapping', con=conn, if_exists="append", index=False)
#     print("Course mapping inserted")


'''
GPAs to-do
- OHE GPAs for diff degrees
- Convert "Central Asia" to "Asia" in Region
- Rename columns
'''

uni_gpas_df: pd.DataFrame = pd.read_excel(UNI_GPAS_XLSX_PATH)
# Remove text
uni_gpas_df = uni_gpas_df.iloc[3:]
# Set column names
uni_gpas_df.columns = uni_gpas_df.iloc[0]
# Remove set column names
uni_gpas_df = uni_gpas_df.iloc[1:]
# Reset indices
uni_gpas_df = uni_gpas_df.reset_index(drop=True)

# Rename columns
uni_gpas_df = uni_gpas_df.rename(columns=COLUMN_RENAME_MAPPING)

# Change "Central Asia" to "Asia"
uni_gpas_df.loc[uni_gpas_df["continent"] == "Central Asia", "continent"] = "Asia"

# Cast column types
uni_gpas_df["gpa_10_percentile"] = uni_gpas_df["gpa_10_percentile"].astype(float)
uni_gpas_df["gpa_90_percentile"] = uni_gpas_df["gpa_90_percentile"].astype(float)

# Remove newlines
uni_gpas_df = uni_gpas_df.replace(r'\n',' ', regex=True)

'''
Create uni_tags entries

Format: {uni_name: ["list", "of", "degree", "names"], uni_name_2: ["list", "of", "degree", "names"]}
'''

# print(uni_gpas_df["applicable_to"].unique().tolist())

uni_gpas_df["applicable_to"] = uni_gpas_df["applicable_to"].apply(lambda x: APPLICABLE_TO_MAPPING[x])

# For initializing uni tags
uni_major_df: pd.DataFrame = uni_gpas_df.loc[:, ["name", "applicable_to"]]
# uni_tags_dict: Dict[str, List[str]] = dict(zip(uni_major_df["name"], uni_major_df["applicable_to"]))

# Drop columns not in DB
uni_gpas_df = uni_gpas_df.drop(columns=["ORG_ID", "applicable_to", "gpa_requirement"])

# uni_gpas_df = pd.get_dummies(uni_gpas_df, columns=["applicable_to"])

# print(uni_gpas_df[["applicable_to"]].join(uni_gpas_df.applicable_to.str.join('|').str.get_dummies().add_prefix('applicable_to_')))

# Explode
uni_major_df = uni_major_df.explode("applicable_to")
# Rename columns
uni_major_df = uni_major_df.rename(columns=TAG_COLUMN_RENAME_MAPPING)

# course_mapping_df: pd.DataFrame = pd.read_csv(UNI_COURSES_CSV_PATH)
# course_mapping_df = course_mapping_df.rename(columns=COURSE_MAPPING_COLUMN)

uni_tags_df: pd.DataFrame = pd.read_json(UNI_TAGS_JSON_PATH)

if __name__ == '__main__':
    # with open("course_mapping.json", "w") as outf:
    #     course_mapping_df.to_json(outf, orient="records")
    try:
        if not DONE_INDICATOR.is_file():
            insert_uni_data(uni_gpas_df, get_uni_connstring())
            insert_major_data(uni_major_df, get_uni_connstring())
            insert_forum_data(uni_gpas_df, get_forum_connstring())
            insert_uni_tag_data(uni_gpas_df, uni_tags_df, get_uni_connstring())

            DONE_INDICATOR.touch()
        else:
            print("Ingestion already completed")
    except Exception as e:
        print(e)
        print("Ingestion failed")


