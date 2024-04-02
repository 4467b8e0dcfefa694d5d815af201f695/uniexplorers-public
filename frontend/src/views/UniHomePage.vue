<script>
import { SingleReview, CtaBanner, UniCarousel, ReviewModal, NearbyPlaceTab, CourseMapping, joinTelegramCard } from '@/components/uniHome'
import { GoogleMap, Marker, InfoWindow } from "vue3-google-map";
import textSearch from '@/components/forms/textSearch.vue';
import { useUniImageStore } from '@/stores';
import { fetchWrapper } from '@/helpers';

export default {
  components: {
    SingleReview,
    CtaBanner,
    UniCarousel,
    ReviewModal,
    GoogleMap,
    Marker,
    InfoWindow,
    NearbyPlaceTab,
    CourseMapping,
    textSearch,
    joinTelegramCard
  },
  data() {
    return {
      GOOGLE_MAP_API_KEY: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
      activeTab: null,
      infowindow: false,
      university: {},
      value: null,
      data: {},
      selectedPlaceType: null,
      places_dict: {
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
    };
  },
  async beforeCreate() {
    let name = this.$route.params.uniName

    const store = useUniImageStore()
    this.images = store.uni_images[name]

    let query = '?name=' + name
    let data = await fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities/' + query)
    this.university = data[0]
    this.getCoordinates()

    fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/reviews/' + name).then((data) => {
      this.reviews = data
    })


    for (let place in this.places_dict) {
      let d = await this.fetchData(place)
      if (d.length > 0) {
        this.data[place] = d
      }
      if (this.selectedPlaceType == null) {
        this.selectedPlaceType = Object.keys(this.data)[0]
      }
    }

    
  },
  methods: {
    async getCoordinates() {
      // const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.university.name}&key=${this.GOOGLE_MAP_API_KEY}`;
      // @JingJie Broken?
      const url = `${import.meta.env.VITE_GOOGLE_BACKEND}/geocode/university/${this.university.name}`
      fetchWrapper.get(url).then((data) => {
        if (data) {
          this.latitude = data.center.lat
          this.longitude = data.center.lng
          this.center = data.center
        } else {
          this.latitude = null;
          this.longitude = null;
        }
      })
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

      // const res = await axios.get(import.meta.env.VITE_GOOGLE_BACKEND + '/nearbysearch' + query);

      const query = `?keyword=${keyword}&lat=${this.latitude}&lng=${this.longitude}&radius=5000&type=${placeType}`
      const apiUrl = `${import.meta.env.VITE_GOOGLE_BACKEND}/nearby/university/${this.university.name}` + query
      let data = await fetchWrapper.get(apiUrl)
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

    },

    getMarkers(activeTab) {
      let markers = []
      let curr = this.data[activeTab]
      for (const p in curr) {
        let marker = { 'center': curr[p].center, 'name': curr[p].name, 'rating': curr[p].rating }
        markers.push(marker)
      }
      // console.log(markers);
      return markers
    },
  },
  computed: {
    filteredPlaceData() {
      if (this.selectedPlaceType && this.data[this.selectedPlaceType]) {
        return this.data[this.selectedPlaceType]
      }
      return []
    },
    markers() {
      // console.log(this.getMarkers(this.selectedPlaceType));
      return this.getMarkers(this.selectedPlaceType)
    }
  }
};
</script>

