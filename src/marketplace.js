import urls from './urls'

export default req => ({
  getSections(appId, marketplaceName) {
    return req.billing.get(`${urls.marketplace(appId, marketplaceName)}/sections`)
  },

  getProducts(appId, marketplaceName, categoryId) {
    return req.billing.get(`${urls.marketplace(appId, marketplaceName)}/categories/${categoryId}/products`)
  },

  getProduct(appId, marketplaceName, productId) {
    return req.billing.get(`${urls.marketplace(appId, marketplaceName)}/products/${productId}`)
  },

  getProductServicesConfigurations(appId, marketplaceName, productId) {
    return req.billing.get(`${urls.marketplace(appId, marketplaceName)}/product/${productId}/service-configurations`)
  },

  getPurchases(appId) {
    return req.billing.get(`${urls.billing(appId)}/marketplace/purchases`)
  },

  allocateProduct(appId, productId, options) {
    return req.billing.post(`${urls.billing(appId)}/marketplace/purchases/${productId}`, options)
  },

  publishProduct(appId, marketplaceName, product) {
    return req.billing.post(`${urls.marketplace(appId, marketplaceName)}/product`, product)
  },

  approveProduct(appId, marketplaceName, productId) {
    return req.billing.put(`${urls.marketplace(appId, marketplaceName)}/product/apply/${productId}`)
  },

  rejectProduct(appId, marketplaceName, productId, reason) {
    return req.billing.put(`${urls.marketplace(appId, marketplaceName)}/product/reject/${productId}`, reason)
  },

  removeProduct(appId, marketplaceName, productId, reason) {
    return req.billing.delete(`${urls.marketplace(appId, marketplaceName)}/product/${productId}`, reason)
  },
})
