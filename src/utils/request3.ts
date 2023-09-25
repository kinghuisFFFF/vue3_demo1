/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-18 12:11:32
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-23 14:53:42
 */
// 二次封装axios
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useDemoStore from '@/store/modules/demo'
import {
  API_BASE_URL_1,
  API_BASE_URL_2,
  API_BASE_URL_3,
  API_ENDPOINTS,
} from './v1/apiConfig'

const request2 = axios.create({
  baseURL: API_ENDPOINTS.endpoint2,
  timeout: 5000,
})

request2.interceptors.request.use(
  (config) => {
    const demoStore = useDemoStore()
    // console.log(config)

    if (demoStore.token) {
      config.headers.token = demoStore.token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request2.interceptors.response.use(
  (response) => {
    // console.log('r2=>',response)
    if (response.status === 200) {
      // console.log('r3=>',response.data)
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data)
    }
  },
  (error) => {
    let message = ''
    const status = error.response.status
    switch (status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        message = '未登录'
        break
      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        message = '登录过期，请重新登录'
        break
      case 404:
        message = '网络请求不存在'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = error.response.data.message
        break
    }
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

export default request2
