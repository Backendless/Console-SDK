import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  billingInfo       : '/:appId/console/billing/application/accountinfo',
  billingPlans      : '/:appId/console/billing/application/plans',
  planComponentsData: '/:appId/console/billing/application/plans/:planId/:billingPeriod/components',
  switchPlan        : '/:appId/console/billing/application/subscriptions/:planId/:billingPeriod',
  componentLimit    : '/:appId/console/billing/application/limits/:componentId',
  apiCallsBlocked   : '/:appId/console/billing/apicalls/blocked',
  inviteCode        : '/:appId/console/billing/refcode',
  billingPeriodInfo : '/:appId/console/billing/application/billing-period-info',
  unlockPlan        : '/:appId/billing/plan/:planId/unlock',
  exchangeBB        : '/:appId/console/billing/application/bb/exchange',
  consolidateApp    : '/:appId/console/billing/application/consolidate/:paymentProfileId',
  tiers             : '/:appId/console/billing/application/tiers',
  maxTier           : '/:appId/console/billing/application/tiers/max',
  hiveUsage         : '/:appId/service/billing/usage/hive',
  hiveLimits        : '/:appId/billing/limits/hive',
})

export default req => ({
  getBillingInfo(appId) {
    return req.billing.get(routes.billingInfo(appId))
  },

  getPlans(appId) {
    return req.billing.get(routes.billingPlans(appId))
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

  getBillingPeriodInfo(appId) {
    return req.billing.get(routes.billingPeriodInfo(appId))
  },

  unlockPlan(appId, planId) {
    return req.billing.put(routes.unlockPlan(appId, planId))
  },

  exchangeBBtoUSD(appId, bbAmount) {
    return req.billing.post(routes.exchangeBB(appId), bbAmount)
      .set({ 'Content-Type': 'application/json' })
  },

  confirmConsolidateApp(appId, { paymentProfileId, newBillingPlan, newBillingPeriod }) {
    return req.billing.put(routes.consolidateApp(appId, paymentProfileId))
      .query({ newBillingPlan, newBillingPeriod })
  },

  loadHiveUsage(appId, cached = true) {
    return req.billing.get(routes.hiveUsage(appId)).query({ cached })
  },

  loadHiveLimit(appId) {
    return req.billing.get(routes.hiveLimits(appId))
  },

  getMaxTier(appId) {
    return req.billing.get(routes.maxTier(appId))
  },

  setMaxTier(appId, tierId) {
    return req.billing.put(routes.maxTier(appId), { tierId })
  },

  getTiersList(appId) {
    return req.billing.get(routes.tiers(appId))
  },
})
