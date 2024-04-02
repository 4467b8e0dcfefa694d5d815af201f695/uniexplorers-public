<script>
import axios from 'axios'
import MyFooter from '../components/myFooter.vue'
import SingleReview from '../components/singleReview.vue'
import CtaBanner from '../components/ctaBanner.vue'
import UniCarousel from '../components/UniCarousel.vue'
import ReviewModal from '../components/ReviewModal.vue'
import { GoogleMap, InfoWindow, Marker } from 'vue3-google-map'
import NearbyPlaceTab from '../components/NearbyPlaceTab.vue'

export default {
  components: {
    MyFooter,
    SingleReview,
    CtaBanner,
    UniCarousel,
    ReviewModal,
    GoogleMap,
    Marker,
    InfoWindow,
    NearbyPlaceTab
  },
  data() {
    return {
      GOOGLE_MAP_API_KEY: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
      activeTab: null,
      city: {},
      continent: {},
      selectedPlace: null,
      value: null,
      data: {},
      selectedPlaceType: null
    }
  },
  async beforeMount() {
    this.city.name = this.$route.params.cityName
    this.continent.name = this.$route.params.continent

    await this.getCoordinates()

    await this.getWikipedia()

    var places_dict = {
      atm: 'atm',
      bakery: 'bread',
      convenience_store: 'convenience store',
      doctor: 'clinic',
      lodging: 'hotels',
      park: 'park',
      restaurant: 'food',
      supermarket: 'groceries',
      tourist_attraction: 'attractions'
    }

    this.data = {}

    for (let place in places_dict) {
      let d = await this.fetchData(place)
      if (d.length > 0) {
        this.data[place] = d
      }
    }

    this.selectedPlaceType = Object.keys(this.data)[0]

    this.columns = ['Name', 'Rating', 'Total Ratings']
    this.width = 300
    this.height = 300
  },
  methods: {
    truncate(text, length, clamp) {
      clamp = clamp || '...'
      let words = text.split(' ')
      return words.length > length ? words.slice(0, length).join(' ') + clamp : text
    },
    getMarkers(activeTab) {
      let markers = []
      let curr = this.data[activeTab]
      for (const p in curr) {
        let marker = { 'center': curr[p].center, 'name': curr[p].name, 'rating': curr[p].rating }
        markers.push(marker)
      }
      return markers
    },
    async getCoordinates() {
      // const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.city.name}&key=${this.GOOGLE_MAP_API_KEY}`
      const apiUrl = `${import.meta.env.VITE_GOOGLE_BACKEND}/geocode/city/${this.city.name}`
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data) {
        // this.latitude = data.results[0].geometry.location.lat;
        // this.longitude = data.results[0].geometry.location.lng;
        // this.center = { lat: this.latitude, lng: this.longitude };
        // console.log(data)
        this.latitude = data.center.lat
        this.longitude = data.center.lng
        this.center = data.center
      } else {
        this.latitude = null;
        this.longitude = null;
        // console.log("Unable to get coordinates.");
      }
    },

    async getWikipedia() {
      const wikiUrl = import.meta.env.VITE_GOOGLE_BACKEND + `/summary/${this.city.name}`
      const response = await fetch(wikiUrl)
      const data = await response.json()
      if (data.length > 0) {
        let new_data = data.split(' ')
        new_data = new_data.splice(0, 40)
        new_data = new_data.join(' ')
        this.wiki = new_data + '...'
      }
    },

    async fetchData(placeType) {
      const mapping = {
        atm: '',
        convenience_store: '',
        restaurant: 'food',
        tourist_attraction: 'tourist attraction',
        doctor: 'clinic',
        lodging: 'hotel',
        bakery: 'bread',
        park: '',
        supermarket: ''
      }
      const keyword = mapping[placeType]
      
      const apiUrl = `${import.meta.env.VITE_GOOGLE_BACKEND}/nearby/city/${this.city.name}`
      const res = await fetch(apiUrl)
      const data = await res.json();
      if (!(placeType in data)) {
        return []
      }
      const results = data[placeType].results;
      let processed_results = [];
      for (let i = 1; i < results.length; i++) {
        if (
          results[i].name === undefined ||
          results[i].rating === undefined ||
          results[i].user_ratings_total === undefined ||
          results[i].geometry.location.lat === undefined ||
          results[i].geometry.location.lng === undefined
        ) {
          continue;
        }

        // Add row to processed_results
        let row = {
          name: results[i].name,
          rating: results[i].rating,
          user_ratings_total: results[i].user_ratings_total,
          latitude: results[i].geometry.location.lat,
          longitude: results[i].geometry.location.lng,
        };
        row.center = { lat: row.latitude, lng: row.longitude }
        processed_results.push(row);
      }

      processed_results.sort((a, b) => {
        // Sort by rating in descending order
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // If ratings are equal, sort by number of ratings in descending order
        return b.user_ratings_total - a.user_ratings_total;
      });
      processed_results = processed_results.slice(0, 8);
      return processed_results
    }
  },
  computed: {
    filteredPlaceData() {
      if (this.selectedPlaceType && this.data[this.selectedPlaceType]) {
        return this.data[this.selectedPlaceType]
      }
      return []
    },
    markers() {
      return this.getMarkers(this.selectedPlaceType)
    }
  }
}
</script>

