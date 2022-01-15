import service from '@/utils/request'

export const getCheckList = (data) => {
  return service({
    url: '/check/getCheckList',
    method: 'post',
    data
  })
}

export const passCheck = (data) => {
  return service({
    url: '/check/passCheck',
    method: 'post',
    data
  })
}

export const passCheckByIds = (data) => {
  return service({
    url: '/check/passCheckByIds',
    method: 'post',
    data
  })
}

export const getDailyReward = (data) => {
  return service({
    url: '/check/getDailyReward',
    method: 'post',
    data
  })
}