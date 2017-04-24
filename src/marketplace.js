export default req => ({
  getCategories(marketplaceName, marketplaceType) {
    return req.get(`/${marketplaceType}/${marketplaceName}/categories`) // main mp
  },

  getProducts(marketplaceName, marketplaceType, categoryId) {
    return req.get(`/${marketplaceType}/${marketplaceName}/categories/${categoryId}/products`)
  },

  getProduct(marketplaceName, marketplaceType, id) {
    return req.get(`/${marketplaceType}/${marketplaceName}/products/${id}`)
  },

  activateProduct(appId, productId, params) {
    return Promise.resolve(true)
    //return req.post(`${ urls.marketplace(appId) }/${ productId }/activate`, params)
  },

  deactivateProduct(appId, productId) {
    return Promise.resolve(true)
    //return req.delete(`${ urls.marketplace(appId) }/${ productId }/deactivate`, params)
  },

  getAppPurchases(appId) {
    return Promise.resolve([])
    // return req.get(`${urls.marketplace(appId)}/products/ordered`)
  }
})