<template>
  <div>
    <div class="container md:max-w-96 mx-auto">
      <textSearch class="my-5 md:hidden mx-auto" />
      <div class="main rounded-xl flex flex-wrap lg:my-8 my-5 lg:flex-nowrap items-center text-darkgreen">
        <div class="basis-full lg:basis-1/2 xl:basis-5/12 md:ml-4 ml-4">
          <h2 class="font-bold font-display lg:text-2xl sm:text-lg">{{ university.name }}</h2>
        </div>
        <div
          class="basis-full lg:basis-1/2 xl:basis-7/12 location-gpa-semester prose-base lg:prose-lg flex gap-2 md:justify-start md:text-md md:gap-6 md:ml-4 ml-4 mt-2">
          <div class="location font-semibold text-sm border border-solid border-darkgreen rounded-2xl px-4 py-1">
            <i class="fa-solid fa-earth-americas pr-1"></i>
            {{ university.continent }} • {{ university.location }}
          </div>
          <div class="gpa font-semibold text-sm border border-solid border-darkgreen rounded-2xl px-4 py-1">
            <i class="fa-solid fa-chart-line pr-1"></i>
            Min. GPA: {{ university.gpa_10_percentile }}
          </div>
        </div>
      </div>

      <div class="mx-auto content h-auto lg:flex-nowrap">
        <UniCarousel :images="images" />
      </div>
      <!-- TODO: TO FILL IN -->
      <joinTelegramCard v-if="true" :teleInfo="{}" />

      <!-- Get to Know Us Section -->
      <div
        class="mt-3 mx-auto px-5 py-5 content rounded-xl bg-white h-auto text-darkgreen flex flex-row flex-wrap lg:flex-nowrap lg:px-8">
        <div class="basis-full md:basis-2/5">
          <!-- Dropdown -->
          <el-select v-model="selectedPlaceType" class="m-2" placeholder="Select">
            <el-option v-for="(placeData, placeType) in data" :key="placeType" :value="placeType"
              :label="$toTitleCase(placeType)" />
          </el-select>
          <div v-if="filteredPlaceData.length">
            <NearbyPlaceTab :data="filteredPlaceData" class="nearby-place-table" />
          </div>

        </div>

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
                        <el-icon style="vertical-align: middle; margin-left: 0.1em; padding-bottom: 0.2em;" :size="18"
                          color="#ff9900">
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

      <!-- Module Mappings -->
      <div class="mt-3 mx-2 px-5 md:px-8 py-5 content rounded-xl bg-white h-auto text-darkgreen flex flex-wrap">
        <div class="basis-full sm:basis-3/5">
          <h2 class="font-semibold text-lg md:text-xl">Module Mappings</h2>
          <hr class="solid">
        </div>

        <div class="basis-full overflow-hidden">
          <CourseMapping></CourseMapping>
        </div>

      </div>

      <!-- Exchangers' Experience Section -->
      <div class="mt-3 mx-2 px-5 md:px-8 py-5 content rounded-xl bg-white h-auto text-darkgreen flex flex-wrap">
        <div class="basis-full sm:basis-3/5">
          <h2 class="font-semibold text-lg md:text-xl">Exchangers' Experience</h2>
          <hr class="solid">

          <!-- <h2 class="font-semibold text-base lg:text-lg mt-2">All Experiences: Overwhelmingly Positive (100)</h2> -->
        </div>

        <div class="flex sm:basis-2/5 md:justify-end lg:justify-center md:my-2 lg:my-4"
          v-if="reviews && reviews.length > 0">
          <ReviewModal :uni-name="university.name"></ReviewModal>
        </div>

        <div class="basis-full mt-4 md:mt-8">
          <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
            <SingleReview v-for="review in reviews" :key="review" :review="review"></SingleReview>
          </div>

          <div class="flex flex-wrap justify-center text-lg md:text-base text-darkgreen font-medium lg:font-semibold"
            v-if="reviews && reviews.length == 0">
            <span class="basis-full text-center mb-2">Be the first to leave a review today!</span>
            <ReviewModal class="basis-full" :uni-name="university.name"></ReviewModal>
          </div>
        </div>
      </div>
    </div>

    <CtaBanner class="mt-12 md:mt-20"></CtaBanner>

  </div>
</template>

<style scoped>
/* CSS styles go here */
.el-tabs__item.is-active {
  color: #000 !important;
}

.main {
  width: 100%;
  /* Ensure the card takes the full width of the page */
  display: flex;
  /* justify-content: center; Center horizontally */
  align-items: center;
  /* Center vertically */
  width: calc(100% - 20px);
}

.search {
  width: calc(100% - 20px);
}

.content {
  width: 100%;
  width: calc(100% - 20px);
}

.university-logo {
  width: 3em;
  height: auto;
  margin-left: 20px;
  margin-right: 50px;
  flex-direction: flex-start;
}

.university-info {
  display: flex;
  /* flex-direction: flex-start; */
}

.university-name {
  display: flex;
  margin-right: 30px;
  /* align-items: flex-start; */
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
</style>