<script>
import { fetchWrapper } from '@/helpers/fetch-wrapper';
import { decodeBlurHash } from 'fast-blurhash'
import { useCacheStore } from '../../stores/cacheStore';
import axios from 'axios'

    export default {
        name: 'lazyImg',
        async mounted() {
            const { getImg } = useCacheStore()

            getImg(this.src).then(res => {
                this.fullLoaded = true
                this.loadedImg = res
            })

            fetchWrapper.get(import.meta.env.VITE_IMAGE_BACKEND + '/' + this.src + '/low').then(data => {
                let r = data.hash.slice(-2)
                this.ratio = isNaN(r) ? [1, 1] : r.split('')
                this.placeholderImg = this.renderImage(data.hash.slice(0, -2))
            })

        },
        data() {
            return {
                ratio : [3, 4],
                placeholderImg : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                loadedImg : null,
                fullLoaded : false
            }
        },
        props : {
            src : {
                type : String
            }
        },
        methods : {
            renderImage(hash) {
                // highkey cursed. why? because this blurhash thing only returns a Uint8ClampedArray, which the img tag cannot use
                try {
                    const newCanvas = document.createElement('canvas')
                    newCanvas.width = this.width
                    newCanvas.height = this.height
                    const ctx = newCanvas.getContext('2d')
                    const pixels = decodeBlurHash(hash, this.width, this.height);
                    ctx.putImageData(new ImageData(pixels, this.width, this.height), 0, 0)
                    return newCanvas.toDataURL("image/jpeg", 1)
                } catch (error) {
                    console.log(error);
                    console.log(hash, this.width, this.height);
                }
            }
        },
        computed : {
            width() {
                return this.ratio[0] * 100
            },
            height() {
                return this.ratio[1] * 100
            },
        }
    }
</script>

<template>
    <!-- consider also style="width: 400px; height: 300px;" -->
    <div class="relative grow self-stretch">
        <img v-if="!fullLoaded" :src="placeholderImg" alt="" class="absolute min-h-full min-w-full" loading="lazy" :width="width" :height="height" >
        <div v-if="!fullLoaded" class="wrapper top-0 absolute lazyload opacity-30"/>
        <img v-else :src="loadedImg" alt="" class="absolute min-h-full min-w-full" loading="lazy" :width="width" :height="height" >
    </div>

</template>

<style scoped>

img {
    transition: 1s ease-in-out;
}

</style>