import { request, METHOD } from '@/utils/request'

let url = "/api/main"
export async function getPersonTree (params) {
  return request(url + "/getPersonTree", METHOD.GET,
    params
  )
}

export async function queryPersonsList (data) {
  return request(url + "/queryPersonsList", METHOD.POST, data)
}

export async function editPerson (data) {
  return request(url + "/editPerson", METHOD.POST, data)
}

export async function delPerson (data) {
  return request(url + "/delPerson", METHOD.POST, data)
}

export async function exportPerson (data) {
  return request(url + "/exportPerson", METHOD.POST, data)
}