import urls from './urls'

export default req => ({
  getBillingInfo(appId) {
    return req.billing.get(`${urls.billing(appId)}/accountinfo`)
  },

  getPlans(appId) {
    return req.billing.get(`${urls.billing(appId)}/plans`)
  },

  getPlanComponentsData(appId, planId, billingPeriod) {
    return req.billing.get(`${urls.billing(appId)}/plans/${planId}/${billingPeriod}/components`)
  },

  getCurrentPlanComponentData(appId) {
    return req.billing.get(`${urls.billing(appId)}/plans/current/current/components`)
  },

  switchToPlan(appId, planId, billingPeriod) {
    return req.billing.put(`${urls.billing(appId)}/subscriptions/${planId}/${billingPeriod}`)
  },

  getCreditCard(appId) {
    return req.billing.get(`${urls.billing(appId)}/creditcard`)
  },

  getComponentLimit(appId, componentId) {
    return req.billing.get(`/${appId}/billing/limits/${componentId}`)
  },

  apiCallsBlocked(appId) {
    return req.billing.get(`/${appId}/billing/apicalls/blocked`)
  },

  getInviteCode(appId) {
    return req.billing.get(`${urls.billing(appId)}/refcode`)
  },

  getCurrentBillingPeriodStart(appId) {
    return req.billing.get(`${urls.billing(appId)}/period/start`)
  },

  getCurrentBillingPeriodEnd(appId) {
    return req.billing.get(`${urls.billing(appId)}/period/end`)
  },

  unlockPlan(appId, planId) {
    return req.billing.put(`/${appId}/billing/plan/${planId}/unlock`)
  },

  exchangeBBtoUSD(appId, bbAmount) {
    return req.billing.post(`${urls.billing(appId)}/bb/exchange`, bbAmount)
      .set({ 'Content-Type': 'application/json' })
  },

  confirmConsolidateApp(appId, { paymentProfileId, newBillingPlan, newBillingPeriod, zoneId }) {
    return req.billing.put(`${urls.billing(appId)}/consolidate/${paymentProfileId}`)
      .query({ newBillingPlan, newBillingPeriod, zoneId })
  },

  loadHiveUsage(appId) {
    return req.billing.get(`/${appId}/service/billing/usage/hive`)
  },
})
