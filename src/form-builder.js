import urls from './urls'

export default req => ({
  init(appId) {
    return req.post(urls.formBuilderInit(appId))
  },
})
