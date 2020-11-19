import { request, METHOD, removeAuthorization } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
var path = "/api/main"
export async function login (name, password) {
  return request(path + "/login", METHOD.POST, {
    userName: name,
    passwd: password
  })
}

export async function getRoutesConfig () {
  return request(path + "/getRouter", METHOD.GET)
}


export async function getAccountTree () {
  return request(path + "/getAccountTree", METHOD.GET)
}
export async function addUser (params) {
  return request(path + "/addUser", METHOD.POST,
    params
  )
}
export async function delUserByParentId (params) {
  return request(path + "/delUserByParentId", METHOD.GET,
    params
  )
}

export async function getAddUserTree () {
  return request(path + "/getAddUserTree", METHOD.GET)
}

export async function getUserPermission () {
  return request(path + "/getUserPermission", METHOD.GET)
}

export async function getUserById (params) {
  return request(path + "/getUserById", METHOD.GET, params)
}

export async function updateUser (params) {
  return request(path + "/updateUser", METHOD.POST,
    params
  )
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
