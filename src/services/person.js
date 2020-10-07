import { request, METHOD } from '@/utils/request'

export async function insertPerson ( params) {
    return request("/api/api-persons/insertPerson", METHOD.POST,
      params
    )
  }

  export async function queryPersonsList (data) {
    return request("/api/api-persons/queryPersonsList", METHOD.POST, data)
  }