import request from '@/utils/request'

export function getMedicineList() {
  return request({
    url: '/api/medicine/list',
    method: 'get'
  })
}

export function getMedicinePage(current, size, keyword) {
  return request({
    url: '/api/medicine/page',
    method: 'get',
    params: { current, size, keyword }
  })
}

export function getMedicineById(id) {
  return request({
    url: `/api/medicine/${id}`,
    method: 'get'
  })
}

export function addMedicine(data) {
  return request({
    url: '/api/medicine',
    method: 'post',
    data
  })
}

export function updateMedicine(data) {
  return request({
    url: '/api/medicine',
    method: 'put',
    data
  })
}

export function deleteMedicine(id) {
  return request({
    url: `/api/medicine/${id}`,
    method: 'delete'
  })
}
