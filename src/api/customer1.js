import service from '@/utils/request'

export const getCustomerTable=(data)=>{
	return service({
	  url: '/customer/getCustomerList',
	  method: 'post',
	  data
	})
}
export const changeCustomerStatus=(data)=>{
	return service({
	  url: '/customer/changeCustomerStatus',
	  method: 'post',
	  data
	})
}
export const getCustomerById=(data)=>{
	return service({
	  url: '/customer/getCustomerById',
	  method: 'post',
	  data
	})
}
export const deleteCustomerById=(data)=>{
	return service({
	  url: '/customer/deleteCustomerById',
	  method: 'post',
	  data
	})
}
//獲取下級
export const getCustomerSubordinate=(data)=>{
	return service({
	  url: '/customer/getSubordinate',
	  method: 'post',
	  data
	})
}

//獲取用戶遊戲記錄
export const getCustomerGameRecord=(data)=>{
	return service({
	  url: '/customer/getGameRecord',
	  method: 'post',
	  data
	})
}

//獲取用戶操作記錄
export const getCustomerOperator=(data)=>{
	return service({
	  url: '/customer/getOperator',
	  method: 'post',
	  data
	})
}
