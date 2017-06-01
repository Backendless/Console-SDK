import urls from './urls'

const marketplaceUrl = (appId, name) => `${urls.marketplace(appId)}/${name}`

const marketplace = reqPromise => {
  return Object.keys(apiMethods).reduce((memo, methodName) => {
    memo[methodName] = (...args) => reqPromise.then(req => {
      const apiMethod = apiMethods[methodName](req)

      return apiMethod.apply(null, args)
    })

    return memo
  }, {})
}

const apiMethods = {
  getSections: req => (appId, marketplaceName) => {
    return req.get(`${marketplaceUrl(appId, marketplaceName)}/sections`)
  },

  getProducts: req => (appId, marketplaceName, categoryId) => {
    return req.get(`${marketplaceUrl(appId, marketplaceName)}/categories/${categoryId}/products`)
  },

  getProduct: req => (appId, marketplaceName, productId) => {
    return req.get(`${marketplaceUrl(appId, marketplaceName)}/products/${productId}`)
  },

  getPurchases: req => appId => {
    return req.get(`${urls.billing(appId)}/marketplace/purchases`)
  },

  allocateProduct: req => (appId, productId, options) => {
    return req.post(`${urls.billing(appId)}/marketplace/purchases/${productId}`, options)
  }
}

export default marketplace
