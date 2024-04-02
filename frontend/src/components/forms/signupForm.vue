<template>
  <form class="space-y-6 h-133 z-10">
    <div>
      <label
        for="email"
        :class="email"
        class="transition-all block mb-2 text-sm font-medium text-gray-900 text-darkgreen"
      >
        Your email
      </label>
      <input
        type="email"
        v-model="email"
        class="textInput z-10"
        placeholder="name@company.com"
        required
      />
    </div>
    <div>
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 text-darkgreen"
        >Your password</label
      >
      <input
        type="password"
        v-model="password"
        placeholder="••••••••"
        class="textInput z-10"
        required
      />
    </div>
    <div>
      <label
        for="confirmPassword"
        class="block mb-2 text-sm font-medium text-gray-900 text-darkgreen"
        >Confirm password</label
      >
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="••••••••"
        class="textInput z-10"
        required
      />
    </div>
    <div class="flex items-center">
      <checkBox
        v-model="remember"
        label="Remember me"
        :style="remember ? 'transform: translate(4px)' : ''"
      />
    </div>
    <button
      type="submit"
      @click.prevent="onSubmit"
      class="w-full text-white bg-darkgreen hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 text-darkgreen"
    >
      Sign Up
    </button>
    <div v-if="errors.email" class="text-red-500 text-sm mt-1 error-message">
      {{ errors.email }}
    </div>
    <div v-if="errors.password" class="text-red-500 text-sm mt-1 error-message">
      {{ errors.password }}
    </div>
  </form>
</template>

<script>
import { useAuthStore } from '@/stores'
import checkBox from '@/components/inputs/checkBox.vue'

export default {
  name: 'signupForm',
  components: {
    checkBox
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      remember: false,
      errors: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    validateEmail(email) {
      // Regular expression for validating an Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    onSubmit() {
      this.errors.email = ''
      this.errors.password = ''

      if (!this.email || !this.password || !this.confirmPassword) {
        this.errors.email = 'Please fill out all fields.'
        return
      }

      if (!this.validateEmail(this.email)) {
        this.errors.email = 'Invalid email address'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.errors.password = 'Passwords do not match'
        return
      }

      const authStore = useAuthStore()
      return authStore.signup(this.email, this.password).then(res => {
        this.$emit('signUp', this.email)
      }).catch((error) => {
        if (error == 'Conflict') {
          this.errors.email = 'This email has been registered'
        }
      })
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
