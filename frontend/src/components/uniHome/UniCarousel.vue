<template>
    <div class="w-full h-96 xl:h-[500px]">
        <Carousel ref="carousel" v-model="currentSlide" :items-to-scroll="1" :wrap-around="true" :transition="500"
            snapAlign="start" :items-to-show="1">
            <Slide v-for="slide, index in images" :key="slide">
                <div @click="showUni(slide, index)" class="w-full h-auto">
                    <div class="w-full h-96 lg:px-28 xl:h-[500px]">
                        <img class="w-full h-96 lg:px-28 xl:h-[500px]" :src="slide">
                    </div>
                </div>
            </Slide>
            <template #addons>
                <Navigation />
            </template>
        </Carousel>
    </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { useCacheStore } from '@/stores';
const { getImg } = useCacheStore()


let currentSlide = ref(0)
const images = ref([])

const baseURL = '/uni-images/'
const props = defineProps(['images'])
onMounted(async () => {
    images.value = await Promise.all(props.images.map((imgpath) => getImg(imgpath)))
    // TODO: Add fallback images properly
    // if (images == undefined) {
    //     let fallback_images = ref([{ 'src': '/src/assets/universities/cambridge.png' }])
    //     console.log(fallback_images.value)
    // }
})

const showUni = (slide, index) => {
    currentSlide.value = index
}
</script>

<style>
.carousel__prev,
.carousel__next,
.carousel__prev:hover,
.carousel__next:hover {
    color: white;
}

.carousel__icon {
    color: darkgreen;
}
</style>