import Cache from './cache'
import { toQueryString } from './path'

const CONTENT_TYPE_HEADER = 'Content-Type'
const CACHE_FLUSH_INTERVAL = 60000 //60 sec

const cache = new Cache(CACHE_FLUSH_INTERVAL)

const isObject = obj => null !== obj && 'object' === typeof obj

class ResponseError extends Error {
  constructor(error, status, headers) {
    super()

    this.status = status
    this.headers = headers
    this.message = error.message || error
    this.code = error.code
  }
}

const parseResponse = res => {
  return parseResponseBody(res).then(body => ({
    ok        : res.ok,
    status    : res.status,
    statusText: res.statusText,
    headers   : res.headers,
    body      : body
  }))
}

const parseResponseBody = res => {
  if (res.status === 404) {
    return Promise.resolve(null)
  }

  return res.clone().json().catch(() => res.text())
}

function parseError(res) {
  if (res.status === 502) {
    return 'No connection with server'
  }

  return res.body || `Status Code ${res.status} (${res.statusText})`
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.ok) {
    return response
  }

  const responseError = new ResponseError(parseError(response), response.status, response.headers)

  return Promise.reject(responseError)
}

export class Request {

  constructor(path, method, body) {
    this.method = method
    this.path = path
    this.body = body
    this.tags = undefined
    this.unwrap = true
    this.cacheTTL = 0
    this.headers = {}
    this.queryParams = {}
  }

  /**
   * Sets a header
   *
   * @param {String} key
   * @param {String} value
   * @returns {Request}
   */
  set(key, value) {
    this.headers[key] = value

    return this
  }

  /**
   * Which kind of tags this request affects.
   * Used for cache validation.
   * Non GET requests with defined tags, will clean all related to these tags caches
   *
   * @param {Array.<String>} tags
   * @returns {Request}
   */
  cacheTags(...tags) {
    this.tags = tags

    return this
  }

  /**
   * @param {String} queryParams
   * @returns {Request}
   */
  query(queryParams) {
    Object.assign(this.queryParams, queryParams)

    return this
  }

  /**
   * Should we cache or use cached result
   *
   * @param {Number} ttl Time to live for cached response. 15 seconds by default
   * @returns {Request}
   */
  useCache(ttl = 15000) {
    this.cacheTTL = ttl

    return this
  }

  /**
   * Shortcut for req.set('Content-Type', value)
   *
   * @param {String} contentType
   * @returns {Request}
   */
  type(contentType) {
    this.set(CONTENT_TYPE_HEADER, contentType)

    return this
  }

  /**
   * Should we unwrap the response and return only body. true by default
   * @param {Boolean} unwrap
   * @returns {Request}
   */
  unwrapBody(unwrap) {
    this.unwrap = unwrap

    return this
  }

  /**
   * Sends the requst
   *
   * @param {Object} body
   * @returns {Promise}
   */
  send(body) {
    let path = this.path
    const queryString = toQueryString(this.queryParams)

    if (queryString) {
      path += '?' + queryString
    }

    if (this.cacheTTL) {
      const cached = cache.get(path)

      if (cached !== undefined) {
        return Promise.resolve(cached)
      }
    }

    const type = this.headers[CONTENT_TYPE_HEADER]

    if (!type && isObject(body) && !(body instanceof FormData)) {
      this.type('application/json')
    }

    const options = {
      method : this.method.toUpperCase(),
      headers: this.headers
    }

    if (body) {
      const isJSON = this.headers[CONTENT_TYPE_HEADER] === 'application/json'

      options.body = isJSON ? JSON.stringify(body) : body
    }

    const unwrapBody = res => {
      return this.unwrap ? res.body : res
    }

    /**
     * Caches the response if required
     */
    const cacheResponse = res => {
      if (this.cacheTTL) {
        cache.set(path, res, this.tags, this.cacheTTL)
      }

      return res
    }

    /**
     * Deletes all relevant to req.cacheTags keys from the cache if this request method is not GET
     */
    const flushCache = res => {
      if (this.tags && this.method !== 'get') {
        cache.deleteByTags(this.tags)
      }

      return res
    }

    return fetch(path, options)
      .then(parseResponse)
      .then(checkStatus)
      .then(unwrapBody)
      .then(cacheResponse)
      .then(flushCache)
  }

  /**
   * If you are too lazy to use method 'send', don't use it and stay cool :)
   *
   * @param {Function} callback
   * @returns {Promise}
   */
  then(onSuccess, onError) {
    this.promise = this.promise || this.send(this.body)

    return this.promise.then(onSuccess, onError)
  }

  catch(callback) {
    this.promise = this.promise || this.send(this.body)

    return this.promise.catch(callback)
  }
}

export const methods = ['get', 'post', 'put', 'patch', 'delete']

methods.forEach(method => {
  module.exports[method] = function(path) {
    return new Request(path, method)
  }
})
