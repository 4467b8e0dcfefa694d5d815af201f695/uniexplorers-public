<template>
    <div class="right-side relative h-full">
        <div v-if="!isCurrentRoomEmpty" class="flex flex-col h-full">
            <div class="room-header">
                <div class="image-container" v-if="otherUser && otherUser.image_filename">
                    <img :src="otherUser.image_filename" class="image w-10 h-10 rounded-lg"/>
                </div>
                <div v-else>
                    <div class="text-black">v-else</div>
                    <div class="image-container-container">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#8f8f8f"></path> <path d="M16.807 19.0112C15.4398 19.9504 13.7841 20.5 12 20.5C10.2159 20.5 8.56023 19.9503 7.193 19.0111C6.58915 18.5963 6.33109 17.8062 6.68219 17.1632C7.41001 15.8302 8.90973 15 12 15C15.0903 15 16.59 15.8303 17.3178 17.1632C17.6689 17.8062 17.4108 18.5964 16.807 19.0112Z" fill="#8f8f8f"></path> <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3432 6 9.00004 7.34315 9.00004 9C9.00004 10.6569 10.3432 12 12 12Z" fill="#8f8f8f"></path> </g></svg>
                    </div>
                </div>
                <div class="name" v-if="otherUser && otherUser.email">
                    {{ getUsername(otherUser.email) }}
                </div>
                <div v-if="typing.isTyping" class="typing">
                    {{ typing.tpingUser }} is typing...
                </div>
                <!-- <div v-else class="status">
                    {{ userStatus }}
                </div> -->
            </div>
            <!-- <div>{{excludeFirstMessage}}</div> -->
            <div class="room-content h-full overflow-auto scroll-smooth" ref="messageContainer">
                <ul v-if=" messages.length > 0 && excludeFirstMessage.length > 0" ref="messageList" class="pb-16 flex flex-col">
                    <li v-for="message in excludeFirstMessage" :key="message.id" :class="{'sent-by-me': message.from.email !== otherUser.email, 'sent-by-other': message.from.email === otherUser.email}">
                        <chat-bubble :message="message" :user="message.from" class="chat-bubble"></chat-bubble>
                    </li>
                </ul>

                <div class="bottom w-full p-4 items-center bg-white">
                    <input class="textInput rounded-lg" type="text" v-model="inputText" placeholder="Type your message..."  @keydown.enter="send" @keydown="typing"/>
                    <button @click="send" class="btnAction" >Send</button>
                </div>
            </div>
        </div>

        <div v-else>
            <h1 class="no-rooms">No rooms</h1>
        </div>
    </div>
</template>

<script>
    import ChatBubble from './ChatBubble.vue'

    export default {
        props: {
            currentRoom: Object,
            typingUsers: String,
            messages: Array,
            user: Object,
            otherUser: Object,
            // TODO: Watch updated prop for any changes to messages
            updated: String
        },
        components: {
            ChatBubble
        },
        mounted() {
            this.scrollToBottom()
        },
        watch: {
            updated: function (newVal, oldVal) {
                this.scrollToBottom()
            }
        },
        data() {
            return {
                inputText: "",
                isTyping: false,
            };
        },
        computed: {
            isCurrentRoomEmpty() {
                if (this.currentRoom) {
                    return Object.keys(this.currentRoom).length === 0;
                }
            },

            excludeFirstMessage() {
            return this.messages.slice(1)
            }
        },
        methods: {
            send() {
                if (this.inputText && !this.isCurrentRoomEmpty) {
                    this.$emit("send", this.inputText);
                    this.inputText = "";
                }
            },
            scrollToBottom() {
                console.log('scrolling?')
                console.log(this.$refs.messageContainer)
                this.$nextTick( () => {
                    const container = this.$refs.messageContainer;
                    if (!container) return
                    
					setTimeout(() => {
						container.scrollTop = container.scrollHeight;
						console.log(container.scrollTop);
						console.log(container.scrollHeight);
					}, 50);
                })
            },
            getUsername(email) {
                if (email) {
                    return email.split('@')[0];
                }
            },
            typing() {
                this.$emit("typing", this.user)
            }
        }
    }
	// var isScrolledToBottom = list.scrollHeight - list.clientHeight <= list.scrollTop + 1;
	// if(isScrolledToBottom) {
	//     // console.log(list, isScrolledToBottom, list.scrollHeight, list.clientHeight, list.scrollTop);
	// 	console.log("list", list)
	// 	console.log("isCrolledToBottom", isScrolledToBottom)
	// 	console.log("scrollHeight", list.scrollHeight)
	// 	console.log("clientHeight", list.clientHeight)
	// 	console.log("scrollTop", list.scrollTop)
</script>

<style scoped>
  /* Right side styles */
.right-side {
    background: white;
    width: 70%;
    position: relative;
    border-left: 0.1rem solid #a4a4a4;
}

.room-header {
    display: flex;
    padding: 2%;
    border-bottom: 0.1rem solid #a4a4a4;
}

.room-header .name {
    color: #1E363E;
    font-weight: bold;
    font-size: 120%;
    margin-top: 1%;
}

.room-header .image-container {
    margin-right: 1%
}

.room-content .chat-bubble {
    margin: 3%
}

.bottom {
    position:absolute;
    bottom: 0;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    gap: 0.5em;
}

.sent-by-me .chat-bubble{
    flex-direction: row-reverse;
}

.no-rooms {
    color: #1E363E;
    text-align: center;
    margin-top: 5%;
}
</style>