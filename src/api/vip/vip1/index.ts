import request2 from '@/utils/request2'
import { da } from 'element-plus/es/locale'
import type { AirFormData, AirResponseData } from '@/api/vip/vip1/type'

// 项目相关的请求地址
enum API {
  AIRPORT_GET_ID_URL = '/airport/',
  AIRPORT_GET_ID2_URL = '/airport/',
  AIRPORT_GET_ID3_URL = '/airport/:id',
  AIRPORT_CREATE_URL = '/airport/create',
}

// 获取单条信息
export const getOne = (data: any) =>
  request2.get<any, AirResponseData>(API.AIRPORT_GET_ID2_URL + data)

// 获取所有信息
export const getAll = () => {
  return request2.get<any, any>(API.AIRPORT_GET_ID_URL)
}

// 新增数据
export const insertOne = (data: any) => {
  return request2.post<any, any>(API.AIRPORT_CREATE_URL, data)
}
