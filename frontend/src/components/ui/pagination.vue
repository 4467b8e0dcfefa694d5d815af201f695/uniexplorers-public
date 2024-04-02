<script>

    import { useSearchStore } from '@/stores'

    export default {
        name: 'pagination',
        setup() {
            const { setPage, getCurrentPage } = useSearchStore()
            return { setPage, getCurrentPage }
        },
        mounted() {
            if (this.totalPages >= this.window) {
                this.nearbyPages = [...Array(this.window).keys()]
            } else if (this.totalPages < this.window) {
                this.nearbyPages = [...Array(this.totalPages).keys()]
            }

            this.currentPage = this.getCurrentPage
            this.paginationJump(this.currentPage)
        },
        data() {
            return {
                nearbyPages : [],
                currentPage : 0,
                error : '',
                debounceTimeout : null
            }
        },
        props : {
            window : {
                type : Number,
                default : 5
            },
            totalPages : {
                type : Number,
                required : true
            }
        },
        computed : {
            jumpPage : {
                get() {
                    const out = Number.parseInt(this.currentPage) + 1
                    return out
                },
                set(newVal) {
                    if (this.debounceTimeout) {
                        clearTimeout(this.debounceTimeout);
                    }

                    this.debounceTimeout = setTimeout(() => {
                        if (newVal > this.totalPages || newVal <= 0) {
                        this.error = true
                        setTimeout(() => {
                            this.error = false
                        }, 2000);
                    } else if (newVal == '') {
                        return newVal
                    } else {
                        this.error = ''
                        this.paginationJump(newVal-1);
                    }
                    }, 500)
                    const out = this.currentPage + 1
                    return out
                }
            }
        },
        emits : ['pageUpdate'],
        methods : {
            paginationNav(shift) {
                // if is at the start or at the end, do nothing
                if ((this.currentPage == this.totalPages - 1 && shift > 0)
                || (this.currentPage == 0 && shift < 0)) {
                    return
                }
                this.currentPage += shift
                // if currentPage is less than 3, do nothing, except change currentPage
                // if currentPage is more than totalPages - 2, do nothing except change currentPage
                if (this.currentPage < this.window / 2 && this.nearbyPages[0] == 0) {
                    // console.log('doing nothing');
                } else if ((this.currentPage >= (this.totalPages - this.window / 2 - 1) && this.nearbyPages[this.window - 1] >= this.totalPages - 1)) {
                    this.nearbyPages = this.nearbyPages.filter((ele) => ele < this.totalPages)
                } else {
                    this.nearbyPages.forEach((page, idx) => {this.nearbyPages[idx] = page + shift})
                }

                this.setPage(this.currentPage)
                this.$emit('pageUpdate', this.currentPage)
            },
            paginationJump(jump) {
                if (jump < this.totalPages && jump >= 0) {
                    this.currentPage = jump
                }

                if (this.currentPage < this.window / 2) {
                    this.nearbyPages.forEach((page, idx) => {this.nearbyPages[idx] = idx})
                } else if (this.totalPages < this.window) {
                    this.nearbyPages = [...Array(this.totalPages).keys()]
                } else if (this.currentPage > (this.totalPages - this.window / 2 - 1)) {
                    this.nearbyPages.forEach((page, idx) => {this.nearbyPages[idx] = this.totalPages - this.window + idx})
                } else {
                    this.nearbyPages.forEach((page, idx) => {
                        this.nearbyPages[idx] = jump + idx - Math.floor(this.window / 2)
                    })
                }

                this.setPage(this.currentPage)
                this.$emit('pageUpdate', this.currentPage)
            }
        }
    }
</script>

<template>
<div class="text-lg font-bold h-8 flex grow items-center justify-between">
    <div class="select-none flex gap-2 h-full items-center">
        <div :class="{'opacity-30' : currentPage === 0}" class="nav w-8 h-8 flex items-center" @click="paginationNav(-1)" :disabled="currentPage === 0">
            <img src="/vectors/caret.svg" class="min-h-full min-w-full rotate-180" alt="">
        </div>
        <div
            v-for="page in nearbyPages"
            :key="'page'+page"
            @click="paginationJump(page)"
            class="text-content rounded cursor-pointer px-2 select-none"
            :class="{ 'bg-darkgreen text-white shadow-md border border-white ': currentPage === page }"
        >
            {{ page + 1 }}
        </div>
        <div :class="{'opacity-30' : currentPage === totalPages - 1}" class="nav w-8 h-8 flex items-center" @click="paginationNav(1)" :disabled="currentPage === totalPages - 1">
            <img src="/vectors/caret.svg" class="min-h-full min-w-full" alt="">
        </div>
    </div>
    <div class="text-darkgreen mr-2">
        <span :class="error ? 'opacity-100' : 'opacity-0'" class="select-none pointer-events-none transition-opacity font-bold brightness-125 mr-4 text-red">Please enter a valid number</span>
        <input class="font-medium inline w-10 py-1 px-0 my-2 text-center ring-1 ring-inset ring-gray-300 focus:ring-1.5 focus:ring-inset focus:ring-darkgreen rounded-md" type="text" pattern = "[0-9]+" v-model="jumpPage">
    of <span class="font-bold">{{ totalPages }}</span> pages</div>
</div>
</template>

<style scoped>

</style>