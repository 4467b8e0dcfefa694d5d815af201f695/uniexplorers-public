<script>

import { useAuthStore } from '@/stores';
import { mapState, mapActions } from "pinia";
import textSearch from "@/components/forms/textSearch.vue";
import dropdownNotification from "@/components/ui/dropdownNotification.vue";


export default {
  name: 'headerBanner',
  components: {
    textSearch,
    dropdownNotification
  },
  methods: {
    goToCities() {
      this.$router.push('/explorecitiespage')
    },
    goToMessages() {
      this.$router.push('/message')
    },
    goToProfile() {
      this.$router.push('/profile')
    },
    goToHome() {
      this.$router.push('/explore')
    },
    
  },
  computed: {
    ...mapState(useAuthStore, ['getProfileImage'])
  },
  inject: ['mq']
}
</script>

<template>
  <div
    class="z-50 sm:px-8 md:px-16 sticky top-0 w-screen bg-darkgreen h-20 flex items-center justify-around border-0 border-b-2 border-gray-500">
    <div class="logo w-1/6 lg:w-1/4 overflow-visible">
      <img @click="goToHome" src="/LightLogo.png" class="h-12 lg:h-16 left-1/4 cursor-pointer transition-all"
        title="Back to Home">
    </div>

    <div class="hidden md:block searchBar relative h-10 z-50 flex-grow">
      <textSearch />
    </div>

    <div class="links flex w-1/3 h-9 justify-end">
      <button class="exploreCities bg-[#FFFFFF] rounded-lg h-full w-fit flex items-center px-4 py-2 outline outline-2 outline-lightgrey hover:brightness-90 hover:outline-lightgreen hover:outline-offset-2 hover:scale-105 transition-all active:scale-100 active:outline-offset-0" @click="goToMessages">
        <p class="text-darkgreen m-0 p-0 text-base">Messages</p>
      </button>
      <div class="flex items-center mx-8">
        <dropdownNotification></dropdownNotification>
      </div>
      <button @click="goToProfile"
        class="relative flex items-center px-2 ml-2 rounded-lg border border-2 border-darkgreen group hover:scale-110 transition-all">

        <div
          class="w-8 h-8 flex rounded-lg outline outline-white outline-offset-1 justify-center items-center overflow-hidden">
          <img :src="getProfileImage" class="max-h-full max-w-full object-cover" alt="">
        </div>
        <p style="color: white;"
          class="absolute select-none -translate-x-1/4 top-1/2 opacity-0 group-hover:opacity-100 group-hover:top-full transition-all px-2 text-base">
          Profile</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
p {
  color: black;
  text-align: center;
  font-weight: 500;
}
</style>