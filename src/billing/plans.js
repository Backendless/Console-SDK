import { routes } from './routes'

export function billingPlansAPI(req) {
  return {
    getPlans(appId) {
      return req.billing.get(routes.billingPlans(appId))
    },

    switchToPlan(appId, planId, billingPeriod) {
      return req.billing.put(routes.switchPlan(appId, planId, billingPeriod))
    },

    unlockPlan(appId, planId) {
      return req.billing.put(routes.unlockPlan(appId, planId))
    },
  }
}
