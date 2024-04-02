<script>

    import { useTimeAgo } from '@vueuse/core';
    import { useCacheStore } from '@/stores';
    import { mapActions } from 'pinia';


    export default {
        name: 'notification',
        setup() {
            return { useTimeAgo }
        },
        data() {
            return {
                userPic : null
            }
    },
        mounted() {
            this.getUserPic(this.notifs.commentBy).then( res => {
                this.userPic = res
            })
        },
        props : {
            notifs : {
                type : Object,
                required : false,
                default : {
                    title : "Notification title",
                    message : "Content to show Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe necessitatibus expedita quidem ea ab officia nihil quasi laboriosam, ipsum odio assumenda! Animi dignissimos totam expedita nesciunt a fugiat ea natus?",
                    datetime : new Date('2024-02-26T12:00:00'),
                    // user : null
                    commentBy : null
                }
            }
        },
        methods : {
            handleNav() {
                if (Object.hasOwn(this.notifs, 'threadId')) {
                    this.$router.push(`/uni/${notifs?.uniName}/discussions/${notifs?.threadId}`)
                }
            },
            ...mapActions(useCacheStore, ['getUserPic'])
        }
    }
</script>

<template>

<div class="max-w-full flex items-center pt-1 pb-1.5 px-4 select-none">
    <img v-if="notifs.commentBy" :src="userPic" class="relative rounded-full outline mr-4 outline-2 outline-darkgreen" width="56" height="56" >
    <div @click="handleNav">
        <span class="flex justify-between">
            <h2 class="font-semibold grow leading-relaxed">
                {{notifs?.title}}
            </h2>
            <!-- <span class="text-lightgrey text-sm self-center font-light">
                {{ useTimeAgo(notifs.datetime) }}
            </span> -->
        </span>
    
        <p class="text-wrap line-clamp-2 w-full leading-snug self-start" >
            {{notifs.message}}
        </p>
    </div>
</div>


</template>

<style scoped>

</style>