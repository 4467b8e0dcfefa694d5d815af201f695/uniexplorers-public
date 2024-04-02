from typing import List
from os import getenv
from hashlib import md5

import redis.asyncio as redis
# import redis
from gensim.models import KeyedVectors


# Expect import at app.py level
GLOVE_FILENAME: str = "algo/glove/glove-wiki-gigaword-50.model"

nlp: KeyedVectors | None = None
def load_model() -> None:
    global nlp
    nlp = KeyedVectors.load(GLOVE_FILENAME)


cache: redis.Redis | None = None
def load_cache() -> None:
    global cache
    cache = redis.Redis(
            host=getenv("REDIS_HOST"),
            password=getenv("REDIS_PASSWORD"),
            port=getenv("REDIS_PORT"),
            decode_responses=True
        )
    

# Store in RAM to reduce instantiation time
load_model()
load_cache()


async def calculate_similarity(user_tag_ls: List[str], uni_tag_ls: List[str]) -> float:
    # ensure lowercase
    user_tag_lower: List[str] = [word.lower() for phrase in user_tag_ls['interests'] for word in phrase.split()]
    uni_tag_lower: List[str] = [word.lower() for phrase in uni_tag_ls for word in phrase.split()]
    # O(N^2) but really can't be helped

    user_str: str = "".join(user_tag_lower)
    uni_str: str = "".join(uni_tag_lower)

    query_md5: str = md5((user_str + uni_str).encode()).hexdigest()
    cache_key: str = f"similarity_{query_md5}"
    
    # attempt cache query
    cache_similarity: float | None = await cache.get(cache_key)

    if cache_similarity:
        # print(cache_similarity)
        # print("Cache hit!")
        return cache_similarity
    else:
        # print("Cache miss!")
        similarity: float = float(nlp.n_similarity(user_tag_lower, uni_tag_lower))
        cache.set(cache_key, similarity)

        return similarity

