<script>
  import { RouterLink, RouterView } from 'vue-router'
  import headerBanner from '@/components/misc/headerBanner.vue';
  import myFooter from '@/components/misc/myFooter.vue';
  export default {
    name: 'App',
    components : {
      RouterView,
      headerBanner,
      myFooter
    },
    created() {
      document.title = 'UniExplorers'
      document.addEventListener('visibilitychange', function(e) {
        var isPageActive = !document.hidden;
        if(!isPageActive){
          // Just some trolling hehe
          document.title = 'Please come back...'
        } else {
          document.title = 'UniExplorers'
        }
      });
    },
    watch : {
      $route (to, from){
        if (to.path == '/') {
          document.body.style.backgroundColor = "#1E363E"
        } else {
          document.body.style.backgroundColor = "#DAE3DD"
        }
    }
    }
  }
</script>

<template>
  <headerBanner v-if="!$route.meta.public && $route.path != '/welcome'"/>
  <div class="wrapper min-h-screen">
    <RouterView />
  </div>
  <myFooter v-if="$route.path != '/welcome'" />
</template>

<style scoped>
</style>
