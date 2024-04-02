<script>
import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';
import { mapState } from 'pinia';

export default {
        name: 'joinTelegramCard',
        data() {
                return {
                        current_uni: this.$route.params.uniName,
                        invite_link: "",
                        numUsers: 0
                }
        },
        props: {
                teleInfo: {
                        type: Object
                        // {
                        //     title : String,
                        //     numUsers : Number,
                        //     link : String,
                        //     MAYBEINTHEFUTURE => sampleUsers : Array<Object>
                        // }
                }
        },
        beforeMount() {
                // let telegramEmbed = document.createElement('script')
                // telegramEmbed.setAttribute('src', 'https://telegram.org/js/telegram-widget.js?22')
                // telegramEmbed.setAttribute('data-telegram-post', 'smuxtrekkers/12786')
                // telegramEmbed.setAttribute('data-width', '100%')
                // this.$refs.contentTelegram.appendChild(telegramEmbed)
                // document.head.appendChild(recaptchaScript)

                // rgb(75, 163, 226) TELEGRAM DEFAULT BLUE
                // rgb(63, 153, 217) TELEGRAM HOVERED BLUE
                // add async?

                if ( this.getExchange == this.$route.params.uniName) {
                        this.joinTelegramGroup()
                }
        },
        methods: {
                async joinTelegramGroup() {
                        try {
                                const response = await fetchWrapper.get(`${import.meta.env.VITE_TELE_BACKEND}/telegram/get_invite_link?university=${this.$route.params.uniName}`)
                                // Handle response accordingly
                                console.log(response)
                                if (response && response.invite_link) {
                                        this.invite_link = response['invite_link'];
                                        this.getCount();
                                }
                        } catch (error) {
                                // Handle error
                                // Make another request or handle accordingly
                                const newInviteLinkResponse = await fetchWrapper.post(`${import.meta.env.VITE_TELE_BACKEND}/telegram/create_group`,
                                                {
                                                        university: this.$route.params.uniName,
                                                        usernames: ['gnefhzth']
                                                })
                                this.invite_link = newInviteLinkResponse.invite_link;
                                this.getCount();
                        }
                },

                async getCount(){
                        // console.log(this.invite_link)
                        const response = await fetchWrapper.get(`${import.meta.env.VITE_TELE_BACKEND}/telegram/get_participant_numbers?invite_link=${this.invite_link}`)
                                // Handle response accordingly
                                // console.log(response)
                                if (response.count) {
                                        this.numUsers = response['count'];
                                }
                }
        },
        computed: {
                ...mapState(useAuthStore, ['getExchange'])
        }
}
</script>

<template>
        <div class="relative bg-white mt-4 overflow-hidden rounded-xl h-28 text-darkgreen flex">
                <div v-if="current_uni === getExchange" class="rainbow-border" />
                <div v-if="current_uni === getExchange"
                        class="content bg-white font-medium text-lg mx-1.5 my-1.5 rounded-lg md:px-8 py-5 z-10 flex grow items-center justify-around">
                        <span><strong>{{ this.numUsers ?? 120 }}</strong> have joined&nbsp;<strong>👉 {{
                $route.params.uniName.toUpperCase()
                                        ?? "SMU EXCHANGE WINTER '23"}} 👈</strong> &nbsp;~ Connect with them on telegram
                                here</span>
                        <span ref="contentTelegram"
                                class="hover:cursor-pointer hover:bg-[#3f99d9] bg-[#4ba3e2] font-roboto text-white text-base px-4 py-2 rounded font-bold m-auto flex items-center gap-4">
                                <a :href=invite_link>
                                Join the group!
                                <img src="/vectors/telegram.svg" height="32" width="32"></a></span>
                </div>
                <div v-else class="content bg-white font-medium text-lg mx-1.5 my-1.5 rounded-lg md:px-8 py-5 z-10 flex grow items-center justify-around">
                        <img src="/vectors/telegram.svg" height="32" width="32">
                        <span><strong>Please declare this university in your profile to join the groupchat!</strong></span>
                                <img src="/vectors/telegram.svg" height="32" width="32">
                </div>
        </div>

</template>

<style scoped>
.heartbeat {
        content: '';
        -webkit-animation: heartbeat 1.5s ease-in-out infinite both;
        animation: heartbeat 1.5s ease-in-out infinite both;
}

@-webkit-keyframes heartbeat {
        from {
                -webkit-transform: scale(1);
                transform: scale(1);
                -webkit-transform-origin: center center;
                transform-origin: center center;
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        }

        10% {
                -webkit-transform: scale(0.91);
                transform: scale(0.91);
                -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
        }

        17% {
                -webkit-transform: scale(0.98);
                transform: scale(0.98);
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        }

        33% {
                -webkit-transform: scale(0.87);
                transform: scale(0.87);
                -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
        }

        45% {
                -webkit-transform: scale(1);
                transform: scale(1);
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        }
}

@keyframes heartbeat {
        from {
                -webkit-transform: scale(1);
                transform: scale(1);
                -webkit-transform-origin: center center;
                transform-origin: center center;
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        }

        10% {
                -webkit-transform: scale(0.91);
                transform: scale(0.91);
                -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
        }

        17% {
                -webkit-transform: scale(0.98);
                transform: scale(0.98);
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        }

        33% {
                -webkit-transform: scale(0.87);
                transform: scale(0.87);
                -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
        }

        45% {
                -webkit-transform: scale(1);
                transform: scale(1);
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        }
}
</style>