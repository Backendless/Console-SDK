import urls from './urls'

export default req => ({
  loadEmailTemplates (appId) {
    return req.get(`${urls.appConsole(appId)}/email`)
  },

  saveEmailTemplate (appId, template) {
    return req.put(`${urls.appConsole(appId)}/email/events`, template)
  },

  sendTestEmail (appId, emailData) {
    return req.post(`${urls.appConsole(appId)}/email/events/test`, emailData)
  },

  updateEmailParams(appId, emailSettings) {
    return req.put(urls.mailSettings(appId), emailSettings)
  },

  resetEmailParams(appId) {
    return req.delete(urls.mailSettings(appId))
  },

  getEmailParams(appId) {
    return req.get(urls.mailSettings(appId))
  },

  testSMTPConnection(appId, emailSettings) {
    return req.put(`${urls.mailSettings(appId)}/test`, emailSettings)
  }
})
