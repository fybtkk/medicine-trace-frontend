import request from '@/utils/request'

export function getNodePage(params) {
  return request({
    url: '/api/node/page',
    method: 'get',
    params
  })
}

export function getNodeList() {
  return request({
    url: '/api/node/list',
    method: 'get'
  })
}

export function getNodeById(id) {
  return request({
    url: `/api/node/${id}`,
    method: 'get'
  })
}

export function addNode(data) {
  return request({
    url: '/api/node',
    method: 'post',
    data
  })
}

export function updateNode(data) {
  return request({
    url: '/api/node',
    method: 'put',
    data
  })
}

export function deleteNode(id) {
  return request({
    url: `/api/node/${id}`,
    method: 'delete'
  })
}
