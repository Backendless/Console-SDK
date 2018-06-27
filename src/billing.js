import urls from './urls'
import decorateRequest from './utils/decorate-request'

export default decorateRequest({
  getBillingInfo: req => appId => {
    return req.get(`${urls.billing(appId)}/accountinfo`)
  },

  getPlans: req => appId => {
    return req.get(`${urls.billing(appId)}/plans`)
  },

  getPlanComponentsData: req => (appId, planId) => {
    return req.get(`${urls.billing(appId)}/plans/${planId}/components`)
  },

  getCurrentPlanComponentData: req => appId => {
    return req.get(`${urls.billing(appId)}/plans/current/components`)
  },

  switchToPlan: req => (appId, planId) => {
    return req.put(`${urls.billing(appId)}/subscriptions/${planId}`)
  },

  getCreditCard: req => appId => {
    return req.get(`${urls.billing(appId)}/creditcard`)
  },

  getComponentLimit: req => (appId, componentId) => {
    return req.get(`/${appId}/billing/limits/${componentId}`)
  },

  apiCallsBlocked: req => appId => {
    return req.get(`/${appId}/billing/apicalls/blocked`)
  },

  getInviteCode: req => appId => {
    return req.get(`${urls.billing(appId)}/refcode`)
  },

  getCurrentBillingPeriodStart: req => appId => {
    return req.get(`${urls.billing(appId)}/period/start`)
  },

  getCurrentBillingPeriodEnd: req => appId => {
    return req.get(`${urls.billing(appId)}/period/end`)
  }
})
