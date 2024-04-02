<template>
    <div v-if="city" class="text-center relative">
        <img 
        v-if="city" 
        :src="city.image" 
        class=" w-full h-[700px] object-cover object-top flex"
        />
        <p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white lg:text-9xl text-7xl font-bold">{{ city.name }}</p>
    </div>
</template>

<script setup>
    defineProps({ city: Object })
</script>