const tempResponse = {
  mode     : 0,
  licenseId: 123456,
  expDate  : '1505199074531',
  nodes    : 2
}

export default req => ({
  get() {
    return Promise.resolve(tempResponse) //req.get('/console/licence')
  },

  upload(file) {
    return Promise.resolve(tempResponse) //req.put('/console/licence', file)
  }
})
