import urls from './urls'

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

export default req => ({
  get(appId, { pageSize, offset }) {
    return Promise.all([
      req
        .get(urls.cache(appId))
        .query({ pagesize: pageSize, offset })
        .then(normalizeResponse),
      this.count(appId)
    ]).then(([data, totalRows]) => ({ data, totalRows }))
  },

  count(appId) {
    return req.get(`${urls.cache(appId)}/count`)
  },

  update(appId, record) {
    const { key, value, expireAt, objectId } = record
    const id = key || objectId

    return req
      .put(urls.cache(appId, id), JSON.stringify(value))
      .query({ expireAt })
      .type('application/json')
  },

  remove(appId, key) {
    return req.delete(urls.cache(appId, key))
  }
})
