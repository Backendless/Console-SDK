import urls from './urls'

export default req => ({
  getAppPurchases(appId) {
    return req.get(`${urls.marketplace(appId)}/products/ordered`)
  },

  deletePurchasedItem(appId, itemId) {
    return req.delete(`/console/marketplace/${itemId}`)
  },

  getProductDetails(appId, productId) {
    return req.get(`${urls.marketplace(appId)}/products/ordered/${productId}`)
  },

  updateProductDetails(appId, productId, productDetails) {
    return req.put(`${urls.marketplace(appId)}/activate/${productId}`, productDetails)
  }
})
