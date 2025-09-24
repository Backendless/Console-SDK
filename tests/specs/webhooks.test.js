describe('apiClient.webhooks', () => {
  let apiClient
  let webhooksAPI

  const appId = 'test-app-id'
  const webhookId = 'test-webhook-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    webhooksAPI = apiClient.webhooks
  })

  describe('getWebhooks()', () => {
    it('makes a GET request to retrieve webhooks for the app', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await webhooksAPI.getWebhooks(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook`,
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error on failed request', async () => {
      const errorMessage = 'Failed to fetch webhooks'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await webhooksAPI.getWebhooks(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 500,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook`,
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })
  })

  describe('getWebhookOperations()', () => {
    it('makes a GET request to retrieve webhook operations for the app', async () => {
      const operations = ['CREATE', 'UPDATE', 'DELETE', 'FIND']
      mockSuccessAPIRequest(operations)

      const result = await webhooksAPI.getWebhookOperations(appId)

      expect(result).toEqual(operations)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/operations`,
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error on failed request', async () => {
      const errorMessage = 'Failed to fetch webhook operations'
      mockFailedAPIRequest(errorMessage, 404)

      const error = await webhooksAPI.getWebhookOperations(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 404,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/operations`,
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })
  })

  describe('saveWebhook()', () => {
    it('makes a POST request to create a new webhook', async () => {
      const configData = {
        name      : 'Test Webhook',
        url       : 'https://example.com/webhook',
        operations: ['CREATE', 'UPDATE'],
        table     : 'Users',
        enabled   : true
      }

      const createdWebhook = {
        id        : 'new-webhook-id',
        ...configData,
        createdAt : Date.now(),
        updatedAt : Date.now()
      }

      mockSuccessAPIRequest(createdWebhook, 201)

      const result = await webhooksAPI.saveWebhook(appId, configData)

      expect(result).toEqual(createdWebhook)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook`,
        method         : 'POST',
        body           : JSON.stringify(configData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('makes a POST request with minimal configuration', async () => {
      const minimalConfig = {
        name: 'Minimal Webhook',
        url : 'https://example.com/minimal'
      }

      mockSuccessAPIRequest(successResult)

      const result = await webhooksAPI.saveWebhook(appId, minimalConfig)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook`,
        method         : 'POST',
        body           : JSON.stringify(minimalConfig),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error when validation fails', async () => {
      const invalidConfig = { name: 'Invalid' }
      const errorMessage = 'Webhook URL is required'
      mockFailedAPIRequest(errorMessage, 400)

      const error = await webhooksAPI.saveWebhook(appId, invalidConfig).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 400,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook`,
        method         : 'POST',
        body           : JSON.stringify(invalidConfig),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error on server failure', async () => {
      const configData = { name: 'Test', url: 'https://example.com' }
      const errorMessage = 'Internal server error'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await webhooksAPI.saveWebhook(appId, configData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 500,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook`,
        method         : 'POST',
        body           : JSON.stringify(configData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })
  })

  describe('updateWebhook()', () => {
    it('makes a PUT request to update an existing webhook', async () => {
      const updateData = {
        name      : 'Updated Webhook',
        url       : 'https://example.com/updated',
        operations: ['DELETE'],
        enabled   : false
      }

      const updatedWebhook = {
        id        : webhookId,
        ...updateData,
        updatedAt : Date.now()
      }

      mockSuccessAPIRequest(updatedWebhook)

      const result = await webhooksAPI.updateWebhook(appId, webhookId, updateData)

      expect(result).toEqual(updatedWebhook)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'PUT',
        body           : JSON.stringify(updateData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('makes a PUT request to partially update a webhook', async () => {
      const partialUpdate = {
        enabled: true
      }

      mockSuccessAPIRequest(successResult)

      const result = await webhooksAPI.updateWebhook(appId, webhookId, partialUpdate)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'PUT',
        body           : JSON.stringify(partialUpdate),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error when webhook not found', async () => {
      const updateData = { name: 'Updated' }
      const errorMessage = 'Webhook not found'
      mockFailedAPIRequest(errorMessage, 404)

      const error = await webhooksAPI.updateWebhook(appId, webhookId, updateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 404,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'PUT',
        body           : JSON.stringify(updateData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error on validation failure', async () => {
      const invalidUpdate = { url: 'invalid-url' }
      const errorMessage = 'Invalid webhook URL format'
      mockFailedAPIRequest(errorMessage, 422)

      const error = await webhooksAPI.updateWebhook(appId, webhookId, invalidUpdate).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 422,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'PUT',
        body           : JSON.stringify(invalidUpdate),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteWebhook()', () => {
    it('makes a DELETE request to remove a webhook', async () => {
      const deleteResult = { deleted: true, webhookId }
      mockSuccessAPIRequest(deleteResult)

      const result = await webhooksAPI.deleteWebhook(appId, webhookId)

      expect(result).toEqual(deleteResult)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('makes a DELETE request with successful 204 response', async () => {
      mockSuccessAPIRequest(undefined, 204)

      const result = await webhooksAPI.deleteWebhook(appId, webhookId)

      expect(result).toBeUndefined()

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error when webhook not found', async () => {
      const errorMessage = 'Webhook not found'
      mockFailedAPIRequest(errorMessage, 404)

      const error = await webhooksAPI.deleteWebhook(appId, webhookId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 404,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error when deletion is forbidden', async () => {
      const errorMessage = 'Cannot delete system webhook'
      mockFailedAPIRequest(errorMessage, 403)

      const error = await webhooksAPI.deleteWebhook(appId, webhookId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 403,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('throws an error on server failure', async () => {
      const errorMessage = 'Internal server error'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await webhooksAPI.deleteWebhook(appId, webhookId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: errorMessage },
        message: errorMessage,
        status : 500,
      })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/webhook/${webhookId}`,
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })
  })
})