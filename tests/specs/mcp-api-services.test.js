describe('apiClient.mcpApiServices', () => {
  let apiClient
  let mcpApiServicesAPI

  const appId = 'test-app-id'
  const serviceVersionId = 'test-service-version-id'

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    mcpApiServicesAPI = apiClient.mcpApiServices
  })

  describe('getMcpApiServices', () => {
    it('should make a GET request to retrieve a list of MCP API services', async () => {
      const servicesResult = [
        {
          serviceInfo: {
            serviceId: 'test-service-id-1',
            serviceName: 'TestService1',
            model: 'Test Service 1',
            lang: 'JS',
            mode: 'PRODUCTION',
            mcpURL: 'http://test-host:3000/test-app-id/test-service-1/mcp',
            logo: '/test-icon-1.svg',
            hostingProvider: 'API_SERVICE'
          },
          elements: [
            {
              id: 'test-element-id-1',
              name: 'testMethod1',
              description: 'Test method 1 description',
              params: [
                {
                  name: 'param1',
                  type: 'STRING',
                  description: 'Test parameter 1',
                  required: true
                }
              ]
            }
          ]
        }
      ]

      mockSuccessAPIRequest(servicesResult)

      const result = await mcpApiServicesAPI.getMcpApiServices(appId)

      expect(result).toEqual(servicesResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/mcp/list`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle an empty services list', async () => {
      const emptyResult = []
      mockSuccessAPIRequest(emptyResult)

      const result = await mcpApiServicesAPI.getMcpApiServices(appId)

      expect(result).toEqual(emptyResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/mcp/list`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle multiple MCP API services with different modes', async () => {
      const servicesResult = [
        {
          serviceInfo: {
            serviceId: 'test-service-id-1',
            serviceName: 'ProductionService',
            model: 'Production Service',
            lang: 'JS',
            mode: 'PRODUCTION',
            mcpURL: 'http://test-host:3000/test-app-id/production/mcp',
            logo: '/test-icon.svg',
            hostingProvider: 'API_SERVICE'
          },
          elements: [
            {
              id: 'test-element-id-1',
              name: 'testMethod',
              description: 'Test method description',
              params: []
            }
          ]
        },
        {
          serviceInfo: {
            serviceId: 'test-service-id-2',
            serviceName: 'DevelopmentService',
            model: 'Development Service',
            lang: 'JS',
            mode: 'DEVELOPMENT',
            mcpURL: 'http://test-host:3000/test-app-id/development/mcp',
            logo: '/test-icon.svg',
            hostingProvider: 'API_SERVICE'
          },
          elements: [
            {
              id: 'test-element-id-2',
              name: 'devMethod',
              description: 'Dev method description',
              params: []
            }
          ]
        },
        {
          serviceInfo: {
            serviceId: 'test-service-id-3',
            serviceName: 'BetaService',
            model: 'Beta Service',
            lang: 'JS',
            mode: 'BETA',
            mcpURL: 'http://test-host:3000/test-app-id/beta/mcp',
            logo: '/test-icon.svg',
            hostingProvider: 'API_SERVICE'
          },
          elements: []
        }
      ]

      mockSuccessAPIRequest(servicesResult)

      const result = await mcpApiServicesAPI.getMcpApiServices(appId)

      expect(result).toEqual(servicesResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/mcp/list`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with unauthorized error', async () => {
      const errorMessage = 'Unauthorized'
      mockFailedAPIRequest(errorMessage, 401)

      const error = await mcpApiServicesAPI.getMcpApiServices(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 401
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/mcp/list`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with app not found error', async () => {
      const errorMessage = 'Application not found'
      mockFailedAPIRequest(errorMessage, 404)

      const error = await mcpApiServicesAPI.getMcpApiServices('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/nonexistent-app/console/localservices/generic/mcp/list',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails on server failure', async () => {
      const errorMessage = 'Internal server error'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await mcpApiServicesAPI.getMcpApiServices(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/mcp/list`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('enableMcpApiService', () => {
    it('should make a PUT request to enable an MCP API service', async () => {
      mockSuccessAPIRequest()

      const result = await mcpApiServicesAPI.enableMcpApiService(appId, serviceVersionId)

      expect(result).toBeUndefined()

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/${serviceVersionId}/mcp/enable`,
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails on server failure', async () => {
      const errorMessage = 'Internal Server Error'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await mcpApiServicesAPI.enableMcpApiService(appId, serviceVersionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/${serviceVersionId}/mcp/enable`,
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('disableMcpApiService', () => {
    it('should make a PUT request to disable an MCP API service', async () => {
      mockSuccessAPIRequest()

      const result = await mcpApiServicesAPI.disableMcpApiService(appId, serviceVersionId)

      expect(result).toBeUndefined()

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/${serviceVersionId}/mcp/disable`,
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails on server failure', async () => {
      const errorMessage = 'Internal Server Error'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await mcpApiServicesAPI.disableMcpApiService(appId, serviceVersionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/${serviceVersionId}/mcp/disable`,
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
