<script>

    import { fetchWrapper } from '@/helpers/fetch-wrapper.js'
    import { useAuthStore } from '@/stores'
    import textInput from '@/components/inputs/textInput.vue'
    import dragChip from '@/components/ui/dragChip.vue';
    import { mapState, mapActions } from 'pinia';
    import spinner from '@/components/ui/spinner.vue'

    export default {
        name: 'onboardingPage',
        components : {
            dragChip,
            textInput,
            spinner
        },
        async beforeRouteEnter(to, from) {
            if (from.path == '/profile') {
                return
            }

            const { login } = useAuthStore()
            if (await login()) {
                return '/profile'
            }
        },
        async mounted() {
            this.name = this.getName
            fetchWrapper.get(`${import.meta.env.VITE_USER_BACKEND}/users/interests`).then( res => {
                this.knownInterests = res.map(int => ({ interest : int.interest, sort: Math.random() }))
                                        .sort((a, b) => a.sort - b.sort)
                                        .map(({ interest }) => interest)
                                        .slice(0, 30)
                this.buildSelectionCloud()
            })
        },
        async unmounted() {
            const { login } = useAuthStore()
            if (!(await login())) {
                this.logout()
            }
        },
        data() {
            return {
                form : {
                    name : '',
                    flavor_text : '',
                    // year_on_exchange : 2,
                    // exchange_duration : 3,
                    university_name : '',
                    major : '',
                    aspire : '',
                    interests : [],
                    // handle : ''
                },
                knownInterests : [],
                testOut : '',
                cloud : {
                    nRows : 4,
                    rowItems : []
                }
            }
        },
        computed : {
            ...mapState(useAuthStore, ['getName', 'getProfileImage'])
        },
        methods : {
            ...mapActions( useAuthStore, ['updateClerkdata', 'updatePersonal', 'logout']),
            scrollNext(ele) {
                let QnBox;

                if (!['endoff', 'q6'].includes(ele)) {
                    QnBox = this.$refs[ele].getElementsByTagName('input')[0]
                    QnBox.focus({preventScroll: true})
                } else {
                    QnBox = this.$refs[ele]
                }
                QnBox.scrollIntoView({behavior: 'smooth', block: 'center'})
                if (ele == 'endoff') {
                    this.createUserData().then( res => {
                        setTimeout(()=>{
                            this.$router.push('/profile')
                        }, 2000)
                    }).catch( err => {
                        console.log(err)
                    })
                }
            },

            selectItem(row, col) {
                let itemRow = this.cloud.rowItems[row]
                this.form.interests.push({value : itemRow[col], row : row})
                itemRow = itemRow.splice(col, 1)
            },

            removeSelectedItem(obj) {
                const [idx, originalValueRow] = obj
                this.form.interests.splice(idx, 1)
                this.cloud.rowItems[originalValueRow.row].push(originalValueRow.value)
            },
            async createUserData() {
                const { name , ...rawform} = this.form
                const { interests, ...form} = rawform
                form['interests'] = interests.map(ele => ele.value)
                form['handle'] = null,
                form['image_filename'] = this.getProfileImage ?? ''
                const userDBRes = fetchWrapper.post(`${import.meta.env.VITE_USER_BACKEND}/users`, form)

                const clerkMeta = {
                    name,
                    is_admin : false,
                    is_alumni : false,
                    profileImage : null
                }

                const clerkRes = this.updateClerkdata(clerkMeta)

                return await clerkRes && await userDBRes
            },
            buildSelectionCloud() {
                const cloudContainer = this.$refs.cloud
                const w = cloudContainer.clientWidth
                const gap = 16
                const rowHeight = 12 + 8 // height of each row 
                const h = this.cloud.nRows * rowHeight // height of the ellipse
                
                // Quite cursed hehe
                // const rowStarts = new Array(nRows).fill(null).map((e, idx) => gap + rowHeight * idx)
                // const rowWidths = rowStarts.map((y) => w/h * Math.sqrt(h**2 - y**2))
                const temp = new Array(this.cloud.nRows/2).fill(null).map((e, idx) => Math.floor(w/h * Math.sqrt(h**2 - (gap + rowHeight * idx)**2)))
                this.cloud.rowLengths = [].concat(temp.toReversed(), temp)

                let totalAdded = 0
                for (let i = this.cloud.nRows; totalAdded < this.knownInterests.length; i++) {
                    let upTo = Math.min(this.knownInterests.length, totalAdded + i)
                    this.cloud.rowItems.push(this.knownInterests.slice(totalAdded, upTo))
                    totalAdded = upTo
                }

            }
        }
    }
</script>

<template>
    <!-- TODO: Add background -->
