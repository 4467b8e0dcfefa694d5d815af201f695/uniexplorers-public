<script>

    import { fetchWrapper } from '@/helpers'
    import { useSearchStore } from '@/stores/searchStore'

    export default {
        name: 'textSearch',

        setup() {
            const searchStore = useSearchStore()
            return { searchStore }
        },
        inject : ['mq'],
        data() {
            return {
                search : '',
                results : [],
                debounceTimeout : null,
                searched : false,
                returnedresults : false,
                showResults : false,
                selectedIdx : -1,
                loading : false
            }
        },
        methods : {
            async goToResult(name) {
                this.showResults = false
                await this.$router.push({path: '/uni/' + name})
            },

            // fix for router not fully func
            // goToResult(name) {
            //     this.showResults = false;
            //     this.$router.push({ name: 'UniHomePage', params: { uniName: name }});
            //     // this.$router.go()
            // },

            debouncedSearch() {
                if (this.debounceTimeout) {
                    clearTimeout(this.debounceTimeout);
                }

                this.debounceTimeout = setTimeout(() => {
                    this.performSearch();
                }, 500)
            },
            performSearch(enter = false) {

                if (this.search.trim() === '') {
                    this.results = [];
                    this.showResults = false
                    this.searched = false
                    this.returnedresults = false
                    return
                }
                
                this.loading = true
                fetchWrapper.get(import.meta.env.VITE_UNI_BACKEND + '/universities/search/' + this.search)
                .then(data => {
                    // Get the first 5 results
                    // console.log(data)
                    this.loading = false
                    const firstEightResults = data.slice();
                    this.results = firstEightResults;
                    this.returnedresults = true
                    
                    if (enter) {
                        if (this.$route.name !== 'ExplorePage') {
                            this.$router.push('/explore')
                        }
                        this.searchStore.setSearchResults(firstEightResults);
                        this.showResults = false;
                        this.returnedresults = false
                    } else {
                            this.showResults = true;
                        }

                        // Update results with the first 8 items
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                this.searched = true;
            },
            updateExplorePage() {
                if (this.selectedIdx > -1) {
                    return this.goToResult(this.results[this.selectedIdx].name)
                } else {
                    return this.performSearch(true)
                }
            },
            navResult(key) {
                switch (key) {
                    case 'up':
                        this.selectedIdx = Math.max(-1, this.selectedIdx - 1)
                        break;
                
                    case 'down':
                        this.selectedIdx = Math.min(this.results.length - 1, this.selectedIdx + 1)
                        break;
                }

                if (this.selectedIdx < this.results.length - 1 && this.selectedIdx > 3) {
                    this.fixScrolling();
                }
            },
            fixScrolling(){
                const liH = this.$refs.searchedItem[this.selectedIdx].clientHeight;
                this.$refs.textSearchContainer.scrollTop = liH * (this.selectedIdx - 3);
                // .scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                
            },
            unFocus() {
                this.returnedresults = false
                this.showResults = false
            }
        }
    }
</script>

<template>

    <div class="wrapper" v-click-outside="unFocus" @click="() => { if (searched) {this.returnedresults=true}}">
        <div class="wrapper" >
            <input @input="debouncedSearch" @keydown.enter="updateExplorePage" @focus="showResults = true" type="text" :class="{'rounded-b-xl' : !returnedresults, 'lazyload' : loading }" class="relative rounded-t-xl w-full h-full pl-4 m-0 text-black"
                placeholder="University?"
                v-model="search"
                @keydown.down.prevent="navResult('down')"
                @keydown.up.prevent="navResult('up')"
                >
            <div class="searchIcon w-auto h-full px-2 absolute flex items-center right-0 top-0 cursor-pointer hover:scale-110">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="black"/>
                </svg>
            </div>
        </div>
        <div v-if="searched && showResults" ref="textSearchContainer" class="wrapper h-auto max-h-[50vh] overflow-y-scroll bg-white overflow-hidden shadow-md rounded-lg rounded-t-none border border-2 border-darkgreen/30">
            <div ref="searchedItem" v-if="results.length > 0" v-for="result, idx in results" @click="goToResult(result.name)" @mouseleave="selectedIdx = -1" @mouseenter="selectedIdx = idx" class="relative shadow-inner w-full min-h-16 py-2 hover:cursor-pointer active:border active:border-darkgreen transition-all duration-75" :class="[idx != results.length - 1 && 'border-b border-lightgray', selectedIdx == idx && 'selected']">
                <h2 class="text-darkgreen pl-4 text-lg font-medium text-left">{{result.name}}</h2>
        
                <div class="text-sm w-full flex flex-row my-2 mx-4 text-lightgrey">
                <div class="location font-medium flex-1 items-center">
                    <svg :class="mq.lgPlus ? 'w-3 mr-2' : 'w-2.5 mr-1.5'" class="inline scale-[0.8] relative bottom-0.5" viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.47143 0 0 4.5385 0 10.15C0 12.673 0.714285 15.0365 2.01429 17.168C3.37143 19.401 5.15714 21.315 6.52857 23.548C7.2 24.6355 7.68571 25.6505 8.2 26.825C8.57143 27.6225 8.87143 29 10 29C11.1286 29 11.4286 27.6225 11.7857 26.825C12.3143 25.6505 12.7857 24.6355 13.4571 23.548C14.8286 21.3295 16.6143 19.4155 17.9714 17.168C19.2857 15.0365 20 12.673 20 10.15C20 4.5385 15.5286 0 10 0ZM10 14.1375C8.02857 14.1375 6.42857 12.5135 6.42857 10.5125C6.42857 8.5115 8.02857 6.8875 10 6.8875C11.9714 6.8875 13.5714 8.5115 13.5714 10.5125C13.5714 12.5135 11.9714 14.1375 10 14.1375Z" fill="#1E363E"/>
                    </svg>
                    {{ result.location }}
                </div>
                <div class="gpa font-medium flex-1 items-center min-w-fit">
                    <svg :class="mq.lgPlus ? 'w-6 mx-2' : 'w-4 scale-105 mr-1.5'" class="inline scale-[0.8] relative" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.36364 16.4011V22.8456L17.5 29L28.6364 22.8456V16.4011L17.5 22.5556L6.36364 16.4011ZM17.5 0L0 9.66667L17.5 19.3333L31.8182 11.4228V22.5556H35V9.66667L17.5 0Z" fill="black"/>
                    </svg>
                    {{ result.gpa_10_percentile }} GPA
                </div>
                <div class="time font-medium flex-1 items-center min-w-fit mr-4">
                    <svg :class="mq.lgPlus ? 'w-5 mx-2' : 'w-3.5 scale-105 mr-1.5'" class="inline scale-[0.8] relative" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.648 8.352C18.9515 6.6555 16.733 5.8 14.5 5.8V14.5L8.352 20.648C11.745 24.041 17.255 24.041 20.6625 20.648C24.0555 17.255 24.0555 11.745 20.648 8.352ZM14.5 0C6.496 0 0 6.496 0 14.5C0 22.504 6.496 29 14.5 29C22.504 29 29 22.504 29 14.5C29 6.496 22.504 0 14.5 0ZM14.5 26.1C8.091 26.1 2.9 20.909 2.9 14.5C2.9 8.091 8.091 2.9 14.5 2.9C20.909 2.9 26.1 8.091 26.1 14.5C26.1 20.909 20.909 26.1 14.5 26.1Z" fill="black"/>
                    </svg>
                    1 Semester
                </div>
                </div>
            </div>
            <div v-else>
                <h2 class="text-darkgreen text-lg font-bold text-center my-2 opacity-50">No Results Found</h2>
            </div>
        </div>
    </div>

</template>

<style scoped>
.selected {
    background-color: #eeeeee
}
</style>