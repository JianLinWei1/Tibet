import { request, METHOD } from '@/utils/request'

export async function searchDevice ( params) {
    return request("/api/api-access/access/searchDevice", METHOD.GET,
      params
    )
  }

  export async function queryPersonsList (data) {
    return request("/api/api-persons/queryPersonsList", METHOD.POST, data)
  }

  export async function editPerson (data) {
    return request("/api/api-persons/editPerson", METHOD.POST, data)
  }

  export async function delPerson (data) {
    return request("/api/api-persons/delPerson", METHOD.POST, data)
  }