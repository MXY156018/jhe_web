import service from '@/utils/request'

export const getTraineesTable=(data)=>{
	return service({
	  url: '/trainees/getTraineesList',
	  method: 'post',
	  data
	})
}
export const changeTraineesStatus=(data)=>{
	return service({
	  url: '/trainees/changeTraineesStatus',
	  method: 'post',
	  data
	})
}
export const getTraineesById=(data)=>{
	return service({
	  url: '/trainees/getTraineesById',
	  method: 'post',
	  data
	})
}
export const editUserInfo=(data)=>{
	return service({
	  url: '/trainees/editUserInfo',
	  method: 'post',
	  data
	})
}
export const deleteUserById=(data)=>{
	return service({
	  url: '/trainees/deleteUserById',
	  method: 'post',
	  data
	})
}
