<script>

    import gsap from 'gsap'
    import { fetchWrapper } from '@/helpers';
    import { mapActions } from 'pinia';
    import { useCacheStore } from '@/stores';

    export default {
        name: 'threadPreview',
        mounted() {

            // metrics = {
            //         value : 72,
            //         metric : 'likes',
            //         time : '24h'
            //     }

            fetchWrapper.get(`${import.meta.env.VITE_FORUM_BACKEND}/forum/${this.threadId}`).then( res => {
                const { forum_title, forum_text_raw, university_name, num_comments, user_email, first_comment_text, first_comment_created, ...rest } = res
                this.threadData = { forum_title, forum_text_raw, university_name, num_comments, user_email, first_comment_text, first_comment_created }
                this.getUserPic(user_email).then( res => {
                    this.userImg = res
                })
            })

        },
        data() {
            return {
                debounceTimeout : null,
                threadData : null,
                metrics : null,
                userImg : null
            }
        },
        props : {
            threadId : {
                type: Number,
                required : true
            }
        },
        methods : {
            ...mapActions(useCacheStore, ['getUserPic']),
            startFountain() {
                // https://gsap.com/community/forums/topic/29717-exploding-stars/
                let svg = this.$refs.iconExplode;
                svg.style.visibility = 'visible'

                let shapes = [
                    'M254 286.11a50 50 0 0050-50H204a50 50 0 0050 50z',
                    'M255.5 271a20 20 0 10-20-20 20 20 0 0020 20zm0 30a50 50 0 10-50-50 50 50 0 0050 50z',
                    'M307.5 250a50 50 0 11-50-50 50 50 0 0150 50',
                    'M234 237a22.5 22.5 0 0045 0h27.5a50 50 0 01-100 0z',
                    'M258 202.5a12 12 0 00-12 12v26h-26a12 12 0 000 24h26v26a12 12 0 0024 0v-26h26a12 12 0 000-24h-26v-26a12 12 0 00-12-12z',
                ];
                let animatedShapes = [];

                for (var i = 0; i < 10; i++) {
                    let newElement = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'path'
                    );
                    newElement.setAttribute('d', gsap.utils.random(shapes));
                    newElement.style.fill = gsap.utils.random([
                    '#4899DF',
                    '#f0f0f0',
                    '#00C0CC',
                    '#DE2870',
                    '#C7DBF4',
                    ]);
                    svg.appendChild(newElement);
                    animatedShapes.push(newElement);
                }

                function killShapes() {
                    animatedShapes.forEach((shape) => {
                    svg.removeChild(shape);
                    });
                }

                gsap.set(animatedShapes, {
                    transformOrigin: 'center',
                    scale: 'random(0.2, 1)',
                });

                gsap.to(animatedShapes, {
                    onComplete: killShapes,
                    keyframes: [
                    {
                        rotate: 'random(180, -180)',
                        x: 'random([-150, -100, -200, 200, 100, 150])',
                        y: 'random([-150, -100, -200, 200, 100, 150])',
                        ease: 'expo.out',
                        duration: 4,
                        stagger: {
                        amount: 0.1,
                        },
                    },
                    { opacity: 0, delay: -3 },
                    ],
                });

                if (this.debounceTimeout) {
                        clearTimeout(this.debounceTimeout);
                    }

                    this.debounceTimeout = setTimeout(() => {
                        svg.style.visibility = 'hidden'
                    }, 1875)
            }

        }
    }
</script>

<template>

<div class="TopThreadEntry min-h-20 max-h-40 flex pr-4">
    
    <div v-if="metrics" class="ThreadStats shrink-0 basis-20 grow p-4 relative">
        <div class="m-auto flex flex-col items-center z-[2]" @mouseenter="startFountain">
            <div class="font-bold text-2xl -mb-1 mt-1">{{ metrics.value }}</div>
            <div :class="{'text-sm' : metrics.metric != 'likes'}" class="text-center leading-none mb-1">{{ metrics.metric }}</div>
            <div class="text-xs text-nowrap text-lightgrey mb-0">in {{ metrics.time }}</div>
            <svg ref="iconExplode" class="absolute z-[0] scale-150 left-0 right-0 m-auto" role="presentational" viewBox="0 0 500 500" style="visibility: hidden;"></svg>
        </div>
    </div>

    <RouterLink :to="`/uni/${threadData?.university_name}/discussions/${threadId}`" class="relative p-4 border-2 grow border-b-0 border-r-0 border-gray-300 rounded-tl-lg text-content p-2 pb-0 group hover:translate-x-2 transition-all">
        <div :class="!threadData ? 'lazyload' : ''" class="w-full mb-2">
            <h2 class="font-bold inline-block">
                {{ threadData?.forum_title }}
            </h2>
            <span class="font-semibold text-lightgrey/70">
                – {{ threadData?.university_name }}
            </span>
        </div>

        <div :class="!threadData ? 'lazyload' : ''" class="flex items-start justify-between gap-2">

            <div class="forumContent">
                {{ threadData?.forum_text_raw }}
            </div>

            <div class="userUpdates justify-self-end gap-4 shrink flex">
                <img :src="userImg" alt="userImage" width="48" height="48" class="aspect-square rounded-lg">
                <article class="line-clamp-3 text-balance pt-2 grow">
                    &#x0022; {{ threadData?.first_comment_text }}&#x0022;
                </article>
            </div>

        </div>

        <div class="view absolute right-0 top-0 justify-end pr-8 items-center flex opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 h-full w-1/2 transition-all">
            <span class="text-center text-darkgreen text-xl font-semibold ">Check it out <img src="/vectors/caret.svg" height="32" width="32" class="inline "/></span>
        </div>
    </RouterLink>

</div>

</template>

<style scoped>

.view {
    /* background-image: linear-gradient(90deg, rgba(30,54,62,0) 0%, rgba(30,54,62,0.75) 40%, rgba(30,54,62,0.95) 65%, rgba(30,54,62,0.95) 90%, rgba(30,54,62,0.75) 100%); */
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.75) 40%, rgba(255, 255, 255, 0.95) 65%, rgba(255, 255, 255, 0.95) 90%, rgba(255, 255, 255, 0.75) 100%);
}

div > div {
    user-select: none;
}

.fountain-icon {
  position: absolute;
  font-size: 20px;
  color: #3498db; /* Adjust icon color */
  opacity: 0;
  pointer-events: none;
}
</style>