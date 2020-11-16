import { request, METHOD, removeAuthorization } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login (name, password) {
  return request("/api/api-auth/login", METHOD.POST, {
    userName: name,
    passwd: password
  })
}

export async function getRoutesConfig () {
  return request("/api/api-auth/getRouter", METHOD.GET)
}


export async function getAccountTree () {
  return request("/api/api-auth/getAccountTree", METHOD.GET)
}
export async function addUser (params) {
  return request("/api/api-auth/addUser", METHOD.POST,
    params
  )
}
export async function delUserByParentId (params) {
  return request("/api/api-auth/delUserByParentId", METHOD.GET,
    params
  )
}

export async function getAddUserTree () {
  return request("/api/api-auth/getAddUserTree", METHOD.GET)
}

export async function getUserPermission () {
  return request("/api/api-auth/getUserPermission", METHOD.GET)
}

export async function getUserById (params) {
  return request("/api/api-auth/getUserById", METHOD.GET, params)
}


/**
 * 退出登录
 */
export function logout () {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig,
  getAccountTree
}
