<script>

    export default {
        name: 'dragChip',
        data() {
            return {

            }
        },
        emits : ['remove'],
        props : {
            value : {
                type : String,
                required : false,
                default : 'Label Here'
            },
            identifier : {
                type : Object,
                required : false,
            },
            action : {
                // this.$emit('remove', `chip-${value}`)
                type : Function,
                required : false,
            },
            removeable : {
                type : Boolean,
                required : false,
                default : false
            },
        }
    }
</script>

<template>

<div
    :id="`chip-${value}`"
    class="relative w-fit h-fit grid select-none items-center whitespace-nowrap rounded-lg bg-gray-900 py-1.5 px-3 font-poppins text-md font-bold uppercase text-white">
    <span :class="{'mr-5' : removeable}">{{value}}</span>
    <button
        v-if="removeable"
        @click="$emit('remove', identifier)"
        class="!absolute  top-2/4 right-1 mx-px h-5 max-h-[32px] w-5 max-w-[32px] -translate-y-2/4 select-none rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        </span>
    </button>
</div>

</template>