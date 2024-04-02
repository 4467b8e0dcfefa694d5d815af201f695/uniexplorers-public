<template>
  <div class="overflow-y-auto w-full">
    <!-- Filter bar -->
    <div class="filter-bar">
      <ul>
        <li class="" @click="
        changeArea('Europe')
        " :class="{active: selectedArea === 'Europe'}">Europe</li>
        <li class="" @click="
        changeArea('Asia')" :class="{active: selectedArea === 'Asia'}">Asia</li>
        <li class="" @click="
        changeArea('America')" :class="{active: selectedArea === 'America'}">America</li>
        <div class="line" :style="{ left: linePosition }"></div>
      </ul>
    </div>
    <!-- <div
        class="filter-bar">
        <div class="basis-full md:basis-2/5">

          <el-tabs v-model="activeTab" class="nearby-search-tabs" @tab-click="handleClick">
            <el-tab-pane label="Europe" name="first">
            </el-tab-pane>
            <el-tab-pane label="Asia" name="second"></el-tab-pane>
            <el-tab-pane label="Amer" name="third"></el-tab-pane>
          </el-tabs>

        </div>
    </div> -->

    <!-- If city is not clicked -->
    <div v-if="!showFullCity">
      <div class="absolute z-0 w-full h-[700px]" @click="goToResult(city)">
        <CityDetails v-if="city" :city="city" />
      </div>
    </div>
    <!-- If city is clicked -->
    <div v-else @click="goToResult(city)">
      <div class="absolute z-0 w-full h-[700px]" >
        <CityDetails v-if="city" :city="city" />
      </div>
    </div>
    <!-- Carousels -->
    <div class="absolute w-full z-20 mt-[650px]">
      <CityCarousel class="pb-14" :area="selectedArea" :cities="cities[selectedArea]" />
      <!-- <CityCarousel class="pb-14" area="Asia/Oceania" :cities="cities[1]" />
      <CityCarousel  area="USA" :cities="cities[2]" /> -->
    </div>
    <!-- Black Gradient -->
    <div class="mt-60 absolute z-10 h-[100%] w-[100%] bg-gradient-to-t from-black via-black" />
  </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel';
import { onMounted, ref } from 'vue';
import router from "@/router"
import cities from '../cities.json';
import CityDetails from '../components/cityDetails.vue'
import CityCarousel from '../components/cityCarousel.vue'; 

import { useCitiesStore } from '../stores/citiesStore'
import { storeToRefs } from 'pinia';
const useCity = useCitiesStore()
let { city, showFullCity } = storeToRefs(useCity)

let selectedArea = ref('Europe')
let linePosition = ref('41.5%'); // Use ref for linePosition

onMounted(() => {
  setTimeout(() => city.value = cities['Europe'][0], 100)
})

const changeArea = (area) => {
  selectedArea.value = area
  city.value = cities[area][0]
  showFullCity = true
}
// /city/continent/:cityname
const goToResult = (cityname) => {
  const route = 'city/' + selectedArea.value + '/' + cityname.name
  router.push(route)
}
</script>

<style>
  body {
    background-color: black;
  }

  .filter-bar {
    position: absolute;
    margin-top: 20px;
    font-family: Outfit;
    font-weight: 700;
    width: 100%;
    height: auto;
    color: white;
    z-index: 2;
  }

  .filter-bar ul {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    width: fit-content;
    margin: auto;
  }

  .filter-bar li {
    margin: 0 10px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: color .2s ease,transform .3s ease-out;
    position: relative;
  }
  
  
  .filter-bar .active {
    text-decoration: underline
  }
</style>