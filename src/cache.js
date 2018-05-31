import urls from './urls'

export default req => ({
  get(appId, { pagesize, offset }) {
    return req.get(urls.cache(appId)).query({ pagesize, offset })
  },

  count(appId) {
    return req.get(`${urls.cache(appId)}/count`)
  },

  put(appId, key, value, timeout) {
    return req.put(urls.cache(appId, key), value).query({ timeout }).type('application/json')
  },

  updateTTL(appId, key, timeout) {
    return req.put(`${urls.cache(appId, key)}/expireIn`).query({ timeout })
  },

  remove(appId, key) {
    return req.delete(urls.cache(appId, key))
  }
})
