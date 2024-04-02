<script>
import { useAuthStore } from '@/stores';
import { useTimeAgo } from '@vueuse/core';
import { mapState, mapActions } from "pinia";

export default {
    setup() {
        return { useTimeAgo }
    },
    data() {
        return {
            notifs: [],
            image_url: "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
        }
    },
    async mounted() {
        this.notifs = await this.getNotifications()
        this.connectWebsocket()
    },
    methods: {
        ...mapActions(useAuthStore, ['getNotifications', 'connectWebsocket', 'updateNewNotifStatus'])
    },
    computed: {
        new_notif() {
            return this.getNewNotifStatus
        },
        ...mapState(useAuthStore, ['getEmail', 'getNewNotifStatus'])
    },

}
</script>

<template>
    <button id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification"
        class="relative inline-flex items-center text-xl font-medium text-center" type="button" @click="this.updateNewNotifStatus">
        <svg :class="new_notif ? 'fa-bounce' : ''"
            style="--fa-animation-duration: 1.2s; --fa-animation-iteration-count: infinite;" height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#ffffff">
            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/>
        </svg>

        <div v-if="new_notif"
            class="absolute block w-3 h-3 bg-[#CB4A4A] border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900">
        </div>
    </button>
    <div id="dropdownNotification"
        class="z-20 hidden w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
        aria-labelledby="dropdownNotificationButton">
        <div
            class="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
            Notifications
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700 h-80 overflow-y-auto">
            <section v-for="notification in notifs" :key="notification.id">
                <router-link :to="`/uni/${notification.uniName}/discussions/${notification.threadId}`"
                    class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div class="flex-shrink-0">
                        <img class="rounded-full w-11 h-11 z-1" :src="image_url" alt="">
                        <div
                            class="relative flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-400 border border-white rounded-full z-10">
                            <svg class="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 20 18">
                                <path
                                    d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                            </svg>
                        </div>
                    </div>
                    <div class="w-full ps-3">
                        <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                            <span class='font-semibold text-gray-900 dark:text-white'>{{ notification.commentBy
                                }}</span> commented: "{{ notification.message }}"
                        </div>
                        <div class="text-xs text-blue-600 dark:text-blue-500">
                            <span v-if="notification.createdAt">{{ useTimeAgo(notification.createdAt) }}</span>
                            <span v-else>just now</span>
                        </div>
                    </div>
                </router-link>
            </section>
            <section class="flex px-4 py-3 text-center items-center">
                <div class="w-full items-center">
                    <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                        <span>You are caught up with your notifications</span>
                    </div>
                </div>
            </section>
        </div>
        <!-- <a href="#"
            class="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <div class="inline-flex items-center ">
                <svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path
                        d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
                View all
            </div>
        </a> -->
    </div>

</template>

<style>
#dropdownNotification {
    inset: 1.2em auto auto 0 !important;
    left: -5em !important;
}
/* 
.fa-bell::before {
    content: "\f0f3";
} */

.fa {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: var(--fa-display, inline-block);
    font-style: normal;
    font-variant: normal;
    line-height: 1;
    text-rendering: auto;
}

@font-face {
    font-family: 'Font Awesome 6 Free';
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url("../fa-fonts/fa-regular-400.woff2") format("woff2"), url("../fa-fonts/fa-regular-400.ttf") format("truetype");
}

.fa-regular {
    font-family: 'Font Awesome 6 Free';
    font-weight: 400;
}

.fa-bounce {
    -webkit-animation-name: fa-bounce;
            animation-name: fa-bounce;
    -webkit-animation-delay: var(--fa-animation-delay, 0s);
            animation-delay: var(--fa-animation-delay, 0s);
    -webkit-animation-direction: var(--fa-animation-direction, normal);
            animation-direction: var(--fa-animation-direction, normal);
    -webkit-animation-duration: var(--fa-animation-duration, 1s);
            animation-duration: var(--fa-animation-duration, 1s);
    -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
            animation-iteration-count: var(--fa-animation-iteration-count, infinite);
    -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
            animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}


@-webkit-keyframes fa-bounce {
    0% {
        -webkit-transform: scale(1, 1) translateY(0);
                transform: scale(1, 1) translateY(0); }
    10% {
        -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
                transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0); }
    30% {
        -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
                transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em)); }
    50% {
        -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
                transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0); }
    57% {
        -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
                transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em)); }
    64% {
        -webkit-transform: scale(1, 1) translateY(0);
                transform: scale(1, 1) translateY(0); }
    100% {
        -webkit-transform: scale(1, 1) translateY(0);
                transform: scale(1, 1) translateY(0); }
}

@keyframes fa-bounce {
    0% {
        -webkit-transform: scale(1, 1) translateY(0);
                transform: scale(1, 1) translateY(0); }
    10% {
        -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
                transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0); }
    30% {
        -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
                transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em)); }
    50% {
        -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
                transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0); }
    57% {
        -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
                transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em)); }
    64% {
        -webkit-transform: scale(1, 1) translateY(0);
                transform: scale(1, 1) translateY(0); }
    100% {
        -webkit-transform: scale(1, 1) translateY(0);
                transform: scale(1, 1) translateY(0); }
}

</style>