import request from '@/utils/request'

export function getInventoryPage(params) {
  return request({
    url: '/api/inventory/page',
    method: 'get',
    params
  })
}

export function getInventoryList() {
  return request({
    url: '/api/inventory/list',
    method: 'get'
  })
}

export function getInventoryWarnings() {
  return request({
    url: '/api/inventory/warnings',
    method: 'get'
  })
}

export function getInventorySummary() {
  return request({
    url: '/api/inventory/summary',
    method: 'get'
  })
}

export function getInventoryById(id) {
  return request({
    url: `/api/inventory/${id}`,
    method: 'get'
  })
}

export function addInventory(data) {
  return request({
    url: '/api/inventory',
    method: 'post',
    data
  })
}

export function updateInventory(data) {
  return request({
    url: '/api/inventory',
    method: 'put',
    data
  })
}

export function deleteInventory(id) {
  return request({
    url: `/api/inventory/${id}`,
    method: 'delete'
  })
}
