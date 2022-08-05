import urls from './urls'

const DEFAULT_NAME_PATTERN = '*'

const normalizeResponse = item => ({
  ...item,
  objectId: item.name,
})

export default req => ({
  get(appId, { pageSize, offset, sortField, sortDir, pattern = DEFAULT_NAME_PATTERN }) {
    return req.get(urls.atomicCounters(appId)).query({ pageSize, offset, sortField, sortDir, pattern })
  },

  listNames(appId, pattern = DEFAULT_NAME_PATTERN) {
    return req.get(`${urls.atomicCounters(appId)}/${pattern}/list-names`)
  },

  listCounters(appId, names) {
    return req.post(`${urls.atomicCounters(appId)}/list-by-names`, names)
  },

  create(appId, name, value) {
    return req.post(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`, { value })
      .then(normalizeResponse)
  },

  update(appId, name, currentValue, newValue) {
    return req.put(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`, { currentValue, newValue })
  },

  remove(appId, name) {
    return req.delete(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`)
  }
})
