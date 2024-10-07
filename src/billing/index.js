import { routes } from './routes'
import { billingPaymentsAPI } from './payments'
import { billingLimitsAPI } from './limits'
import { billingPlansAPI } from './plans'

export function billingAPI(req) {
  return {
    ...billingPaymentsAPI(req),
    ...billingLimitsAPI(req),
    ...billingPlansAPI(req),

    getAppBillingInfo(appId) {
      return req.billing.get(routes.appBillingInfo(appId))
    },

    getAutomationBillingInfo(appId) {
      return req.billing.get(routes.automationBillingInfo(appId))
    },

    getSubscriptionStatus(appId) {
      return req.billing.get(routes.subscriptionStatus(appId))
    },

    loadSubscriptionsInfo() {
      return req.billing.get(routes.devSubscriptionsInfo())
    },

    getAppBillingPeriodInfo(appId) {
      return req.billing.get(routes.appBillingPeriodInfo(appId))
    },

    getAutomationBillingPeriodInfo(appId) {
      return req.billing.get(routes.automationBillingPeriodInfo(appId))
    },

    // TODO: seems like we do not use the function
    // getInviteCode(appId) {
    //   return req.billing.get(routes.inviteCode(appId))
    // },
  }
}
