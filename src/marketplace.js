export default req => ({
  getCategories() {
    return req.get('/categories')
  },

  getProducts(categoryId) {
    return req.get(`/products/category/${categoryId}`)
  },

  getProduct(id) {
    return req.get(`/products/${id}`)
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
