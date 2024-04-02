from os import getenv
from typing import List

import requests


UNI_API_URL: str | None = None
USER_API_URL: str | None = None
def ensure_api() -> None:
    global UNI_API_URL
    global USER_API_URL

    UNI_API_URL = getenv("UNI_API_URL")
    if UNI_API_URL is None:
        print("!!! BIG ERROR NO UNI_API_URL !!!")

    USER_API_URL = getenv("USER_API_URL")
    if USER_API_URL is None:
        print("!!! BIG ERROR NO USER_API_URL !!!")

ensure_api()


def get_user_interests(user_email: str) -> List[str] | None:
    REQUEST_URL: str = f"{USER_API_URL}/users/interests/{user_email}"

    resp = requests.get(REQUEST_URL)

    if resp.status_code == 200:
        return resp.json()
    else:
        return