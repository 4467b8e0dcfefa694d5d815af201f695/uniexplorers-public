from pydantic import BaseModel


class UniversityActivity(BaseModel):
    thread_id: int
    university_name: str
    activity_score: float

