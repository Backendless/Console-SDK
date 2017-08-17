import urls from './urls'

export default req => ({
  getStatus(appId) {
    return req.get(`${urls.appConsole(appId)}/referrals`)
  },

  send(appId, data) {
    return req.post(`${urls.appConsole(appId)}/referrals`, data)
  }
})
