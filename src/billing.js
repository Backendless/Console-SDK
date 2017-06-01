import urls from './urls'

const billing = reqPromise => {
  return Object.keys(apiMethods).reduce((memo, methodName) => {
    memo[methodName] = (...args) => reqPromise.then(req => {
      const apiMethod = apiMethods[methodName](req)

      return apiMethod.apply(null, args)
    })

    return memo
  }, {})
}

const apiMethods = {
  getBillingInfo: req => appId => {
    return req.get(`${urls.billing(appId)}/accountinfo`)
  },

  getPlans: req => appId => {
    return req.get(`${urls.billing(appId)}/plans`)
  },

  getPlanComponentsData: req => (appId, planId) => {
    return req.get(`${urls.billing(appId)}/plans/${planId}/components`)
  },

  switchToPlan: req => (appId, planId) => {
    return req.post(`${urls.billing(appId)}/subscriptions/${planId}`)
  },

  getCreditCard: req => appId => {
    return req.get(`${urls.billing(appId)}/creditcard`)
  },

  getComponentLimit: req => (appId, componentId) => {
    return req.get(`/${appId}/billing/limits/${componentId}`)
  },

  apiCallsBlocked: req => appId => {
    return req.get(`/${appId}/billing/apicalls/blocked`)
  }
}

export default billing
