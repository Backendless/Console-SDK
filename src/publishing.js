export default req => ({
  publish(marketplace, product) {
    return req.post(`/${marketplace}`, product)
  },

  download(marketplace, productId) {
    return req.get(`/${marketplace}/download/products/${productId}`)
  }
})
