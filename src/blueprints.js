import urls from './urls'

export default req => ({
  get: function(id) {
    return req.get(urls.blueprints()).query({ id })
  }
})
