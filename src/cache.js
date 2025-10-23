/* eslint-disable max-len */

import urls from './urls'
import BaseService from './base/base-service'

const normalizeValue = value => typeof value === 'string' ? value : JSON.stringify(value)

const normalizeResponse = res => {
  return Object.keys(res).map(key => {
    const { expireAt, value } = res[key]

    return {
      objectId: key,
      value   : normalizeValue(value),
      expireAt,
      key
    }
  })
}

class Cache extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'cache'
  }

  get(appId, params) {
    const { pageSize, offset } = params || {}
    return Promise.all([
      this.req
        .get(urls.cache(appId))
        .query({ pagesize: pageSize, offset })
        .then(normalizeResponse),
      this.count(appId)
    ]).then(([data, totalRows]) => ({ data, totalRows }))
  }

  count(appId) {
    return this.req.get(`${urls.cache(appId)}/count`)
  }

  update(appId, record) {
    const { key, value, expireAt, objectId } = record
    const id = key || objectId

    return this.req
      .put(urls.cache(appId, id), JSON.stringify(value))
      .query({ expireAt })
      .type('application/json')
  }

  remove(appId, key) {
    return this.req.delete(urls.cache(appId, key))
  }
}

export default req => Cache.create(req)