<!-- <a href="https://storyset.com/people">People illustrations by Storyset</a> -->

    <form class="top-0 bg-white" @submit.prevent>

        <div ref="questionaire" class="flex flex-col items-center m-auto max-h-[100vh] overflow-y-auto snap-y snap-mandatory">
            <div ref="q1" class="question snap-center">
                <textInput @keyup.enter="scrollNext('q2')" center inputHeight="h-20" textSize="text-3xl" labelSize="text-2xl" label="You should be called..." v-model="form.name" placeholder="A short name will do!" />
                <button @click="scrollNext('q2')" class="btnAction font-bold h-12 mt-4 self-end">Next ></button>
            </div>
            <div ref="q2" class="question snap-center" style="padding-top: 10%;">
                <h1 v-if="form.name">Hey {{ form.name }}! Great to have you join us!</h1>
                <h1 v-else>You should get back up there and enter a name :)</h1>
                <textInput class="mt-8" @keyup.enter="scrollNext('q3')" center inputHeight="h-20" textSize="text-3xl" labelSize="text-2xl" label="How would you describe yourself?" v-model="form.flavor_text" placeholder="Life-long learner" />
                <button @click="scrollNext('q3')" class="btnAction font-bold h-12 mt-4 self-end">Next ></button>
            </div>
            <div ref="q3" class="question snap-center">
                <textInput @keyup.enter="scrollNext('q4')" center inputHeight="h-20" textSize="text-3xl" labelSize="text-2xl" label="Which institution are you studying in?" v-model="form.university_name" placeholder="XYZ University" />
                <button @click="scrollNext('q4')" class="btnAction font-bold h-12 mt-4 self-end">Next ></button>
            </div>
            <div ref="q4" class="question snap-center">
                <textInput @keyup.enter="scrollNext('q5')" center inputHeight="h-20" textSize="text-3xl" labelSize="text-2xl" label="The course you are pursuing for?" v-model="form.major" placeholder="Business? Finance? Comp Sci?" />
                <button @click="scrollNext('q5')" class="btnAction font-bold h-12 mt-4 self-end">Next ></button>
            </div>
            <div ref="q5" class="question snap-center">
                <textInput @keyup.enter="scrollNext('q6')" center inputHeight="h-20" textSize="text-3xl" labelSize="text-2xl" label="And what are you striving to become?" v-model="form.aspire" placeholder="Engineer? Lawyer? Doctor?" />
                <button @click="scrollNext('q6')" class="btnAction font-bold h-12 mt-4 self-end">Next ></button>
            </div>
            
            <div ref="q6" class="question snap-center" style="padding-top: 15%;">
                <div class="wrapper text-gray-500 text-center font-normal leading-tight tracking-wider">
                    <h2 class="text-3xl">What are your interests?</h2>
                    <p class="text-xl italic">Choose up to 3</p>
                    <div class="selected h-fit flex gap-4 items-center mt-8">
                        <dragChip v-for="item, interestIdx in form.interests" :value="item.value" removeable @remove="removeSelectedItem" :identifier="[interestIdx, item]"/>
                        <!-- TODO: Add custom addition, lower priority -->
                        <!-- <div class="customAddition flex">
                            <textInput class="ml-4 justify-self-end" inputHeight="h-16" labelSize="text-xl" label="Others?" placeholder="Surprise us!"/>
                            <button class="btnAction self-end mb-2">Add</button>
                        </div> -->
                    </div>
                    <button @click="scrollNext('endoff')" class="btnAction font-bold h-12 mt-4 self-end">And that's a wrap!</button>

                </div>
                <hr class="border-t-2 m-2 mb-12">
                <div class="flex flex-col justify-around">
                    <div class="wrapper">
                        <h2 class="text-gray-500/50 mb-4 text-center font-normal tracking-wider text-3xl">Some suggestions by us...</h2>
                        <div class="text-darkgreen font-bold flex flex-col gap-4 items-center" ref="cloud">
                            <ul v-for="items, idx in cloud.rowItems" :key="`row-${idx}`" class="list-none flex justify-center gap-4">
                                <li v-for="item, idy in items" :key="`item-${idy}`">
                                    <dragChip :class="{'pointer-events-none opacity-50 shadow-none' : form.interests.length == 3}" :value="item" @click="selectItem(idx, idy)"/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div ref="endoff" class="question snap-center">
                <h1 class="text-darkgreen">THATS ALL, THANKS FOR SUBMITTING IT LOLOL, lets get u back to profile <spinner class="inline" /></h1>
            </div>

        </div>
    </form>
</template>

<style scoped>

.question {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 20%;
    width: 33%;
}

::-webkit-scrollbar {
    display: none;
}

</style>