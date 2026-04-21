import request from '@/utils/request'

export function getTraceByCode(traceCode) {
  return request({
    url: `/api/trace/${traceCode}`,
    method: 'get'
  })
}

export function verifyAuthenticity(traceCode) {
  return request({
    url: `/api/trace/verify/${traceCode}`,
    method: 'get'
  })
}
