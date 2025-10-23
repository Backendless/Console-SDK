/* eslint-disable max-len */

import urls from './urls'
import BaseService from './base/base-service'

class Email extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'email'
  }

  loadEmailTemplates(appId) {
    return this.loadTemplates(appId)
  }

  loadTemplates(appId) {
    return this.req.get(`${urls.appConsole(appId)}/email`)
  }

  saveEmailTemplate(appId, template) {
    return this.saveTemplate(appId, template)
  }

  saveTemplate(appId, template) {
    return this.req.put(`${urls.appConsole(appId)}/email/events`, template)
  }

  sendTestEmail(appId, emailData) {
    return this.req.post(`${urls.appConsole(appId)}/email/events/test`, emailData)
  }

  updateEmailParams(appId, emailSettings) {
    return this.req.put(urls.mailSettings(appId), emailSettings)
  }

  resetEmailParams(appId) {
    return this.req.delete(urls.mailSettings(appId))
  }

  getEmailParams(appId) {
    return this.req.get(urls.mailSettings(appId))
  }

  testSMTPConnection(appId, emailSettings) {
    return this.req.put(`${urls.mailSettings(appId)}/test`, emailSettings)
  }

  loadCustomTemplates(appId) {
    return this.req.get(urls.emailTemplates(appId))
  }

  createCustomTemplate(appId, payload) {
    return this.req.post(urls.emailTemplates(appId), payload)
  }

  updateCustomTemplate(appId, payload, templateName) {
    return this.req.put(urls.emailTemplates(appId, templateName), payload)
  }

  deleteCustomTemplate(appId, templateName) {
    return this.req.delete(urls.emailTemplates(appId, templateName))
  }

  sendTestCustomEmail(appId, payload) {
    return this.req.post(`${urls.emailTemplates(appId)}/test`, payload)
  }

  parseCustomTemplateKeys(appId, payload) {
    return this.req.post(`${urls.emailTemplates(appId)}/customkeys`, payload)
  }

  installEmailTemplateFromMarketplace(appId, productId, data) {
    return this.req.post(urls.installEmailTemplate(appId, productId), data)
  }

  resetSystemEmailTemplate(appId, eventId) {
    return this.req.delete(`${urls.appConsole(appId)}/email/events/${eventId}`)
  }
}

export default req => Email.create(req)
