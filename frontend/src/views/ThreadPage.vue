
<script>
import textAreaInput from '@/components/inputs/textAreaInput/textAreaInput.vue';
import { fetchWrapper } from '@/helpers/fetch-wrapper';
import comment from '@/components/discussionsPage/comment.vue';
import { useCacheStore, useAuthStore } from '@/stores'
import { mapActions, mapState } from 'pinia';

export default {
  components: {
    textAreaInput,
    comment
  },
  data() {
    return {
      forum_text : null,
      forum_title : null,
      currentReply : null,
      isWatching: false,
    }
  },
  async mounted() {
    let thread = this.setCurrentThread(this.$route.params.thread);
    
    if (thread == undefined) {
      await this.getUniThreads(this.$route.params.uniName)
      thread = this.setCurrentThread(this.$route.params.thread)
    }


    await this.retrieveComments(this.$route.params.thread);
    this.forum_text = thread.forum_text;
    this.forum_title = thread.forum_title;

    await this.checkWatchStatus();
  },
  unmounted() {
    
  },
  computed: {
    ...mapState(useAuthStore, ['getProfileImage', 'getName', 'getEmail']),
    ...mapState(useCacheStore, ['comments'])
  },
  methods: {

    toggleWatch() {
      const data = {
        thread_id: this.$route.params.thread,
        user_email: this.getEmail,
      };
      fetchWrapper.post(`${import.meta.env.VITE_FORUM_BACKEND}/forum/watch_thread`, data)
        .then(response => {
          this.isWatching = !this.isWatching;
          this.connectWebsocket()
        })
        .catch(error => {
          console.error('Failed to toggle watch status', error);
        });
    },

    async checkWatchStatus() {
      try {
        const userEmail = this.getEmail
        const url = `${import.meta.env.VITE_FORUM_BACKEND}/forum/watch_thread/check/${this.$route.params.thread}?user_email=${userEmail}`;
        const res = await fetchWrapper.get(url);

        this.isWatching = res.isWatching;
      } catch (error) {
        console.error('Error checking watch status:', error);
      }
    },

    setReply(commentId) {
      this.currentReply = commentId
    },
    handlePost(postData) {

      const regxp = /<a\s+href="((?!https?:\/\/)[^"]+)"/g
      fetchWrapper.post(import.meta.env.VITE_FORUM_BACKEND + '/forum/comments', {
        comment_text: postData.comment_text,
        uni_name: this.$route.params.uniName,
        comment_text_raw: postData.comment_text_raw.replace(regxp, '<a href="http://$1"'),
        thread_id: this.$route.params.thread,
      }).then(data => {
        this.currentReply = null
        const createdComment = data[0]
        createdComment.depth = 1
        this.addComment(createdComment)
      }).catch(err => {
        console.log(err);
      })
    },
    ...mapActions(useCacheStore, ['setCurrentThread', 'retrieveComments', 'getUniThreads', 'addComment']),
    ...mapActions(useAuthStore, ['connectWebsocket'])
  },
};
</script>


