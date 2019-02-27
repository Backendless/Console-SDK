export default req => ({
  loadNavigatorOptions() {
    return req.get('/console/navigator')
  },

  log(data) {
    return req.post('/console/navigator/log', data)
  }
})
