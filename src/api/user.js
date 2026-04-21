import request from '@/utils/request'

export function getUserPage(params) {
  return request({
    url: '/api/user/page',
    method: 'get',
    params
  })
}

export function getUserList() {
  return request({
    url: '/api/user/list',
    method: 'get'
  })
}

export function getUserById(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

export function updateUserStatus(id, status) {
  return request({
    url: '/api/user/status',
    method: 'put',
    params: { id, status }
  })
}

export function updateUserRole(id, role) {
  return request({
    url: '/api/user/role',
    method: 'put',
    params: { id, role }
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'delete'
  })
}
