<script>
    import tags from '@/components/misc/tags.vue'
    import { fetchWrapper } from '@/helpers';
    import { useCacheStore, useUniImageStore } from '@/stores';
    import lazyImg from '@/components/ui/lazyImg.vue'

    export default {
        name: 'uniCards',
        components : {
            tags,
            lazyImg
        },
        setup() {
            const { getImg } = useCacheStore()
            const { uni_images } = useUniImageStore()

            return { getImg, uni_images }
        },
        async mounted() {

            fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + `/reviews/${this.uniData.name}`).then(data => {
                this.displayedReview = data.length ? data[0] : null
            }).catch(err => {
                console.debug('No review found');
            })

            // TODO: Actually fix this bullshit
            this.getImg('pikachu.jpeg').then(res => {
                this.reviewImg = res
            })

        },
        data() {
            return {
                name : 'BOB',
                uniImg : this.uni_images[this.uniData.name] ? this.uni_images[this.uniData.name][0] : 'pikachu.jpeg',
                reviewImg : null,
                displayedReview : null,
            }
        },
        props : {
            uniData : {
                type : Object,
                required : false
            },
            small : {
                type : Boolean,
                required : false
            },
            uniName : {
                type : String,
                required : false
            }
        },
        inject: ["mq"]
    }
</script>

<template>
    <!-- TODO: Dyanmically change width-->
