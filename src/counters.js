import urls from './urls'
import totalRows from './utils/total-rows'

export default req => ({
  get(appId, { pageSize, offset, sortField, sortDir }) {
    return totalRows(req).getWithData(req.get(urls.counters(appId)).query({ pageSize, offset, sortField, sortDir }))
  },

  count(appId) {
    return req.get(`${urls.counters(appId)}/count`)
  },

  create(appId, name, value) {
    return req.post(urls.counters(appId), { name, value })
  },

  update(appId, name, value, objectId) {
    return req.put(urls.counters(appId, objectId), { name, value }).type('application/json')
  },

  remove(appId, key) {
    return req.delete(urls.counters(appId, key))
  }
})
