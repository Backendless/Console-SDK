import { prepareRoutes } from '../utils/routes'

export const routes = prepareRoutes({
  appBillingInfo              : '/:appId/console/billing/application/accountinfo',
  appBillingPlans             : '/:appId/console/billing/application/plans',
  appPlanComponentsData       : '/:appId/console/billing/application/plans/:planId/:billingPeriod/components',
  switchAppPlan               : '/:appId/console/billing/application/subscriptions/:planId/:billingPeriod',
  componentLimit              : '/:appId/console/billing/application/limits/:componentId',
  appBillingPeriodInfo        : '/:appId/console/billing/application/billing-period-info',
  exchangeBB                  : '/:appId/console/billing/application/bb/exchange',
  consolidateApp              : '/:appId/console/billing/application/consolidate/:paymentProfileId',
  tiers                       : '/:appId/console/billing/application/tiers',
  maxTier                     : '/:appId/console/billing/application/tiers/max',
  tiersFloatPriceEstimation   : '/:appId/console/billing/application/tiers/price-estimation',
  tiersFixedPriceEstimation   : '/:appId/console/billing/application/tiers/price-estimation/:tierId',
  paymentProfilesForCloneApp  : '/:appId/console/billing/application/payment-profiles-for-clone-operation',
  appPaymentProfileCard       : '/:appId/console/billing/application/creditcard/:paymentProfileId',

  apiCallsBlocked: '/:appId/console/billing/apicalls/blocked',
  // inviteCode                : '/:appId/console/billing/refcode',

  devSubscriptionsInfo : '/console/billing/developer/subscriptions-info',
  devPaymentProfile    : '/console/billing/developer/payment-profile',
  devPaymentProfileById: '/console/billing/developer/payment-profile/:id',

  subscriptionStatus: '/:appId/billing/subscriptions/status',
  unlockPlan        : '/:appId/billing/plan/:planId/unlock',

  hiveLimits: '/:appId/billing/limits/hive',
  hiveUsage : '/:appId/service/billing/usage/hive',
})
