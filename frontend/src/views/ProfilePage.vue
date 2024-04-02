<template>
  <div class="flex flex-col lg:flex-row gap-4 m-12 mt-4">
    <textSearch class=" h-12 left-0 right-0 mx-auto md:hidden"/>
    <div class="bg-white h-fit grow lg:grow-0 relative flex flex-col justify-center items-center rounded-lg p-12">
      <img :src="yourImg" alt="" class="mb-4 aspect-square w-24">
      <p class="lg:mb-16 mb-4 text-center text-content name font-bold">{{name}}</p>
      <p class="text-content/70">Singapore Management University</p>
    </div>
    <div class="grow bg-white rounded-lg p-10">
      <form action="" class="relative w-full">
        <label for="">Name</label>
        <input type="text" v-model="name" @keydown="inputChange" class="rounded xl:w-3/5 md:w-4/5 w-full">
        
        <label for="">Email</label>
        <input type="email" v-model="email" disabled class="rounded xl:w-3/5 md:w-4/5 w-full">
        
        <label for="">New Password</label>
        <input type="password" v-model="password"  @keydown="inputChange" class="rounded xl:w-3/5 md:w-4/5 w-full" placeholder="New Password">
        
        <label for="">Confirm New Password</label>
        <input type="password" v-model="newPassword" class="rounded xl:w-3/5 md:w-4/5 w-full">
        
        <label for="">Status</label>
        <select name="" id="" v-model="status"  @change="inputChange" class="rounded lg:w-2/5 w-4/5">
          <option value="alumni">Alumni</option>
          <option value="student">Student</option>
        </select>
        
        <label for="">Exchange School</label>
        <select name="" id="" v-model="exchangeSchool" class="mb-16 rounded lg:w-2/5 w-4/5"  @change="inputChange">
          <option value="bocconi">Bocconi University</option>
          <option value="chattahoochee">Chattahoochee Valley Community College</option>
        </select>

        
      </form>

      <div class="flex justify-end items-center mb-4">
        <button :disabled="noChangesMade" class="">Save Changes <span class="text-orange text-2xl align-middle">&#62;</span></button>
      </div>

      <div class="flex justify-end items-center mb-4">
        <button @click="logout" class=" bg-red hover:bg-red-700 text-white py-2 px-4 rounded">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import textSearch from '@/components/forms/textSearch.vue'
import { useAuthStore, useCacheStore } from '@/stores';

export default {
  data() {
    return {
      ...useAuthStore().user,
      password: '',
      newPassword: '',
      status: 'alumni',
      exchangeSchool: 'bocconi',
      noChangesMade: true,
      yourImg : null
    }
  },
  setup() {
    const CacheStore = useCacheStore()
    return { CacheStore }
  },
  mounted() {
    this.CacheStore.getImg(this.image_filename).then(res => {
      this.yourImg = res
    })

  },
  components: {
    textSearch,
  },
  methods: {
    inputChange() {
      this.noChangesMade = false
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
    },
  }
}
</script>

<style>
  label, input, select {
    display: block;
    font-weight: bold;
    font-size: 1.2em;
    color: black;
  }
  input, select {
    font-weight: normal;
    display: block;
    padding: 10px 6px;
    width: 40%;
    box-sizing: border-box;
    border-width: 1px;
    border-color: #979393;
    border-radius: 10px;
    margin: 5px 0 20px;
  }
  button {
    padding: 10px 20px;
    background-color: #1E363E;
    border-radius: 4px;
    color: white;
  }
  button:disabled {
    background-color: #908d8d;
  }
</style>

<style scoped>

</style>