import urls from './urls'

export default req => ({
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

  getCreditCard(appId) {
    return req.get(`${urls.billing(appId)}/creditcard`)
  },

  getPurchases(appId) {
    return req.get(`${urls.billing(appId)}/marketplace/purchases`)
  },

  allocateProduct(appId, productId, options) {
    return req.post(`${urls.billing(appId)}/marketplace/purchases/${productId}`, options)
  },
})
