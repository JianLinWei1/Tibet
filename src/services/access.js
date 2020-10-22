import { request, METHOD } from '@/utils/request'
let url ="/api/api-access/access"

export async function searchDevice ( params) {
    return request(url+"/searchDevice", METHOD.GET,
      params
    )
  }

  export async function addDevice (data) {
    return request(url+"/addDevice", METHOD.POST, data)
  }

  export async function listDevice ( params) {
    return request(url+"/listDevice", METHOD.GET,
      params
    )
  }

  export async function queryPersonsList ( params) {
    return request(url+"/queryPersonsList", METHOD.POST,
      params
    )
  }
  
  export async function issuedPerson ( params) {
    return request(url+"/issuedPerson", METHOD.POST,
      params
    )
  }

  export async function listAccessPersons ( params) {
    return request(url+"/listAccessPersons", METHOD.POST,
      params
    )
  }

  
  export async function DelAccessPerson ( params) {
    return request(url+"/DelAccessPerson", METHOD.POST,
      params
    )
  }