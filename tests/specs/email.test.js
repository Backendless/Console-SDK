describe('apiClient.email', () => {
  let apiClient
  let emailAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    emailAPI = apiClient.email
  })

  describe('loadEmailTemplates', () => {
    it('should make GET request with correct parameters (alias for loadTemplates)', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await emailAPI.loadEmailTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await emailAPI.loadEmailTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied' },
        message: 'Access denied',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadTemplates', () => {
    it('should make GET request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await emailAPI.loadTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Templates not found', 404)

      const error = await emailAPI.loadTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Templates not found' },
        message: 'Templates not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('saveEmailTemplate', () => {
    it('should make PUT request with correct parameters (alias for saveTemplate)', async () => {
      mockSuccessAPIRequest(successResult)

      const template = {
        templateName: 'welcome',
        subject: 'Welcome to our app',
        htmlBody: '<h1>Welcome!</h1>',
        textBody: 'Welcome!'
      }

      const result = await emailAPI.saveEmailTemplate(appId, template)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events`,
        method: 'PUT',
        body: JSON.stringify(template),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid template format', 400)

      const template = { invalid: 'template' }
      const error = await emailAPI.saveEmailTemplate(appId, template).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid template format' },
        message: 'Invalid template format',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events`,
        method: 'PUT',
        body: JSON.stringify(template),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('saveTemplate', () => {
    it('should make PUT request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const template = {
        templateName: 'password-reset',
        subject: 'Reset your password',
        htmlBody: '<h1>Reset Password</h1>',
        textBody: 'Reset Password'
      }

      const result = await emailAPI.saveTemplate(appId, template)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events`,
        method: 'PUT',
        body: JSON.stringify(template),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template validation failed', 422)

      const template = { subject: 'Invalid template without body' }
      const error = await emailAPI.saveTemplate(appId, template).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template validation failed' },
        message: 'Template validation failed',
        status: 422
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events`,
        method: 'PUT',
        body: JSON.stringify(template),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('sendTestEmail', () => {
    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const emailData = {
        recipient: 'test@example.com',
        templateName: 'welcome',
        templateData: { name: 'John Doe' }
      }

      const result = await emailAPI.sendTestEmail(appId, emailData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events/test`,
        method: 'POST',
        body: JSON.stringify(emailData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid email address', 400)

      const emailData = { recipient: 'invalid-email' }
      const error = await emailAPI.sendTestEmail(appId, emailData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid email address' },
        message: 'Invalid email address',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events/test`,
        method: 'POST',
        body: JSON.stringify(emailData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateEmailParams', () => {
    it('should make PUT request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const emailSettings = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'user@gmail.com',
        smtpPassword: 'password123'
      }

      const result = await emailAPI.updateEmailParams(appId, emailSettings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings`,
        method: 'PUT',
        body: JSON.stringify(emailSettings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('SMTP configuration invalid', 400)

      const emailSettings = { smtpHost: 'invalid-host' }
      const error = await emailAPI.updateEmailParams(appId, emailSettings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'SMTP configuration invalid' },
        message: 'SMTP configuration invalid',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings`,
        method: 'PUT',
        body: JSON.stringify(emailSettings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('resetEmailParams', () => {
    it('should make DELETE request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await emailAPI.resetEmailParams(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings`,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Reset not allowed', 403)

      const error = await emailAPI.resetEmailParams(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Reset not allowed' },
        message: 'Reset not allowed',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings`,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getEmailParams', () => {
    it('should make GET request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await emailAPI.getEmailParams(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Email settings not found', 404)

      const error = await emailAPI.getEmailParams(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Email settings not found' },
        message: 'Email settings not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('testSMTPConnection', () => {
    it('should make PUT request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const emailSettings = {
        smtpHost: 'smtp.outlook.com',
        smtpPort: 587,
        smtpUsername: 'test@outlook.com',
        smtpPassword: 'testpass'
      }

      const result = await emailAPI.testSMTPConnection(appId, emailSettings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings/test`,
        method: 'PUT',
        body: JSON.stringify(emailSettings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('SMTP connection failed', 500)

      const emailSettings = { smtpHost: 'invalid.smtp.com' }
      const error = await emailAPI.testSMTPConnection(appId, emailSettings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'SMTP connection failed' },
        message: 'SMTP connection failed',
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/mailsettings/test`,
        method: 'PUT',
        body: JSON.stringify(emailSettings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadCustomTemplates', () => {
    it('should make GET request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await emailAPI.loadCustomTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Custom templates not accessible', 403)

      const error = await emailAPI.loadCustomTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Custom templates not accessible' },
        message: 'Custom templates not accessible',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createCustomTemplate', () => {
    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const payload = {
        templateName: 'custom-newsletter',
        subject: 'Monthly Newsletter',
        htmlBody: '<h1>Newsletter Content</h1>',
        textBody: 'Newsletter Content',
        fromName: 'Company Newsletter'
      }

      const result = await emailAPI.createCustomTemplate(appId, payload)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate`,
        method: 'POST',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template name already exists', 409)

      const payload = { templateName: 'existing-template' }
      const error = await emailAPI.createCustomTemplate(appId, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template name already exists' },
        message: 'Template name already exists',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate`,
        method: 'POST',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateCustomTemplate', () => {
    it('should make PUT request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const templateName = 'custom-newsletter'
      const payload = {
        subject: 'Updated Monthly Newsletter',
        htmlBody: '<h1>Updated Newsletter Content</h1>',
        textBody: 'Updated Newsletter Content'
      }

      const result = await emailAPI.updateCustomTemplate(appId, payload, templateName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/${templateName}`,
        method: 'PUT',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const templateName = 'non-existent-template'
      const payload = { subject: 'Updated subject' }
      const error = await emailAPI.updateCustomTemplate(appId, payload, templateName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/${templateName}`,
        method: 'PUT',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteCustomTemplate', () => {
    it('should make DELETE request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const templateName = 'custom-newsletter'
      const result = await emailAPI.deleteCustomTemplate(appId, templateName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/${templateName}`,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template deletion not allowed', 403)

      const templateName = 'protected-template'
      const error = await emailAPI.deleteCustomTemplate(appId, templateName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template deletion not allowed' },
        message: 'Template deletion not allowed',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/${templateName}`,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('sendTestCustomEmail', () => {
    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const payload = {
        templateName: 'custom-newsletter',
        recipient: 'test@example.com',
        templateData: { userName: 'John Doe', companyName: 'Acme Corp' }
      }

      const result = await emailAPI.sendTestCustomEmail(appId, payload)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/test`,
        method: 'POST',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found for test', 404)

      const payload = { templateName: 'non-existent', recipient: 'test@example.com' }
      const error = await emailAPI.sendTestCustomEmail(appId, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found for test' },
        message: 'Template not found for test',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/test`,
        method: 'POST',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('parseCustomTemplateKeys', () => {
    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const payload = {
        htmlBody: '<h1>Hello {{userName}}, welcome to {{companyName}}!</h1>',
        textBody: 'Hello {{userName}}, welcome to {{companyName}}!'
      }

      const result = await emailAPI.parseCustomTemplateKeys(appId, payload)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/customkeys`,
        method: 'POST',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template parsing failed', 400)

      const payload = { htmlBody: 'Invalid template {{' }
      const error = await emailAPI.parseCustomTemplateKeys(appId, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template parsing failed' },
        message: 'Template parsing failed',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/emailtemplate/customkeys`,
        method: 'POST',
        body: JSON.stringify(payload),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('installEmailTemplateFromMarketplace', () => {
    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const productId = 'marketplace-template-123'
      const data = {
        templateName: 'installed-template',
        category: 'marketing'
      }

      const result = await emailAPI.installEmailTemplateFromMarketplace(appId, productId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email-templates/install/${productId}`,
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Product not found in marketplace', 404)

      const productId = 'non-existent-product'
      const data = { templateName: 'test' }
      const error = await emailAPI.installEmailTemplateFromMarketplace(appId, productId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Product not found in marketplace' },
        message: 'Product not found in marketplace',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email-templates/install/${productId}`,
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('resetSystemEmailTemplate', () => {
    it('should make DELETE request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const eventId = 'user-registration'
      const result = await emailAPI.resetSystemEmailTemplate(appId, eventId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events/${eventId}`,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Event template reset not allowed', 403)

      const eventId = 'protected-event'
      const error = await emailAPI.resetSystemEmailTemplate(appId, eventId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Event template reset not allowed' },
        message: 'Event template reset not allowed',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/email/events/${eventId}`,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
