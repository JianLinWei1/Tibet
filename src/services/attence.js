import { request, METHOD } from '@/utils/request'
let url = "/api/main"

export async function getDeviceTree (params) {
  return request(url + "/getDeviceTree", METHOD.GET,
    params
  )
}


export async function addConfig (params) {
  return request(url + "/addConfig", METHOD.POST,
    params
  )
}

export async function getConfig (params) {
  return request(url + "/getConfig", METHOD.GET,
    params
  )
}

export async function getAttenceReport (params) {
  return request(url + "/getAttenceReport", METHOD.POST,
    params
  )
}
