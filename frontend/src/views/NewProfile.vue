<script>

    import notification from '@/components/ui/notification.vue'
    import spinner from '@/components/ui/spinner.vue'
    import threadPreview from '@/components/profile/threadPreview.vue'
    import personalCard from '@/components/profile/personalCard.vue'
    import uniCards from '@/components/uniCards.vue'
    import { useAuthStore } from '@/stores'
    import { mapActions, mapState } from 'pinia'
    import { fetchWrapper } from '@/helpers'

    export default {
        name: 'NewProfile',
        async beforeRouteEnter() {
            const { login } = useAuthStore()
            if (!await login()) {
                return '/welcome'
            }
        },
        components : {
            threadPreview,
            personalCard,
            uniCards,
            notification,
            spinner
        },
        beforeMount() {
            this.getNotifications().then( res => {
                this.notifications.push(...res)
            })
            this.refreshRecommendedThreads()
            this.refreshRecommendedUniversities()

            const quoteTags = ["change", "character", "competition", "courage", "creativity", "education", "freedom", "friendship", "future", "gratitude", "happiness", "health", "imagination", "inspirational", "knowledge", "life", "motivational", "self", "wellness", "wisdom"]
            fetchWrapper.get('https://api.quotable.io/random?tags=' + quoteTags.join('|')).then( res => {
                setTimeout(() => {
                    this.randomQuote = res
                }, 1000);
            })
        },
        data() {
            return {
                meta : {
                    name : 'Your Name',
                    is_admin : false,
                    is_alumni : false,
                    profileImage : null
                },
                randomQuote : null,
                notifications : [],
                suggestedThreads : [],
                suggestedUnis : [],
                savedUni : [],
                loadingThreads : true,
                loadingUnis : true,
            }
        },
        computed : {
            ...mapState(useAuthStore, ['getName', 'getRecommendedUniversities', 'getRecommendedThreads', 'getExchange'])
        },
        methods : {
            // TODO: Consider ordering based on how long the content is 
            handleClear() {

            },
            refreshRecommendedThreads() {
                this.loadingThreads = true
                this.updateRecommendedThreads().then( res=> {
                    this.suggestedThreads = res
                    this.loadingThreads = false
                })
            },
            refreshRecommendedUniversities() {
                this.loadingUnis = true
                this.updateRecommendedUniversities().then( res => {
                    this.suggestedUnis = res
                    this.loadingUnis = false
                })
            },
            ...mapActions(useAuthStore, ['updateRecommendedUniversities', 'updateRecommendedThreads', 'getNotifications'])
        }

    }
</script>

<template>

<div class="w-full h-auto text-content grid auto-rows-auto xl:grid-cols-13 gap-4 p-8">
    <div class="head col-span-full">
        <h2 class="card bg-white border-gray-300 shadow-sm text-2xl flex relative">

            <span class="font-caudex contents">Hello </span>
            <span class="contents font-medium">{{ getName ?? "Someone" }}</span>!

            <span v-if="getExchange" class="px-2 rounded-md font-caudex grow inline"> All the best in your journey to <a :href="`uni/${getExchange}`" class="exchangeLink transition-all duration-500 hover:text-lightgreen px-2"><strong>{{ getExchange }}</strong></a> ! We look forward to hearing your experience in the <a :href="`uni/${getExchange}/discussions`" class="exchangeLink transition-all duration-500 hover:text-lightgreen px-2 font-medium">forums 💬</a> & <a :href="`uni/${getExchange}`" class="exchangeLink transition-all duration-500 hover:text-lightgreen px-2 font-medium">review 📝</a> ! </span>
            <span v-else :class="!randomQuote ? 'lazyload' : ''" class="px-2 rounded-md font-caudex grow inline">{{ randomQuote?.content }} <span class="text-base text-lightgrey/70"> ~ {{ randomQuote?.author }}</span> </span>

            <!-- Can add notifications here??? -->
        </h2>
    </div>

    <div class="col-span-full xl:col-span-3 relative box-border">
        <personalCard/>
    </div>

    <div class="grid grid-cols-subgrid xl:col-span-10 md:grid-rows-2 grid-flow-row-dense md:grid-flow-col-dense gap-2 box-border">

            <div v-if="savedUni.length > 0" class="UniSaved profileCards xl:col-span-5">
                <h1 class="text-2xl mt-0">Your saved universities</h1>
                <div class="uniCardsContent">
                </div>
            </div>

            <div class="xl:col-span-5 TopThreads">
                <div class="wrapper profileCards h-fit min-h-fit">
                    <span class="flex justify-between">
                        <h1 class="text-2xl mt-0">🔥 Top Threads 🔥</h1>
                        <span class="flex h-fit items-center gap-4">
                            <spinner v-if="loadingThreads"/>
                            <button class="btnAction self-start" @click="refreshRecommendedThreads"> Refresh </button>
                        </span>
                    </span>
                    <div class="TopThreadsContent flex flex-col gap-6">
                        <threadPreview v-for="thread in suggestedThreads.slice(0, Math.min(suggestedThreads.length, 3))" :key="thread.thread_id" :threadId="thread.thread_id"/>
                        <!-- <threadPreview :metrics="{value : 17, metric : 'replies', time : '6h'}"/>
                        <threadPreview :metrics="{value : 23, metric : 'new users', time : '6h'}"/> -->
                    </div>
                </div>
            </div>


            <div class="xl:col-span-5 md:row-span-2 order-first md:order-2 RecentActivity" >
                <div class="wrapper profileCards flex flex-col">
                    <div class="flex justify-between">
                        <h1 class="text-2xl mt-0">Recent Activity</h1>
                        <button :disabled="notifications.length == 0" :class="{'disabled' : !notifications.length}" class="btnDanger" @click="handleClear">
                            clear
                        </button>
                    </div>
                    <div v-if="notifications.length" class="scrollbox wrapper overflow-y-scroll overscroll-contain outline outline-lightergrey outline-offset-4 outline-r-0">
                        <ul class="RecentActivityContent w-full divide-y divide-gray-300">
                            <li v-for="notif, idxNotif in notifications" :key="idxNotif">
                                <notification :notifs="notif"/>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="flex justify-center items-center h-4/6 relative">
                        <p class="select-none font-poppins font-bold text-lightgrey/60 text-3xl text-center">
                            Nothing to see here... <br>
                            Interact with more people!
                        </p>
                    </div>
                </div>
            </div>

            <div class="xl:col-span-5 UniSuggestions">
                <div class="wrapper profileCards h-fit">
                    <span class="flex justify-between">
                        <h1 class="text-2xl mt-0">Check them out! 🏫 Tailored just for you 🤓</h1>
                        <span class="flex h-fit items-center gap-4">
                            <spinner v-if="loadingUnis"/>
                            <button class="btnAction self-start" @click="refreshRecommendedUniversities"> Refresh </button>
                        </span>
                    </span>
                    <div class="uniCardsContent flex flex-col gap-2">
                        <uniCards v-for="uni, idxUni in suggestedUnis?.slice(0, 3)" :uniData="uni" small :key="idxUni"/>
                    </div>
                </div>
            </div>
    

    </div>

</div>

</template>

<style scoped>
h1 {
    user-select: none;
}

.exchangeLink {
    background: linear-gradient(to right, #1E363E 50%, #DAE3DD 50%) left;
    background-size: 200%;
    background-position:right bottom;
}

.exchangeLink:hover {
    background-position: left bottom;
}
</style>