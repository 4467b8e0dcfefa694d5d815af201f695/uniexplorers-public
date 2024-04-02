from typing import Dict, List
from os import getenv

from fastapi import FastAPI, Depends
import redis

from models.similarity import SimilarityObject

from api import university, user

from utils.jwt import JWTBearer

from algo.similarity import calculate_similarity

app: FastAPI = FastAPI()
cache = None

def load_cache() -> None:
    global cache
    cache = redis.Redis(
            host=getenv("REDIS_HOST"),
            password=getenv("REDIS_PASSWORD"),
            port=getenv("REDIS_PORT"),
            decode_responses=True
        )
    
load_cache()


@app.get("/")
async def root() -> Dict[str, str]:
    return {
        "status": "healthy",
        "message": "recommdender service running"
    }


@app.get("/similarity", dependencies=[Depends(JWTBearer())])
async def get_similarity(sim_obj: SimilarityObject, token_data: Dict[str, str] = Depends(JWTBearer())):
    req_uni_name: str = sim_obj.university_name
    req_user_email: str = token_data.get("email")

    university_tags: List[str] = university.get_uni_tags(req_uni_name)
    user_interests: List[str] = user.get_user_interests(req_user_email)

    sim_rating: float = await calculate_similarity(user_interests, university_tags)

    return {
        "user_email": req_user_email,
        "university_name": req_uni_name,
        "similarity": sim_rating
    }


@app.get("/similarity_all", dependencies=[Depends(JWTBearer())])
async def get_user_universities_similarity(token_data: Dict[str, str] = Depends(JWTBearer())):
    req_user_email: str = token_data.get("email")
    
    user_interests: List[str] = user.get_user_interests(req_user_email)

    all_universities: List[str] = university.get_all_uni_names()

    similarities = []
    
    for uni_name in all_universities:
        university_tags: List[str] = university.get_uni_tags(uni_name)

        if len(university_tags) == 0:
            continue
        
        sim_rating: float = await calculate_similarity(user_interests, university_tags)

        similarity_dict: Dict[str, str | float] = {
            "university_name": uni_name,
            "similarity": sim_rating
        }

        similarities.append(similarity_dict)
    
    similarities.sort(key = lambda uni: uni.get("similarity", 0), reverse=True)

    return similarities
