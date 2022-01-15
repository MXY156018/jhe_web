import service from '@/utils/request'

export const getEquipmentList = (data) => {
  return service({
    url: '/equipment/equipmentlist',
    method: 'post',
	data
  })
}

export const createEquipment = (data) => {
  return service({
    url: '/equipment/createEquipment',
    method: 'post',
	data
  })
}

export const changeEquipment = (data) => {
  return service({
    url: '/equipment/changeEquipment',
    method: 'post',
	data
  })
}