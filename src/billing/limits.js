import { routes } from './routes'

export function billingLimitsAPI(req) {
  return {
    getAppPlanComponentsData(appId, planId, billingPeriod) {
      return req.billing.get(routes.appPlanComponentsData(appId, planId, billingPeriod))
    },

    getAppCurrentPlanComponentData(appId) {
      return req.billing.get(routes.appPlanComponentsData(appId, 'current', 'current'))
    },

    getAutomationPlanComponentsData(appId, planId, billingPeriod) {
      return req.billing.get(routes.automationPlanComponentsData(appId, planId, billingPeriod))
    },

    getAutomationCurrentPlanComponentData(appId) {
      return req.billing.get(routes.automationPlanComponentsData(appId, 'current', 'current'))
    },

    getComponentLimit(appId, componentId) {
      return req.billing.get(routes.componentLimit(appId, componentId))
    },

    apiCallsBlocked(appId) {
      return req.billing.get(routes.apiCallsBlocked(appId))
    },

    loadHiveUsage(appId, cached = true) {
      return req.billing.get(routes.hiveUsage(appId)).query({ cached })
    },

    loadHiveLimit(appId) {
      return req.billing.get(routes.hiveLimits(appId))
    },

    scalePlanePricingEstimate(appId, query) {
      return req.billing.get(routes.tiersFloatPriceEstimation(appId)).query(query)
    },

    scaleFixedPlanePricingEstimate(appId, tierId, query) {
      return req.billing.get(routes.tiersFixedPriceEstimation(appId, tierId)).query(query)
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
  }
}
