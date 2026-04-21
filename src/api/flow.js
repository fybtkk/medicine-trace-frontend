import request from '@/utils/request'

export function getFlowList() {
  return request({
    url: '/api/flow/list',
    method: 'get'
  })
}

export function getFlowPage(current, size, keyword) {
  return request({
    url: '/api/flow/page',
    method: 'get',
    params: { current, size, keyword }
  })
}

export function getFlowPageAdvanced(params) {
  return request({
    url: '/api/flow/page',
    method: 'get',
    params
  })
}

export function getFlowById(id) {
  return request({
    url: `/api/flow/${id}`,
    method: 'get'
  })
}

export function addFlow(data) {
  return request({
    url: '/api/flow',
    method: 'post',
    data
  })
}

export function updateFlow(data) {
  return request({
    url: '/api/flow',
    method: 'put',
    data
  })
}

export function deleteFlow(id) {
  return request({
    url: `/api/flow/${id}`,
    method: 'delete'
  })
}

export function getPendingInbound() {
  return request({
    url: '/api/flow/pending',
    method: 'get'
  })
}

export function sendFlow(data) {
  return request({
    url: '/api/flow/send',
    method: 'post',
    data
  })
}

export function receiveFlow(flowId) {
  return request({
    url: `/api/flow/receive/${flowId}`,
    method: 'post'
  })
}

export function sendBatchFlow(data) {
  return request({
    url: '/api/flow/sendBatch',
    method: 'post',
    data
  })
}
