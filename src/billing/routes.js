import { prepareRoutes } from '../utils/routes'

export const routes = prepareRoutes({
  billingInfo               : '/:appId/console/billing/application/accountinfo',
  billingPlans              : '/:appId/console/billing/application/plans',
  planComponentsData        : '/:appId/console/billing/application/plans/:planId/:billingPeriod/components',
  switchPlan                : '/:appId/console/billing/application/subscriptions/:planId/:billingPeriod',
  componentLimit            : '/:appId/console/billing/application/limits/:componentId',
  billingPeriodInfo         : '/:appId/console/billing/application/billing-period-info',
  exchangeBB                : '/:appId/console/billing/application/bb/exchange',
  consolidateApp            : '/:appId/console/billing/application/consolidate/:paymentProfileId',
  tiers                     : '/:appId/console/billing/application/tiers',
  maxTier                   : '/:appId/console/billing/application/tiers/max',
  tiersFloatPriceEstimation : '/:appId/console/billing/application/tiers/price-estimation',
  tiersFixedPriceEstimation : '/:appId/console/billing/application/tiers/price-estimation/:tierId',
  paymentProfilesForCloneApp: '/:appId/console/billing/application/payment-profiles-for-clone-operation',
  devPaymentProfileCard     : '/:appId/console/billing/application/creditcard/:paymentProfileId',

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
