<template>
  <div class="chat-container">

    <chat-list :user="user" :rooms="rooms" :other-users="otherUsers" :other-user="otherUser" :latest-messages="latestMessages ? latestMessages : []" @joinRoom="joinRoom" @selectRoom="selectedRoom" :typingUsers="userTyping"></chat-list>

    <room :updated="updatedChat" :current-room="currentRoom" :other-user="otherUser" :messages="messages" :user="user" :typing="typing" @send="sendMessage" @typing="userTyping"></room>

  </div>
</template>

<script>
import io from 'socket.io-client';
import chatList from '../components/directMessage/ChatList'
import room from '../components/directMessage/Room'
import { useAuthStore } from '@/stores'
import { useRoomStore } from '@/stores'
import { fetchWrapper } from '@/helpers/fetch-wrapper'

const roomStore = useRoomStore();

export default {
  data() {
    return {
      user: {},
      rooms: [],
      currentRoom: {},
      messages: [],
      latestMessages: [],
      otherUser: {},
      otherUsers: [],
      typing: {isTyping: false, typingUser: false},
    };
  },
  components: {
    chatList,
    room,
  },
  async created() {
    // try {
      // Initialize socket connection and listen for events
      // this.socket = io(import.meta.env.VITE_CHAT_BACKEND);
      // this.socket = io('http://localhost', {path: '/chat-api/socket.io'});
      this.socket = io(import.meta.env.VITE_BACKEND, {path: '/chat-api/socket.io'});
      this.socket.on("connect", () => {
        console.log("Connected to server");
      });
  
      // Listen to room created
      this.socket.on("roomCreated", (room, message) => {
        console.log("recvied from socket", room)
        // New room
        roomStore.addRoom(room)
        this.rooms = roomStore.rooms

        // Set new room as current room
        roomStore.setRoom(room)
        this.currentRoom = roomStore.currentRoom

        // Set new other user and add to otherUsers
        const participants = room.participants
        roomStore.setOtherUser(participants.find(participant => participant.email != this.user.email))
        this.otherUser = roomStore.otherUser
        this.otherUsers.push(this.otherUser)
        console.log(this.otherUsers)

        // Reset messages
        roomStore.setMessages([])
        roomStore.addMessage(message)
        this.messages = roomStore.messages
        this.latestMessages.push(roomStore.messages[roomStore.messages.length - 1])
      })
  
      // Listen to message sent
      this.socket.on("messageSent", (message) => {
        roomStore.addMessage(message)

        this.messages = roomStore.messages

        if (this.latestMessages.length > 0) {
          for (let lMessage of this.latestMessages) {
            if (message.roomId == lMessage.roomId) {
              const index = this.latestMessages.indexOf(lMessage)
              this.latestMessages.splice(index, 1)
              this.latestMessages.push(message)
            }
          }
        } else {
          this.latestMessages.push(roomStore.messages[roomStore.messages.length -  1])
        }

        this.sentNewMessage = true
      })
  
      // Listen to typing user
      this.socket.on("handleTpying", (user) => {
        this.typing.isTyping = true
        this.typing.typingUser = user
      });
      
      window.addEventListener('beforeunload', this.handleRefresh);

      const authStore = useAuthStore();
      const userFromStore = authStore.user

      // Store user
      if (Object.keys(userFromStore).length != 0) {
        this.user = {email: userFromStore.emailAddresses[0].emailAddress, image_filename: authStore.getProfileImage}
      }
      
      // Store rooms and otherUsers
      if (Object.keys(this.user).length != 0) {
        await roomStore.fetchRooms(this.user.email)
        this.rooms = roomStore.rooms
        this.otherUsers = this.computeOtherUsers
        if (this.rooms.length > 0) {
          this.currentRoom = roomStore.currentRoom
          console.log(Object.keys(this.currentRoom).length == 0)
          if (Object.keys(this.currentRoom).length == 0) {
            roomStore.setRoom(this.rooms[0])
            this.currentRoom = roomStore.currentRoom
          }

          for (let room of this.rooms) {
            const messagesData = await fetchWrapper.get(
            `${import.meta.env.VITE_CHAT_BACKEND}/messages?room_id=${room._id}`)
            const messages = messagesData.messages
            if (messages.length > 0) {
              this.latestMessages.push(messages[messages.length - 1])
            }
          }
        }

      }

      // Store current room and other user
      if (Object.keys(this.currentRoom).length > 0 ) {
        const participants = this.currentRoom.participants
        roomStore.otherUser = participants.find(participant => participant.email != this.user.email)
        this.otherUser = roomStore.otherUser

        await roomStore.fetchMessages(this.currentRoom._id)
        this.messages = roomStore.messages
      } 

  },
  computed: {
    computeOtherUsers() {
      let returnArray = []
      if (this.rooms.length > 0) {
        for (let room of this.rooms) {
          let participants = room.participants
          returnArray.push(participants.find(participant => participant.email != this.user.email))
        }
      }
      return returnArray
    },
    computeOtherUser() {
      let participants = this.currentRoom.participants
      return participants.filter(participant => participant.email != this.user.email)
    },
    updatedChat() {
      return `${roomStore.currentRoom._id}-${this.messages.length}`
    }
  },
  methods: {
    sendMessage(inputText) {
      console.log(this.currentRoom._id)
      if (inputText.length > 0) {
        this.socket.emit("message", { roomId: this.currentRoom._id , from:this.user, text: inputText});
      }
    },

    joinRoom(otherUser) {
      if (!this.otherUsers.some(user => user.email === otherUser.email)) {

        this.socket.emit("enterRoom", { user: this.user, other_user: otherUser});
      } else {
        roomStore.findRoom(otherUser)
        this.currentRoom = roomStore.currentRoom
      }
    },

    async selectedRoom({room, user}) {
      // Update the current otherUser in the store
      roomStore.setOtherUser(user);
      this.otherUser = roomStore.otherUser
      console.log("selectedUser", this.otherUser)

      // Update the current room in the store
      roomStore.setRoom(room)
      this.currentRoom = roomStore.currentRoom
      console.log("selectedRoom",this.currentRoom)

      // Fetch new messages
      await roomStore.fetchMessages(roomStore.currentRoom._id);
      this.messages = roomStore.messages; 
    },
    
    userTyping(user) {
      this.socket.emit("typing", user)
    },
    handleRefresh() {
      this.socket.close()
      this.socket.emit("disconncted", "User refreshed")
    }
  },
};
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: row;
  margin-top: 5%;
  margin-left: 15%;
  margin-right: 15%;
  margin-bottom: 5%;
  height: 70vh;
}



</style>