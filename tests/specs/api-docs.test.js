import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.apiDocs', () => {
  let apiClient
  let apiDocsAPI

  const appId = 'test-app-id'
  const successResult = { apiDoc: 'generated successfully' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    apiDocsAPI = apiClient.apiDocs
  })

  describe('generateDataTableApi', () => {
    it('should make POST request to generate data table API docs', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'Users'
      const options = {
        format: 'swagger',
        includeSchema: true,
        version: '1.0'
      }

      const result = await apiDocsAPI.generateDataTableApi(appId, tableName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/data/table/${tableName}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle table names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'User Profile Data'
      const options = { format: 'openapi' }

      const result = await apiDocsAPI.generateDataTableApi(appId, tableName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/data/table/User%20Profile%20Data`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty options', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'Products'
      const options = {}

      const result = await apiDocsAPI.generateDataTableApi(appId, tableName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/data/table/${tableName}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex options with multiple settings', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'Orders'
      const options = {
        format: 'swagger',
        includeSchema: true,
        includeExamples: true,
        apiVersion: '2.1',
        security: {
          apiKey: true,
          oauth: false
        },
        endpoints: ['create', 'read', 'update', 'delete'],
        pagination: {
          enabled: true,
          defaultPageSize: 25
        }
      }

      const result = await apiDocsAPI.generateDataTableApi(appId, tableName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/data/table/${tableName}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with table not found error', async () => {
      mockFailedAPIRequest('Table not found', 404)

      const tableName = 'NonexistentTable'
      const options = { format: 'swagger' }
      const error = await apiDocsAPI.generateDataTableApi(appId, tableName, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Table not found' },
        message: 'Table not found',
        status: 404
      })
    })

    it('fails when server responds with invalid format error', async () => {
      mockFailedAPIRequest('Unsupported API documentation format', 400)

      const tableName = 'Users'
      const options = { format: 'invalid-format' }
      const error = await apiDocsAPI.generateDataTableApi(appId, tableName, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unsupported API documentation format' },
        message: 'Unsupported API documentation format',
        status: 400
      })
    })
  })

  describe('generateMessagingChannelApi', () => {
    it('should make POST request to generate messaging channel API docs', async () => {
      mockSuccessAPIRequest(successResult)

      const channelName = 'chat-room'
      const options = {
        format: 'swagger',
        includeRealTime: true,
        includeHistory: false
      }

      const result = await apiDocsAPI.generateMessagingChannelApi(appId, channelName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/messaging/channel/${channelName}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle channel names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const channelName = 'user-notifications@prod'
      const options = { format: 'openapi' }

      const result = await apiDocsAPI.generateMessagingChannelApi(appId, channelName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/messaging/channel/${channelName}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle messaging options with subscription settings', async () => {
      mockSuccessAPIRequest(successResult)

      const channelName = 'live-updates'
      const options = {
        format: 'swagger',
        features: {
          publish: true,
          subscribe: true,
          history: true,
          presence: false
        },
        security: {
          authentication: 'required',
          authorization: 'channel-based'
        },
        messageTypes: ['text', 'binary', 'json']
      }

      const result = await apiDocsAPI.generateMessagingChannelApi(appId, channelName, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/messaging/channel/${channelName}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with channel not found error', async () => {
      mockFailedAPIRequest('Messaging channel not found', 404)

      const channelName = 'nonexistent-channel'
      const options = { format: 'swagger' }
      const error = await apiDocsAPI.generateMessagingChannelApi(appId, channelName, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Messaging channel not found' },
        message: 'Messaging channel not found',
        status: 404
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions for messaging API generation', 403)

      const channelName = 'restricted-channel'
      const options = { format: 'openapi' }
      const error = await apiDocsAPI.generateMessagingChannelApi(appId, channelName, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions for messaging API generation' },
        message: 'Insufficient permissions for messaging API generation',
        status: 403
      })
    })
  })

  describe('generateFilesApi', () => {
    it('should make POST request to generate files API docs', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        format: 'swagger',
        includeUpload: true,
        includeDownload: true,
        includeListing: false
      }

      const result = await apiDocsAPI.generateFilesApi(appId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/files`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive file operations options', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        format: 'openapi',
        operations: {
          upload: {
            enabled: true,
            maxFileSize: '50MB',
            allowedTypes: ['image/*', 'application/pdf', 'text/*']
          },
          download: {
            enabled: true,
            streaming: true,
            rangeRequests: true
          },
          listing: {
            enabled: true,
            pagination: true,
            filtering: true
          },
          metadata: {
            enabled: true,
            customProperties: true
          }
        },
        security: {
          authentication: 'required',
          filePermissions: true
        }
      }

      const result = await apiDocsAPI.generateFilesApi(appId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/files`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal options for files API', async () => {
      mockSuccessAPIRequest(successResult)

      const options = { format: 'swagger' }

      const result = await apiDocsAPI.generateFilesApi(appId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/files`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('File storage quota exceeded', 507)

      const options = { format: 'swagger', includeUpload: true }
      const error = await apiDocsAPI.generateFilesApi(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'File storage quota exceeded' },
        message: 'File storage quota exceeded',
        status: 507
      })
    })

    it('fails when server responds with invalid configuration error', async () => {
      mockFailedAPIRequest('Invalid files API configuration', 422)

      const options = { format: 'swagger', maxFileSize: 'invalid-size' }
      const error = await apiDocsAPI.generateFilesApi(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid files API configuration' },
        message: 'Invalid files API configuration',
        status: 422
      })
    })
  })

  describe('generateServiceApi', () => {
    it('should make POST request to generate service API docs', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'user-service'
      const model = 'UserModel'
      const options = {
        format: 'swagger',
        includeBusinessLogic: true,
        includeTimers: false
      }

      const result = await apiDocsAPI.generateServiceApi(appId, serviceId, model, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/services/${serviceId}/${model}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle service with complex model structure', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'order-processing-service'
      const model = 'OrderProcessingModel'
      const options = {
        format: 'openapi',
        features: {
          businessLogic: {
            enabled: true,
            includeEventHandlers: true,
            includeTimers: true
          },
          codeGeneration: {
            enabled: true,
            languages: ['javascript', 'java', 'swift']
          },
          testing: {
            includeExamples: true,
            includeMockData: true
          }
        },
        apiVersion: '3.0.1',
        metadata: {
          title: 'Order Processing API',
          description: 'Comprehensive order processing service',
          contact: 'api-team@example.com'
        }
      }

      const result = await apiDocsAPI.generateServiceApi(appId, serviceId, model, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/services/${serviceId}/${model}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle service names and models with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const serviceId = 'payment-gateway@v2'
      const model = 'PaymentModel-Advanced'
      const options = { format: 'swagger' }

      const result = await apiDocsAPI.generateServiceApi(appId, serviceId, model, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/services/${serviceId}/${model}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with service not found error', async () => {
      mockFailedAPIRequest('Service not found', 404)

      const serviceId = 'nonexistent-service'
      const model = 'SomeModel'
      const options = { format: 'swagger' }
      const error = await apiDocsAPI.generateServiceApi(appId, serviceId, model, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service not found' },
        message: 'Service not found',
        status: 404
      })
    })

    it('fails when server responds with model not found error', async () => {
      mockFailedAPIRequest('Model not found in service', 404)

      const serviceId = 'user-service'
      const model = 'NonexistentModel'
      const options = { format: 'openapi' }
      const error = await apiDocsAPI.generateServiceApi(appId, serviceId, model, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Model not found in service' },
        message: 'Model not found in service',
        status: 404
      })
    })

    it('fails when server responds with service compilation error', async () => {
      mockFailedAPIRequest('Service compilation failed', 422)

      const serviceId = 'broken-service'
      const model = 'BrokenModel'
      const options = { format: 'swagger', includeBusinessLogic: true }
      const error = await apiDocsAPI.generateServiceApi(appId, serviceId, model, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service compilation failed' },
        message: 'Service compilation failed',
        status: 422
      })
    })
  })

  describe('generateGeoApi', () => {
    it('should make POST request to generate geo API docs', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        format: 'swagger',
        includeSearch: true,
        includeClustering: false,
        includeGeofencing: true
      }

      const result = await apiDocsAPI.generateGeoApi(appId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/geo`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive geo API options', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        format: 'openapi',
        features: {
          search: {
            enabled: true,
            radius: true,
            rectangular: true,
            polygon: true
          },
          clustering: {
            enabled: true,
            algorithms: ['k-means', 'dbscan']
          },
          geofencing: {
            enabled: true,
            shapes: ['circle', 'rectangle', 'polygon'],
            monitoring: true
          },
          categories: {
            enabled: true,
            customCategories: true
          },
          metadata: {
            enabled: true,
            customProperties: true
          }
        },
        coordinateSystems: ['WGS84', 'UTM'],
        units: ['meters', 'kilometers', 'miles'],
        apiVersion: '2.0'
      }

      const result = await apiDocsAPI.generateGeoApi(appId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/geo`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal geo options', async () => {
      mockSuccessAPIRequest(successResult)

      const options = { format: 'swagger' }

      const result = await apiDocsAPI.generateGeoApi(appId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/api-docs/geo`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with geo service not available error', async () => {
      mockFailedAPIRequest('Geo service not available for this plan', 403)

      const options = { format: 'swagger', includeSearch: true }
      const error = await apiDocsAPI.generateGeoApi(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Geo service not available for this plan' },
        message: 'Geo service not available for this plan',
        status: 403
      })
    })

    it('fails when server responds with invalid geo configuration error', async () => {
      mockFailedAPIRequest('Invalid geo API configuration', 400)

      const options = { format: 'swagger', coordinateSystem: 'invalid' }
      const error = await apiDocsAPI.generateGeoApi(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid geo API configuration' },
        message: 'Invalid geo API configuration',
        status: 400
      })
    })

    it('fails when server responds with geo service timeout error', async () => {
      mockFailedAPIRequest('Geo API generation timeout', 408)

      const options = { format: 'openapi', includeAllFeatures: true }
      const error = await apiDocsAPI.generateGeoApi(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Geo API generation timeout' },
        message: 'Geo API generation timeout',
        status: 408
      })
    })
  })
})