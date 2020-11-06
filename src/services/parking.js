import { request, METHOD } from '@/utils/request'
let url ="/api/api-parking"

export async function listParking ( params) {
    return request(url+"/listParking", METHOD.POST,
      params
    )
}

export async function getUserIdByName ( params) {
    return request(url+"/getUserIdByName", METHOD.GET,
      params
    )
}

export async function saveParkInfo ( params) {
    return request(url+"/saveParkInfo", METHOD.POST,
      params
    )
}

export async function delParkInfo ( params) {
    return request(url+"/delParkInfo", METHOD.POST,
      params
    )
}

export async function getPersonByName ( params) {
    return request(url+"/getPersonByName", METHOD.POST,
      params
    )
}

export async function saveParkPersonInfo ( params) {
    return request(url+"/saveParkPersonInfo", METHOD.POST,
      params
    )
}

export async function listParkingPerson ( params) {
    return request(url+"/listParkingPerson", METHOD.POST,
      params
    )
}

export async function delParkingPerson ( params) {
    return request(url+"/delParkingPerson", METHOD.POST,
      params
    )
}

export async function listParkingResult ( params) {
    return request(url+"/listParkingResult", METHOD.POST,
      params
    )
}

export async function delParkingResult ( params) {
    return request(url+"/delParkingResult", METHOD.POST,
      params
    )
}

export async function exportRecords ( params) {
  return request(url+"/exportRecords", METHOD.POST,
    params
  )
}