/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-20 10:58:16
 * @LastEditors: Huccct
 * @LastEditTime: 2023-06-02 11:27:32
 */
import { defineStore } from 'pinia'
import router from '@/router'
import { reqLogin, reqUserInfo, reqLogOut } from '@/api/user'
import type {
  LoginFormData,
  LoginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/types'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'

// @ts-expect-error
import cloneDeep from 'lodash/cloneDeep'

function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
// 选择式API
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN()!,
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  // 异步|逻辑的地方
  actions: {
    //用户登录方法
    async userLogin(data: LoginFormData) {
      const res: LoginResponseData = await reqLogin(data)
      // success=>token
      // error=>error.message
      if (res.code === 200) {
        this.token = res.data as string
        // 持久化
        SET_TOKEN(res.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data as string))
      }
    },
    async userInfo() {
      const res: userInfoResponseData = await reqUserInfo()

      if (res.code === 200) {
        this.username = res.data.name as string
        this.avatar = res.data.avatar as string
        this.buttons=res.data.buttons
        // asyncRoute
        // console.log('异步路由===》',asyncRoute)
        // console.log('yonghu路由===》',res.data.routes)

        // 计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          // 深copy，避免切换用户路由丢失
          cloneDeep(asyncRoute),
          res.data.routes,
        )
        // 菜单数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          // console.log('路由菜单===》',route)
          // console.log('路由菜单===》'+route)

          router.addRoute(route)
          // console.log('router', router)
        })
        // this.menuRoutes
        // console.log('yonghu路由2===》',this.menuRoutes)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    async userLogout() {
      const res = await reqLogOut()
      if (res.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
