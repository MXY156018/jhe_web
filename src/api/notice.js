import service from '@/utils/request'

export const getNoticeList = (data) => {
  return service({
    url: '/notice/getNoticeList',
    method: 'post',
    data
  })
}

export const deleteNoticeByIds = (data) => {
  return service({
    url: '/notice/deleteNoticeByIds',
    method: 'post',
    data
  })
}

export const getNoticeById= (data) => {
  return service({
    url: '/notice/getNoticeById',
    method: 'post',
    data
  })
}
export const deleteNotice= (data) => {
  return service({
    url: '/notice/deleteNotice',
    method: 'post',
    data
  })
}

export const createNotice= (data) => {
  return service({
    url: '/notice/createNotice',
    method: 'post',
    data
  })
}
export const updateNotice= (data) => {
  return service({
    url: '/notice/updateNotice',
    method: 'post',
    data
  })
}

export const fleshNotice= (data) => {
  return service({
    url: '/notice/fleshNotice',
    method: 'post',
    data
  })
}
