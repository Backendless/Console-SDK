import { routes } from './routes'
import { billingPaymentsAPI } from './payments'
import { billingLimitsAPI } from './limits'
import { billingPlansAPI } from './plans'

export function billingAPI(req) {
  return {
    ...billingPaymentsAPI(req),
    ...billingLimitsAPI(req),
    ...billingPlansAPI(req),

    getBillingInfo(appId) {
      return req.billing.get(routes.billingInfo(appId))
    },

    getSubscriptionStatus(appId) {
      return req.billing.get(routes.subscriptionStatus(appId))
    },

    loadSubscriptionsInfo() {
      return req.billing.get(routes.devSubscriptionsInfo())
    },

    getBillingPeriodInfo(appId) {
      return req.billing.get(routes.billingPeriodInfo(appId))
    },

    // TODO: seems like we do not use the function
    // getInviteCode(appId) {
    //   return req.billing.get(routes.inviteCode(appId))
    // },

  }
}
