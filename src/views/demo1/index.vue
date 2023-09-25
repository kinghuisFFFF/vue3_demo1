<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, watch, onBeforeUnmount } from 'vue'
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
import useCategoryStore2 from '@/store/modules/demo2'
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '@/api/product/attr'
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'

let categoryStore2 = useCategoryStore2()
let scene = ref<number>(0)

let inputArr = ref<any>([])


let flag = ref<boolean>(true)

const addAttr = () => {
  Object.assign(attrParams, {
    attrName: "",
    attrValueList: [],
    categoryId: categoryStore2.c3Id,
    categoryLevel: 3,
  })
  scene.value = 1
  // attrParams.categoryId = categoryStore2.c1Id
}

const updateAttr = (row: Attr) => {
  scene.value = 1

  // 对象合并，将row 对象赋值给 attrParams
  // Object.assign(attrParams,row)

  // 深 clone
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}


// deleteAttr
const deleteAttr = async (attrID: number) => {
  let res: any = await reqRemoveAttr(attrID)

  if (res.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}


// cancel2
const cancel2 = () => {
  scene.value = 0
}

// toLook
const toLook = (row: AttrValue, $index: number) => {
  // flag.value = false
  if (row.valueName.trim() == '') {
    // delete att is null
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return;
  }

  // situation 2
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return row.valueName === item.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return;
  }

  // show div
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  // flag.value = true
  row.flag = true
  // $index 
  //这样可以，nextTick里面的代码会在DOM更新后执行
  nextTick(function () {
    // console.log() //可以得到'changed'
    inputArr.value[$index].focus();
  })

}

let attrParams = reactive<Attr>({
  attrName: "",
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })

  nextTick(function () {
    // console.log() //可以得到'changed'
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  })

}

// save
const save = async () => {
  let res: any = await reqAddOrUpdateAttr(attrParams)

  if (res.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }


}


// 组件挂在完毕发起一个请求
onMounted(() => {
  // console.log('组件挂在完毕发起一个请求')
  // let res = request3.post('/login',{username:'srh-producer-web',password:'122119352'})
  // console.log('onMounted=>',res)
  // getHasTradeMark();
  categoryStore2.getC1()
})

watch(() => categoryStore2.c3Id, async () => {
  // console.log(999)
  // const {c1Id,c2Id,c3Id} = categoryStore2
  // // console.log(c1Id,c2Id,c3Id)
  // let res = await reqAttr(c1Id,c2Id,c3Id)
  attrArr.value = []
  if (!categoryStore2.c3Id) return;
  getAttr()

})

let attrArr = ref<Attr[]>([])

const getAttr = async () => {
  // console.log(999)
  const { c1Id, c2Id, c3Id } = categoryStore2
  // console.log(c1Id,c2Id,c3Id)
  let res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  // console.log(res)
  if (res.code == 200) {
    attrArr.value = res.data
  }

}

// handler
const handler = () => {
  // console.log(111)
  categoryStore2.c2Id = ''
  categoryStore2.c3Arr = []
  categoryStore2.c3Id = ''

  categoryStore2.getC2()
}

const handler2 = () => {
  categoryStore2.c3Id = ''
  // console.log(111)
  categoryStore2.getC3()
}

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

let total = ref<number>(0);
let strArr = ref<any>([]);

const getHasTradeMark = async (pager = 1) => {
  pageNo.value = pager;
  let res = await reqHasTradeMark(pageNo.value, pageSize.value)
  // console.log('getHasTradeMark===>',res)
  if (res.code == 200) {
    total.value = res.data.total;
    strArr.value = res.data.records;

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
  if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
    // if (rawFile.type !== 'image/jpeg') {
    // ElMessage.error('Avatar picture must be JPG format!')
    // return false
    if (rawFile.size / 1024 / 1024 < 4) {
      // return true
    } else {
      ElMessage({
        type: 'error',
        message: "上传文件大小 大于4MB"
      })
      return false
    }
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  } else {
    ElMessage({
      type: 'error',
      message: "上传文件格式务必是PNG|JPG|GIF"
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
  uploadFile
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
    ElMessage(
      {
        type: 'success',
        message: trademarkParams.id ? '修改数据成功' : '添加数据成功'
      }
    )
    getHasTradeMark(trademarkParams.id ? pageNo.value : 1)
    // trademarkParams.tmName=''
    // trademarkParams.logoUrl=''
  } else {
    dialogFormVisible.value = false
    ElMessage(
      {
        type: 'error',
        message: trademarkParams.id ? '修改数据失败' : '添加数据失败'
      }
    )

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
    callBack();
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
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}


const removeOne = async (id: number) => {
  console.log('removeOne', id)
  let res = await reqDeleteTrademark(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除数据成功'
    })
    getHasTradeMark(strArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除数据失败'
    })
  }
}

onBeforeUnmount(() => {
  // 清空仓库数据
  categoryStore2.$reset()
})


</script>


<template>
  <div class="box">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select v-model="categoryStore2.c1Id" @change="handler" :disabled="scene === 0 ? false : true">
            <el-option v-for="(c1, index) in categoryStore2.c1Arr" :key="c1.id" :label="c1.name"
              :value="c1.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="categoryStore2.c2Id" @change="handler2" :disabled="scene === 0 ? false : true">
            <el-option v-for="(c2, index) in categoryStore2.c2Arr" :key="c2.id" :label="c2.name"
              :value="c2.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类">
          <el-select v-model="categoryStore2.c3Id" :disabled="scene === 0 ? false : true">
            <el-option v-for="(c2, index) in categoryStore2.c3Arr" :key="c2.id" :label="c2.name"
              :value="c2.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- <DefZujian1 /> -->
    <!-- <DefCategory :scene="scene"/> -->
    <!-- <def-category :scene="scene" /> -->
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" @click="addAttr"
          :disabled="categoryStore2.c3Id ? false : true">添加属性</el-button>

        <el-table border style="margin: 10px 0px;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="列1" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="列2">
            <template #="{ row, index }">
              <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{ item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="列3" width="200px">
            <template #="{ row, index }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <!-- <el-button type="primary" size="small" icon="Delete" @click="deleteAttr(row.id)"></el-button> -->
              <el-popconfirm :title="` 你确定删除 ${row.attrName} ? `" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button>Delete</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="!attrParams.attrName" type="primary" size="default" @click="addAttrValue">添加属性值</el-button>
        <el-button type="primary" size="default" @click="cancel2">取消</el-button>

        <el-table border style="margin:10px 0px" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" size="small" v-if="row.flag" @blur="toLook(row, $index)"
                placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="primary" size="default" @click="cancel2">取消</el-button>

      </div>
    </el-card>

    <div style="color:red;margin: 10px 0;">
      我欲乘风向北行，雪落轩辕大如席
      <hr />
      我欲借船向东游，绰约仙子迎风立
      <hr />
      我欲踏云千万里，庙堂龙鸣奈我何
      <hr />
      昆仑之巅沐日光，沧海绝境见青山
      <hr />
      长风万里燕归来，不见天涯人不回
      <hr />
    </div>

  </div>
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