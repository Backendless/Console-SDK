import urls from './urls'

export default req => ({
  get: function() {
    return req.get(urls.blueprints())
  }
})
