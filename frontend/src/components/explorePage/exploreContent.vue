<script>

    import uniCards from '@/components/uniCards.vue';
    import exploreFilter from '@/components/forms/exploreFilter.vue';
    import { useSearchStore } from '@/stores'
    import Pagination from '../ui/pagination.vue';

    export default {
        name: 'exploreContent',
        setup() {
            const { navigatePage, getSearchResults, setPage } = useSearchStore()
            const searchStore = useSearchStore()

            return { navigatePage, getSearchResults, searchStore, setPage }
        },
        async mounted() {
            this.loading = true
            const totalResults = await this.getSearchResults()
            this.totalPages = Math.ceil(totalResults.length / this.MAX_CARDS)
            this.updateDisplayedResult(0)

            this.searchStore.$onAction(({
                name, // name of the action
                store, // store instance, same as `someStore`
                args, // array of parameters passed to the action
                after, // hook after the action returns or resolves
                onError, // hook if the action throws or rejects
            }) => {

                if (name === 'getSearchResults') {
                    this.loading = true
                }

                after((data) => {
                    if (name === 'setSearchResults') {
                        this.setPage(0)
                        const totalRes = data.length
                        if (totalRes == 0) {
                            this.error = 'No Results Found'
                            this.loading = false
                            this.totalPages = 0
                            this.displayedResults = []
                        } else {
                            this.totalPages = Math.ceil(totalRes / this.MAX_CARDS)
                            this.updateDisplayedResult(0)
                        }
                    }
                })
            })
        },
        inject: ["mq"],
        components : {
            uniCards,
            exploreFilter,
            Pagination
        },
        data() {
            return {
                error : "",
                loading : true,
                displayedResults : [],
                MAX_CARDS : 6,
                totalPages : 0,
            }
        },
        methods : {
            updateDisplayedResult(pageNum) {
                this.getSearchResults('get').then(res=>{
                    const startIdx = pageNum * this.MAX_CARDS
                    this.displayedResults = res.slice(startIdx, startIdx + this.MAX_CARDS)
                })
                this.loading = false
            },
        }
    }
</script>

<template>
<div :class="mq.lgPlus ? 'w-auto' : 'w-full'" class="RESULTS rounded-xl flex flex-col justify-start gap-2 min-w-[50vw] min-h-[50vh]">

    <Pagination :key="'paginationFor' + totalPages" @pageUpdate="updateDisplayedResult" :totalPages="totalPages"/>

    <div class="wrapper">
        <div class="flex flex-col gap-3" >
            <uniCards v-for="uni in displayedResults" v-bind:key="uni.name" :uniData="uni"/>
        </div>
        <div v-if="displayedResults.length == 0" class="w-full h-full flex justify-center items-center">
            <span class="text-7xl font-bold">{{ error }}</span>
        </div>
        <div v-if="loading" class="lazyload wrapper min-h-full absolute top-0 mix-blend-multiply rounded-lg"></div>
    </div>


</div>
</template>

<style scoped>

</style>