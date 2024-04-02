<script>
    import uniCards from '@/components/uniCards.vue';
    import exploreFilter from '@/components/forms/exploreFilter.vue';
    import textSearch from '@/components/forms/textSearch.vue';
    import exploreContent from '@/components/explorePage/exploreContent.vue'
    import pagination from '@/components/ui/pagination.vue'
    import { MqResponsive } from "vue3-mq";
    import { useSearchStore } from '@/stores'

    export default {
        name: 'ExplorePage',
        setup() {
            const { navigatePage, getSearchResults, setPage } = useSearchStore()

            return { navigatePage, getSearchResults, setPage }
        },
        beforeRouteEnter(to, from, next) {
            next(async vm => {
                if (from.path == '/') {
                    // There is a minor bug where if user just refreshes with the default output but has changed the pages, the page number will not change to 1 because the totalPages count does not change. 
                    await vm.getSearchResults('reset')
                }
            })
        },
        inject: ["mq"],
        data() {
            return {
                filtered : false,
                showfilter : false,
            }
        },
        components : {
            exploreContent,
            exploreFilter,
            textSearch,
            MqResponsive
        },
        methods : {
        toggleFilter(e) {
            this.showfilter = !this.showfilter
        },
        updateSpacer(width) {
            document.getElementById('SPACER').style.width = `${width}px`;
        },
        queryBuilder(filters) {
            let query = '';
            for (var category in filters) {

            switch (category) {

                case 'major':
                if (filters.major.length > 1) {
                    filters.major.forEach(filter => {
                    query += `&major=${filter}`
                    });
                } else if (filters.major.length == 1) {
                    query += `&major=${filters.major[0]}`
                }
                break;
            
                case 'gpa':
                query += `?gpa=${filters.gpa}`;
                break;

                case 'continent':
                if (filters.continent.length > 1) {
                    filters.continent.forEach(filter => {
                        query += `&continent=${filter}`
                        })
                } else if (filters.continent.length == 1) {
                    query += `&continent=${filters.continent[0]}`
                }
                break;
            }

            }

            return query
        },
        updateResult(filters) {
            this.loading = !this.loading
            if (this.mq.smMinus) {
                this.toggleFilter()
            }
            this.filtered = true;
            var query = ''

            if (filters !== 'reset') {
                query = this.queryBuilder(filters)
            } else {
                query = 'reset'
            }

            this.getSearchResults(query)
        }

}
}
</script>

<template>
<!-- right-[6.25%] -->
    <div :class="mq.smMinus ? 'flex-col items-center px-4' : 'flex-row justify-center px-8'" class="gap-4 text-darkgreen flex my-4 relative">
        <MqResponsive target="md+">
        <div style="box-shadow: rgba(30, 54, 62, 0.3) 0px 2px 4px;" id="filter" class="rounded-xl h-fit w-auto bg-white mx-2 p-2 lg:p-4 flex flex-col gap-2">
            <exploreFilter :key="$uuid()" @filter="updateResult" @filterWidth="updateSpacer"/>
        </div>
        </MqResponsive>

        <exploreContent/>

        <!-- <RouterView/> -->

        <div v-if="mq.mdPlus" id="SPACER" style="z-index: -1;">
        </div>
    </div>
</template>

<style scoped>

.list-enter-active, .list-leave-active {
  transition: all 0.2s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(10%);
}

.slide-enter-active {
  /* transition: all 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940); */
  animation: slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
.slide-leave-active {
  /* transition: all 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940); */
  animation: slide-out-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}




@keyframes slide-out-bottom {
  0% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(100%);
            transform: translateY(100%);
  }
}

@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(100%);
            transform: translateY(100%);
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
  }
}


</style>