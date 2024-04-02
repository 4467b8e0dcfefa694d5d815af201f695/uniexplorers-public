import os
from telethon import TelegramClient, functions, types, events, sync


API_ID = os.environ.get('TELEGRAM_API_ID')
API_HASH = os.environ.get('TELEGRAM_API_HASH')
PHONE_NUMBER = os.environ.get('TELEGRAM_PHONE_NUMBER')


async def get_group(usernames, university):
    group_title = f"UniExplorers {university} Groupchat"
    
    # Note: Using `async with` for the asynchronous context manager
    async with TelegramClient('anon', API_ID, API_HASH) as client:
        # await client.start(phone=PHONE_NUMBER)
        result = await client(functions.channels.CreateChannelRequest(
            title=group_title,
            about='Groupchat for fun!',
            megagroup=True
        ))

        # Extracting channel ID from the result
        channel_id = result.chats[0].id

        # Convert usernames to user entities
        user_entities = []
        for username in usernames:
            try:
                user = await client.get_input_entity(username)
                user_entities.append(user)
            except ValueError:
                print(f"Could not find user: {username}")
        
        # Add users to the supergroup
        if user_entities:
            try:
                await client(functions.channels.InviteToChannelRequest(
                    channel=channel_id,
                    users=user_entities
                ))
                print("Users added successfully.")
            except Exception as e:
                print(f"Error adding users: {e}")

        # Requesting invite link for the supergroup
        invite_link_result = await client(functions.messages.ExportChatInviteRequest(
            peer=channel_id
        ))
        invite_link = invite_link_result.link
        print(f"Invite link: {invite_link}")

    return invite_link


async def get_participant_numbers(invite_link):
    async with TelegramClient('anon', API_ID, API_HASH) as client:
        await client.start(PHONE_NUMBER)
        await client(functions.channels.JoinChannelRequest(invite_link))
        
        # Now, retrieve details about the group
        channel = await client.get_entity(invite_link)
        print(f"Channel Name: {channel.title}")
        print(f"Access Hash: {channel.access_hash}")
        
        # Getting the number of participants
        participants = await client(functions.channels.GetParticipantsRequest(channel, filter=types.ChannelParticipantsRecent(), offset=0, limit=0, hash=0))
        print(f"Number of Participants: {len(participants.users)}")

    return len(participants.users)