import request from '@/utils/request'

export function getBatchList() {
  return request({
    url: '/api/batch/list',
    method: 'get'
  })
}

export function getBatchPage(current, size, keyword) {
  return request({
    url: '/api/batch/page',
    method: 'get',
    params: { current, size, keyword }
  })
}

export function getBatchById(id) {
  return request({
    url: `/api/batch/${id}`,
    method: 'get'
  })
}

export function addBatch(data) {
  return request({
    url: '/api/batch',
    method: 'post',
    data
  })
}

export function updateBatch(data) {
  return request({
    url: '/api/batch',
    method: 'put',
    data
  })
}

export function deleteBatch(id) {
  return request({
    url: `/api/batch/${id}`,
    method: 'delete'
  })
}
