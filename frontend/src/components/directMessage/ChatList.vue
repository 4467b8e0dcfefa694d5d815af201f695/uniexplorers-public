<template>
	
	<div class="left-side">
	<div class="form-join">
		<div class="hidden md:block h-10 w-full">
			<userSearch @join="join" :user="this.user"/>
        </div>
        <!-- <input type="text" id="room" placeholder="Username" size="5" required v-model="otherUser">
			<button id="join" type="submit" @click="join()">Create Chat</button> -->
	</div>
	<div>
		<ul v-if="otherUsers.length > 0">
			<li v-for="(room, idx) in rooms" :key="idx" :class="{'room-item': true, 'active': otherUsers[idx] === otherUser}" @mousedown="selectRoom({room: room, user:otherUsers[idx]})">
				<div class="flex room-items">
					<div v-if="otherUsers[idx] && otherUsers[idx].image_filename" class="image-container-container">
						<div class="flex justify-center items-centerimage-container">
							<img :src="otherUsers[idx].image_filename" class="image w-10 rounded-lg outline-white outline outline-offset-1 "/>
						</div>
					</div>
					<div v-else>
						<div class="image-container-container flex justify-center items-centerimage-container">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#8f8f8f"></path> <path d="M16.807 19.0112C15.4398 19.9504 13.7841 20.5 12 20.5C10.2159 20.5 8.56023 19.9503 7.193 19.0111C6.58915 18.5963 6.33109 17.8062 6.68219 17.1632C7.41001 15.8302 8.90973 15 12 15C15.0903 15 16.59 15.8303 17.3178 17.1632C17.6689 17.8062 17.4108 18.5964 16.807 19.0112Z" fill="#8f8f8f"></path> <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3432 6 9.00004 7.34315 9.00004 9C9.00004 10.6569 10.3432 12 12 12Z" fill="#8f8f8f"></path> </g></svg>
						</div>
					</div>
					
					<!-- <div class="block room-item-room ml-4" v-if="!isMessageEmpty" >
						<p class="user">{{ getUsername(otherUsers[idx].email) }}</p>
						<p class="latest-message">{{getUsername(matchingLatestMessage(room).from.email)}}: {{ matchingLatestMessage(room).text }}</p>
						
					</div> -->
					<div class="grid grid-rows-2 ml-4 w-4/5" v-if="!isMessageEmpty" >
						<p class="user">{{ getUsername(otherUsers[idx].email) }}</p>
						<p v-if="!isMessageEmpty" class="time-stamp">{{ getTime(matchingLatestMessage(room).time) }}</p>
						<p class="latest-message col-span-2">{{getUsername(matchingLatestMessage(room).from.email)}}: {{ matchingLatestMessage(room).text }}</p>
						
					</div>
				</div>
			</li>
		</ul>
		<div v-else class="no-rooms">
		No rooms at the moment
		</div>
	</div>
	</div>

</template>

<script>
import userSearch from '@/components/forms/userSearch.vue'

export default {
	props: {
		user: Object,
		otherUser: Object,
		otherUsers: Array,
		latestMessages: Array,
		rooms: Array,
	},
	components:{
		userSearch
	},
	computed: {
		isMessageEmpty() {
			return this.latestMessages.length == 0 
		}
  	},
	methods: {
		matchingLatestMessage(room) {
			for (let message of this.latestMessages) {
				if (message.roomId == room._id) {
					// console.log(message)
					return message ? message : {text: '', time: ''}
				}
			}
		},
		join(user) {
    		this.$emit("joinRoom", user);
		},
		selectRoom(room, user) {
			this.$emit("selectRoom", room, user)
		},
		getUsername(email) {
			if (email) {
				return email.split('@')[0];
			}
		},
		getTime(input_date) {
			const [year, month, day] = new Date(input_date).toISOString().split('T')[0].split('-').map(Number);
			input_date = [day, month, year]

			const nowDate = new Date()
			const currentDate = [nowDate.getDate(), nowDate.getMonth() + 1, nowDate.getFullYear()]
			let result = ''

			let index = 2
			let timestamp = 'year'
			while (index >= 0) {
				if (currentDate[index] - input_date[index] > 0) {
				if (currentDate[index] - input_date[index] > 1) {
					result = (currentDate[index] - input_date[index]) + ' ' + timestamp + 's ago'
				} else {
					result = (currentDate[index] - input_date[index]) + ' ' + timestamp + ' ago'
				}
				break
				} 
				index--
				if (index == 1) {
				timestamp = 'month'
				} else {
				timestamp = 'day'
				}
			}
			return result ? result : 'Today'
		},
	},
};
</script>

<style scoped>
	.left-side {
		flex-direction: column;
		background: white;
		padding: 1.5rem;
		width: 35%;
		overflow-y: auto;
		max-height: 80vh
	}

	.left-side .form-join {
		display: flex;
		flex-flow: row nowrap;
		justify-content:space-between;
		gap: .25rem;
	}

	.form-join input {
		border-radius: 10px;
		padding: .5rem;
	}

	.form-join button {
		color: white;
		background: #1E363E;
		border-radius: 10px;
		padding: 1.5%;
	}

	.room-items {
	width: 100%
	}

	.room-item {
	display: flex;
	margin-top: 4%;
	margin-bottom: 4%;
	border-radius: 10px;
	transition: background-color 0.3s;
	padding-top: 4%;
	padding-bottom: 4%;
	padding-right: 4%;
	}
	
	.image {
		margin-top: 3%;
	}

	.room-item-item {
		margin-left: 3%
	}

	.image-container-container {
		margin-top: 3%
	}

	.room-item.active{
		background: rgb(216, 231, 236)
	}
	
	.room-item:hover{
		background: rgb(231, 231, 231);
	}
	
	.room-item .user {
		color: #1E363E;
		font-weight: bold;
		font-size: 120%;
	}
	
	.room-item .latest-message {
		color: #1E363E;
		font-size: 90%;
		white-space: nowrap; 
		overflow: hidden; 
		text-overflow: ellipsis;
	}
	
	.room-item .time-stamp {
		color: #1E363E;
		justify-content: space-between;
		margin-left: auto;
		font-size: 90%;
	}

	.no-latest-message {
		color:black
	}
	.no-rooms {
		color: #1E363E;
		margin-top: 10px;
		margin-left: 1px
	}

	.input-username {
		color:#1E363E
	}

	</style>
