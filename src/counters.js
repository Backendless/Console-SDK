import urls from './urls'

export default req => ({
  get(appId, { pageSize, offset, sortField, sortDir }) {
    return Promise.all([
      req.get(urls.counters(appId)).query({ pageSize, offset, sortField, sortDir }),
      this.count(appId)
    ]).then(([data, totalRows]) => ({ data, totalRows }))
  },

  count(appId) {
    return req.get(`${urls.counters(appId)}/count`)
  },

  create(appId, name, value) {
    return req.post(urls.counters(appId), { name, value })
  },

  update(appId, value, objectId) {
    return req.put(urls.counters(appId, encodeURIComponent(objectId)), { value })
  },

  remove(appId, key) {
    return req.delete(urls.counters(appId, encodeURIComponent(key)))
  }
})
