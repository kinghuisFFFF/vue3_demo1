// api.js
// node1\vue-admin\src\utils\v1
import axios from 'axios'
// import { API_BASE_URL_1, API_BASE_URL_2, API_ENDPOINTS } from '@/apiConfig';
import {
  API_BASE_URL_1,
  API_BASE_URL_2,
  API_BASE_URL_3,
  API_ENDPOINTS,
} from './apiConfig'

// 创建一个 Axios 实例
const instance1 = axios.create({
  baseURL: API_BASE_URL_1,
})

const instance2 = axios.create({
  baseURL: API_BASE_URL_2,
})

const instance3 = axios.create({
  baseURL: API_BASE_URL_3,
})

// 定义接口请求函数
export const requestEndpoint1 = () => {
  return instance1.get(API_ENDPOINTS.endpoint1)
}

export const requestEndpoint2 = () => {
  return instance2.get(API_ENDPOINTS.endpoint2)
}

export const requestEndpoint3 = () => {
  return instance3.get(API_ENDPOINTS.endpoint3)
}

// 添加其他接口请求函数...
