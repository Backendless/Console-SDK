import _omit from 'lodash/omit'

import { trimQueryParams } from './path'

const NON_COUNTS_PARAMS = ['offset', 'pagesize', 'pageSize']
const DEFAULT_CACHE_TTL = 30000

const getCountPath = path => {
  path = trimQueryParams(path, NON_COUNTS_PARAMS)

  const pathTokens = path.split('?')

  return `${pathTokens[0]}/count${pathTokens[1] ? '?' + pathTokens[1] : ''}`
}

export default req => ({

  get(path, cacheTags) {
    return req.get(getCountPath(path)).useCache().cacheTags(cacheTags)
  },

  getFor(dataReq, cacheTTL = DEFAULT_CACHE_TTL) {
    return req
      .get(dataReq.path + '/count')
      .useCache(cacheTTL)
      .cacheTags(...(dataReq.tags || []))
      .query(_omit(dataReq.queryParams, NON_COUNTS_PARAMS))
  },

  getWithData(dataReq, cacheTTL) {
    return dataReq.then(data => {
      return this.getFor(dataReq, cacheTTL).then(totalRows => ({ data, totalRows }))
    })
  }
})
