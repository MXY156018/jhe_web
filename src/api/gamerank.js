import service from '@/utils/request'

export const getConfig = (data) => {
    return service({
        url: '/gamerank/getConfig',
        method: 'get',
    })
}
export const setConfig = (data) => {
    return service({
        url: '/gamerank/setConfig',
        method: 'post',
        data
    })
}

export const getRank = (data) => {
    return service({
        url: '/gamerank/getRank',
        method: 'post',
        data
    })
}