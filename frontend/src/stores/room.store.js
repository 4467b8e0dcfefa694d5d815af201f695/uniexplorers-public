import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'

export const useRoomStore = defineStore('room', {
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        serializer: {
          serialize: (state) => JSON.stringify(state),
          deserialize: (state) => {
            const result = JSON.parse(state)
            // If currentRoom was stored as a JSON string, parse it back to an object
            if (result.currentRoom) {
              result.currentRoom = JSON.parse(result.currentRoom)
            }
            return result
          }
        }
      }
    ]
  },
  state: () => ({
    currentRoom: {},
    rooms: [],
    messages: [],
    otherUser: {}
  }),
  actions: {
    async fetchRooms(email) {
      try {
        const roomsData = await fetchWrapper.get(
          `${import.meta.env.VITE_CHAT_BACKEND}/rooms?email=${email}`
        )
        // console.log(roomsData)
        this.rooms = roomsData.rooms
      } catch (error) {
        console.log('Error in fetching rooms')
      }
    },
    async fetchRoom(email1, email2) {
      try {
        const room = await fetchWrapper.get(
          `${import.meta.env.VITE_CHAT_BACKEND}/rooms?email1=${email1}&email2=${email2}`
        )
        // console.log(room)
        this.currentRoom = room
      } catch (error) {
        onsole.log('Error in fetching room', error)
      }
    },
    async fetchMessages(roomId) {
      try {
        const messageData = await fetchWrapper.get(
          `${import.meta.env.VITE_CHAT_BACKEND}/messages?room_id=${roomId}`
        )
        this.messages = messageData.messages
      } catch (error) {
        console.log('error in fetching in messages', error)
      }
    },
    addRoom(room) {
      this.rooms.push(room)
    },
    setRoom(room) {
      this.currentRoom = room
    },
    setMessages(messages) {
      this.messages = messages
    },
    addMessage(message) {
      this.messages.push(message)
    },
    setOtherUser(user) {
      this.otherUser = user
    },
    findRoom(user) {
      for (let room of this.rooms) {
        for (let participant of room.participants) {
          if (participant.email == user.email) {
            this.currentRoom = room
          }
        }
      }
    }
  }
})
