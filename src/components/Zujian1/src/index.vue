<template>
  <div class="box">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select placeholder="">
            <el-option label="北京"></el-option>
            <el-option label="上海"></el-option>
            <el-option label="广州"></el-option>
            <el-option label="深圳"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select placeholder="">
            <el-option label="北京"></el-option>
            <el-option label="上海"></el-option>
            <el-option label="广州"></el-option>
            <el-option label="深圳"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类">
          <el-select placeholder="">
            <el-option label="北京"></el-option>
            <el-option label="上海"></el-option>
            <el-option label="广州"></el-option>
            <el-option label="深圳"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()
</script>
<style lang="scss" scoped></style>
