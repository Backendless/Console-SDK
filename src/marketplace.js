export default req => ({
  getSectionsAndCategories(marketplaceName) {
    return req.get(`/${marketplaceName}/sections`) // main mp
  },

  getProducts(marketplaceName, categoryId) {
    return req.get(`/${marketplaceName}/category/${categoryId}/products`)
  },

  getProduct(marketplaceName, id) {
    return req.get(`/${marketplaceName}/products/${id}`)
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
