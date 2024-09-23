import { routes } from './routes'

export function billingPlansAPI(req) {
  return {
    getAppPlans(appId) {
      return req.billing.get(routes.appBillingPlans(appId))
    },

    getAutomationPlans(appId) {
      return req.billing.get(routes.automationBillingPlans(appId))
    },

    switchToAppPlan(appId, planId, billingPeriod) {
      return req.billing.put(routes.switchAppPlan(appId, planId, billingPeriod))
    },

    switchToAutomationPlan(appId, planId, billingPeriod) {
      return req.billing.put(routes.switchAutomationPlan(appId, planId, billingPeriod))
    },

    unlockPlan(appId, planId) {
      return req.billing.put(routes.unlockPlan(appId, planId))
    },
  }
}
