/* eslint-disable max-len */

import urls from './urls'

import BaseService from './base/base-service'

const DEFAULT_NAME_PATTERN = '*'

const normalizeResponse = item => ({
  ...item,
  objectId: item.name,
})

class AtomicCounters extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'counters'
  }

  get(appId, params = {}) {
    const { pageSize, offset, sortField, sortDir, pattern = DEFAULT_NAME_PATTERN } = params
    return this.req
      .get(urls.atomicCounters(appId))
      .query({ pageSize, offset, sortField, sortDir, pattern })
  }

  listNames(appId, pattern = DEFAULT_NAME_PATTERN) {
    return this.req.get(`${urls.atomicCounters(appId)}/${pattern}/list-names`)
  }

  listCounters(appId, names) {
    return this.req.post(`${urls.atomicCounters(appId)}/list-by-names`, names)
  }

  create(appId, name, value) {
    return this.req
      .post(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`, { value })
      .then(normalizeResponse)
  }

  update(appId, name, currentValue, newValue) {
    return this.req.put(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`, { currentValue, newValue })
  }

  remove(appId, name) {
    return this.req.delete(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`)
  }
}

export default req => AtomicCounters.create(req)
