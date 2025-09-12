/* eslint-disable max-len */

import urls from './urls'
import BaseService from './base/BaseService'

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

  /**
   * @typedef {Object} getCacheData__params
   * @paramDef {"type":"number","label":"Page Size","name":"pageSize","description":"Number of cache entries to return per page","required":false}
   * @paramDef {"type":"number","label":"Offset","name":"offset","description":"Number of cache entries to skip for pagination","required":false}
   */

  /**
   * @aiToolName Get Cache Data
   * @category Data
   * @description Retrieves cache entries with pagination support and returns both data and total count.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"getCacheData__params","name":"params","label":"Pagination Parameters","description":"Optional parameters for pagination","required":true}
   * @sampleResult {"data":[{"objectId":"user:123","value":"John Doe","expireAt":1700000000000,"key":"user:123"}],"totalRows":25}
   */
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

  /**
   * @aiToolName Count Cache Entries
   * @category Data
   * @description Returns the total number of cache entries in the application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult 42
   */
  count(appId) {
    return this.req.get(`${urls.cache(appId)}/count`)
  }

  /**
   * @typedef {Object} updateCacheEntry__record
   * @paramDef {"type":"string","label":"Key","name":"key","description":"The cache key (either key or objectId is required)","required":false}
   * @paramDef {"type":"string","label":"Object ID","name":"objectId","description":"Alternative identifier for the cache entry","required":false}
   * @paramDef {"type":"any","label":"Value","name":"value","description":"The value to be cached (can be any type, will be JSON stringified)","required":true}
   * @paramDef {"type":"string","label":"Expire At","name":"expireAt","description":"ISO date string when the cache entry should expire","required":false}
   */

  /**
   * @aiToolName Update Cache Entry
   * @category Data
   * @description Updates or creates a cache entry with the specified key, value, and expiration time.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"updateCacheEntry__record","name":"record","label":"Cache Record","description":"The cache entry data","required":true}
   * @sampleResult ""
   */
  update(appId, record) {
    const { key, value, expireAt, objectId } = record
    const id = key || objectId

    return this.req
      .put(urls.cache(appId, id), JSON.stringify(value))
      .query({ expireAt })
      .type('application/json')
  }

  /**
   * @aiToolName Remove Cache Entry
   * @category Data
   * @description Permanently removes a cache entry by its key.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"key","label":"Cache Key","description":"The key of the cache entry to be removed","required":true}
   * @sampleResult ""
   */
  remove(appId, key) {
    return this.req.delete(urls.cache(appId, key))
  }
}

export default req => Cache.create(req)
