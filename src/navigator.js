export default req => ({
  loadNavigatorOptions() {
    return req.get('/console/navigator')
  },

  logNotFoundedEntry(searchEntry) {
    return req.post('/console/navigator/log', { searchEntry })
  }
})
