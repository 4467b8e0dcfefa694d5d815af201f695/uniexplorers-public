<script>

    import { useMajorsStore } from '@/stores/majorsStore'


    export default {
        name: 'tags',
        props : {
            majorName : String
        },
        inject: ['mq'],
        setup() {
            const majorsStore = useMajorsStore()
            return { majorsStore }
        },
    }
</script>

<template>
<div :class="[...majorsStore.getMajor(this.majorName)]" class="tag text-2xs lg:text-xs font-semibold w-fit px-4 py-1 rounded-xl">
    {{ majorName }}
</div>
</template>
