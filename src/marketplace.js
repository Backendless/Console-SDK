import urls from './urls'

const marketplace = (appId, name) => `${urls.marketplace(appId)}/${name}`

export default req => ({
  getSections(appId, marketplaceName) {
    return req.get(`${marketplace(appId, marketplaceName)}/sections`)
  },

  getProducts(appId, marketplaceName, categoryId) {
    return req.get(`${marketplace(appId, marketplaceName)}/categories/${categoryId}/products`)
  },

  getPurchases(appId) {
    return req.get(`${urls.billing(appId)}/marketplace/purchases`)
  },

  allocateProduct(appId, productId, options) {
    return req.post(`${urls.billing(appId)}/marketplace/purchases/${productId}`, options)
  }
})
