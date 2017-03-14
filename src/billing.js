import urls from './urls'

export default req => ({
  getAppPurchases(appId) {
    return req.get(`${urls.appConsole(appId)}/marketplace/products/ordered`)
  },

  getBillingInfo(appId) {
    return req.get(`${urls.appConsole(appId)}/billing/accountinfo`)
  },

  getBillingPlans(appId) {
    return this.get(`${urls.appConsole(appId)}/billing/plans`)
  },

  switchToBillingPlan(appId, plan, purchases) {
    const params = { plan }

    return req.post(`${urls.appConsole(appId)}/billing/switch`, purchases).query(params)
  },

  updateCreditCard(appId) {
    return req.get(`${urls.appConsole(appId)}/billing/updatecreditcard`)
  },

  deletePurchasedItem(appId, itemId) {
    return req.delete(`/console/marketplace/${itemId}`)
  },

  addCreditCard(appId, cardInfo) {
    return req.post(`${urls.appConsole(appId)}/billing/creditcard`, cardInfo)
  },

  setMarketplaceCredentials(appId, credentials) {
    return req.post(`${urls.appConsole(appId)}/billing/marketplaceaccess`, credentials)
  },

  getProductDetails(appId, productId) {
    return req.get(`${urls.appConsole(appId)}/marketplace/products/ordered/${productId}`)
  },

  updateProductDetails(appId, productId, productDetails) {
    return req.put(`${urls.appConsole(appId)}/marketplace/activate/${productId}`, productDetails)
  }
})
