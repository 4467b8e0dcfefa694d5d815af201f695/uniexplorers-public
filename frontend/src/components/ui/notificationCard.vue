<script>
import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';

var image_url = "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
export default {
  data() {
    return {
      image_url: image_url,
      items: [
        {
          email: 'email@windster.com',
          comment: 'Neil Sims commented "Amazing experience!"',
          image_url: image_url
        },
        {
          email: 'email@windster.com',
          comment: 'Bonnie Green commented "Amazing experience!"',
          image_url: image_url
        },
        {
          email: 'email@windster.com',
          comment: 'Michael Gough commented "Amazing experience!"',
          image_url: image_url
        },
        {
          email: 'email@windster.com',
          comment: 'Lana Byrd commented "Amazing experience!"',
          image_url: image_url
        },
        {
          email: 'email@windster.com',
          comment: 'Thomes Lean commented "Amazing experience!"',
          image_url: image_url
        }
      ]
    };
  },
  props: {
    notifs: {
      type: Array,
      required: true,
    }
  },
  computed() {
    
  },
  methods: {
    websocket() {
      const authStore = useAuthStore()
      const user_email = authStore.user.primaryEmailAddress.emailAddress

      this.socket = new WebSocket('ws://localhost:9999/ws?userEmail=' + user_email);
      this.socket.onopen = (event) => {
        console.log(event)
        console.log("Successfully connected to websocket server")
      }

      this.socket.onmessage = (event) => {
        console.log(event)
      }
    }
  }
};
</script>

<template>
  <div
    class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Notifications</h5>
      <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
        View all
      </a>
    </div>
    <div class="flow-root overflow-y-auto h-80">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="(item, index) in notifs" :key="index" class="py-3 sm:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="w-8 h-8 rounded-full" :src="image_url" :alt="`${item.commentBy} image`">
            </div>
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-sm text-gray-900 truncate dark:text-white"><span class="font-semibold">{{ item.commentBy }}</span> commented "{{ item.message }}"</p>
              <!-- <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{ item.email }}</p> -->
            </div>
          </div>
          <div class="flex items-center" v-if="notifs.length == 0">
            <p class="text-sm text-gray-900 truncate dark:text-white">
              You have no new notifications
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>