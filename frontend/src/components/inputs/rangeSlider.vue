<script>
    export default {
        name: 'rangeSlider',
        props : {
            min : {
                type : Number,
                required : true
            },
            max : {
                type : Number,
                required : true
            },
            modelValue: { type: Number, default : 200},
        },
        computed:{
            gap() {return this.max - this.min},
            model:{
                get() {
                    return this.modelValue;
                },
                set(value) {
                    const progress = (value / 200) * 100;
                    const valOUT = progress / 100 * this.gap + this.min;
                    this.bgStyle = `linear-gradient(to right, #1E363E ${progress}%, #eee ${progress}%)`
                    this.$emit("update:modelValue", Number(value));
                    this.$emit("sliderValue", valOUT)
                }
            }
        },
        beforeUnmount() {
            this.bgStyle = `linear-gradient(to right, #1E363E 100%, #eee 0%)`
        },
        data() {
            return {
                bgStyle : 'linear-gradient(to right, #1E363E 100%, #eee 0%)',
            }
        },
    }
</script>

<template>
    <div class="w-full h-8 flex flex-row gap-3 items-center">
        <p>{{min}}</p>
        <div class="w-full">
            <input type="range" name="slider" min="0" max="200" v-model="model">
        </div>
        <!-- TODO: AVG VALUE KIV 
            <p id="avg" class="absolute">▼</p> -->
        <p>{{max}}</p>
    </div>

</template>

<style scoped>

input, select {
    display: block;
    border-width: 1px;
    border-color: #979393;
    border-radius: 10px;
}

p {
    /* text-base pointer-events-none */
    color: black;
    font-size: 1rem;
    line-height: 1.5rem;
    pointer-events: none;

    user-select: none;
}

#avg {
    left: -0.5em;

    /* if scale: 100%, top: -0.25em
        if scale: 125%, top: -0.01em
    */
    top: -0.01em;
    transform: scaleY(125%);
}

input[type="range"] {
    /* removing default appearance */
    -webkit-appearance: none;
    appearance: none; 
    /* creating a custom design */
    width: 100%;
    cursor: pointer;
    outline: none;

    /* New additions */
    background: v-bind(bgStyle);
    height: 0.5rem;
    margin: 0 auto;
    padding: 0;
}

/* Thumb: webkit */
input[type="range"]::-webkit-slider-thumb {
    /* removing default appearance */
    -webkit-appearance: none;
    appearance: none; 
    /* creating a custom design */
    height: 1rem;
    width: 1rem;
    background-color: #FFF;
    border-radius: 50%;
    border: 2px solid rgb(30, 54, 62);

    transition: .2s ease-in-out;
}

/* Thumb: Firefox */
input[type="range"]::-moz-range-thumb {
    height: 1rem;
    width: 1rem;
    background-color: rgb(30, 54, 62);
    border-radius: 50%;
    border: none;
    
    transition: .2s ease-in-out;
}

/* Hover, active & focus Thumb: Webkit */

input[type="range"]::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 10px rgba(30, 54, 62, .1)
}
input[type="range"]:active::-webkit-slider-thumb {
    box-shadow: 0 0 0 13px rgba(30, 54, 62, .2)
}

/* Hover, active & focus Thumb: Firefox */

input[type="range"]::-moz-range-thumb:hover {
    box-shadow: 0 0 0 10px rgba(30, 54, 62, .1)
}
input[type="range"]:active::-moz-range-thumb {
    box-shadow: 0 0 0 13px rgba(30, 54, 62, .2)
}

</style>