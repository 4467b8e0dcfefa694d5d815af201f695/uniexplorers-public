<script>

    export default {
        name: 'textInput',
        mounted() {
            if (this.type.toLowerCase() == 'number') {
                this.outValue = (val) => parseInt(val)
            } else {
                this.outValue = (val) => val.trim()
            }


        },
        emits : ['update:modelValue'],
        props : {
            label : {
                type : String,
                required : false,
                default : "LABEL"
            },
            placeholder : {
                type : String,
                required : false,
                default : "PLACEHOLDER"
            },
            type : {
                type : String,
                required : false,
                default : "text"
            },
            textSize : {
                type : String,
                required : false,
                default : "text-sm"
            },
            labelSize : {
                type : String,
                required : false,
                default : "text-xs"
            },
            inputHeight : {
                type : String,
                required : false,
                default : "h-11"
            },
            center : {
                type : Boolean,
                required : false,
                default : false
            },
            modelValue : {
                type : [String, Number],
                required : false,
                default : ''
            },
            editable : {
                type : Boolean,
                required : false,
            }
        },
        computed : {
            doLeading() {
                return ["text-2xl", "text-3xl"].includes(this.textSize) ? 'leading-none peer-focus:leading-none -top-6 after:-bottom-6' : 'leading-tight peer-focus:leading-tight -top-1.5 after:-bottom-1.5'
            },
            caretHandling() {
                if (this.center) {
                    if (this.modelValue?.length == 0) {
                        return 'caret-transparent'
                    } else {
                        return ''
                    }
                } else {
                    return ''
                }
                
            }
        }
    }
</script>

<template>

<div :class="inputHeight" class="relative h-fit w-full min-w-content text-lg">
    <input 
        @keydown.enter.prevent
        :type="type"
        :value="modelValue"
        @focusout="$event.target.value = $event.target.value.trim()"
        @input="$emit('update:modelValue', outValue($event.target.value))"
        :placeholder="placeholder"
        :class="[textSize, center ? 'placeholder:text-center text-center' : '', caretHandling, editable ? 'p-0' : 'tracking-widest pb-1.5 pt-4']"
        class="peer text-darkgreen h-full w-full border-t-0 border-r-0 border-l-0 focus:ring-0 border-b border-blue-gray-200 bg-transparent font-poppins font-medium text-blue-gray-700 outline outline-0 transition-all placeholder:font-normal placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
    <label
        v-if="!editable"
        :class="[`peer-placeholder-shown:${textSize} peer-focus:${labelSize} ${labelSize}`, doLeading]"
        class="after:content[''] pointer-events-none absolute left-0 flex h-full w-full select-none !overflow-visible truncate font-normal text-gray-500 transition-all after:absolute after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300  peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-darkgreen peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
        <span :class="[center ? 'text-center' : 'left-4']" class="relative tracking-wider w-full ">{{ label }}</span>
    </label>
</div>

</template>