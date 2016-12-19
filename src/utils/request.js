/* global fetch */

import Cache from './cache'
import { toQueryString } from './path'

const CONTENT_TYPE_HEADER = 'Content-Type'
const CACHE_FLUSH_INTERVAL = 60000 //60 sec

const cache = new Cache(CACHE_FLUSH_INTERVAL)

const isObject = val => null !== val && 'object' === typeof val
const isFormData = val => (typeof FormData !== 'undefined') && (val instanceof FormData)

class ResponseError extends Error {
  constructor(error, status, headers) {
    super()

    this.status = status
    this.headers = headers
    this.message = error.message || error
    this.code = error.code
  }
}

function parseError(res) {
  if (res.status === 502) {
    return 'No connection with server'
  }

  return res.body || `Status Code ${res.status} (${res.statusText})`
}

function parseBody(res) {
  try {
    return { ...res, body: JSON.parse(res.body) }
  } catch (e) {
    return res
  }
}

function parseHeaders(headersString) {
  const parsed = {}

  if (!headersString) {
    return parsed
  }

  headersString.split('\n').forEach(line => {
    const i = line.indexOf(':')
    const key = line.substr(0, i).trim()
    const val = line.substr(i + 1).trim()

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val
    }
  })

  return parsed
}

const sendXmlHttpRequest = (path, method, headers, body) => {
  return new Promise(function sendRequest(resolve, reject) {
    let request = new XMLHttpRequest()

    request.open(method.toUpperCase(), path, true)

    request.onload = function handleLoadEvent() {
      const headers = parseHeaders(request.getAllResponseHeaders())
      const { status, statusText, response, responseText } = request
      const body = response || responseText

      resolve({ status, statusText, headers, body })

      request = null
    }

    request.onerror = function handleErrorEvent() {
      reject(new Error('Network Error'))

      request = null
    }

    request.ontimeout = function handleTimeout() {
      reject(new Error('Connection aborted due to timeout'))

      request = null
    }

    Object.keys(headers).forEach(key => {
      request.setRequestHeader(key, headers[key])
    })

    request.send(body)
  })
}

const sendFetchAPIRequest = (path, method, headers, body) => {
  const options = { method, headers, body }

  const responseHeadersToJSON = headers => {
    const result = {}

    for (const key of headers.keys()) {
      result[key] = headers.get(key)
    }

    return result
  }

  return fetch(path, options).then(res => {
    const { status, statusText } = res
    const headers = responseHeadersToJSON(res.headers)

    return res.text().then(body => ({ status, statusText, headers, body }))
  })
}

const sendNodeAPIRequest = (path, method, headers, body) => {
  return new Promise((resolve, reject) => {
    const u = require('url').parse(path)
    const https = u.protocol === 'https:'
    const options = {
      host   : u.hostname,
      port   : u.port || (https ? 443 : 80),
      method : method,
      path   : u.path,
      headers: headers
    }

    const httpClient = require(https ? 'https' : 'http')

    const req = httpClient.request(options, res => {
      res.setEncoding('utf8')

      const { statusCode: status, statusMessage: statusText, headers } = res

      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => resolve({ status, statusText, headers, body }))
      res.on('error', reject)
    })

    if (body) {
      req.write(body)
    }

    req.on('error', reject)
    req.end()
  })
}

const sendRequest = typeof XMLHttpRequest !== 'undefined' ? sendXmlHttpRequest : sendNodeAPIRequest

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
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

    if (!type && isObject(body) && !isFormData(body)) {
      this.type('application/json')
    }

    if (body) {
      const isJSON = this.headers[CONTENT_TYPE_HEADER] === 'application/json'

      body = (isJSON && typeof body !== 'string') ? JSON.stringify(body) : body
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

    return sendRequest(path, this.method.toUpperCase(), this.headers, body)
      .then(parseBody)
      .then(checkStatus)
      .then(unwrapBody)
      .then(cacheResponse)
      .then(flushCache)
  }

  /**
   * If you are too lazy to use method 'send', don't use it and stay cool :)
   *
   * @param {Function} successHandler
   * @param {Function} errorHandler
   * @returns {Promise}
   */
  then(successHandler, errorHandler) {
    this.promise = this.promise || this.send(this.body)

    return this.promise.then(successHandler, errorHandler)
  }

  /**
   * @param {Function} errorHandler
   * @returns {Promise}
   */
  catch(errorHandler) {
    this.promise = this.promise || this.send(this.body)

    return this.promise.catch(errorHandler)
  }
}

export const methods = ['get', 'post', 'put', 'patch', 'delete']

methods.forEach(method => {
  module.exports[method] = function(path) {
    return new Request(path, method)
  }
})
