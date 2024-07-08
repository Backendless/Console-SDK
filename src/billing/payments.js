import { routes } from './routes'

export function billingPaymentsAPI(req) {
  return {
    loadPaymentProfilesForCloneApp(appId) {
      return req.billing.get(routes.paymentProfilesForCloneApp(appId))
    },

    confirmConsolidateApp(appId, { paymentProfileId, newBillingPlan, newBillingPeriod }) {
      return req.billing.put(routes.consolidateApp(appId, paymentProfileId))
        .query({ newBillingPlan, newBillingPeriod })
    },

    loadPaymentProfiles() {
      return req.billing.get(routes.devPaymentProfile())
    },

    setPaymentProfile(appId, paymentProfileId) {
      return req.billing.put(routes.devPaymentProfileCard(appId, paymentProfileId))
    },

    addPaymentProfile(data) {
      return req.billing.post(routes.devPaymentProfile(), data)
    },

    updatePaymentProfile(id, data) {
      return req.billing.put(routes.devPaymentProfileById(id), data)
    },

    deletePaymentProfile(id) {
      return req.billing.delete(routes.devPaymentProfileById(id))
    },

    exchangeBBtoUSD(appId, bbAmount) {
      return req.billing.post(routes.exchangeBB(appId), bbAmount)
        .set({ 'Content-Type': 'application/json' })
    },
  }
}