<template>
  <div>
    <div class="container md:max-w-96 mx-auto">
      <div
        class="main card rounded-xl bg-white flex flex-wrap lg:flex-nowrap items-center text-darkgreen"
      >
        <div class="basis-2/3 ml-2 lg:basis-4/12 lg:ml-0 pl-6">
          <h2 class="font-bold text-lg lg:text-xl">{{ city.name }}, {{ continent.name }}</h2>
        </div>
        <div class="mx-auto content h-auto lg:flex-nowrap px-6">
          <p class="super-small">{{ wiki }}</p>
          <a class="super-small" :href="'https://en.wikipedia.org/wiki/' + city.name">Read more</a>
        </div>
      </div>

      <!-- Find out more about the city -->
      <div
        class="mt-3 mx-auto px-5 py-5 content rounded-xl bg-white h-auto text-darkgreen flex flex-row flex-wrap lg:flex-nowrap lg:px-8"
      >
        <div class="basis-full md:basis-2/5">
          <!-- Dropdown -->
          <el-select v-model="selectedPlaceType" class="m-2" placeholder="Select">
            <el-option
              v-for="(placeData, placeType) in this.data"
              :key="placeType"
              :value="placeType"
              :data="this.data[placeType]"
              :label="$toTitleCase(placeType)"
            />
          </el-select>
          <div v-if="filteredPlaceData.length">
            <NearbyPlaceTab :data="filteredPlaceData" class="nearby-place-table" />
          </div>
        </div>

        <!-- Google Map -->
        <div class="basis-full lg:basis-3/5 p-5">
          <div class="google-maps">
            <GoogleMap :api-key="GOOGLE_MAP_API_KEY" style="width: 100%; height: 500px" :center="center" :zoom="12">
              <Marker :options="{ position: center }" />
              <div v-for="marker in markers" :key="marker">
                <Marker
                  :options="{ position: marker.center, icon: { url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' } }">
                  <InfoWindow v-model="opened">
                    <div id="content">
                      <p>{{ marker.name }}</p>
                      <div>
                        <span>{{ marker.rating }}</span>
                        <el-icon style="vertical-align: middle; margin-left: 0.1em; padding-bottom: 0.2em;" :size="18" color="#ff9900">
                          <StarFilled />
                        </el-icon>
                      </div>
                    </div>
                  </InfoWindow>
                </Marker>
              </div>
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
    <!-- <CtaBanner class="mt-12 md:mt-20"></CtaBanner> -->
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  margin: 10px;
  height: 120px;
  overflow: auto;
}

.content {
  width: 100%;
  width: calc(100% - 20px);
}

.university-logo {
  width: 50px;
  height: auto;
  margin-left: 20px;
  margin-right: 50px;
  flex-direction: flex-start;
}

.university-info {
  display: flex;
}

.university-name {
  display: flex;
  margin-right: 30px;
}

.font-bold {
  font-weight: bold;
}

.font-normal {
  font-weight: normal;
}

.text-xl {
  font-size: 1.25rem;
}

.svg-icon {
  display: inline;
  width: auto;
  height: 1em;
}

hr.solid {
  border-top: 1.5px solid #333;
}

.super-small {
  font-size: 12px;
}

.nearby-place-table {
  overflow-y: auto;
}
</style>
