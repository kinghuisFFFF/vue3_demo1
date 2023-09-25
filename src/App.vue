<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-17 14:32:02
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-21 14:01:31
-->
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref, onMounted } from 'vue'
import { getAll } from '@/api/vip/vip1'

const locale = ref(zhCn)

import SvgIcon from '@/components/SvgIcon/src/index.vue'
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped lang="scss">
h1 {
  color: $color;
}
</style>
