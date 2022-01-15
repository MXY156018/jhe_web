import service from '@/utils/request'

export const getTable = (data) => {
  return service({
    url: '/bill/getBill',
    method: 'post',
    data
  })
}

export const getGame = (data) => {
  return service({
    url: '/bill/getGameBill',
    method: 'post',
    data
  })
}

export const getDailyBill = (data) => {
  return service({
    url: '/bill/getDailyBill',
    method: 'post',
    data
  })
}
export const getSumProfit = (data) => {
  return service({
    url: '/bill/getSumProfit',
    method: 'post',
    data
  })
}
