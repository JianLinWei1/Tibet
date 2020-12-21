import { request, METHOD } from '@/utils/request'

let url = "/api/main/camera"
export async function cameraBind(params) {
    return request(url + "/cameraBind", METHOD.POST,
        params
    )
}
export async function cameraBindList(params) {
    return request(url + "/cameraBindList", METHOD.POST,
        params
    )
}

export function delBind(data) {
    return request(url + "/delBind", METHOD.GET, data)
}

export function listCamera(data) {
    return request(url + "/listCamera", METHOD.POST, data)
}



