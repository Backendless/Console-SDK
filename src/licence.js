export default req => ({
  get() {
    return req.get('/console/licence')
  },

  upload(file) {
    return req.put('/console/licence', file)
  }
})
