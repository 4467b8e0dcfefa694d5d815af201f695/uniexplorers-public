<script>

    import { useAuthStore } from '@/stores';
    import { useWindowSize } from '@vueuse/core'
    import { mapState, mapActions } from 'pinia'
    import textInput from '../inputs/textInput.vue';
    import modalDeclaration from '@/components/ui/modalDeclaration.vue'

    export default {
        name: 'personalCard',
        components : {
            textInput,
            modalDeclaration
        },
        setup() {
            const { width, height } = useWindowSize()
            return { width, height }
        },
        mounted() {
            this.form.name = this.getName
            this.form.handle = this.getHandle
            this.form.exchange_name = this.getExchange
        },
        data() {
            return {
                editable : false,
                form : {
                    name : '',
                    handle : '',
                },
                exchange_name : '',
                message : '',
                visible : false
            }
        },
        methods : {
            async toggleEdit() {
                if (this.editable) {
                    let [clerkRes, personalRes] = [Promise.resolve(false), Promise.resolve(false)]
                    const { name, ...rest } = this.form

                    if ( this.getName != name ) {
                        clerkRes = this.updateClerkdata({ name })
                    }

                    if (
                        this.getExchange != this.form.exchange_name
                        || this.getHandle != this.form.handle
                        ) {
                        personalRes = this.updatePersonal(rest)
                    }

                    const res = await Promise.all([clerkRes, personalRes])
                    console.log(res);
                    if (!res.every(res => res === false)) {
                        this.message = 'Successfully Updated'
                        setTimeout(() => {
                            this.message = ''
                        }, 1000)
                    }
                }

                this.editable = !this.editable
            },
            signOut() {
                this.logout()
                this.$router.replace('/')
            },
            ...mapActions(useAuthStore, ['updatePersonal', 'updateClerkdata', 'logout']),
        },
        computed : {
            imgDimension() {
                return 224/1386*this.width
            },
            ...mapState(useAuthStore, ['personal', 'getProfileImage', 'getMetadata', 'getName', 'getHandle', 'getExchange'])
        }
    }
</script>

<template>

<div class="wrapper">
    <button :class="[editable ? 'btnAction' : 'btnNormal']" class="absolute right-0 m-4 z-10" @click="toggleEdit">
        {{ editable ? 'save!' : 'edit ✍🏻' }}
    </button>

    <div class="grid grid-cols-12 profileCards p-8 gap-4">
        
        <div class="hidden md:block col-span-1 xl:col-span-full xl:mb-2 xl:-mt-2">
            <div class="wrapper flex profileImg justify-center min-h-min min-w-min">
                <img :src="getProfileImage" class="rounded-full border border-2 border-darkgreen shadow-sm object-cover aspect-square" :width="imgDimension">
            </div>
        </div>

        <div class="col-start-1 md:col-start-2 col-end-12 xl:col-span-full flex flex-col gap-2">
            <div class="flex flex-col relative">
                <span class="absolute -translate-y-full">{{ message }}</span>
                <textInput v-if="editable" editable textSize="text-lg" v-model="form.name" placeholder="Add your name!"/>
                <span v-else class="font-medium -mb-1 h-8 text-lg">{{ getName }}</span>
                <span class="text-lightgrey/60">{{ personal ? personal.email : 'Loading'  }}</span>
                <!-- <span class="right-0 absolute text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1">
                Hanging Around
                </span> -->
            </div>

            <div v-if="!getExchange" class="declare relative flex p-1.5 justify-center items-center">
                <div class="rainbow-border after:rounded-lg"/>
                <button class="btnActionInvert z-10 w-full" @click="visible = true">
                    Declare Exchange!
                </button>

            </div>

            <modalDeclaration :visible="visible" @cancel="visible = false" @declare="visible = false"/>

            <div class="flex gap-2">
                <img src="/vectors/school.svg" class="inline" height="28" width="28">
                <span>
                    <div class="font-medium text-wrap">{{ personal ? personal.university_name : 'Loading' }}</div>
                    <div class="text-sm font-medium text-lightgrey/80">{{ personal ? personal.major : 'Loading' }}</div>
                </span>
            </div>
            <div class="min-w-max flex items-center">
                <img src="/vectors/telegramflat.svg" class="inline" height="28" width="28">&nbsp;

                <span v-if="editable" class="grow">
                    <textInput editable textSize="text-base" v-model="form.handle" placeholder="Edit in your handle!"/>
                </span>
                <a v-else-if="getHandle" :href="'https://t.me/'+getHandle" target="_blank" class="font-medium">{{ getHandle }}</a>
                <span v-else > Edit in your handle! </span>
            </div>
            <h2 class="font-bold">Interests</h2>
            <span>{{ personal ? (personal.interests ? personal.interests.join(', ') : "gg everything under the sun") : 'Loading' }}</span>

            <button class="btnDanger" @click="signOut"> Logout </button>
        </div>

    </div>
</div>

</template>

<style scoped>

</style>