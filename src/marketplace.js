export default req => ({
  getCategories() {
    return req.get('/categories')
  },

  getProducts(categoryId) {
    return req.get('/products').query({ categoryId })
  },

  activateProduct(appId, productId, params) {
    return Promise.resolve(true)
    //return req.post(`${ urls.marketplace(appId) }/${ productId }/activate`, params)
  },

  deactivateProduct(appId, productId) {
    return Promise.resolve(true)
    //return req.delete(`${ urls.marketplace(appId) }/${ productId }/deactivate`, params)
  }
})
