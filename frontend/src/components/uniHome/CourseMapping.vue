<script>
import { fetchWrapper } from '@/helpers';

export default {
  data() {
    return {
      data: [],
      pageData: [],
      filters: [],
      filterOptions: [],
      filterOptionsCurr: [],
      query: '',
      itemsPerPage: 10,
      page: 0
    }
  },
  async beforeMount() {
    let name = this.$route.params.uniName
    // @JingJie Broken?
    let data = await fetchWrapper.get(import.meta.env.VITE_GOOGLE_BACKEND + '/course_mapping/university/' + name)

    let areas = ["Capabilities - Managing", "Cap - Modes of Thinking", "Comm - Technology & Society", "Comm - Cultures of the Mod W",
      "Business Option", "Marketing Major Elective", "Strategic Mgmt Major Elective", "Asian Studies", "Game Theory", "Free Elective"]

    let count = {}
    let colors = ['', 'success', 'warning', 'danger']
    let effects = ['light', 'dark', 'plain']
    let color_effect = []
    for (const e of effects) {
      for (const c of colors) {
        color_effect.push([c, e])
      }
    }
    
    this.data = data.filter((mod) => {
      if (mod.course_area.match("Free Elective")) return true;
      return areas.includes(mod.course_area)
    })
    
    for (const d of this.data) {
      if (!(d.course_area in count)) {
        count[d.course_area] = 0
      }
      count[d.course_area]++
    }
    
    areas = Object.keys(count).filter((key) => {
      if (count[key] > 0) return key;
    })

    this.color_map = {}
    let i = 0
    for (const area of areas) {
      this.color_map[area] = color_effect[i]
      i = i < color_effect.length ? i+1 : 0
      let opt = { 'label': area, 'value': area }
      this.filterOptions.push(opt)
    }

    // this.pagination = {}
    // let perpage = 10
    // let total = this.data.length
    // let page_count = Math.ceil(total / 10)
    // let start = 0
    // let end = start + perpage
    // for (let i = 0; i < page_count; i++) {
    //   this.pagination[i] = this.data.slice(start, end)
    //   start += perpage
    //   end = start + perpage
    // }
    // this.pageData = this.pagination[0]
    
    this.clearFilter()
  },
  methods: {
    clearFilter() {
      this.filters = []
      this.filterOptionsCurr = this.filterOptions.slice(0)
      this.page = 0
    },
    handleSelect(item) {
      this.filters.push(item.value)
      this.filterOptionsCurr = this.filterOptionsCurr.filter((x) => {return x.value !== item.value})
      this.query = ''
      document.getElementById('query').blur()
      this.page = 0
    },
    handleRemove(filter) {
      this.filters = this.filters.filter((x) => {
        return x !== filter
      })
      this.filterOptionsCurr.push({'label': filter, 'value': filter})
    },
    onNext(pager) {
      this.page = pager
      // this.pageData = this.pagination[pager]
    },
    onPrev(pager) {
      this.page = pager-2
    },
    onPageChange(pager) {
      this.page = pager-1
    },
    paginate() {
      return this.filteredData.slice(this.page*this.itemsPerPage, this.itemsPerPage * this.page + this.itemsPerPage)        
    },
  },
  computed: {
    filteredData() {
      if (this.filters.length > 0) {
        return this.data.filter((mod) => {
          return this.filters.includes(mod.course_area)
        })
      }
      return this.data
    },
    numPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },
    paginateData() {
      return this.paginate()
    },
    currentPage() {
      return this.page + 1
    }
  },
}
</script>

<template>
  <div style="height: 100%; width: 100%;" class="flex flex-wrap pt-7">
    <!-- <el-select-v2 class="w-1/2 mb-2" v-model="filters" :options="filterOptions" filterable placeholder="Select"
      multiple /> -->
    <el-autocomplete
      v-model="query"
      :fetch-suggestions="filterOptionsCurr"
      clearable
      id="query"
      class="inline-input sm:basis-1/2 lg:basis-1/3 basis-full"
      placeholder="Select Filter"
      @select="handleSelect"
    >
    <template #prefix>
      <i class="fa-solid fa-search"></i>
    </template>
    </el-autocomplete>
    <el-button class="ml-5 my-1" v-if="filters.length > 0" type="danger" @click="clearFilter">Clear<i class="fa-solid fa-xmark pl-2"></i> </el-button>

    <div class="basis-full flex flex-wrap gap-2 pt-5">
      <el-tag v-for="filter in filters" :key="filter" 
        :type="color_map[filter][0]" :effect="color_map[filter][1]"
        closable @close="handleRemove(filter)">
        {{ filter }}
      </el-tag>
    </div>
    <el-table :data="paginateData" :default-sort="{ prop: 'course_area', order: 'ascending' }" height="auto"
      class="custom-table basis-full mt-2" style="width: 100%;">
      <el-table-column prop="course_title" label="Course Title">
        <template #default="scope">
          <span>{{ scope.row.course_title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="course_area" label="Course Area">
        <template #default="scope">
          <el-tag :type="color_map[scope.row.course_area][0]" :effect="color_map[scope.row.course_area][1]">{{ scope.row.course_area }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="mt-5" v-model:current-page="currentPage" background layout="prev, pager, next" :total="filteredData.length" @next-click="onNext" @prev-click="onPrev" @current-change="onPageChange"/>
  </div>
</template>

<style>
.el-input__inner {
  margin: 5px 0;
}

.el-input__inner:focus {
  box-shadow: none;
}
</style>