import urls from './urls'

export default req => ({
  get(appId, { pageSize, offset, sortField, sortDir }) {
    return Promise.all([
      req.get(urls.systemDataCounters(appId)).query({ pageSize, offset, sortField, sortDir }),
      this.count(appId)
    ]).then(([data, totalRows]) => ({ data, totalRows }))
  },

  getAll(appId, pattern) {
    return req.get(`${urls.counters(appId, pattern)}`)
  },

  count(appId) {
    return req.get(`${urls.systemDataCounters(appId)}/count`)
  },

  create(appId, name, value) {
    return req.post(urls.systemDataCounters(appId), { name, value })
  },

  update(appId, value, objectId) {
    return req.put(urls.systemDataCounters(appId, encodeURIComponent(objectId)), { value })
  },

  remove(appId, key) {
    return req.delete(urls.systemDataCounters(appId, encodeURIComponent(key)))
  }
})
