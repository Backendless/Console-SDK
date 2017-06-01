import urls from './urls'
import decorateRequest from './utils/decorate-request'

const marketplaceUrl = (appId, name) => `${urls.marketplace(appId)}/${name}`

export default decorateRequest({
  getSections: req => (appId, marketplaceName) => {
    return req.get(`${marketplaceUrl(appId, marketplaceName)}/sections`)
  },

  getProducts: req => (appId, marketplaceName, categoryId) => {
    return req.get(`${marketplaceUrl(appId, marketplaceName)}/categories/${categoryId}/products`)
  },

  getProduct: req => (appId, marketplaceName, productId) => {
    return req.get(`${marketplaceUrl(appId, marketplaceName)}/products/${productId}`)
  },

  getPurchases: req => appId => {
    return req.get(`${urls.billing(appId)}/marketplace/purchases`)
  },

  allocateProduct: req => (appId, productId, options) => {
    return req.post(`${urls.billing(appId)}/marketplace/purchases/${productId}`, options)
  }
})
