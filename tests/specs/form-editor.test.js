describe('apiClient.formEditor', () => {
  let apiClient
  let formEditorAPI

  const appId = 'test-app-id'
  const successResult = { forms: [] }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    formEditorAPI = apiClient.formEditor
  })

  describe('getForms', () => {
    it('should make GET request to get forms', async () => {
      const formsResult = {
        forms: [
          { id: 'form-1', name: 'Contact Form', status: 'active' },
          { id: 'form-2', name: 'Survey Form', status: 'draft' }
        ]
      }
      mockSuccessAPIRequest(formsResult)

      const result = await formEditorAPI.getForms(appId)

      expect(result).toEqual(formsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty forms list', async () => {
      mockSuccessAPIRequest({ forms: [] })

      const result = await formEditorAPI.getForms(appId)

      expect(result).toEqual({ forms: [] })
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await formEditorAPI.getForms(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Access denied to form editor', 403)

      const error = await formEditorAPI.getForms(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to form editor' },
        message: 'Access denied to form editor',
        status: 403
      })
    })
  })

  describe('createForm', () => {
    it('should make POST request to create form', async () => {
      const formResult = {
        id: 'form-123',
        name: 'New Contact Form',
        status: 'draft'
      }
      mockSuccessAPIRequest(formResult)

      const formSource = {
        name: 'New Contact Form',
        description: 'A simple contact form',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', required: true },
          { id: 'email', type: 'email', label: 'Email Address', required: true },
          { id: 'message', type: 'textarea', label: 'Message', required: false }
        ],
        settings: {
          submitAction: 'email',
          submitTo: 'contact@example.com',
          confirmationMessage: 'Thank you for your submission!'
        }
      }

      const appSettings = {
        theme: 'default',
        branding: {
          showLogo: true,
          logoUrl: 'https://example.com/logo.png'
        },
        notifications: {
          email: true,
          sms: false
        }
      }

      const result = await formEditorAPI.createForm(appId, formSource, appSettings)

      expect(result).toEqual(formResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form`,
        body: JSON.stringify({ formSource, appSettings }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal form creation', async () => {
      const formResult = { id: 'form-456', name: 'Simple Form' }
      mockSuccessAPIRequest(formResult)

      const formSource = {
        name: 'Simple Form',
        fields: [
          { id: 'name', type: 'text', label: 'Name' }
        ]
      }

      const appSettings = { theme: 'default' }

      const result = await formEditorAPI.createForm(appId, formSource, appSettings)

      expect(result).toEqual(formResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form`,
        body: JSON.stringify({ formSource, appSettings }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex form with advanced fields', async () => {
      const formResult = { id: 'form-789', name: 'Advanced Survey' }
      mockSuccessAPIRequest(formResult)

      const formSource = {
        name: 'Advanced Survey',
        description: 'Customer satisfaction survey',
        fields: [
          {
            id: 'rating',
            type: 'rating',
            label: 'Overall Satisfaction',
            required: true,
            options: { max: 5, style: 'stars' }
          },
          {
            id: 'category',
            type: 'select',
            label: 'Product Category',
            required: true,
            options: {
              values: ['electronics', 'clothing', 'books', 'home'],
              multiple: false
            }
          },
          {
            id: 'features',
            type: 'checkbox',
            label: 'Preferred Features',
            required: false,
            options: {
              values: [
                { id: 'fast-delivery', label: 'Fast Delivery' },
                { id: 'easy-returns', label: 'Easy Returns' },
                { id: 'customer-support', label: 'Customer Support' }
              ]
            }
          },
          {
            id: 'upload',
            type: 'file',
            label: 'Upload Receipt',
            required: false,
            options: {
              allowedTypes: ['image/*', 'application/pdf'],
              maxSize: '5MB'
            }
          }
        ],
        logic: {
          conditionalFields: [
            {
              condition: 'rating < 3',
              showFields: ['improvement-suggestions']
            }
          ],
          validation: {
            customRules: ['email-domain-whitelist']
          }
        },
        styling: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d'
          },
          layout: 'vertical'
        }
      }

      const appSettings = {
        theme: 'custom',
        integrations: {
          googleAnalytics: 'GA-123456789',
          zapier: { webhookUrl: 'https://hooks.zapier.com/...' }
        },
        security: {
          captcha: true,
          ipRestrictions: ['192.168.1.0/24']
        }
      }

      const result = await formEditorAPI.createForm(appId, formSource, appSettings)

      expect(result).toEqual(formResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form`,
        body: JSON.stringify({ formSource, appSettings }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Form validation failed', 400)

      const formSource = { name: '' } // Invalid empty name
      const appSettings = {}
      const error = await formEditorAPI.createForm(appId, formSource, appSettings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form validation failed' },
        message: 'Form validation failed',
        status: 400
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('Form creation quota exceeded', 429)

      const formSource = { name: 'Test Form' }
      const appSettings = {}
      const error = await formEditorAPI.createForm(appId, formSource, appSettings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form creation quota exceeded' },
        message: 'Form creation quota exceeded',
        status: 429
      })
    })
  })

  describe('updateForm', () => {
    it('should make PUT request to update form', async () => {
      const updatedFormResult = {
        id: 'form-123',
        name: 'Updated Contact Form',
        status: 'active'
      }
      mockSuccessAPIRequest(updatedFormResult)

      const formSource = {
        id: 'form-123',
        name: 'Updated Contact Form',
        description: 'An updated contact form with new fields',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', required: true },
          { id: 'email', type: 'email', label: 'Email Address', required: true },
          { id: 'phone', type: 'tel', label: 'Phone Number', required: false },
          { id: 'message', type: 'textarea', label: 'Message', required: true }
        ],
        settings: {
          submitAction: 'database',
          tableName: 'ContactSubmissions',
          confirmationMessage: 'Thank you! We will contact you soon.'
        }
      }

      const result = await formEditorAPI.updateForm(appId, formSource)

      expect(result).toEqual(updatedFormResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form/${formSource.id}`,
        body: JSON.stringify({ formSource }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial form updates', async () => {
      const updatedFormResult = { id: 'form-456', status: 'published' }
      mockSuccessAPIRequest(updatedFormResult)

      const formSource = {
        id: 'form-456',
        status: 'published'
      }

      const result = await formEditorAPI.updateForm(appId, formSource)

      expect(result).toEqual(updatedFormResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form/${formSource.id}`,
        body: JSON.stringify({ formSource }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID form IDs', async () => {
      const updatedFormResult = { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }
      mockSuccessAPIRequest(updatedFormResult)

      const formSource = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Updated UUID Form'
      }

      const result = await formEditorAPI.updateForm(appId, formSource)

      expect(result).toEqual(updatedFormResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form/${formSource.id}`,
        body: JSON.stringify({ formSource }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with form not found error', async () => {
      mockFailedAPIRequest('Form not found', 404)

      const formSource = { id: 'nonexistent-form', name: 'Test' }
      const error = await formEditorAPI.updateForm(appId, formSource).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form not found' },
        message: 'Form not found',
        status: 404
      })
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid form data', 422)

      const formSource = { id: 'form-123', fields: 'invalid-fields' }
      const error = await formEditorAPI.updateForm(appId, formSource).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid form data' },
        message: 'Invalid form data',
        status: 422
      })
    })
  })

  describe('deleteForm', () => {
    it('should make DELETE request to delete form', async () => {
      const deleteResult = { success: true, message: 'Form deleted successfully' }
      mockSuccessAPIRequest(deleteResult)

      const formSource = {
        id: 'form-to-delete-123',
        name: 'Old Contact Form'
      }

      const result = await formEditorAPI.deleteForm(appId, formSource)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form/${formSource.id}`,
        body: JSON.stringify({ formSource }),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID form IDs for deletion', async () => {
      const deleteResult = { success: true }
      mockSuccessAPIRequest(deleteResult)

      const formSource = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Form to Delete'
      }

      const result = await formEditorAPI.deleteForm(appId, formSource)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form/${formSource.id}`,
        body: JSON.stringify({ formSource }),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle form with minimal data for deletion', async () => {
      const deleteResult = { deleted: true }
      mockSuccessAPIRequest(deleteResult)

      const formSource = { id: 'simple-form-id' }

      const result = await formEditorAPI.deleteForm(appId, formSource)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/form-editor/form/${formSource.id}`,
        body: JSON.stringify({ formSource }),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with form not found error', async () => {
      mockFailedAPIRequest('Form not found', 404)

      const formSource = { id: 'nonexistent-form' }
      const error = await formEditorAPI.deleteForm(appId, formSource).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form not found' },
        message: 'Form not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Cannot delete published form', 403)

      const formSource = { id: 'published-form-123', status: 'published' }
      const error = await formEditorAPI.deleteForm(appId, formSource).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete published form' },
        message: 'Cannot delete published form',
        status: 403
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Form has active submissions', 409)

      const formSource = { id: 'active-form-456' }
      const error = await formEditorAPI.deleteForm(appId, formSource).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form has active submissions' },
        message: 'Form has active submissions',
        status: 409
      })
    })
  })

  describe('launchForm', () => {
    it('should make GET request to launch form', async () => {
      const launchResult = {
        url: 'https://forms.backendless.com/form/123/view',
        embed: {
          iframe: '<iframe src="..."></iframe>',
          script: '<script>...</script>'
        }
      }
      mockSuccessAPIRequest(launchResult)

      const formId = 'form-launch-123'
      const result = await formEditorAPI.launchForm(appId, formId)

      expect(result).toEqual(launchResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/form-editor/${formId}/view`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID form IDs for launch', async () => {
      const launchResult = { url: 'https://forms.backendless.com/form/uuid/view' }
      mockSuccessAPIRequest(launchResult)

      const formId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await formEditorAPI.launchForm(appId, formId)

      expect(result).toEqual(launchResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/form-editor/${formId}/view`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle form launch with complex response data', async () => {
      const launchResult = {
        url: 'https://forms.backendless.com/form/advanced-form/view',
        config: {
          theme: 'dark',
          responsive: true,
          analytics: true
        },
        embed: {
          iframe: {
            src: 'https://forms.backendless.com/embed/form/advanced-form',
            width: '100%',
            height: '600px',
            frameborder: '0'
          },
          popup: {
            trigger: 'button',
            size: { width: '800px', height: '600px' }
          },
          inline: {
            containerId: 'form-container',
            autoResize: true
          }
        },
        sharing: {
          directLink: 'https://forms.backendless.com/form/advanced-form/view',
          qrCode: 'data:image/png;base64,...',
          socialMedia: {
            facebook: 'https://facebook.com/share?url=...',
            twitter: 'https://twitter.com/share?url=...'
          }
        }
      }
      mockSuccessAPIRequest(launchResult)

      const formId = 'advanced-form'
      const result = await formEditorAPI.launchForm(appId, formId)

      expect(result).toEqual(launchResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/form-editor/${formId}/view`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with form not found error', async () => {
      mockFailedAPIRequest('Form not found', 404)

      const formId = 'nonexistent-form'
      const error = await formEditorAPI.launchForm(appId, formId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form not found' },
        message: 'Form not found',
        status: 404
      })
    })

    it('fails when server responds with form not published error', async () => {
      mockFailedAPIRequest('Form is not published', 400)

      const formId = 'draft-form'
      const error = await formEditorAPI.launchForm(appId, formId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Form is not published' },
        message: 'Form is not published',
        status: 400
      })
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to form', 403)

      const formId = 'private-form'
      const error = await formEditorAPI.launchForm(appId, formId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to form' },
        message: 'Access denied to form',
        status: 403
      })
    })
  })
})
