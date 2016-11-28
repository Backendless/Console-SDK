import urls from './urls'
import billingPlans from './billing-plans' // TODO: remove this import with file after server route will be ready

export default req => ({
  getAppPurchases(appId) {
    return req.get(`${urls.appConsole(appId)}/marketplace/products/ordered`)
  },

  getBillingInfo(appId) {
    return req.get(`${urls.appConsole(appId)}/billing/accountinfo`)
  },

  getBillingPlans(/*appId*/) {
    return Promise.resolve(billingPlans)  // this.get(`/console/${appId}/billing/plans`)
  },

  switchToBillingPlan(appId, plan) {
    const params = { plan }

    return req.post(`${urls.appConsole(appId)}/billing/switch`).query(params)
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
