import { defineStore } from 'pinia'

export const useCitiesStore = defineStore('city', {
  state: () => ({
    city: null,
    showFullCity: false
  })
})
