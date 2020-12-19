import { request, METHOD } from '@/utils/request'
let url = "/api/main/access"

export async function searchDevice (params) {
  return request(url + "/searchDevice", METHOD.GET,
    params
  )
}

export async function addDevice (data) {
  return request(url + "/addDevice", METHOD.POST, data)
}

export async function editDevice (data) {
  return request(url + "/editDevice", METHOD.POST, data)
}
export async function listDevice (params) {
  return request(url + "/listDevice", METHOD.POST,
    params
  )
}

export async function queryPersonsList (params) {
  return request(url + "/queryPersonsList", METHOD.POST,
    params
  )
}

export async function issuedPerson (params) {
  return request(url + "/issuedPerson", METHOD.POST,
    params
  )
}

export async function listAccessPersons (params) {
  return request(url + "/listAccessPersons", METHOD.POST,
    params
  )
}


export async function DelAccessPerson (params) {
  return request(url + "/DelAccessPerson", METHOD.POST,
    params
  )
}


export async function listRecords (params) {
  return request(url + "/listRecords", METHOD.POST,
    params
  )
}

export async function delRecords (params) {
  return request(url + "/delRecords", METHOD.POST,
    params
  )
}

export async function exportRecords (params) {
  return request(url + "/exportRecords", METHOD.POST,
    params
  )
}

export async function delDevice (params) {
  return request(url + "/delDevice", METHOD.POST,
    params
  )
}

export async function exportSearchRecords (params) {
  return request(url + "/exportSearchRecords", METHOD.POST,
    params
  )
}

export async function exportSearchRecords2 (params) {
  return request(url + "/exportSearchRecords2", METHOD.POST,
    params
  )
}
export async function openDoor (params) {
  return request(url + "/openDoor", METHOD.GET,
    params
  )
}