<div ref="uniCard"  style="box-shadow: rgba(30, 54, 62, 0.3) 0px 2px 4px;" @click="async () => await $router.push('/uni/' + this.uniData.name)" class="card overflow-hidden p-0 border-darkgreen/30 xl:max-w-[50vw] rounded-xl min-w-min bg-white flex items-center text-darkgreen transition-all hover:scale-[101%]  hover:cursor-pointer hover:outline-2 hover:outline-offset-2 active:scale-100 active:brightness-90 active:outline-offset-0">
    <slot>
    </slot>
    <div v-if="mq.lgPlus && !small" class="relative flex overflow-hidden basis-1/3 self-stretch max-h-full">
        <lazyImg :src="uniImg"/>
    </div>
    <div ref="uniContent" class="info flex flex-1 flex-col my-2 mx-4" >
        <h2 :class="mq.xlPlus ? 'w-3/4' : 'w-full', mq.lgPlus ? 'text-xl' : 'text-base'" class="font-bold border-b-2"> {{ uniData.name }} </h2>
        <div :class="mq.lgPlus ? 'text-sm' : 'text-xs'" class="TRAITS min-w-min flex flex-row gap-x-4 my-2 mx-2">
            <div class="location font-bold flex items-center">
                <svg :class="mq.lgPlus ? 'w-3 mr-2' : 'w-2.5 mr-1.5'" class="inline relative bottom-0.5" viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.47143 0 0 4.5385 0 10.15C0 12.673 0.714285 15.0365 2.01429 17.168C3.37143 19.401 5.15714 21.315 6.52857 23.548C7.2 24.6355 7.68571 25.6505 8.2 26.825C8.57143 27.6225 8.87143 29 10 29C11.1286 29 11.4286 27.6225 11.7857 26.825C12.3143 25.6505 12.7857 24.6355 13.4571 23.548C14.8286 21.3295 16.6143 19.4155 17.9714 17.168C19.2857 15.0365 20 12.673 20 10.15C20 4.5385 15.5286 0 10 0ZM10 14.1375C8.02857 14.1375 6.42857 12.5135 6.42857 10.5125C6.42857 8.5115 8.02857 6.8875 10 6.8875C11.9714 6.8875 13.5714 8.5115 13.5714 10.5125C13.5714 12.5135 11.9714 14.1375 10 14.1375Z" fill="#1E363E"/>
                </svg>
                {{ uniData.location }}
            </div>
            <div class="gpa font-bold flex items-center min-w-fit">
                <svg :class="mq.lgPlus ? 'w-6 mx-2' : 'w-4 scale-105 mr-1.5'" class="inline relative" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.36364 16.4011V22.8456L17.5 29L28.6364 22.8456V16.4011L17.5 22.5556L6.36364 16.4011ZM17.5 0L0 9.66667L17.5 19.3333L31.8182 11.4228V22.5556H35V9.66667L17.5 0Z" fill="black"/>
                </svg>
                {{ uniData.gpa_10_percentile }} - {{ uniData.gpa_90_percentile }} GPA
            </div>
            <div class="time font-bold flex items-center min-w-fit mr-4">
                <svg :class="mq.lgPlus ? 'w-5 mx-2' : 'w-3.5 scale-105 mr-1.5'" class="inline relative" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.648 8.352C18.9515 6.6555 16.733 5.8 14.5 5.8V14.5L8.352 20.648C11.745 24.041 17.255 24.041 20.6625 20.648C24.0555 17.255 24.0555 11.745 20.648 8.352ZM14.5 0C6.496 0 0 6.496 0 14.5C0 22.504 6.496 29 14.5 29C22.504 29 29 22.504 29 14.5C29 6.496 22.504 0 14.5 0ZM14.5 26.1C8.091 26.1 2.9 20.909 2.9 14.5C2.9 8.091 8.091 2.9 14.5 2.9C20.909 2.9 26.1 8.091 26.1 14.5C26.1 20.909 20.909 26.1 14.5 26.1Z" fill="black"/>
                </svg>
                1 Semester
            </div>
        </div>

        <div :class="mq.lgPlus ? 'text-sm font-semibold' : 'text-xs'" class="DESCRIPTION text-lightgrey text-sm mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum arcu mauris, id tempor urna pulvinar id. Donec lobortis lacinia quam, eu faucibus ante viverra in. Etiam sit amet pellentesque lorem. Etiam ornare sed lorem eu dictum.
        </div>

        <div v-if="mq.lgPlus && displayedReview" class="h-auto review flex items-center gap-4 mb-2">
            <img class="w-16 h-16" :src="reviewImg" alt="">
            <div>
                <p class="reviewtext text-lightgrey text-sm">
                    “ {{ displayedReview.review_text }} “
                    <span class="text-sm font-medium "> - {{ $toTitleCase(displayedReview.user_email.split('@')[0]) }}</span>
                </p> 
            </div>
        </div>

        <div v-if="uniData.majors" class="flex gap-4 items-center h-auto">
            <svg :class="mq.lgPlus ? 'w-7' : 'w-5'" class="flex-none" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.7094 32.0594C19.2219 32.5469 18.6328 32.7906 17.9422 32.7906C17.2516 32.7906 16.6625 32.5469 16.175 32.0594L0.940625 16.825C0.669792 16.5542 0.486979 16.2698 0.392188 15.9719C0.297396 15.674 0.25 15.3625 0.25 15.0375V2.6875C0.25 1.98333 0.480208 1.40104 0.940625 0.940625C1.40104 0.480208 1.98333 0.25 2.6875 0.25H15.0375C15.3625 0.25 15.6875 0.297396 16.0125 0.392188C16.3375 0.486979 16.6354 0.669792 16.9062 0.940625L32.0594 16.0938C32.574 16.6083 32.8313 17.2109 32.8313 17.9016C32.8313 18.5922 32.574 19.1948 32.0594 19.7094L19.7094 32.0594ZM6.95313 9.025C7.52188 9.025 8.01615 8.8151 8.43594 8.39531C8.85573 7.97552 9.06563 7.48125 9.06563 6.9125C9.06563 6.34375 8.85573 5.84948 8.43594 5.42969C8.01615 5.0099 7.52188 4.8 6.95313 4.8C6.38438 4.8 5.8901 5.0099 5.47031 5.42969C5.05052 5.84948 4.84063 6.34375 4.84063 6.9125C4.84063 7.48125 5.05052 7.97552 5.47031 8.39531C5.8901 8.8151 6.38438 9.025 6.95313 9.025Z" fill="black"/>
            </svg>
            <div class="flex flex-wrap gap-2">
                <tags :majorName="major" v-for="major in uniData.majors.split(', ')"/>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>


</style>