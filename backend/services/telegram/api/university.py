import requests
from os import getenv

UNIVERSITY_API_URL: str | None = getenv("UNI_API_URL")
if UNIVERSITY_API_URL is None:
    print("!!! NO UNI_API_URL !!!")

TELEGRAM_UNI_API_URL: str = f"{UNIVERSITY_API_URL}/universities/telegram"


def retrieve_invite_link(university_name: str) -> str | None:
    resp = requests.get(TELEGRAM_UNI_API_URL, json = {
        "university_name": university_name
    })

    if resp.status_code == 200:
        resp_json = resp.json()

        if resp_json['success']:
            return resp_json["invite_link"]
        

def set_invite_link(university_name: str, invite_link: str) -> bool:
    resp = requests.post(TELEGRAM_UNI_API_URL, json = {
        "university_name": university_name,
        "invite_link": invite_link
    })

    if resp.status_code == 200:
        resp_json = resp.json()

        if resp_json['success']:
            return True
        
    return False