<template>
  <div class=" h-auto flex m-4 overflow-y-auto">

    <div class="wrapper basis-1/6 hidden md:block">
      <!-- University Information Card -->
      <div class="university-info-card rounded-xl bg-white border-2 text-darkgreen">
        <div class="university-info break-words text-center">
            <h2>{{ $route.params.uniName }}</h2>
        </div>
        <!-- <div class="location-gpa-semester">
          <div class="font-bold info">
              <svg class="svg-icon" viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.47143 0 0 4.5385 0 10.15C0 12.673 0.714285 15.0365 2.01429 17.168C3.37143 19.401 5.15714 21.315 6.52857 23.548C7.2 24.6355 7.68571 25.6505 8.2 26.825C8.57143 27.6225 8.87143 29 10 29C11.1286 29 11.4286 27.6225 11.7857 26.825C12.3143 25.6505 12.7857 24.6355 13.4571 23.548C14.8286 21.3295 16.6143 19.4155 17.9714 17.168C19.2857 15.0365 20 12.673 20 10.15C20 4.5385 15.5286 0 10 0ZM10 14.1375C8.02857 14.1375 6.42857 12.5135 6.42857 10.5125C6.42857 8.5115 8.02857 6.8875 10 6.8875C11.9714 6.8875 13.5714 8.5115 13.5714 10.5125C13.5714 12.5135 11.9714 14.1375 10 14.1375Z" fill="#1E363E"/>
              </svg>
              London, UK
          </div>
          <div class="font-bold info">
              <svg class="svg-icon" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.36364 16.4011V22.8456L17.5 29L28.6364 22.8456V16.4011L17.5 22.5556L6.36364 16.4011ZM17.5 0L0 9.66667L17.5 19.3333L31.8182 11.4228V22.5556H35V9.66667L17.5 0Z" fill="black"/>
              </svg>
              3.7 GPA
          </div>
          <div class="font-bold info">
              <svg class="svg-icon" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.648 8.352C18.9515 6.6555 16.733 5.8 14.5 5.8V14.5L8.352 20.648C11.745 24.041 17.255 24.041 20.6625 20.648C24.0555 17.255 24.0555 11.745 20.648 8.352ZM14.5 0C6.496 0 0 6.496 0 14.5C0 22.504 6.496 29 14.5 29C22.504 29 29 22.504 29 14.5C29 6.496 22.504 0 14.5 0ZM14.5 26.1C8.091 26.1 2.9 20.909 2.9 14.5C2.9 8.091 8.091 2.9 14.5 2.9C20.909 2.9 26.1 8.091 26.1 14.5C26.1 20.909 20.909 26.1 14.5 26.1Z" fill="black"/>
              </svg>
              1 Semester
          </div> -->
      <!-- </div> -->
      </div>
      <!-- Menu -->
      <div class="menu-card bg-white border-2 rounded-xl text-darkgreen">
        <p class="menu">Menu</p>
        <router-link to="/explore" class="menu-link font-bold">Home</router-link>
        <router-link :to="`/uni/${$route.params.uniName}`" class="menu-link font-bold" replace>University</router-link>
        <router-link :to="{name: 'uniDiscussions'}" class="menu-link font-bold">Discussion</router-link>
        <router-link to="/explorecitiespage" class="menu-link font-bold">City</router-link>
      </div>
    </div>

    <!-- Title of discussion -->

    <div class="topic-card grow bg-white border-2 rounded-xl text-darkgreen">
      <h2 :class="{'lazyload' : !forum_title}" class="title font-bold text-darkgreen mb-4 text-xl md:text-3xl">{{ forum_title ?? '&nbsp;' }}</h2>
      <p class="mb-8">
        <div :class="{'lazyload mt-8' : !forum_text}" class="text-sm md:text-base">{{ forum_text ?? '&nbsp;' }}</div>
        <div v-if="!forum_text" :class="{'lazyload mt-2 max-w-[75%]' : !forum_text}">&nbsp;</div>
        <div v-if="!forum_text" :class="{'lazyload mt-2 max-w-[50%]' : !forum_text}">&nbsp;</div>
      </p>
      <!-- Nav -->

      <div class="nav-container">
        <ul class="comment-nav">
          <li class="watcher">
            <button @click="toggleWatch" :class="{'btnAction': isWatching, 'btnActionInvert': !isWatching}">
              {{ isWatching ? 'Watching' : 'Watch' }}
            </button>
          </li>
          <li class="comment-count">
            {{ comments[1]?.length ? `${comments[1].length} comment(s)` : 'Add the first comment!' }}
          </li>
          <li class="comment-username">
            <svg style="color: rgb(30, 54, 62);" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-fill chat-icon" viewBox="0 0 16 16"> <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" fill="#1e363e"></path> </svg>
            <span class="user">{{ getName }}</span>
          </li>
        </ul>
      </div>

      <!-- Input field and "Create" button for asking questions -->
      
      <div class="create-section">
        <div class="hidden sm:inline">
          <img :src="getProfileImage" alt="" class="avatar">
        </div>
        <textAreaInput @posted="handlePost" name="make" :thread_id="parseInt($route.params.thread)"/>
      </div>

      <!-- Display each question card separately -->

      <div class="replies">
        <div v-for="question in comments[1] ?? []" class="mt-8 mb-4">
          <comment :commentData="question" :currentReply="currentReply" @replying="setReply"/>
          <hr>
        </div>

      </div>
      
      <span class="font-bold flex flex-grow justify-center opacity-30">end</span>
    </div>

    <div class="spacer basis-1/6 hidden md:block"></div>

    
  </div>
</template>
<style scoped>

.menu-card {
  margin: 10px;
  padding: 30px 50px 30px 50px;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.menu-link {
  font-size: 1.3rem;
  margin-top: 10px;
}
.university-info-card { 
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin: 10px;
  height: fit-content;
  padding: 30px 0 30px 0;
}

.university-logo {
  width: 100px;
  height: auto;
  margin-bottom: 10px
}
.university-info {
  font-weight: bold;
  font-size: 1.5rem;
  padding: 1rem;
}
.location-gpa-semester {
  gap: 1rem;
  margin-left: 20px;
  flex-direction: flex-start;
}
.info {
  margin-top: 20px;
  font-size: 1rem;
}
.svg-icon {
  display: inline;
  width: auto;
  height: 2em;
}

.topic-card {
  height: fit-content;
  padding: 20px;
  width: 70%;
  margin: 10px;
}
.post-comment-button {
  padding: 10px 20px; 
  border-radius: 0.5rem;
  color: white; 
  font-weight: bold;
  border: none;
  cursor: pointer;
  display: block;
}

.nav-container {
  border-bottom: 2px solid #e7e9ee;
  margin-bottom: 24px;
}

.comment-nav {
  list-style: none;
  display: inline-block;
  width: 100%;
}

.chat-icon {
  height: 1em;
  width: auto;
  display: inline;
}

.comment-count {
  font-weight: 500;
  float: left;
}

.user {
  font-weight: 500;
  float: right;
  margin-top: 2px;
  margin-left: 4px;
}

.comment-username {
  float: right;
  font-weight: 500;
}

.watcher {
  text-align: right;
}

.create-section {
  display: flex;
  align-items: flex-start;
  cursor: text
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
}

/* .watch-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 8px;
  margin: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.watching-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 8px;
  margin: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
} */

</style>
