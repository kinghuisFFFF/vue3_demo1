<script setup lang="ts">
import { ref, reactive } from 'vue'

// import {  requestEndpoint3 } from '@/utils/v1/api'

const getData = () => {
  console.log('111')
  // console.log(requestEndpoint3);
}
</script>

<template>
  <div class="box">
    <h1>我是2级路由-李白</h1>
    <button @click="getData">点我获取数据</button>
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: cyan;
}
</style>
