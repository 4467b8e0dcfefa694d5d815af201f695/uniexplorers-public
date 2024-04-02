from typing import List, Dict
from pathlib import Path


UNI_GPAS_XLSX_PATH: Path = Path("ingestion_data/gpas.xlsx")
UNI_COURSES_CSV_PATH: Path = Path("ingestion_data/data.csv")
UNI_TAGS_JSON_PATH: Path = Path("ingestion_data/uni_tag.json")
DONE_INDICATOR: Path = Path("./done")

# Course Title,University,Country,Course Area
COURSE_MAPPING_COLUMN: Dict[str, str] = {
    "Course Title": "course_title",
    "University": "university",
    "Country": "country",
    "Course Area": "course_area"
}

COLUMN_RENAME_MAPPING: Dict[str, str] = {
    "Region": "continent",
    "Region/ Country": "location",
    "Name of Partner University": "name",
    "GPA Requirement from Partner\nUniversity": "gpa_requirement",
    "Applicable only for students in the following\nDegree programmes": "applicable_to",
    "10th Percentile": "gpa_10_percentile",
    "90th Percentile": "gpa_90_percentile"
}

TAG_COLUMN_RENAME_MAPPING: Dict[str, str] = {
    "name": "university_name",
    "applicable_to": "major_name"
}

UNIQUE_APPLICABLE_TO: List[str] = [
    'LLB & JD', 
    'All (except LLB & JD)', 
    'BAcc, BBM, BSc (Econ)', 
    'BSocSc', 
    'BSc (Econs)', 
    'All (except BBM, LLB & JD)', 
    'BSc (Econ) & BSocSc', 
    'All', 
    'BSc (IS), BSc (CS) & BSc (C&L)', 
    'BBM & BSc (Econ)', 
    'BBM, BSc (Econ), LLB &', 
    'BSc (Econ)', 
    'BAcc & BBM', 
    'BBM', 
    'BAcc, BBM, BSc (Econ), BSc (IS), BSc (CS) & BSc (C&L)']

# All tags: Law, Accountancy, Business, Social Sciences, Economics, Computing & Law, Information Systems, Computer Science

ALL_TAGS: List[str] = [
    "Accountancy", "Business", "Social Sciences", "Economics", "Computing & Law", "Information Systems", "Computer Science", "Law"
]

APPLICABLE_TO_MAPPING: Dict[str, List[str]] = {
    'LLB & JD': ["Law"], 
    'All (except LLB & JD)': ["Accountancy", "Business", "Social Sciences", "Economics", "Computing & Law", "Information Systems", "Computer Science"], 
    'BAcc, BBM, BSc (Econ)': ["Accountancy", "Business", "Economics"], 
    'BSocSc': ["Social Sciences"], 
    'BSc (Econs)': ["Economics"], 
    'BSc (Econ)': ["Economics"], 
    'All (except BBM, LLB & JD)': ["Accountancy", "Social Sciences", "Economics", "Computing & Law", "Information Systems", "Computer Science"], 
    'BSc (Econ) & BSocSc': ["Social Sciences", "Economics"], 
    'All': ["Law", "Accountancy", "Business", "Social Sciences", "Economics", "Computing & Law", "Information Systems", "Computer Science"], 
    'BSc (IS), BSc (CS) & BSc (C&L)': ["Computing & Law", "Information Systems", "Computer Science"], 
    'BBM & BSc (Econ)': ["Business", "Economics"], 
    'BBM, BSc (Econ), LLB &': ["Business", "Economics", "Law"], 
    'BAcc & BBM': ["Accountancy", "Business"], 
    'BBM': ["Business"], 
    'BAcc, BBM, BSc (Econ), BSc (IS), BSc (CS) & BSc (C&L)': ["Accountancy", "Business", "Economics", "Computing & Law", "Information Systems", "Computer Science"]
}