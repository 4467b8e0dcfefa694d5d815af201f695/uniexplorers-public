<script>
export default {
    name: 'entryAnimator',
    props: {
        animationType: {
            type: String,
            required: false,
            default: 'fade'
        }
    },
    props: {
        animationType: {
            type: String,
            required: false,
            default: 'fade'
            },
        transitiondelay : {
            type : String,
            required: false,
            default: '0.1s'
        }
    },
    data() {
        return {
            animate: false,
            observer : null
        }
    },
    mounted() {
        this.observer = new IntersectionObserver(
            ([entry]) => {
                this.animate = entry.isIntersecting;
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        // console.log('removing')
                        // FKING INEFFICIENT BUT WTV
                        this.observer.unobserve(this.$refs.target);
                    }, 500)
                }
            },
            {
                threshold: 1
            }
        )

        this.observer.observe(this.$refs.target);
    }
};
</script>

<template>
<div ref="target">
    <Transition :name="animationType" >
        <div v-show="animate" :style="{transitionDelay : transitiondelay}">
            <slot/>
        </div>
    </Transition>
</div>
</template>

<style scoped>
.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(24px);
}

.fade-enter-active, .fade-leave-active {
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1)
}


</style>