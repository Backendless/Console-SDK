describe('apiClient.frExtensions', () => {
  let apiClient
  let frExtensionsAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    frExtensionsAPI = apiClient.frExtensions
  })

  describe('getAllIntegrationConnections', () => {
    it('should make GET request to get all integration connections', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await frExtensionsAPI.getAllIntegrationConnections(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connections`,
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

      const error = await frExtensionsAPI.getAllIntegrationConnections(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await frExtensionsAPI.getAllIntegrationConnections(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })
    })
  })

  describe('getIntegrationConnectionAccessToken', () => {
    it('should make GET request to get integration connection access token', async () => {
      mockSuccessAPIRequest(successResult)

      const connectionId = 'connection-123'
      const result = await frExtensionsAPI.getIntegrationConnectionAccessToken(appId, connectionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connection/${connectionId}/token`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID connection IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const connectionId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await frExtensionsAPI.getIntegrationConnectionAccessToken(appId, connectionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connection/${connectionId}/token`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Connection not found', 404)

      const connectionId = 'nonexistent-connection'
      const error = await frExtensionsAPI.getIntegrationConnectionAccessToken(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection not found' },
        message: 'Connection not found',
        status: 404
      })
    })

    it('fails when server responds with expired token error', async () => {
      mockFailedAPIRequest('Access token expired', 401)

      const connectionId = 'expired-connection'
      const error = await frExtensionsAPI.getIntegrationConnectionAccessToken(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access token expired' },
        message: 'Access token expired',
        status: 401
      })
    })
  })

  describe('deleteIntegrationConnectionById', () => {
    it('should make DELETE request to delete integration connection', async () => {
      mockSuccessAPIRequest(successResult)

      const connectionId = 'connection-456'
      const result = await frExtensionsAPI.deleteIntegrationConnectionById(appId, connectionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connections/${connectionId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex connection IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const connectionId = 'oauth-google-connection-2024'
      const result = await frExtensionsAPI.deleteIntegrationConnectionById(appId, connectionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connections/${connectionId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Connection not found', 404)

      const connectionId = 'nonexistent-connection'
      const error = await frExtensionsAPI.deleteIntegrationConnectionById(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection not found' },
        message: 'Connection not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Cannot delete system connection', 403)

      const connectionId = 'system-connection'
      const error = await frExtensionsAPI.deleteIntegrationConnectionById(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete system connection' },
        message: 'Cannot delete system connection',
        status: 403
      })
    })
  })

  describe('updateIntegrationConnectionName', () => {
    it('should make PUT request to update integration connection name', async () => {
      mockSuccessAPIRequest(successResult)

      const connectionId = 'connection-789'
      const updatedName = 'Updated Connection Name'

      const result = await frExtensionsAPI.updateIntegrationConnectionName(appId, connectionId, updatedName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connections/${connectionId}/name`,
        body: JSON.stringify({ updatedName }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const connectionId = 'slack-connection'
      const updatedName = 'Slack Integration (Production) - 2024'

      const result = await frExtensionsAPI.updateIntegrationConnectionName(appId, connectionId, updatedName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connections/${connectionId}/name`,
        body: JSON.stringify({ updatedName }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Connection name cannot be empty', 400)

      const connectionId = 'connection-123'
      const updatedName = ''
      const error = await frExtensionsAPI.updateIntegrationConnectionName(appId, connectionId, updatedName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection name cannot be empty' },
        message: 'Connection name cannot be empty',
        status: 400
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Connection name already exists', 409)

      const connectionId = 'connection-123'
      const updatedName = 'Existing Connection Name'
      const error = await frExtensionsAPI.updateIntegrationConnectionName(appId, connectionId, updatedName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection name already exists' },
        message: 'Connection name already exists',
        status: 409
      })
    })
  })

  describe('getConnectionsUsages', () => {
    it('should make GET request to get connections usages', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await frExtensionsAPI.getConnectionsUsages(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connections/usages`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with internal server error', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const error = await frExtensionsAPI.getConnectionsUsages(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Internal server error' },
        message: 'Internal server error',
        status: 500
      })
    })

    it('fails when server responds with timeout error', async () => {
      mockFailedAPIRequest('Request timeout', 408)

      const error = await frExtensionsAPI.getConnectionsUsages(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Request timeout' },
        message: 'Request timeout',
        status: 408
      })
    })
  })

  describe('getConnectionURL', () => {
    it('should make GET request to get connection URL', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        appId: appId,
        serviceName: 'google-oauth',
        serviceId: 'service-123'
      }

      const result = await frExtensionsAPI.getConnectionURL(params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connection/oauth/url?serviceName=${params.serviceName}&serviceId=${params.serviceId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle OAuth service configurations', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        appId: appId,
        serviceName: 'facebook-login',
        serviceId: 'fb-service-456'
      }

      const result = await frExtensionsAPI.getConnectionURL(params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connection/oauth/url?serviceName=${params.serviceName}&serviceId=${params.serviceId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle Slack service configurations', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        appId: appId,
        serviceName: 'slack-webhook',
        serviceId: 'slack-789'
      }

      const result = await frExtensionsAPI.getConnectionURL(params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/connection/oauth/url?serviceName=${params.serviceName}&serviceId=${params.serviceId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with invalid service error', async () => {
      mockFailedAPIRequest('Invalid service configuration', 400)

      const params = {
        appId: appId,
        serviceName: 'invalid-service',
        serviceId: 'invalid-id'
      }
      const error = await frExtensionsAPI.getConnectionURL(params).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid service configuration' },
        message: 'Invalid service configuration',
        status: 400
      })
    })
  })

  describe('getSharedElements', () => {
    it('should make GET request to get shared elements', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await frExtensionsAPI.getSharedElements()

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/api/node-server/manage/integration/shared/elements',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with maintenance error', async () => {
      mockFailedAPIRequest('Service under maintenance', 503)

      const error = await frExtensionsAPI.getSharedElements().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service under maintenance' },
        message: 'Service under maintenance',
        status: 503
      })
    })

    it('fails when server responds with network error', async () => {
      mockFailedAPIRequest('Network error', 502)

      const error = await frExtensionsAPI.getSharedElements().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Network error' },
        message: 'No connection with server',
        status: 502,
        code: undefined,
        headers: undefined
      })
    })
  })

  describe('getElementParamDictionary', () => {
    it('should make POST request to get element param dictionary', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'google-sheets'
      const dictionaryName = 'spreadsheet-list'
      const payload = { connectionId: 'conn-123', filters: { active: true } }

      const result = await frExtensionsAPI.getElementParamDictionary(appId, serviceName, dictionaryName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/param-dictionary/${dictionaryName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle Slack service dictionaries', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'slack'
      const dictionaryName = 'channels-list'
      const payload = { connectionId: 'slack-conn-456', teamId: 'T1234567' }

      const result = await frExtensionsAPI.getElementParamDictionary(appId, serviceName, dictionaryName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/param-dictionary/${dictionaryName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty payload', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'salesforce'
      const dictionaryName = 'objects-list'
      const payload = {}

      const result = await frExtensionsAPI.getElementParamDictionary(appId, serviceName, dictionaryName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/param-dictionary/${dictionaryName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with authentication error', async () => {
      mockFailedAPIRequest('Authentication failed for service', 401)

      const serviceName = 'google-drive'
      const dictionaryName = 'folders-list'
      const payload = { connectionId: 'invalid-conn' }
      const error = await frExtensionsAPI.getElementParamDictionary(appId, serviceName, dictionaryName, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Authentication failed for service' },
        message: 'Authentication failed for service',
        status: 401
      })
    })
  })

  describe('getElementParamSchema', () => {
    it('should make POST request to get element param schema', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'mailchimp'
      const schemaLoaderName = 'campaign-schema'
      const payload = { connectionId: 'mc-conn-789', listId: 'list-123' }

      const result = await frExtensionsAPI.getElementParamSchema(appId, serviceName, schemaLoaderName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/param-schema/${schemaLoaderName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle Zapier service schemas', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'zapier'
      const schemaLoaderName = 'webhook-schema'
      const payload = { webhookUrl: 'https://hooks.zapier.com/hooks/catch/123/abc' }

      const result = await frExtensionsAPI.getElementParamSchema(appId, serviceName, schemaLoaderName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/param-schema/${schemaLoaderName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex schema configurations', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'hubspot'
      const schemaLoaderName = 'contact-properties'
      const payload = {
        connectionId: 'hubspot-conn-101',
        objectType: 'contact',
        includeCustomProperties: true,
        propertyGroups: ['contactinformation', 'emailinformation']
      }

      const result = await frExtensionsAPI.getElementParamSchema(appId, serviceName, schemaLoaderName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/param-schema/${schemaLoaderName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with schema not found error', async () => {
      mockFailedAPIRequest('Schema loader not found', 404)

      const serviceName = 'unknown-service'
      const schemaLoaderName = 'nonexistent-schema'
      const payload = {}
      const error = await frExtensionsAPI.getElementParamSchema(appId, serviceName, schemaLoaderName, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Schema loader not found' },
        message: 'Schema loader not found',
        status: 404
      })
    })
  })

  describe('getElementSampleResult', () => {
    it('should make POST request to get element sample result', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'twitter'
      const schemaLoaderName = 'tweet-sample'
      const payload = { connectionId: 'twitter-conn-202', tweetType: 'timeline' }

      const result = await frExtensionsAPI.getElementSampleResult(appId, serviceName, schemaLoaderName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/sample-result/${schemaLoaderName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle GitHub service samples', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'github'
      const schemaLoaderName = 'repository-sample'
      const payload = { connectionId: 'github-conn-303', owner: 'octocat', repo: 'Hello-World' }

      const result = await frExtensionsAPI.getElementSampleResult(appId, serviceName, schemaLoaderName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/sample-result/${schemaLoaderName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle API samples with authentication', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceName = 'stripe'
      const schemaLoaderName = 'payment-sample'
      const payload = {
        connectionId: 'stripe-conn-404',
        endpoint: 'payments',
        filters: { limit: 5, status: 'succeeded' }
      }

      const result = await frExtensionsAPI.getElementSampleResult(appId, serviceName, schemaLoaderName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/block/${serviceName}/sample-result/${schemaLoaderName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with rate limit error', async () => {
      mockFailedAPIRequest('Rate limit exceeded', 429)

      const serviceName = 'instagram'
      const schemaLoaderName = 'media-sample'
      const payload = { connectionId: 'ig-conn-505' }
      const error = await frExtensionsAPI.getElementSampleResult(appId, serviceName, schemaLoaderName, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Rate limit exceeded' },
        message: 'Rate limit exceeded',
        status: 429
      })
    })
  })

  describe('getSharedProductStatus', () => {
    it('should make GET request to get shared product status', async () => {
      mockSuccessAPIRequest(successResult)

      const productId = 'product-606'
      const result = await frExtensionsAPI.getSharedProductStatus(productId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/integration/shared/product/${productId}/status`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID product IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const productId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await frExtensionsAPI.getSharedProductStatus(productId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/integration/shared/product/${productId}/status`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with product not found error', async () => {
      mockFailedAPIRequest('Product not found', 404)

      const productId = 'nonexistent-product'
      const error = await frExtensionsAPI.getSharedProductStatus(productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Product not found' },
        message: 'Product not found',
        status: 404
      })
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to product', 403)

      const productId = 'restricted-product'
      const error = await frExtensionsAPI.getSharedProductStatus(productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to product' },
        message: 'Access denied to product',
        status: 403
      })
    })
  })

  describe('installSharedProduct', () => {
    it('should make POST request to install shared product', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        productId: 'product-707',
        versionId: 'v1.2.3',
        configs: { apiKey: 'test-key', endpoint: 'https://api.example.com' }
      }

      const result = await frExtensionsAPI.installSharedProduct(params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/integration/shared/product/${params.productId}/install`,
        body: JSON.stringify({ versionId: params.versionId, configs: params.configs }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle installation with minimal configs', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        productId: 'simple-product-808',
        versionId: 'latest',
        configs: {}
      }

      const result = await frExtensionsAPI.installSharedProduct(params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/integration/shared/product/${params.productId}/install`,
        body: JSON.stringify({ versionId: params.versionId, configs: params.configs }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex installation configurations', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        productId: 'advanced-product-909',
        versionId: '2.1.0-beta',
        configs: {
          authentication: {
            type: 'oauth2',
            clientId: 'client-123',
            clientSecret: 'secret-456'
          },
          features: {
            enableWebhooks: true,
            retryAttempts: 3,
            timeout: 30000
          },
          endpoints: {
            primary: 'https://primary.api.com',
            fallback: 'https://backup.api.com'
          }
        }
      }

      const result = await frExtensionsAPI.installSharedProduct(params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/integration/shared/product/${params.productId}/install`,
        body: JSON.stringify({ versionId: params.versionId, configs: params.configs }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with installation error', async () => {
      mockFailedAPIRequest('Product installation failed', 422)

      const params = {
        productId: 'failing-product',
        versionId: 'v1.0.0',
        configs: { invalidConfig: true }
      }
      const error = await frExtensionsAPI.installSharedProduct(params).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Product installation failed' },
        message: 'Product installation failed',
        status: 422
      })
    })

    it('fails when server responds with version not found error', async () => {
      mockFailedAPIRequest('Product version not found', 404)

      const params = {
        productId: 'valid-product',
        versionId: 'v99.99.99',
        configs: {}
      }
      const error = await frExtensionsAPI.installSharedProduct(params).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Product version not found' },
        message: 'Product version not found',
        status: 404
      })
    })
  })

  describe('loadSharedAppConfigs', () => {
    it('should make GET request to load shared app configs', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'service-1010'
      const result = await frExtensionsAPI.loadSharedAppConfigs(appId, serviceId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/service/${encodeURIComponent(serviceId)}/app-configs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle service IDs with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'google-cloud-storage@v2.0'
      const result = await frExtensionsAPI.loadSharedAppConfigs(appId, serviceId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/service/${encodeURIComponent(serviceId)}/app-configs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID service IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await frExtensionsAPI.loadSharedAppConfigs(appId, serviceId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/service/${encodeURIComponent(serviceId)}/app-configs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with service not found error', async () => {
      mockFailedAPIRequest('Service not found', 404)

      const serviceId = 'nonexistent-service'
      const error = await frExtensionsAPI.loadSharedAppConfigs(appId, serviceId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service not found' },
        message: 'Service not found',
        status: 404
      })
    })
  })

  describe('saveSharedAppConfigs', () => {
    it('should make PUT request to save shared app configs', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'service-1111'
      const configs = {
        apiKey: 'updated-api-key',
        environment: 'production',
        features: { logging: true, caching: false }
      }

      const result = await frExtensionsAPI.saveSharedAppConfigs(appId, serviceId, configs)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/service/${encodeURIComponent(serviceId)}/app-configs`,
        body: JSON.stringify(configs),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle service IDs with special characters in save', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'aws-lambda@v1.5.2'
      const configs = {
        region: 'us-east-1',
        runtime: 'nodejs18.x',
        timeout: 30
      }

      const result = await frExtensionsAPI.saveSharedAppConfigs(appId, serviceId, configs)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/service/${encodeURIComponent(serviceId)}/app-configs`,
        body: JSON.stringify(configs),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty configs', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'minimal-service'
      const configs = {}

      const result = await frExtensionsAPI.saveSharedAppConfigs(appId, serviceId, configs)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/service/${encodeURIComponent(serviceId)}/app-configs`,
        body: JSON.stringify(configs),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid configuration format', 400)

      const serviceId = 'strict-service'
      const configs = { invalidKey: 'invalid-value' }
      const error = await frExtensionsAPI.saveSharedAppConfigs(appId, serviceId, configs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid configuration format' },
        message: 'Invalid configuration format',
        status: 400
      })
    })

    it('fails when server responds with permission error', async () => {
      mockFailedAPIRequest('Insufficient permissions to modify configs', 403)

      const serviceId = 'readonly-service'
      const configs = { readOnlyKey: 'new-value' }
      const error = await frExtensionsAPI.saveSharedAppConfigs(appId, serviceId, configs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to modify configs' },
        message: 'Insufficient permissions to modify configs',
        status: 403
      })
    })
  })
})
