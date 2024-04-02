import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchWrapper } from '../helpers/fetch-wrapper';
import { useAuthStore } from './auth.store'

export const useSearchStore = defineStore({
  id: 'search',
  persist: {
    storage: sessionStorage
  },
  state: () => ({
    searchResults : [],
    searchQuery : '',
    currentPage : 0,
    minGpa : 2,
    textSearchResults : [],
    uniRatings : null
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
        this.setSearchResults(await this.mapRankedUniversities(data))
        this.minGpa = data.reduce((prev, curr) => prev.gpa_10_percentile < curr.gpa_10_percentile ? prev : curr).gpa_10_percentile
        return this.searchResults
      } else if (query == 'reset') {
        // if i get query is reset, then re-retrieve all
        const data = await fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities')
        this.setSearchResults(await this.mapRankedUniversities(data))
        return data
      } else if (!query || query == 'get') {
        // if i dont get any query, but is still called, means im just trying to get the results
        return this.searchResults
      } else {
        const data = await fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities' + query)
        this.setSearchResults(await this.mapRankedUniversities(data))
        return data
      }
    },
    async mapRankedUniversities(all_unis) {
      const authStore = useAuthStore()
      if (authStore.uni_rank?.length > 0) {
        all_unis = all_unis.reduce((acc, obj) => {
          acc[obj.name] = obj;
          return acc;
        }, {});

        await this.getUniverityRank()

        const unsortedUnis = authStore.uni_rank.reduce( (out, ranked_uni) => {
            if (ranked_uni.university_name in all_unis) {

              let rating = 1
              try {
                rating = this.uniRatings[ranked_uni.university_name].rating
              } catch (error) {
                
              }
              let sim = ranked_uni.similarity ?? 1
              let overall_rate = sim * rating

              out.push({
                ...ranked_uni,
                ...all_unis[ranked_uni.university_name],
                overall_rate
              })
            }
            return out
        }, [])

        unsortedUnis.sort((uni1, uni2) => uni2.overall_rate - uni1.overall_rate)
        return unsortedUnis;
      }

      return all_unis
    },
    async getUniverityRank() {

      if ( this.uniRatings == null ) {
        const res = await fetchWrapper.get(`${import.meta.env.VITE_RECOMMENDER_BACKEND}/api/recommendation_all`)

        this.uniRatings = res.reduce((acc, obj) => {
          acc[obj.name] = obj;
          return acc;
        }, {});

        return this.uniRatings

      } else {

        return this.uniRatings

      }
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
