<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import request2 from '@/utils/request2'
import request3 from '@/utils/request3'
// import {  requestEndpoint3 } from '@/utils/v1/api'
import useDemoStore from '@/store/modules/demo'
import {
  reqHasTradeMark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from '@/api/product/trademark/type'
import { UploadProps } from 'element-plus/es/components/upload/src/upload'

// 组件挂在完毕发起一个请求
onMounted(() => {
  // console.log('组件挂在完毕发起一个请求')
  // let res = request3.post('/login',{username:'srh-producer-web',password:'122119352'})
  // console.log('onMounted=>',res)
  getHasTradeMark()
})

let demoStore = useDemoStore()

// ctl show dialog
const dialogFormVisible = ref<boolean>(false)

const pageNo = ref<number>(1)
const currentPage2 = ref(5)
const currentPage3 = ref(5)
const currentPage4 = ref(4)
const pageSize2 = ref(100)
const pageSize3 = ref(100)
const pageSize = ref(3)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

let total = ref<number>(0)
let strArr = ref<any>([])

const getHasTradeMark = async (pager = 1) => {
  pageNo.value = pager
  let res = await reqHasTradeMark(pageNo.value, pageSize.value)
  // console.log('getHasTradeMark===>',res)
  if (res.code == 200) {
    total.value = res.data.total
    strArr.value = res.data.records
  }
}

const getData = () => {
  // console.log('111');
  // console.log(requestEndpoint3);
}

let id = ref(2)
let reqData = reactive({ id: 2 })

const demo = async () => {
  try {
    // console.log('222')
    // console.log(demoStore)
    demoStore.getA1(reqData)
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 当下拉菜单发生变化时触发
const sizeChange = (pageSize: number) => {
  // console.log('sizeChange===>', pageSize)
  // pageNo.value=1;
  getHasTradeMark()
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif'
  ) {
    // if (rawFile.type !== 'image/jpeg') {
    // ElMessage.error('Avatar picture must be JPG format!')
    // return false
    if (rawFile.size / 1024 / 1024 < 4) {
      // return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小 大于4MB',
      })
      return false
    }
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必是PNG|JPG|GIF',
    })
    return false
  }
  return true
}

let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
let formRef = ref()

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}

// add
const addOne = () => {
  dialogFormVisible.value = true

  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')

  nextTick(() => {
    // console.log('nextTick', formRef.value)
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// update
const updateOne = (row: TradeMark) => {
  dialogFormVisible.value = true
  // console.log('updateOne', row)
  // ES6 语法合并对象
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  nextTick(() => {
    // console.log('nextTick', formRef.value)
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

const cancel = () => {
  dialogFormVisible.value = false
}

const confirm = async () => {
  await formRef.value.validate()
  let res = await reqAddOrUpdateTrademark(trademarkParams)
  if (res.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改数据成功' : '添加数据成功',
    })
    getHasTradeMark(trademarkParams.id ? pageNo.value : 1)
    // trademarkParams.tmName=''
    // trademarkParams.logoUrl=''
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改数据失败' : '添加数据失败',
    })

    // trademarkParams.tmName=''
    // trademarkParams.logoUrl=''
  }
}

const validatorTmName = (rule: any, value: any, callBack: any) => {
  // console.log('validatorTmName')
  // console.log(rule)
  // console.log(value)
  // console.log(callBack)
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于2位'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // console.log('validatorLogoUrl===>')
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }
}

const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

const removeOne = async (id: number) => {
  console.log('removeOne', id)
  let res = await reqDeleteTrademark(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除数据成功',
    })
    getHasTradeMark(strArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除数据失败',
    })
  }
}
</script>

<template>
  <div class="box">
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus" @click="addOne">
        添加数据
      </el-button>

      <!-- <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
      <el-table style="margin: 10px 0px" border :data="strArr">
        <el-table-column
          label="列1"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <!-- <el-table-column label="列2" prop="tmName"></el-table-column> -->
        <el-table-column label="列2">
          <template #="{ row, $index }">
            <pre style="color: black">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="列3">
          <template #="{ row, $index }">
            <img
              :src="row.logoUrl"
              alt="oop"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="列4">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="($event) => updateOne(row)"
            ></el-button>
            <el-popconfirm
              :title="`你确定要删除${row.tmName}吗？`"
              width="260px"
              icon="Delete"
              @confirm="removeOne(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :disabled="disabled"
        :background="background"
        layout="prev, pager, next, jumper,->,total, sizes"
        :total="total"
        @current-change="getHasTradeMark"
        @size-change="sizeChange"
      />
    </el-card>

    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改数据' : '添加数据'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="please input 品牌 name"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
    <!-- <h1>我是2级路由-ff</h1>
    <button @click="getData"> 点我获取数据 </button>
    <button @click="demo"> 点我获取数据2 </button> 
  vue2 组件只能有一个根节点
  vue3 组件可以有多个根节点
  --></div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
