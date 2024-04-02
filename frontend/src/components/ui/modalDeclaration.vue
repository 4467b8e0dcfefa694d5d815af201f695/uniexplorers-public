<script>

    import { useCacheStore, useAuthStore } from '@/stores';
    import { mapState, mapActions } from 'pinia';
    import spinner from './spinner.vue'

    export default {
        name: 'modalDeclaration',
        mounted() {
            this.getUniNames.then( data => {
                this.uniNames.push(...data)
            })
        },
        components : {
            spinner
        },
        data() {
            return {
                uniNames : [],
                exchange_name : '',
                loading : false,
                message : ''
            }
        },
        props : {
            visible : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            ...mapState(useCacheStore, ['getUniNames'])
        },
        methods : {
            handleDeclare(data) {
                console.log(data)
                this.loading = true
                this.updatePersonal({exchange_name : this.exchange_name}).then( res => {
                    this.loading = false
                    setTimeout(() => {
                        this.$emit('declare', this.exchange_name)
                    }, 200);
                }).catch( err => {
                    this.message = 'Unfortunately, something went wrong. Please try again later.'
                    setTimeout(() => {
                        this.message = ''
                    })
                })
            },
            ...mapActions(useAuthStore, ['updatePersonal'])
        }
    }
</script>

<template>

    <Transition name="fade">
        <div v-if="visible" @wheel.prevent @touchmove.prevent @scroll.prevent class="fixed z-50 fixed backdrop-blur-sm top-0 left-0 w-screen h-screen inset-0 bg-gray-500 bg-opacity-75 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <form @submit.prevent="handleDeclare" class="modalCard relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Declaring Exchange University</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">Great that you've found your match! Just make sure that you are <strong>definitely</strong> going there. <br><br> Your declaration cannot be undone.</p>
                                </div>
                                <input type="search" list="uniList" class="mt-6 textInput-valid" v-model="exchange_name" required>
                                <datalist id="uniList">
                                    <option v-for="uniName in uniNames" :value="uniName"/>
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-4">
                        <button type="submit" class="btnAction">Declare!</button>
                        <button type="button" class="btnNormal" @click="$emit('cancel')">Cancel</button>
                        <span :class="loading ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">
                            <spinner/>
                        </span>

                        <span class="error">
                            {{ message }}
                        </span>
                    </div>
                </form>
                </div>
            </div>
        
        </div>
    </Transition>

</template>

<style scoped>

</style>