import service from '@/utils/request'

export const getMessage = (data) => {
  return service({
    url: '/message/getMessage',
    method: 'post',
    data
  })
}
export const getNewMessage = () => {
  return service({
    url: '/message/getNewMessage',
    method: 'get',
  })
}
export const readNewMessage = (data) => {
  return service({
    url: '/message/readNewMessage',
    method: 'post',
	data
  })
}
export const dealMessage = (data) => {
  return service({
    url: '/message/dealMessage',
    method: 'post',
	data
  })
}
export const deleteMessage = (data) => {
  return service({
    url: '/message/deleteMessage',
    method: 'post',
	data
  })
}