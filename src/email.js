/* eslint-disable max-len */

import urls from './urls'
import BaseService from './base/BaseService'

class Email extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'email'
  }

  /**
   * @aiToolName Load Email Templates
   * @category Email
   * @description Load email templates for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"eventId":6,"name":"Registration Confirmation","triggersEmail":true}]
   */
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

  /**
   * @aiToolName Load Custom Templates
   * @category Email
   * @description Load custom email templates for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult []
   */
  loadCustomTemplates(appId) {
    return this.req.get(urls.emailTemplates(appId))
  }

  /**
   * @typedef {Object} createCustomTemplate__payload
   * @paramDef {"type":"string","label":"Template Name","name":"name","required":true,"description":"The name of the custom email template"}
   * @paramDef {"type":"string","label":"Subject","name":"subject","required":true,"description":"The email subject line"}
   * @paramDef {"type":"string","label":"HTML Body","name":"body","required":true,"description":"The HTML content of the email template. Use {{variableName}} for template variables that can be replaced when sending emails"}
   */

  /**
   * @aiToolName Create Custom Template
   * @category Email
   * @description Create a new custom email template
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"createCustomTemplate__payload","name":"payload","label":"Template Data","description":"Object containing template name, subject, and HTML body","required":true}
   * @sampleResult ""
   */
  createCustomTemplate(appId, payload) {
    return this.req.post(urls.emailTemplates(appId), payload)
  }

  /**
   * @typedef {Object} updateCustomTemplate__payload
   * @paramDef {"type":"string","label":"Template Name","name":"name","required":true,"description":"The name of the email template"}
   * @paramDef {"type":"string","label":"Subject","name":"subject","required":true,"description":"The email subject line"}
   * @paramDef {"type":"string","label":"Body","name":"body","required":true,"description":"The HTML content of the email template. Use {{variableName}} for template variables that can be replaced when sending emails"}
   * @paramDef {"type":"array","label":"Attachments","name":"attachments","required":false,"description":"Array of email attachments (optional)"}
   */

  /**
   * @aiToolName Update Custom Template
   * @category Email
   * @description Update an existing custom email template
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"updateCustomTemplate__payload","name":"payload","label":"Template Data","description":"Object containing template name, subject, and HTML body","required":true}
   * @paramDef {"type":"string","name":"templateName","label":"Template Name","description":"The name of the template to update","required":true}
   * @sampleResult ""
   */
  updateCustomTemplate(appId, payload, templateName) {
    return this.req.put(urls.emailTemplates(appId, templateName), payload)
  }

  /**
   * @aiToolName Delete Custom Template
   * @category Email
   * @description Delete a custom email template
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"templateName","label":"Template Name","description":"The name of the template to delete","required":true}
   * @sampleResult ""
   */
  deleteCustomTemplate(appId, templateName) {
    return this.req.delete(urls.emailTemplates(appId, templateName))
  }

  /**
   * @typedef {Object} sendTestCustomEmail__templateValues
   * @paramDef {"type":"string","label":"Template Variable","name":"[key]","required":false,"description":"Template variables to replace in HTML (e.g., for {{username}} use username: 'John')"}
   */

  /**
   * @typedef {Object} sendTestCustomEmail__payload
   * @paramDef {"type":"string","label":"Template Name","name":"template-name","required":true,"description":"The name of the custom email template to use"}
   * @paramDef {"type":"sendTestCustomEmail__templateValues","label":"Template Values","name":"template-values","required":false,"description":"Object containing template variables to replace in HTML. For {{key}} in HTML, provide key: 'value'"}
   * @paramDef {"type":"array","label":"Attachments","name":"attachment","required":false,"description":"Array of file paths from Backendless Files service (e.g., ['folder/file.pdf', 'image.jpg'])"}
   * @paramDef {"type":"string","label":"Recipient Email","name":"email","required":true,"description":"Email address to send the test email to"}
   */

  /**
   * @aiToolName Send Test Custom Email
   * @category Email
   * @description Send a test email using a custom template. Template variables in HTML like {{key}} will be replaced with values from template-values object.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"sendTestCustomEmail__payload","name":"payload","label":"Email Data","description":"Object containing template name, variables, attachments, and recipient email","required":true}
   * @sampleResult ""
   */
  sendTestCustomEmail(appId, payload) {
    return this.req.post(`${urls.emailTemplates(appId)}/test`, payload)
  }

  /**
   * @typedef {Object} parseCustomTemplateKeys__payload
   * @paramDef {"type":"string","label":"Template Name","name":"name","required":true,"description":"The name of the email template to parse"}
   * @paramDef {"type":"string","label":"Subject","name":"subject","required":true,"description":"The email subject line"}
   * @paramDef {"type":"string","label":"HTML Body","name":"body","required":true,"description":"The HTML content of the email template to extract variables from"}
   * @paramDef {"type":"array","label":"Attachments","name":"attachments","required":false,"description":"Array of email attachments (optional)"}
   */

  /**
   * @aiToolName Parse Custom Template Keys
   * @category Email
   * @description Parse and validate custom template keys
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"parseCustomTemplateKeys__payload","name":"payload","label":"Template Data","description":"Object containing template name, subject, and HTML body to extract variables from","required":true}
   * @sampleResult ["username","email","date"]
   */
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
