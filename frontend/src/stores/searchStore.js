import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchWrapper } from '../helpers/fetch-wrapper';
import { useAuthStore } from './auth.store'

export const useSearchStore = defineStore({
  id: 'search',
  state: () => ({
    searchResults : useStorage('searchResults', [], sessionStorage),
    searchQuery : '',
    currentPage : useStorage('searchPage', 0, sessionStorage),
    minGpa : 2,
    textSearchResults : [],
  }),
  getters: {
    getCurrentPage(state) {
      return state.currentPage
    }
  },
  actions: {
    setPage(nextPage) {
      this.currentPage = nextPage
      return this.currentPage
    },
    async getSearchResults(query) {
      // if no query and no results, assumed to be first time load, so retrieve all and set mingpa
      if (!query && this.searchResults.length == 0) {
        const data = await fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities')
        this.setSearchResults(this.mapSimilarity(data))
        this.minGpa = data.reduce((prev, curr) => prev.gpa_10_percentile < curr.gpa_10_percentile ? prev : curr).gpa_10_percentile
        return this.searchResults
      } else if (query == 'reset') {
        // if i get query is reset, then re-retrieve all
        const data = await fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities')
        this.setSearchResults(this.mapSimilarity(data))
        return data
      } else if (!query || query == 'get') {
        // if i dont get any query, but is still called, means im just trying to get the results
        return this.searchResults
      } else {
        const data = await fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities' + query)
        this.setSearchResults(this.mapSimilarity(data))
        return data
      }
    },
    mapSimilarity(all_unis) {
      const authStore = useAuthStore()
      if (authStore.uni_rank?.length > 0) {
        all_unis = all_unis.reduce((acc, obj) => {
          acc[obj.name] = obj;
          return acc;
        }, {});

        // Combine the lists efficiently
        return authStore.uni_rank.reduce( (out, ranked_uni) => {
            if (ranked_uni.university_name in all_unis) {
              out.push({
                ...ranked_uni,
                ...all_unis[ranked_uni.university_name]
              })
            }
            return out
        }, []);
      }

      return all_unis
    },
    setSearchResults(results) {
      this.searchResults = results
      return results
    },
    setSearchQuery(query) {
      this.searchQuery = query
    }
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}