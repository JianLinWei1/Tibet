import { request, METHOD } from '@/utils/request'

let url = "/api/main"
export async function getPersonTree (params) {
  return request(url + "/getPersonTree", METHOD.GET,
    params
  )
}
export async function getDeviceTreeDoor (params) {
  return request(url + "/parkingBatch/getParingTree", METHOD.GET,
    params
  )
}

export  function batchIssue (data) {
  return request(url + "/parkingBatch/batchIssue", METHOD.POST, data)
}
