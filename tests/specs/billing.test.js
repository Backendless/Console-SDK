import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.billing', () => {
  let apiClient
  let billingAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000', null, {
      billingURL: 'http://billing-host:4000',
      billingAuth: 'test-auth-token'
    })
    billingAPI = apiClient.billing
  })

  describe('Main Billing API', () => {
    describe('getAppBillingInfo', () => {
      it('should make GET request with correct parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await billingAPI.getAppBillingInfo(appId)

        expect(result).toEqual(successResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/accountinfo`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Billing service unavailable', 503)

        const error = await billingAPI.getAppBillingInfo(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Billing service unavailable' },
          message: 'Billing service unavailable',
          status: 503
        })

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/accountinfo`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })
    })

    describe('getAutomationBillingInfo', () => {
      it('should make GET request with correct parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await billingAPI.getAutomationBillingInfo(appId)

        expect(result).toEqual(successResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/accountinfo`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Automation billing not available', 400)

        const error = await billingAPI.getAutomationBillingInfo(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Automation billing not available' },
          message: 'Automation billing not available',
          status: 400
        })
      })
    })

    describe('getSubscriptionStatus', () => {
      it('should make GET request with correct parameters', async () => {
        const subscriptionStatus = { status: 'active', daysLeft: 30 }
        mockSuccessAPIRequest(subscriptionStatus)

        const result = await billingAPI.getSubscriptionStatus(appId)

        expect(result).toEqual(subscriptionStatus)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/billing/subscriptions/status`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Subscription not found', 404)

        const error = await billingAPI.getSubscriptionStatus(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Subscription not found' },
          message: 'Subscription not found',
          status: 404
        })
      })
    })

    describe('loadSubscriptionsInfo', () => {
      it('should make GET request with correct parameters', async () => {
        const subscriptionsInfo = [{ id: 'sub1' }, { id: 'sub2' }]
        mockSuccessAPIRequest(subscriptionsInfo)

        const result = await billingAPI.loadSubscriptionsInfo()

        expect(result).toEqual(subscriptionsInfo)

        expect(apiRequestCalls()).toEqual([{
          path: 'http://billing-host:4000/console/billing/developer/subscriptions-info',
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Unable to load subscriptions', 500)

        const error = await billingAPI.loadSubscriptionsInfo().catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Unable to load subscriptions' },
          message: 'Unable to load subscriptions',
          status: 500
        })
      })
    })

    describe('getAppBillingPeriodInfo', () => {
      it('should make GET request with correct parameters', async () => {
        const billingPeriodInfo = { period: 'monthly', startDate: '2024-01-01' }
        mockSuccessAPIRequest(billingPeriodInfo)

        const result = await billingAPI.getAppBillingPeriodInfo(appId)

        expect(result).toEqual(billingPeriodInfo)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/billing-period-info`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Billing period info not available', 400)

        const error = await billingAPI.getAppBillingPeriodInfo(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Billing period info not available' },
          message: 'Billing period info not available',
          status: 400
        })
      })
    })

    describe('getAutomationBillingPeriodInfo', () => {
      it('should make GET request with correct parameters', async () => {
        const billingPeriodInfo = { period: 'yearly', startDate: '2024-01-01' }
        mockSuccessAPIRequest(billingPeriodInfo)

        const result = await billingAPI.getAutomationBillingPeriodInfo(appId)

        expect(result).toEqual(billingPeriodInfo)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/billing-period-info`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Automation billing period info not available', 400)

        const error = await billingAPI.getAutomationBillingPeriodInfo(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Automation billing period info not available' },
          message: 'Automation billing period info not available',
          status: 400
        })
      })
    })
  })

  describe('Payments API', () => {
    describe('loadPaymentProfilesForCloneApp', () => {
      it('should make GET request with correct parameters', async () => {
        const paymentProfiles = [{ id: 'profile1' }, { id: 'profile2' }]
        mockSuccessAPIRequest(paymentProfiles)

        const result = await billingAPI.loadPaymentProfilesForCloneApp(appId)

        expect(result).toEqual(paymentProfiles)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/payment-profiles-for-clone-operation`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Payment profiles not found', 404)

        const error = await billingAPI.loadPaymentProfilesForCloneApp(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Payment profiles not found' },
          message: 'Payment profiles not found',
          status: 404
        })
      })
    })

    describe('confirmConsolidateApp', () => {
      it('should make PUT request with query parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const params = {
          paymentProfileId: 'profile123',
          newBillingPlan: 'premium',
          newBillingPeriod: 'monthly'
        }

        const result = await billingAPI.confirmConsolidateApp(appId, params)

        expect(result).toEqual(successResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/consolidate/profile123?newBillingPlan=premium&newBillingPeriod=monthly`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should handle undefined query parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const params = {
          paymentProfileId: 'profile456',
          newBillingPlan: undefined,
          newBillingPeriod: undefined
        }

        const result = await billingAPI.confirmConsolidateApp(appId, params)

        expect(result).toEqual(successResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/consolidate/profile456`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Consolidation failed', 400)

        const params = {
          paymentProfileId: 'profile789',
          newBillingPlan: 'standard',
          newBillingPeriod: 'yearly'
        }

        const error = await billingAPI.confirmConsolidateApp(appId, params).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Consolidation failed' },
          message: 'Consolidation failed',
          status: 400
        })
      })
    })

    describe('loadPaymentProfiles', () => {
      it('should make GET request with correct parameters', async () => {
        const profiles = [{ id: '1', type: 'card' }, { id: '2', type: 'paypal' }]
        mockSuccessAPIRequest(profiles)

        const result = await billingAPI.loadPaymentProfiles()

        expect(result).toEqual(profiles)

        expect(apiRequestCalls()).toEqual([{
          path: 'http://billing-host:4000/console/billing/developer/payment-profile',
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Unable to load payment profiles', 500)

        const error = await billingAPI.loadPaymentProfiles().catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Unable to load payment profiles' },
          message: 'Unable to load payment profiles',
          status: 500
        })
      })
    })

    describe('setAppPaymentProfile', () => {
      it('should make PUT request with correct parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const paymentProfileId = 'profile-xyz'
        const result = await billingAPI.setAppPaymentProfile(appId, paymentProfileId)

        expect(result).toEqual(successResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/creditcard/profile-xyz`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Invalid payment profile', 400)

        const paymentProfileId = 'invalid-profile'
        const error = await billingAPI.setAppPaymentProfile(appId, paymentProfileId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid payment profile' },
          message: 'Invalid payment profile',
          status: 400
        })
      })
    })

    describe('setAutomationPaymentProfile', () => {
      it('should make PUT request with correct parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const paymentProfileId = 'auto-profile-123'
        const result = await billingAPI.setAutomationPaymentProfile(appId, paymentProfileId)

        expect(result).toEqual(successResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/creditcard/auto-profile-123`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Automation payment profile not found', 404)

        const paymentProfileId = 'nonexistent-profile'
        const error = await billingAPI.setAutomationPaymentProfile(appId, paymentProfileId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Automation payment profile not found' },
          message: 'Automation payment profile not found',
          status: 404
        })
      })
    })

    describe('addPaymentProfile', () => {
      it('should make POST request with data', async () => {
        const newProfile = { id: 'new-profile', created: true }
        mockSuccessAPIRequest(newProfile)

        const profileData = {
          type: 'credit_card',
          cardNumber: '4111111111111111',
          expiryDate: '12/25',
          cvv: '123'
        }

        const result = await billingAPI.addPaymentProfile(profileData)

        expect(result).toEqual(newProfile)

        expect(apiRequestCalls()).toEqual([{
          path: 'http://billing-host:4000/console/billing/developer/payment-profile',
          method: 'POST',
          headers: { 
            'Authorization': 'Basic test-auth-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData),
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Invalid card details', 400)

        const profileData = {
          type: 'credit_card',
          cardNumber: 'invalid'
        }

        const error = await billingAPI.addPaymentProfile(profileData).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid card details' },
          message: 'Invalid card details',
          status: 400
        })
      })
    })

    describe('updatePaymentProfile', () => {
      it('should make PUT request with id and data', async () => {
        const updatedProfile = { id: 'profile-id', updated: true }
        mockSuccessAPIRequest(updatedProfile)

        const profileId = 'profile-id'
        const updateData = {
          expiryDate: '12/26',
          billingAddress: '123 Main St'
        }

        const result = await billingAPI.updatePaymentProfile(profileId, updateData)

        expect(result).toEqual(updatedProfile)

        expect(apiRequestCalls()).toEqual([{
          path: 'http://billing-host:4000/console/billing/developer/payment-profile/profile-id',
          method: 'PUT',
          headers: { 
            'Authorization': 'Basic test-auth-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData),
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Profile not found', 404)

        const profileId = 'nonexistent-id'
        const updateData = { expiryDate: '12/27' }

        const error = await billingAPI.updatePaymentProfile(profileId, updateData).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Profile not found' },
          message: 'Profile not found',
          status: 404
        })
      })
    })

    describe('deletePaymentProfile', () => {
      it('should make DELETE request with id', async () => {
        const deleteResult = { deleted: true }
        mockSuccessAPIRequest(deleteResult)

        const profileId = 'profile-to-delete'
        const result = await billingAPI.deletePaymentProfile(profileId)

        expect(result).toEqual(deleteResult)

        expect(apiRequestCalls()).toEqual([{
          path: 'http://billing-host:4000/console/billing/developer/payment-profile/profile-to-delete',
          method: 'DELETE',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Cannot delete active profile', 400)

        const profileId = 'active-profile'
        const error = await billingAPI.deletePaymentProfile(profileId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Cannot delete active profile' },
          message: 'Cannot delete active profile',
          status: 400
        })
      })
    })

    describe('exchangeBBtoUSD', () => {
      it('should make POST request with special Content-Type header', async () => {
        const exchangeResult = { usdAmount: 100, rate: 0.01 }
        mockSuccessAPIRequest(exchangeResult)

        const bbAmount = 10000
        const result = await billingAPI.exchangeBBtoUSD(appId, bbAmount)

        expect(result).toEqual(exchangeResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/bb/exchange`,
          method: 'POST',
          headers: { 
            'Authorization': 'Basic test-auth-token',
            'Content-Type': 'application/json'
          },
          body: String(bbAmount),
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should handle zero amount', async () => {
        const exchangeResult = { usdAmount: 0, rate: 0.01 }
        mockSuccessAPIRequest(exchangeResult)

        const bbAmount = 0
        const result = await billingAPI.exchangeBBtoUSD(appId, bbAmount)

        expect(result).toEqual(exchangeResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/bb/exchange`,
          method: 'POST',
          headers: { 
            'Authorization': 'Basic test-auth-token',
            'Content-Type': 'application/json'
          },
          body: 0,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Invalid BB amount', 400)

        const bbAmount = -100
        const error = await billingAPI.exchangeBBtoUSD(appId, bbAmount).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid BB amount' },
          message: 'Invalid BB amount',
          status: 400
        })
      })
    })
  })

  describe('Limits API', () => {
    describe('getAppPlanComponentsData', () => {
      it('should make GET request with correct parameters', async () => {
        const componentsData = { components: ['api', 'storage'] }
        mockSuccessAPIRequest(componentsData)

        const planId = 'premium-plan'
        const billingPeriod = 'monthly'
        const result = await billingAPI.getAppPlanComponentsData(appId, planId, billingPeriod)

        expect(result).toEqual(componentsData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/plans/premium-plan/monthly/components`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Plan not found', 404)

        const planId = 'invalid-plan'
        const billingPeriod = 'monthly'
        const error = await billingAPI.getAppPlanComponentsData(appId, planId, billingPeriod).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Plan not found' },
          message: 'Plan not found',
          status: 404
        })
      })
    })

    describe('getAppCurrentPlanComponentData', () => {
      it('should make GET request with current parameters', async () => {
        const componentsData = { components: ['current-api', 'current-storage'] }
        mockSuccessAPIRequest(componentsData)

        const result = await billingAPI.getAppCurrentPlanComponentData(appId)

        expect(result).toEqual(componentsData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/plans/current/current/components`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('No active plan', 400)

        const error = await billingAPI.getAppCurrentPlanComponentData(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'No active plan' },
          message: 'No active plan',
          status: 400
        })
      })
    })

    describe('getAutomationPlanComponentsData', () => {
      it('should make GET request with correct parameters', async () => {
        const componentsData = { components: ['workflow', 'triggers'] }
        mockSuccessAPIRequest(componentsData)

        const planId = 'automation-pro'
        const billingPeriod = 'yearly'
        const result = await billingAPI.getAutomationPlanComponentsData(appId, planId, billingPeriod)

        expect(result).toEqual(componentsData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/plans/automation-pro/yearly/components`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Automation plan not found', 404)

        const planId = 'invalid-automation-plan'
        const billingPeriod = 'monthly'
        const error = await billingAPI.getAutomationPlanComponentsData(appId, planId, billingPeriod).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Automation plan not found' },
          message: 'Automation plan not found',
          status: 404
        })
      })
    })

    describe('getAutomationCurrentPlanComponentData', () => {
      it('should make GET request with current parameters', async () => {
        const componentsData = { components: ['current-workflow', 'current-triggers'] }
        mockSuccessAPIRequest(componentsData)

        const result = await billingAPI.getAutomationCurrentPlanComponentData(appId)

        expect(result).toEqual(componentsData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/plans/current/current/components`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('No active automation plan', 400)

        const error = await billingAPI.getAutomationCurrentPlanComponentData(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'No active automation plan' },
          message: 'No active automation plan',
          status: 400
        })
      })
    })

    describe('getComponentLimit', () => {
      it('should make GET request with correct parameters', async () => {
        const limitData = { limit: 1000000, used: 500000 }
        mockSuccessAPIRequest(limitData)

        const componentId = 'api-calls'
        const result = await billingAPI.getComponentLimit(appId, componentId)

        expect(result).toEqual(limitData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/limits/api-calls`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Component not found', 404)

        const componentId = 'invalid-component'
        const error = await billingAPI.getComponentLimit(appId, componentId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Component not found' },
          message: 'Component not found',
          status: 404
        })
      })
    })

    describe('apiCallsBlocked', () => {
      it('should make GET request with correct parameters', async () => {
        const blockedInfo = { blocked: true, reason: 'Limit exceeded' }
        mockSuccessAPIRequest(blockedInfo)

        const result = await billingAPI.apiCallsBlocked(appId)

        expect(result).toEqual(blockedInfo)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/apicalls/blocked`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Unable to check API calls status', 500)

        const error = await billingAPI.apiCallsBlocked(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Unable to check API calls status' },
          message: 'Unable to check API calls status',
          status: 500
        })
      })
    })

    describe('loadHiveUsage', () => {
      it('should make GET request with default cached parameter', async () => {
        const hiveUsage = { totalSize: 1024000, fileCount: 100 }
        mockSuccessAPIRequest(hiveUsage)

        const result = await billingAPI.loadHiveUsage(appId)

        expect(result).toEqual(hiveUsage)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/service/billing/usage/hive?cached=true`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should make GET request with cached=false', async () => {
        const hiveUsage = { totalSize: 2048000, fileCount: 200 }
        mockSuccessAPIRequest(hiveUsage)

        const result = await billingAPI.loadHiveUsage(appId, false)

        expect(result).toEqual(hiveUsage)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/service/billing/usage/hive?cached=false`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Hive usage unavailable', 503)

        const error = await billingAPI.loadHiveUsage(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Hive usage unavailable' },
          message: 'Hive usage unavailable',
          status: 503
        })
      })
    })

    describe('loadHiveLimit', () => {
      it('should make GET request with correct parameters', async () => {
        const hiveLimit = { maxSize: 10485760, maxFiles: 1000 }
        mockSuccessAPIRequest(hiveLimit)

        const result = await billingAPI.loadHiveLimit(appId)

        expect(result).toEqual(hiveLimit)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/billing/limits/hive`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Hive limits not found', 404)

        const error = await billingAPI.loadHiveLimit(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Hive limits not found' },
          message: 'Hive limits not found',
          status: 404
        })
      })
    })

    describe('scalePlanePricingEstimate', () => {
      it('should make GET request with query parameters', async () => {
        const pricingEstimate = { totalCost: 150.00, breakdown: {} }
        mockSuccessAPIRequest(pricingEstimate)

        const query = {
          apiCalls: 5000000,
          storage: 10,
          bandwidth: 100
        }

        const result = await billingAPI.scalePlanePricingEstimate(appId, query)

        expect(result).toEqual(pricingEstimate)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers/price-estimation?apiCalls=5000000&storage=10&bandwidth=100`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should handle empty query object', async () => {
        const pricingEstimate = { totalCost: 0, breakdown: {} }
        mockSuccessAPIRequest(pricingEstimate)

        const query = {}
        const result = await billingAPI.scalePlanePricingEstimate(appId, query)

        expect(result).toEqual(pricingEstimate)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers/price-estimation`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Invalid estimation parameters', 400)

        const query = { apiCalls: -1 }
        const error = await billingAPI.scalePlanePricingEstimate(appId, query).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid estimation parameters' },
          message: 'Invalid estimation parameters',
          status: 400
        })
      })
    })

    describe('scaleFixedPlanePricingEstimate', () => {
      it('should make GET request with tierId and query parameters', async () => {
        const pricingEstimate = { totalCost: 200.00, tierName: 'Tier 2' }
        mockSuccessAPIRequest(pricingEstimate)

        const tierId = 'tier-2'
        const query = {
          apiCalls: 10000000,
          storage: 20
        }

        const result = await billingAPI.scaleFixedPlanePricingEstimate(appId, tierId, query)

        expect(result).toEqual(pricingEstimate)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers/price-estimation/tier-2?apiCalls=10000000&storage=20`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should handle undefined query', async () => {
        const pricingEstimate = { totalCost: 100.00, tierName: 'Tier 1' }
        mockSuccessAPIRequest(pricingEstimate)

        const tierId = 'tier-1'
        const result = await billingAPI.scaleFixedPlanePricingEstimate(appId, tierId)

        expect(result).toEqual(pricingEstimate)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers/price-estimation/tier-1`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Tier not found', 404)

        const tierId = 'invalid-tier'
        const query = { apiCalls: 1000000 }
        const error = await billingAPI.scaleFixedPlanePricingEstimate(appId, tierId, query).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Tier not found' },
          message: 'Tier not found',
          status: 404
        })
      })
    })

    describe('getMaxTier', () => {
      it('should make GET request with correct parameters', async () => {
        const maxTierData = { tierId: 'tier-3', name: 'Tier 3' }
        mockSuccessAPIRequest(maxTierData)

        const result = await billingAPI.getMaxTier(appId)

        expect(result).toEqual(maxTierData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers/max`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Max tier not configured', 400)

        const error = await billingAPI.getMaxTier(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Max tier not configured' },
          message: 'Max tier not configured',
          status: 400
        })
      })
    })

    describe('setMaxTier', () => {
      it('should make PUT request with tierId in body', async () => {
        const setResult = { success: true, tierId: 'tier-5' }
        mockSuccessAPIRequest(setResult)

        const tierId = 'tier-5'
        const result = await billingAPI.setMaxTier(appId, tierId)

        expect(result).toEqual(setResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers/max`,
          method: 'PUT',
          headers: { 
            'Authorization': 'Basic test-auth-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tierId }),
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Invalid tier ID', 400)

        const tierId = 'invalid-tier'
        const error = await billingAPI.setMaxTier(appId, tierId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid tier ID' },
          message: 'Invalid tier ID',
          status: 400
        })
      })
    })

    describe('getTiersList', () => {
      it('should make GET request with correct parameters', async () => {
        const tiersList = [
          { id: 'tier-1', name: 'Tier 1', price: 100 },
          { id: 'tier-2', name: 'Tier 2', price: 200 },
          { id: 'tier-3', name: 'Tier 3', price: 300 }
        ]
        mockSuccessAPIRequest(tiersList)

        const result = await billingAPI.getTiersList(appId)

        expect(result).toEqual(tiersList)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/tiers`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Tiers not available', 503)

        const error = await billingAPI.getTiersList(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Tiers not available' },
          message: 'Tiers not available',
          status: 503
        })
      })
    })
  })

  describe('Plans API', () => {
    describe('getAppPlans', () => {
      it('should make GET request with correct parameters', async () => {
        const plansData = [
          { id: 'free', name: 'Free Plan' },
          { id: 'standard', name: 'Standard Plan' },
          { id: 'premium', name: 'Premium Plan' }
        ]
        mockSuccessAPIRequest(plansData)

        const result = await billingAPI.getAppPlans(appId)

        expect(result).toEqual(plansData)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/plans`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Plans not available', 503)

        const error = await billingAPI.getAppPlans(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Plans not available' },
          message: 'Plans not available',
          status: 503
        })
      })
    })

    describe('getAutomationPlans', () => {
      it('should make GET request with correct parameters', async () => {
        const automationPlans = [
          { id: 'auto-basic', name: 'Basic Automation' },
          { id: 'auto-pro', name: 'Pro Automation' }
        ]
        mockSuccessAPIRequest(automationPlans)

        const result = await billingAPI.getAutomationPlans(appId)

        expect(result).toEqual(automationPlans)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/plans`,
          method: 'GET',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Automation plans not available', 503)

        const error = await billingAPI.getAutomationPlans(appId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Automation plans not available' },
          message: 'Automation plans not available',
          status: 503
        })
      })
    })

    describe('switchToAppPlan', () => {
      it('should make PUT request with correct parameters', async () => {
        const switchResult = { success: true, newPlan: 'premium' }
        mockSuccessAPIRequest(switchResult)

        const planId = 'premium'
        const billingPeriod = 'monthly'
        const result = await billingAPI.switchToAppPlan(appId, planId, billingPeriod)

        expect(result).toEqual(switchResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/subscriptions/premium/monthly`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should handle yearly billing period', async () => {
        const switchResult = { success: true, newPlan: 'standard' }
        mockSuccessAPIRequest(switchResult)

        const planId = 'standard'
        const billingPeriod = 'yearly'
        const result = await billingAPI.switchToAppPlan(appId, planId, billingPeriod)

        expect(result).toEqual(switchResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/application/subscriptions/standard/yearly`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Cannot switch to this plan', 400)

        const planId = 'enterprise'
        const billingPeriod = 'monthly'
        const error = await billingAPI.switchToAppPlan(appId, planId, billingPeriod).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Cannot switch to this plan' },
          message: 'Cannot switch to this plan',
          status: 400
        })
      })
    })

    describe('switchToAutomationPlan', () => {
      it('should make PUT request with correct parameters', async () => {
        const switchResult = { success: true, newPlan: 'auto-pro' }
        mockSuccessAPIRequest(switchResult)

        const planId = 'auto-pro'
        const billingPeriod = 'monthly'
        const result = await billingAPI.switchToAutomationPlan(appId, planId, billingPeriod)

        expect(result).toEqual(switchResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/subscriptions/auto-pro/monthly`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('should handle yearly billing period', async () => {
        const switchResult = { success: true, newPlan: 'auto-basic' }
        mockSuccessAPIRequest(switchResult)

        const planId = 'auto-basic'
        const billingPeriod = 'yearly'
        const result = await billingAPI.switchToAutomationPlan(appId, planId, billingPeriod)

        expect(result).toEqual(switchResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/console/billing/automation/subscriptions/auto-basic/yearly`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Invalid automation plan', 400)

        const planId = 'invalid-auto-plan'
        const billingPeriod = 'monthly'
        const error = await billingAPI.switchToAutomationPlan(appId, planId, billingPeriod).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid automation plan' },
          message: 'Invalid automation plan',
          status: 400
        })
      })
    })

    describe('unlockPlan', () => {
      it('should make PUT request with correct parameters', async () => {
        const unlockResult = { success: true, unlockedPlan: 'enterprise' }
        mockSuccessAPIRequest(unlockResult)

        const planId = 'enterprise'
        const result = await billingAPI.unlockPlan(appId, planId)

        expect(result).toEqual(unlockResult)

        expect(apiRequestCalls()).toEqual([{
          path: `http://billing-host:4000/${appId}/billing/plan/enterprise/unlock`,
          method: 'PUT',
          headers: { 'Authorization': 'Basic test-auth-token' },
          body: undefined,
          encoding: 'utf8',
          timeout: 0,
          withCredentials: false
        }])
      })

      it('fails when server responds with non 200 status code', async () => {
        mockFailedAPIRequest('Plan already unlocked', 400)

        const planId = 'already-unlocked'
        const error = await billingAPI.unlockPlan(appId, planId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Plan already unlocked' },
          message: 'Plan already unlocked',
          status: 400
        })
      })
    })
  })
})