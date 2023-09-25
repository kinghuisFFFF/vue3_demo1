<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import useLayOutSettingStore from '@/store/modules/setting'
let pageNo = ref<number>(1)

let pageSize = ref<number>(5)

let total = ref<number>(0)

let userArr = ref<Records>([])

let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)

let allRole = ref<AllRole>([])

let userRole = ref<AllRole>([])
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})

let selectIdArr = ref<User[]>([])
onMounted(() => {
  getHasUser()
})

let formRef = ref<any>()
let keyword = ref<string>('')

let settingStore = useLayOutSettingStore()
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let res: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}

const handler = () => {
  getHasUser()
}

//下面是一个通用较高的自定义日期时间格式化函数的示例：
function formatDateTime(date: Date, format: string) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
    a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
    A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length),
      )
    }
  }
  return format
}
//这个函数接受两个参数，第一个参数是要格式化的日期时间，可以是 Date 对象或表示日期时间的字符串，第二个参数是要格式化的格式，例如 yyyy-MM-dd HH:mm:ss。该函数会将日期时间格式化为指定的格式，并返回格式化后的字符串。

//该函数使用了正则表达式来匹配格式字符串中的占位符，然后根据对应的日期时间值来替换占位符。其中，y 会被替换为年份，M、d、h、H、m、s、q、S、a、A 分别表示月份、日期、小时（12 小时制）、小时（24 小时制）、分钟、秒、季度、毫秒、上午/下午、AM/PM。

const addUser = () => {
  drawer.value = true
  // let t1 = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
  // let t2 = formatDate(new Date(), "yyyy-M-d h:m:s")
  // console.log('时间===》', '\n', t1, '\n', t2)

  //使用该函数进行日期时间格式化的示例如下：
  const date = new Date()
  // console.log(formatDateTime(date, 'yyyy-MM-dd HH:mm:ss')); // 2023-02-16 08:25:05
  // console.log(formatDateTime(date, 'yyyy年MM月dd日 HH:mm:ss')); // 2023年02月16日 08:25:05
  // console.log(formatDateTime(date, 'yyyy-MM-dd HH:mm:ss S')); // 2023-02-16 08:25:05 950
  // console.log(formatDateTime(date, 'yyyy-MM-dd hh:mm:ss A')); // 2023-02-16 08:25:05 上午
  let t1 = formatDateTime(date, 'yyyy-MM-dd HH:mm:ss S')

  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
    createTime: t1,
    updateTime: t1,
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

const save = async () => {
  formRef.value.validate()
  let res: any = await reqAddOrUpdateUser(userParams)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

const cancel = () => {
  drawer.value = false
}

const validatorUserName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}

const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

const setRole = async (row: User) => {
  drawer1.value = true
  Object.assign(userParams, row)
  let res: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (res.code === 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
    drawer1.value = true
  }
}

const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)

const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

const handleCheckedUsersChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  let res: any = await reqSetUserRole(data)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配职务成功',
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}

const deleteUser = async (userId: number) => {
  let res: any = await reqRemoveUser(userId)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

const selectChange = (value: any) => {
  selectIdArr.value = value
}

const deleteSelectUser = async () => {
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let res: any = await reqSelectUser(idList)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

const search = () => {
  getHasUser()
  keyword.value = ''
}

const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>
<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="keyword.length ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      type="danger"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <el-table
      style="margin: 10px 0"
      border
      :data="userArr"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button size="small" icon="User" @click="setRole(row)">
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定删除${row.username}`"
            width="260px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedUsersChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
