import { request, METHOD } from '@/utils/request'
let url = "/api/main/index"

export async function count (params) {
  return request(url + "/count", METHOD.GET,
    params
  )
}



