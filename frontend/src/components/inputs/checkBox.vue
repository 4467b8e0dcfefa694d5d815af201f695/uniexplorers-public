<script>

    export default {
        name: 'checkBox',
        props : {
            modelValue: { type: [Array, Boolean] },
            value: { type: [Boolean, String] },
            label: { type: String },
            // checked: {type: Boolean, default: false}
        },
        data() {
            return {
                checked : false
            }
        },
        computed:{
            model:{
                get() {
                    return this.modelValue;
                },
                set(value) {
                    this.$emit("update:modelValue", value);
                }
            }
        },
        methods: {
            checkBoxUpdate(event) {
                this.checked = !this.checked;
            }
        },
        inject: ['mq']
    }
</script>

<template>
    <label :class="checked ? 'active scale-105 text-darkgreen stroke-[0.5px] stroke-darkgreen' : ''" class="hover:scale-105 hover:text-darkgreen hover:stroke-[0.5px] hover:stroke-darkgreen transition-all max-w-fit pr-2 h-7 text-lightgrey flex flex-row items-center gap-2 select-none">
        <div class="h-full"><input class="text-darkgreen focus:ring-0" type="checkbox" :id="label" v-model="model" :value="value" :checked="checked" @change="checkBoxUpdate"> </div>
        <span :class="mq.lgPlus ? 'text-base' : (mq.mdPlus ? 'text-sm' : 'text-sm')" class="label min-w-max text-base text-center">{{ label }}</span>
    </label>
</template>

<style scoped>
 * {
    cursor: pointer;
}

label:hover {
    -webkit-text-stroke-width: 0.5px;
    -webkit-text-stroke-color: #1E363E;
}
.active {
    -webkit-text-stroke-width: 0.5px;
    -webkit-text-stroke-color: #1E363E;
}


</style>