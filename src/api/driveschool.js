import service from '@/utils/request'

export const getDriveSchoolList = (data) => {
  return service({
    url: '/driveschool/driveschoollist',
    method: 'get',
  })
}