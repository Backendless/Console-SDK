import urls from './urls'

export default req => ({
  getAppPurchases(appId) {
    return req.get(`${urls.marketplace(appId)}/products/ordered`)
  },

  getBillingInfo(appId) {
    return req.get(`${urls.billing(appId)}/accountinfo`)
  },

  getPlans(appId) {
    return req.get(`${urls.billing(appId)}/plans`)
  },

  getPlanComponentsData(appId, planId) {
    return req.get(`${urls.billing(appId)}/plans/${planId}/components`)
  },

  switchToPlan(appId, planId) {
    return req.post(`${urls.billing(appId)}/subscriptions/${planId}`)
  },

  updateCreditCard(appId) {
    return req.get(`${urls.billing(appId)}/updatecreditcard`)
  },

  deletePurchasedItem(appId, itemId) {
    return req.delete(`/console/marketplace/${itemId}`)
  },

  addCreditCard(appId, cardInfo) {
    return req.post(`${urls.billing(appId)}/creditcard`, cardInfo)
  },

  getProductDetails(appId, productId) {
    return req.get(`${urls.marketplace(appId)}/products/ordered/${productId}`)
  },

  updateProductDetails(appId, productId, productDetails) {
    return req.put(`${urls.marketplace(appId)}/activate/${productId}`, productDetails)
  }
})
