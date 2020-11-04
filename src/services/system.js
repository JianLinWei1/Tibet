import { request, METHOD } from '@/utils/request'
let url ="/api/api-auth"

export async function getSysConfig ( params) {
    return request(url+"/getSysConfig", METHOD.GET,
      params
    )
}

export async function addSysConfig ( params) {
    return request(url+"/addSysConfig", METHOD.POST,
      params
    )
}

export async function getSysLogs ( params) {
  return request(url+"/getSysLogs", METHOD.POST,
    params
  )
}

export async function delSyslog ( params) {
  return request(url+"/delSyslog", METHOD.POST,
    params
  )
}
