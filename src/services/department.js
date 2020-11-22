import { request, METHOD } from '@/utils/request'
let url = "/api/main/department"

export async function insert (params) {
  return request(url + "/insert", METHOD.POST,
    params
  )
}

export async function getList (params) {
  return request(url + "/getList", METHOD.POST,
    params
  )
}

export async function del (params) {
  return request(url + "/del", METHOD.POST,
    params
  )
}


