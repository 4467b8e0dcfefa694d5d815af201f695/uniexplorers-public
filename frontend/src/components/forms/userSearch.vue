<script>
    import { fetchWrapper } from '@/helpers'
    
    export default {
        name: 'userSearch',
        inject : ['mq'],
        props: {
            user: Object,
        },
        data() {
            return {
                search : '',
                results : [],
                debounceTimeout : null,
                searched : false,
                returnedresults : false,
                showResults : false,
                selectedIdx : -1,
                loading : false,
            }
        },
        methods : {
            goToResult(user) {
                this.showResults = false
                this.$emit("join", user)
                this.search = "";
            },
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
                fetchWrapper.get(`${import.meta.env.VITE_USER_BACKEND}/users/search/${this.search}`)
                .then(data => {
                    // Get the first 5 results
                    console.log(data)
                    this.loading = false
                    this.results = data.filter(d => d.email != this.user.email)
                    this.returnedresults = true
                    
                    if (enter) {
                        goToResult(this.results[0])
                        this.showResults = false;
                        this.returnedresults = false
                    } else {
                            this.showResults = true;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                    this.searched = true;
            },
            updateChatList() {
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

    <div class="wrapper " v-click-outside="unFocus" @click="() => { if (searched) {this.returnedresults=true}}">
        <div class="wrapper" >
            <input @input="debouncedSearch" @keydown.enter="updateChatList" @focus="showResults = true" type="text" :class="{'rounded-b-xl' : !returnedresults, 'lazyload' : loading }" class="rounded-t-xl w-full h-full textInput"
                placeholder="Search username"
                v-model="search"
                @keydown.down.prevent="navResult('down')"
                @keydown.up.prevent="navResult('up')"
                >
        </div>
        <div v-if="searched && showResults" ref="textSearchContainer" class="wrapper h-auto max-h-[50vh] overflow-y-scroll bg-white overflow-hidden shadow-md rounded-lg rounded-t-none border border-2 border-darkgreen/30">
            <div v-if="results.length > 0">
                <div ref="searchedItem" v-for="result, idx of results" :key="idx" @click="goToResult(result)" @mouseleave="selectedIdx = -1" @mouseenter="selectedIdx = idx" class="text-content relative shadow-inner w-full min-h-16 py-2 hover:cursor-pointer active:border active:border-darkgreen transition-all duration-75" :class="[idx != results.length - 1 && 'border-b border-lightgray', selectedIdx == idx && 'selected']">
                    <h2 class="text-darkgreen pl-4 text-lg font-medium text-left">{{result.email}}</h2>
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