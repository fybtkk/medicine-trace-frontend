import request from '@/utils/request'

export function getConsumerPurchasePage(current, size, keyword) {
  return request({
    url: '/api/consumer-purchase/page',
    method: 'get',
    params: { current, size, keyword }
  })
}

export function getConsumerPurchaseList() {
  return request({
    url: '/api/consumer-purchase/list',
    method: 'get'
  })
}

export function getConsumerPurchaseById(id) {
  return request({
    url: `/api/consumer-purchase/${id}`,
    method: 'get'
  })
}

export function addConsumerPurchase(data) {
  return request({
    url: '/api/consumer-purchase',
    method: 'post',
    data
  })
}

export function deleteConsumerPurchase(id) {
  return request({
    url: `/api/consumer-purchase/${id}`,
    method: 'delete'
  })
}
