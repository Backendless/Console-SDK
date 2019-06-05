import urls from './urls'

export default req => ({
  send(appId, event) {
    return req.post(urls.userActivity(appId), event)
  }
})
