<script>
export default {
  props: ['data']
}
</script>

<template>
  <div style="height: 400px">
    <el-table :data="data" height="auto" class="custom-table">
      <el-table-column prop="name" label="Name" width="300">
        <template #default="scope">
          <a class="" :href="`https://www.google.com/maps/search/?api=1&query=${scope.row.name}`" 
          target="_blank">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="rating" label="Reviews" width="180">
        <template #default="scope">
          <span>{{ scope.row.rating }}</span>
          <el-icon style="vertical-align: middle; margin-left: 0.1em; padding-bottom: 0.2em;" :size="18" color="#ff9900">
            <StarFilled />
          </el-icon>
          <span> ({{ scope.row.user_ratings_total }} reviews)</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
.el-tabs__item.is-active, .el-tabs__item:hover {
  color: #036b4e;
}
.el-tabs__active-bar.is-top {
  background-color: #036b4e;
}

</style>