import { createClient, CacheTags, Request, urls, DevPermissions } from '../../src/index'

describe('index', () => {
  describe('exports', () => {
    it('should export createClient function', () => {
      expect(createClient).toBeDefined()
      expect(typeof createClient).toBe('function')
    })

    it('should export CacheTags', () => {
      expect(CacheTags).toBeDefined()
      expect(typeof CacheTags).toBe('object')
    })

    it('should export Request', () => {
      expect(Request).toBeDefined()
      expect(typeof Request).toBe('function')
    })

    it('should export urls', () => {
      expect(urls).toBeDefined()
      expect(typeof urls).toBe('object')
    })

    it('should export DevPermissions', () => {
      expect(DevPermissions).toBeDefined()
      expect(typeof DevPermissions).toBe('object')
    })
  })

  describe('createClient', () => {
    const serverUrl = 'http://test-server.com'
    const authKey = 'test-auth-key'

    it('should create client with basic parameters', () => {
      const client = createClient(serverUrl, authKey)

      expect(client).toBeDefined()
      expect(client.destroy).toBeDefined()
      expect(client.request).toBeDefined()
      expect(typeof client.destroy).toBe('function')
    })

    it('should create client without auth key', () => {
      const client = createClient(serverUrl)

      expect(client).toBeDefined()
      expect(client.request.context.authKey).toBeUndefined()
    })

    it('should create client with all API modules', () => {
      const client = createClient(serverUrl, authKey)

      // Test that all major API modules are present
      expect(client.activityManager).toBeDefined()
      expect(client.analytics).toBeDefined()
      expect(client.apiDocs).toBeDefined()
      expect(client.apps).toBeDefined()
      expect(client.automation).toBeDefined()
      expect(client.billing).toBeDefined()
      expect(client.bl).toBeDefined()
      expect(client.cloudCode).toBeDefined()
      expect(client.blueprints).toBeDefined()
      expect(client.cache).toBeDefined()
      expect(client.cacheControl).toBeDefined()
      expect(client.codeless).toBeDefined()
      expect(client.counters).toBeDefined()
      expect(client.dataConnectors).toBeDefined()
      expect(client.dataViews).toBeDefined()
      expect(client.dataHives).toBeDefined()
      expect(client.dataToVisualize).toBeDefined()
      expect(client.developerProfile).toBeDefined()
      expect(client.devTeam).toBeDefined()
      expect(client.email).toBeDefined()
      expect(client.files).toBeDefined()
      expect(client.formEditor).toBeDefined()
      expect(client.gamification).toBeDefined()
      expect(client.license).toBeDefined()
      expect(client.messaging).toBeDefined()
      expect(client.navigator).toBeDefined()
      expect(client.security).toBeDefined()
      expect(client.devPermissions).toBeDefined()
      expect(client.openAI).toBeDefined()
      expect(client.settings).toBeDefined()
      expect(client.status).toBeDefined()
      expect(client.tables).toBeDefined()
      expect(client.transfer).toBeDefined()
      expect(client.user).toBeDefined()
      expect(client.users).toBeDefined()
      expect(client.warning).toBeDefined()
      expect(client.uiBuilder).toBeDefined()
      expect(client.chartBuilder).toBeDefined()
      expect(client.community).toBeDefined()
      expect(client.sqlService).toBeDefined()
      expect(client.marketplace).toBeDefined()
      expect(client.referrals).toBeDefined()
      expect(client.visualizations).toBeDefined()
      expect(client.initialQuestionnaire).toBeDefined()
      expect(client.consolePreview).toBeDefined()
      expect(client.quickApps).toBeDefined()
      expect(client.integrations).toBeDefined()
      expect(client.pdf).toBeDefined()
      expect(client.frExtensions).toBeDefined()
      expect(client.mcpServices).toBeDefined()
      expect(client.system).toBeDefined()
    })

    it('should create client with custom options', () => {
      const options = {
        billingURL: 'http://billing.example.com',
        billingAuth: 'basic-auth-token',
        communityURL: 'http://community.example.com',
        sqlServiceURL: 'http://sql.example.com',
        automationURL: 'http://automation.example.com',
        nodeApiURL: 'http://node-api.example.com',
        middleware: jest.fn()
      }

      const client = createClient(serverUrl, authKey, options)

      expect(client).toBeDefined()
      expect(client.request.billing).toBeDefined()
      expect(client.request.community).toBeDefined()
      expect(client.request.sqlService).toBeDefined()
      expect(client.request.automation).toBeDefined()
      expect(client.request.nodeAPI).toBeDefined()
    })

    it('should set up billing request with custom URL and auth', () => {
      const options = {
        billingURL: 'http://billing.example.com',
        billingAuth: 'basic-auth-token'
      }

      const client = createClient(serverUrl, authKey, options)
      
      expect(client.request.billing).toBeDefined()
      expect(client.request.billing).not.toBe(client.request)
    })

    it('should use default billing request when no billing URL provided', () => {
      const client = createClient(serverUrl, authKey)
      
      expect(client.request.billing).toBe(client.request)
    })

    it('should set up community request with custom URL', () => {
      const options = {
        communityURL: 'http://community.example.com'
      }

      const client = createClient(serverUrl, authKey, options)
      
      expect(client.request.community).toBeDefined()
      expect(client.request.community).not.toBe(client.request)
    })

    it('should use default community request when no community URL provided', () => {
      const client = createClient(serverUrl, authKey)
      
      expect(client.request.community).toBe(client.request)
    })

    it('should set up SQL service request with custom URL', () => {
      const options = {
        sqlServiceURL: 'http://sql.example.com'
      }

      const client = createClient(serverUrl, authKey, options)
      
      expect(client.request.sqlService).toBeDefined()
      expect(client.request.sqlService).not.toBe(client.request)
    })

    it('should use default SQL service request when no SQL service URL provided', () => {
      const client = createClient(serverUrl, authKey)
      
      expect(client.request.sqlService).toBe(client.request)
    })

    it('should set up automation request with custom URL', () => {
      const options = {
        automationURL: 'http://automation.example.com'
      }

      const client = createClient(serverUrl, authKey, options)
      
      expect(client.request.automation).toBeDefined()
      expect(client.request.automation).not.toBe(client.request)
    })

    it('should use default automation request when no automation URL provided', () => {
      const client = createClient(serverUrl, authKey)
      
      expect(client.request.automation).toBe(client.request)
    })

    it('should set up node API request with custom URL', () => {
      const options = {
        nodeApiURL: 'http://node-api.example.com'
      }

      const client = createClient(serverUrl, authKey, options)
      
      expect(client.request.nodeAPI).toBeDefined()
      expect(client.request.nodeAPI).not.toBe(client.request)
    })

    it('should use default node API request when no node API URL provided', () => {
      const client = createClient(serverUrl, authKey)
      
      expect(client.request.nodeAPI).toBe(client.request)
    })

    it('should destroy client and reject subsequent requests', async () => {
      const client = createClient(serverUrl, authKey)
      
      client.destroy()

      // Try to make a request after destruction
      const request = client.request.get('/test')
      
      await expect(request.send()).rejects.toThrow('Client has been destroyed')
    })
  })

  describe('Context class', () => {
    it('should create context with auth key and options', () => {
      const authKey = 'test-auth-key'
      const options = { middleware: jest.fn() }
      
      // We can't directly test the Context class as it's not exported,
      // but we can test it through createClient
      const client = createClient('http://test.com', authKey, options)
      
      expect(client.request.context.authKey).toBe(authKey)
      expect(client.request.context.options.middleware).toBe(options.middleware)
      expect(client.request.context.options.billingURL).toBe(null)
      expect(client.request.context.options.billingAuth).toBe(null)
    })

    it('should set auth key on context', () => {
      const client = createClient('http://test.com', 'initial-key')
      
      client.request.context.setAuthKey('new-key')
      
      expect(client.request.context.authKey).toBe('new-key')
    })

    it('should apply auth key to request', () => {
      const client = createClient('http://test.com', 'test-auth-key')
      const mockRequest = { set: jest.fn() }
      
      client.request.context.apply(mockRequest)
      
      expect(mockRequest.set).toHaveBeenCalledWith('auth-key', 'test-auth-key')
    })

    it('should not apply auth key when not set', () => {
      const client = createClient('http://test.com')
      const mockRequest = { set: jest.fn() }
      
      client.request.context.apply(mockRequest)
      
      expect(mockRequest.set).not.toHaveBeenCalled()
    })

    it('should apply middleware to request', () => {
      const middleware = jest.fn()
      const client = createClient('http://test.com', 'auth-key', { middleware })
      const mockRequest = { set: jest.fn() }
      
      client.request.context.apply(mockRequest)
      
      expect(middleware).toHaveBeenCalledWith(mockRequest)
    })

    it('should apply additional middleware to request', () => {
      const additionalMiddleware = jest.fn()
      const client = createClient('http://test.com', 'auth-key')
      const mockRequest = { set: jest.fn() }
      
      client.request.context.apply(mockRequest, additionalMiddleware)
      
      expect(additionalMiddleware).toHaveBeenCalledWith(mockRequest)
    })
  })

  describe('contextifyRequest', () => {
    it('should add server URL to relative paths', () => {
      const client = createClient('http://test.com', 'auth-key')
      
      // Test through the client's request methods
      const getRequest = client.request.get('/test-path')
      
      expect(getRequest.path).toBe('http://test.com/test-path')
    })

    it('should not modify absolute URLs', () => {
      const client = createClient('http://test.com', 'auth-key')
      
      const getRequest = client.request.get('https://external.com/api')
      
      expect(getRequest.path).toBe('https://external.com/api')
    })

    it('should handle requests without server URL', () => {
      const client = createClient(null, 'auth-key')
      
      const getRequest = client.request.get('/test-path')
      
      expect(getRequest.path).toBe('/test-path')
    })

    it('should create HTTP method functions', () => {
      const client = createClient('http://test.com', 'auth-key')
      
      expect(client.request.get).toBeDefined()
      expect(client.request.post).toBeDefined()
      expect(client.request.put).toBeDefined()
      expect(client.request.delete).toBeDefined()
      expect(client.request.patch).toBeDefined()
      
      expect(typeof client.request.get).toBe('function')
      expect(typeof client.request.post).toBe('function')
      expect(typeof client.request.put).toBe('function')
      expect(typeof client.request.delete).toBe('function')
      expect(typeof client.request.patch).toBe('function')
    })
  })
})