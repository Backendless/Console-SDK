import urls from './urls'

export default req => ({
  get() {
    return req.get(urls.proLicense())
  },

  upload(file) {
    return req.post(urls.proLicense(), file)
  }
})
