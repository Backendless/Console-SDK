import urls from './urls'

export default req => ({
  loadTemplates(appId) {
    return req.get(`${urls.appConsole(appId)}/email`)
  },

  saveTemplate(appId, template) {
    return req.put(`${urls.appConsole(appId)}/email/events`, template)
  },

  sendTestEmail(appId, emailData) {
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
  },

  loadCustomTemplates(appId) {
    return req.get(urls.emailTemplates(appId))
  },

  createCustomTemplate(appId, payload) {
    return req.post(urls.emailTemplates(appId), payload)
  },

  updateCustomTemplate(appId, payload, templateName) {
    return req.put(urls.emailTemplates(appId, templateName), payload)
  },

  deleteCustomTemplate(appId, templateName) {
    return req.delete(urls.emailTemplates(appId, templateName))
  },

  sendTestCustomEmail(appId, payload) {
    return req.post(`${urls.emailTemplates(appId)}/test`, payload)
  },

  parseCustomTemplateKeys(appId, payload) {
    return req.post(`${urls.emailTemplates(appId)}/customkeys`, payload)
  }
})
