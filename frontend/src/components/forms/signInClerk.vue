<script>

    import { SignIn } from 'vue-clerk'


    export default {
        name: 'signInClerk',
        components : {
            SignIn
        },
        data() {
            return {
                clerkStyle : {
                    elements: {
                    formButtonPrimary: "bg-darkgreen hover:bg-lightgreen hover:text-content active:bg-lightgreenshadow",
                    card : {
                        "& > :last-child" : {
                            backgroundColor : "#DAE3DD",
                            color : "#333333"
                        }
                    },
                    headerSubtitle : "hidden",
                    main : "flex flex-col-reverse",
                    footer : 'hidden',
                    rootBox : "ml-[-26px]"
                    }
                }
            }
        },
    }
</script>

<template>
    <SignIn :appearance="clerkStyle" routing="path" path="/sign-in" redirectUrl="/profile"/>
</template>

<style scoped>

</style>