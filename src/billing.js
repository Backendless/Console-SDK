import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  billingInfo       : '/:appId/console/billing/application/accountinfo',
  billingPlans      : '/:appId/console/billing/application/plans',
  planComponentsData: '/:appId/console/billing/application/plans/:planId/:billingPeriod/components',
  switchPlan        : '/:appId/console/billing/application/subscriptions/:planId/:billingPeriod',
  componentLimit    : '/:appId/console/billing/application/limits/:componentId',
  apiCallsBlocked   : '/:appId/console/billing/apicalls/blocked',
  inviteCode        : '/:appId/console/billing/refcode',
  billingPeriodStart: '/:appId/console/billing/application/period/start',
  billingPeriodEnd  : '/:appId/console/billing/application/period/end',
  unlockPlan        : '/:appId/billing/plan/:planId/unlock',
  exchangeBB        : '/:appId/console/billing/application/bb/exchange',
  consolidateApp    : '/:appId/console/billing/application/consolidate/:paymentProfileId',
  hiveUsage         : '/:appId/service/billing/usage/hive',
  hiveLimits        : '/:appId/billing/limits/hive',
})

export default req => ({
  getBillingInfo(appId) {
    return req.billing.get(routes.billingInfo(appId))
  },

  getPlans(appId, zoneId) {
    return req.billing.get(routes.billingPlans(appId)).query({ zoneId })
  },

  getPlanComponentsData(appId, planId, billingPeriod) {
    return req.billing.get(routes.planComponentsData(appId, planId, billingPeriod))
  },

  getCurrentPlanComponentData(appId) {
    return req.billing.get(routes.planComponentsData(appId, 'current', 'current'))
  },

  switchToPlan(appId, planId, billingPeriod) {
    return req.billing.put(routes.switchPlan(appId, planId, billingPeriod))
  },

  getComponentLimit(appId, componentId) {
    return req.billing.get(routes.componentLimit(appId, componentId))
  },

  apiCallsBlocked(appId) {
    return req.billing.get(routes.apiCallsBlocked(appId))
  },

  getInviteCode(appId) {
    return req.billing.get(routes.inviteCode(appId))
  },

  getCurrentBillingPeriodStart(appId) {
    return req.billing.get(routes.billingPeriodStart(appId))
  },

  getCurrentBillingPeriodEnd(appId) {
    return req.billing.get(routes.billingPeriodEnd(appId))
  },

  unlockPlan(appId, planId) {
    return req.billing.put(routes.unlockPlan(appId, planId))
  },

  exchangeBBtoUSD(appId, bbAmount) {
    return req.billing.post(routes.exchangeBB(appId), bbAmount)
      .set({ 'Content-Type': 'application/json' })
  },

  confirmConsolidateApp(appId, { paymentProfileId, newBillingPlan, newBillingPeriod, zoneId }) {
    return req.billing.put(routes.consolidateApp(appId, paymentProfileId))
      .query({ newBillingPlan, newBillingPeriod, zoneId })
  },

  loadHiveUsage(appId, cached = true) {
    return req.billing.get(routes.hiveUsage(appId)).query({ cached })
  },

  loadHiveLimit(appId) {
    return req.billing.get(routes.hiveLimits(appId))
  },
})
