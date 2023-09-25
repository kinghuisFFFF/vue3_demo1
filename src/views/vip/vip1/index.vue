<script setup lang="ts">
import { ref, reactive } from 'vue'

// import {  requestEndpoint3 } from '@/utils/v1/api'
import useDemoStore from '@/store/modules/demo'
let demoStore = useDemoStore()
const getData = () => {
  console.log('111')
  // console.log(requestEndpoint3);
}

let id = ref(1)
let reqData = reactive({ id: 1 })
const tableLayout = ref('fixed')

const tableData = [
  {
    date: '2023年9月22日',
    name: 'eui',
    address:
      'https://element-plus.org/zh-CN/component/table.html#%E8%A1%A8%E6%A0%BC%E5%B8%83%E5%B1%80',
  },
  {
    date: '2023年9月22日',
    name: 'isqqw',
    address: 'https://www.isqqw.com/',
  },
]

const demo = async () => {
  try {
    console.log('222')
    console.log(demoStore)
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<template>
  <div class="box">
    <el-radio-group v-model="tableLayout">
      <el-radio-button label="fixed" />
      <el-radio-button label="auto" />
    </el-radio-group>
    <el-table :data="tableData" :table-layout="tableLayout">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <!-- <el-table-column prop="address" label="Address" show-overflow-tooltip /> -->
      <el-table-column label="Address" show-overflow-tooltip>
        <template #="{ row, index }">
          <a :href="row.address" target="_blank" class="buttonText">
            {{ row.address }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: cyan;
}

// aqua cyan
span {
  display: block;
  background-color: orchid;
  width: 100px;
  height: 100px;
}
</style>
