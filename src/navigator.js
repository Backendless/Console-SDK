export default req => ({
  loadNavigatorOptions() {
    return req.get('/console/navigator')
  },

  log({ query, hasResult }) {
    return req.post('/console/navigator/log', { query, hasResult })
  }
})
