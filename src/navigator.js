export default req => ({
  loadNavigatorOptions() {
    return req.get('/console/navigator')
  }
})
