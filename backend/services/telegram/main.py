import os

from quart import Quart, request
from quart_cors import cors

from api.university import *

import urllib.parse

from teleFunction import *

app = Quart(__name__)
app = cors(app, allow_origin=os.environ.get('ORIGIN'),
           allow_methods=["GET", "POST", "OPTIONS"], 
           allow_headers=["Content-Type", "Authorization"])


@app.route('/')
async def index():
    return "Hello!", 200


@app.route('/telegram/create_group', methods=['POST'])
async def get_group_route():
    data = await request.get_json()
    usernames = data['usernames']
    university = data['university']
    
    invite_link = await get_group(usernames, university)

    set_invite_link(university, invite_link)
    
    return {'invite_link': invite_link}


@app.route('/telegram/get_invite_link', methods=['GET'])
async def get_invite_link_route():
    university = request.args.get('university')
    if university is None:
        return {'error': 'Missing university parameter'}, 400

    invite_link = retrieve_invite_link(university)
    if invite_link is None:
        return {'error': 'No invite link found for the university'}, 404

    return {'invite_link': invite_link}, 200


@app.route('/telegram/get_participant_numbers', methods=['GET'])
async def get_count_route():
    raw_query_string = request.query_string.decode()
    
    # Parse the raw query string manually
    parsed_query = urllib.parse.parse_qs(raw_query_string)
    
    # Extract the invite_link, accounting for possible URL encoding issues
    invite_link = request.args.get('invite_link')
    if invite_link is None:
        return {'error': 'Missing invite_link parameter'}, 400

    invite_link = invite_link.replace(" ", "+")
    # print(invite_link)
    count = await get_participant_numbers(invite_link)

    return {'count': count}, 201


if __name__ == '__main__':
    app.run('0.0.0.0', port=12069, debug=True)
