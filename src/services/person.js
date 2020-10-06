import { request, METHOD } from '@/utils/request'

export async function insertPerson ( params) {
    return request("/api/api-persons/insertPerson", METHOD.POST,
      params
    )
  }

  export async function get () {
    return request("/api/api-persons/get", METHOD.GET)
  }