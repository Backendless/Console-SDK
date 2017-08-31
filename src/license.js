export default req => ({
  get() {
    return req.get('/console/license')
  },

  upload(file) {
    return req.post('/console/license', file)
  }
})
