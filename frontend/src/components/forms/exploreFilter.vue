<script>

    import rangeSlider from '@/components/inputs/rangeSlider.vue'
    import checkBox from '@/components/inputs/checkBox.vue';
    import { mapActions, mapState } from 'pinia';
    import { useMajorsStore, useSearchStore } from '@/stores';
    import gsap from 'gsap'

    export default {
        name: 'exploreFilter',
        mounted() {
            var width = document.getElementById('filter').offsetWidth;
            this.$emit('filterWidth', width);
        },
        emits: ['filter', 'filterWidth'],
        components : {
            rangeSlider,
            checkBox
        },
        data() {
            return {
                slider : 200,
                sliderkey : this.$uuid(),
                gparaw : null,
                gpa : 4,
                continent : [],
                continentkey : this.$uuid(),
                major : [],
                majorkey : this.$uuid(),
                filtered : false,
                continents : ["Asia", "Europe", "North America", "South America", "Middle East",]
            }
        },
        computed : {
            gpaFixed() {return this.gpa.toFixed(2)},
            ...mapState(useSearchStore, ['minGpa']),
            ...mapState(useMajorsStore, ['majors']),
        },
        methods : {
            doFilter() {
                this.filtered = true
                this.$emit('filter', this.$data);
            },
            resetFilter() {
                this.$emit('filter', 'reset');
                this.slider = 200
                this.gparaw = 4
                this.gpa = 4
                this.continent = []
                this.major = []
                this.filtered = false
                this.sliderkey = this.$uuid()
                this.continentkey = this.$uuid()
                this.majorkey = this.$uuid()
            }
        },
        watch: {
            gparaw(n) {
            gsap.to(this, { duration: 0.3, gpa: Number(n) || 0 })
            }
        },
        inject: ["mq"],
    }
</script>

<template>
        <div v-if="mq.mdPlus" class="flex items-center h-12">
            <button @click="doFilter" :class="filtered ? 'bg-white border-darkgreen hover:bg-darkgreen' : 'hover:bg-white hover:border-darkgreen'" class="grow submitFilter group flex gap-2 items-center justify-center border-2 rounded-lg p-2.5 bg-darkgreen text-white">
                <svg :class="mq.lgPlus ? 'h-6' : 'h-5', filtered ? 'fill-darkgreen group-hover:fill-white' : 'group-hover:fill-darkgreen fill-white'" class="inline relative transition-all group-hover:-translate-y-1" viewBox="0 0 137 137" xmlns="http://www.w3.org/2000/svg">
                <path d="M129.685 0H6.38566C0.720182 0 -2.1386 6.87416 1.87571 10.8885L51.026 60.0462V114.809C51.026 116.89 52.0414 118.84 53.7466 120.034L75.0074 134.911C79.2019 137.847 85.0433 134.872 85.0433 129.686V60.0462L134.195 10.8885C138.201 6.88213 135.362 0 129.685 0Z"/>
                </svg>
            <span :class="mq.lgPlus ? 'text-lg' : 'text-base', filtered ? 'group-hover:text-white text-darkgreen' : 'group-hover:text-darkgreen'" class="min-w-fit font-semibold">Filter</span>
            </button>
            <button v-if="filtered" @click="resetFilter" class="group hover:bg-red hover:brightness-110 transition-all relative h-full p-0 rounded-lg bg-darkred w-8 mx-1 overflow-hidden flex justify-center items-center">
                <svg style="outline: blue dashed 1px;" id="cross" class="absolute fill-red group-hover:brightness-75 brightness-125 block h-12 w-12" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"/>
                </svg>
                <!-- <span class="group-hover:opacity-80 absolute w-fit opacity-0 transition-all font-semibold">Clear</span> -->
            </button>
        </div>


        <div :class="mq.lgPlus ? 'text-lg' : 'text-base px-4'" class="font-semibold flex flex-col gap-2">
            <div class="font-semibold">
            Continent
                <div :key="continentkey" class="flex flex-col ml-4 min-w-fit">
                    <checkBox v-for="cont in continents" :label="cont" :value="cont" v-model="continent"/>
                </div>
            </div>
            <!-- TODO: MANUALLY EDITABLE GPA -->
            <div class="font-semibold">
                GPA up to {{ gpaFixed }}
                <!-- <input type="text" :value="gpa.toFixed(2)" @change="(event) => {this.slider = event.target.value / 4 * 200}"> -->
                <!-- @gpaFilter="(value) => {this.gparaw = value}" -->
                <rangeSlider :key="sliderkey" v-model="slider" :min="minGpa" :max="4" @sliderValue="(value) => this.gparaw = value" @bgStyle=""/>
            </div>
            <div class="font-semibold">
                Faculty
                <div :key="majorkey" class="flex flex-col ml-4">
                    <checkBox v-for="majorItem in Object.keys(majors)" :label="majorItem" :value="majorItem" v-model="major"/>
                </div>
            </div>
        </div>

        <div v-if="mq.smMinus" class="absolute bottom-0 w-full left-0 p-4 mb-8">
            <hr/>
            <button @click="doFilter" class="my-2 h-16 w-full text-lg font-medium">Show Results</button>
            <button v-if="filtered" @click="resetFilter" class="w-full bg-red"> Reset </button>
        </div>

</template>