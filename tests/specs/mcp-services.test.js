import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.mcpServices', () => {
  let apiClient
  let mcpServicesAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    mcpServicesAPI = apiClient.mcpServices
  })

  describe('getMcpClients', () => {
    it('should make GET request to get MCP clients', async () => {
      const clientsResult = {
        clients: [
          {
            id: 'client-123',
            name: 'Database Client',
            type: 'mysql',
            status: 'active',
            config: {
              host: 'localhost',
              port: 3306,
              database: 'app_db'
            },
            createdAt: '2024-01-10T09:00:00Z'
          },
          {
            id: 'client-456',
            name: 'Redis Cache Client',
            type: 'redis',
            status: 'inactive',
            config: {
              host: 'redis.example.com',
              port: 6379
            },
            createdAt: '2024-01-12T14:30:00Z'
          }
        ],
        totalCount: 2
      }
      mockSuccessAPIRequest(clientsResult)

      const result = await mcpServicesAPI.getMcpClients(appId)

      expect(result).toEqual(clientsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty clients list', async () => {
      const clientsResult = { clients: [], totalCount: 0 }
      mockSuccessAPIRequest(clientsResult)

      const result = await mcpServicesAPI.getMcpClients(appId)

      expect(result).toEqual(clientsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive client details', async () => {
      const clientsResult = {
        clients: [
          {
            id: 'advanced-client-789',
            name: 'Multi-Protocol Client',
            type: 'custom',
            status: 'active',
            version: '2.1.0',
            config: {
              endpoints: {
                primary: 'https://api.example.com/v1',
                fallback: 'https://backup.example.com/v1'
              },
              authentication: {
                type: 'oauth2',
                clientId: 'client_123',
                scopes: ['read', 'write', 'admin']
              },
              retryPolicy: {
                maxAttempts: 3,
                backoffMultiplier: 2,
                initialDelay: 1000
              },
              rateLimiting: {
                requestsPerMinute: 100,
                burstLimit: 10
              }
            },
            health: {
              status: 'healthy',
              lastCheck: '2024-01-15T12:00:00Z',
              uptime: '99.9%'
            },
            metrics: {
              totalRequests: 45230,
              successfulRequests: 44890,
              averageResponseTime: 250,
              lastActivity: '2024-01-15T11:55:00Z'
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1
        },
        statistics: {
          totalActive: 1,
          totalInactive: 0,
          totalTypes: 1,
          mostUsedType: 'custom'
        }
      }
      mockSuccessAPIRequest(clientsResult)

      const result = await mcpServicesAPI.getMcpClients(appId)

      expect(result).toEqual(clientsResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await mcpServicesAPI.getMcpClients(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await mcpServicesAPI.getMcpClients('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('createMcpClient', () => {
    it('should make POST request to create MCP client', async () => {
      const createResult = {
        client: {
          id: 'new-client-123',
          name: 'PostgreSQL Client',
          type: 'postgresql',
          status: 'active'
        },
        message: 'MCP client created successfully'
      }
      mockSuccessAPIRequest(createResult)

      const clientData = {
        name: 'PostgreSQL Client',
        type: 'postgresql',
        config: {
          host: 'postgres.example.com',
          port: 5432,
          database: 'production_db',
          username: 'app_user',
          password: 'secure_password',
          ssl: {
            enabled: true,
            rejectUnauthorized: false
          }
        },
        settings: {
          connectionTimeout: 30000,
          idleTimeout: 600000,
          maxConnections: 10
        }
      }

      const result = await mcpServicesAPI.createMcpClient(appId, clientData)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(clientData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex client configuration', async () => {
      const createResult = { success: true, clientId: 'complex-client-456' }
      mockSuccessAPIRequest(createResult)

      const clientData = {
        name: 'Enterprise API Client',
        type: 'rest-api',
        config: {
          baseUrl: 'https://enterprise-api.example.com',
          authentication: {
            type: 'bearer',
            token: 'eyJhbGciOiJIUzI1NiIs...',
            refreshToken: 'refresh_token_here',
            autoRefresh: true
          },
          headers: {
            'User-Agent': 'Backendless-MCP-Client/1.0',
            'Accept': 'application/json',
            'Custom-Header': 'custom-value'
          },
          timeout: {
            connection: 5000,
            read: 30000,
            write: 15000
          },
          retryPolicy: {
            enabled: true,
            maxRetries: 3,
            retryDelay: 1000,
            exponentialBackoff: true,
            retryOnStatus: [500, 502, 503, 504]
          },
          circuitBreaker: {
            enabled: true,
            failureThreshold: 5,
            resetTimeout: 60000,
            halfOpenMaxCalls: 3
          }
        },
        monitoring: {
          healthCheck: {
            enabled: true,
            endpoint: '/health',
            interval: 30000
          },
          logging: {
            level: 'info',
            includeHeaders: false,
            includeBody: false
          },
          metrics: {
            enabled: true,
            collectLatency: true,
            collectThroughput: true
          }
        },
        security: {
          validateCertificates: true,
          allowedHosts: ['enterprise-api.example.com', '*.api.example.com'],
          ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
        }
      }

      const result = await mcpServicesAPI.createMcpClient(appId, clientData)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(clientData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal client configuration', async () => {
      const createResult = { success: true, clientId: 'simple-client-789' }
      mockSuccessAPIRequest(createResult)

      const clientData = {
        name: 'Simple HTTP Client',
        type: 'http',
        config: {
          url: 'https://api.example.com'
        }
      }

      const result = await mcpServicesAPI.createMcpClient(appId, clientData)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(clientData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid client configuration', 400)

      const clientData = { name: 'Invalid Client' } // Missing required fields
      const error = await mcpServicesAPI.createMcpClient(appId, clientData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid client configuration' },
        message: 'Invalid client configuration',
        status: 400
      })
    })

    it('fails when server responds with client already exists error', async () => {
      mockFailedAPIRequest('MCP client with this name already exists', 409)

      const clientData = { name: 'Existing Client', type: 'mysql' }
      const error = await mcpServicesAPI.createMcpClient(appId, clientData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'MCP client with this name already exists' },
        message: 'MCP client with this name already exists',
        status: 409
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('MCP client quota exceeded', 429)

      const clientData = { name: 'New Client', type: 'redis' }
      const error = await mcpServicesAPI.createMcpClient(appId, clientData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'MCP client quota exceeded' },
        message: 'MCP client quota exceeded',
        status: 429
      })
    })
  })

  describe('updateMcpClient', () => {
    it('should make PUT request to update MCP client', async () => {
      const updateResult = {
        client: {
          id: 'client-123',
          name: 'Updated Database Client',
          status: 'active',
          lastUpdated: '2024-01-15T12:00:00Z'
        },
        message: 'MCP client updated successfully'
      }
      mockSuccessAPIRequest(updateResult)

      const updateData = {
        clientId: 'client-123',
        name: 'Updated Database Client',
        config: {
          host: 'new-database.example.com',
          port: 3306,
          database: 'updated_db',
          connectionPool: {
            min: 2,
            max: 10,
            idleTimeoutMs: 300000
          }
        },
        settings: {
          enableLogging: true,
          logLevel: 'debug',
          healthCheckInterval: 60000
        }
      }

      const result = await mcpServicesAPI.updateMcpClient(appId, updateData)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(updateData),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial configuration updates', async () => {
      const updateResult = { success: true, updated: ['config.timeout'] }
      mockSuccessAPIRequest(updateResult)

      const updateData = {
        clientId: 'client-456',
        config: {
          timeout: 45000
        }
      }

      const result = await mcpServicesAPI.updateMcpClient(appId, updateData)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(updateData),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle status updates', async () => {
      const updateResult = { success: true, status: 'inactive' }
      mockSuccessAPIRequest(updateResult)

      const updateData = {
        clientId: 'client-789',
        status: 'inactive',
        reason: 'Temporarily disabled for maintenance'
      }

      const result = await mcpServicesAPI.updateMcpClient(appId, updateData)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(updateData),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with client not found error', async () => {
      mockFailedAPIRequest('MCP client not found', 404)

      const updateData = { clientId: 'nonexistent-client' }
      const error = await mcpServicesAPI.updateMcpClient(appId, updateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'MCP client not found' },
        message: 'MCP client not found',
        status: 404
      })
    })

    it('fails when server responds with invalid configuration error', async () => {
      mockFailedAPIRequest('Invalid configuration update', 422)

      const updateData = { clientId: 'client-123', config: { invalidField: 'value' } }
      const error = await mcpServicesAPI.updateMcpClient(appId, updateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid configuration update' },
        message: 'Invalid configuration update',
        status: 422
      })
    })
  })

  describe('deleteMcpClient', () => {
    it('should make DELETE request to delete MCP client', async () => {
      const deleteResult = {
        success: true,
        message: 'MCP client deleted successfully',
        deletedClientId: 'client-123'
      }
      mockSuccessAPIRequest(deleteResult)

      const deleteData = {
        clientId: 'client-123',
        reason: 'No longer needed'
      }

      const result = await mcpServicesAPI.deleteMcpClient(appId, deleteData)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(deleteData),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle deletion with cleanup information', async () => {
      const deleteResult = {
        success: true,
        cleanup: {
          connectionsTerminated: 3,
          cacheCleared: true,
          metricsArchived: true,
          backupCreated: true,
          backupLocation: 'backups/mcp-clients/client-456_20240115.json'
        },
        warnings: [
          'Active connections will be terminated',
          'Cached data will be cleared'
        ]
      }
      mockSuccessAPIRequest(deleteResult)

      const deleteData = {
        clientId: 'client-456',
        forceDelete: true,
        createBackup: true
      }

      const result = await mcpServicesAPI.deleteMcpClient(appId, deleteData)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients`,
        body: JSON.stringify(deleteData),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle soft deletion', async () => {
      const deleteResult = {
        success: true,
        status: 'disabled',
        message: 'MCP client disabled successfully'
      }
      mockSuccessAPIRequest(deleteResult)

      const deleteData = {
        clientId: 'client-789',
        softDelete: true
      }

      const result = await mcpServicesAPI.deleteMcpClient(appId, deleteData)

      expect(result).toEqual(deleteResult)
    })

    it('fails when server responds with client not found error', async () => {
      mockFailedAPIRequest('MCP client not found', 404)

      const deleteData = { clientId: 'nonexistent-client' }
      const error = await mcpServicesAPI.deleteMcpClient(appId, deleteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'MCP client not found' },
        message: 'MCP client not found',
        status: 404
      })
    })

    it('fails when server responds with client in use error', async () => {
      mockFailedAPIRequest('Cannot delete MCP client currently in use', 409)

      const deleteData = { clientId: 'active-client' }
      const error = await mcpServicesAPI.deleteMcpClient(appId, deleteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete MCP client currently in use' },
        message: 'Cannot delete MCP client currently in use',
        status: 409
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to delete MCP client', 403)

      const deleteData = { clientId: 'protected-client' }
      const error = await mcpServicesAPI.deleteMcpClient(appId, deleteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to delete MCP client' },
        message: 'Insufficient permissions to delete MCP client',
        status: 403
      })
    })
  })

  describe('validateMcpConnection', () => {
    it('should make POST request to validate MCP connection', async () => {
      const validationResult = {
        valid: true,
        connectionTime: 150,
        message: 'Connection established successfully'
      }
      mockSuccessAPIRequest(validationResult)

      const validationData = {
        type: 'mysql',
        config: {
          host: 'mysql.example.com',
          port: 3306,
          database: 'test_db',
          username: 'test_user',
          password: 'test_password'
        }
      }

      const result = await mcpServicesAPI.validateMcpConnection(appId, validationData)

      expect(result).toEqual(validationResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/integration/mcp/clients/validate`,
        body: JSON.stringify(validationData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive validation results', async () => {
      const validationResult = {
        valid: true,
        connectionTime: 245,
        checks: {
          connectivity: { status: 'passed', time: 120 },
          authentication: { status: 'passed', time: 85 },
          permissions: { status: 'passed', time: 40 },
          ssl: { status: 'passed', time: 30, details: 'TLS 1.3 connection established' }
        },
        performance: {
          latency: 25,
          throughput: '1000 req/s',
          availability: '99.9%'
        },
        recommendations: [
          'Consider enabling connection pooling',
          'Set up monitoring for this connection'
        ],
        warnings: []
      }
      mockSuccessAPIRequest(validationResult)

      const validationData = {
        type: 'postgresql',
        config: {
          host: 'postgres.example.com',
          port: 5432,
          database: 'production_db',
          username: 'app_user',
          password: 'secure_password',
          ssl: { enabled: true }
        },
        testQueries: [
          'SELECT 1',
          'SELECT COUNT(*) FROM information_schema.tables'
        ]
      }

      const result = await mcpServicesAPI.validateMcpConnection(appId, validationData)

      expect(result).toEqual(validationResult)
    })

    it('should handle failed validation results', async () => {
      const validationResult = {
        valid: false,
        error: 'Connection timeout',
        details: {
          attempted: '2024-01-15T12:00:00Z',
          timeout: 30000,
          lastKnownGoodConnection: '2024-01-14T18:30:00Z'
        },
        suggestions: [
          'Check if the host is reachable',
          'Verify network connectivity',
          'Confirm credentials are correct'
        ]
      }
      mockSuccessAPIRequest(validationResult)

      const validationData = {
        type: 'redis',
        config: {
          host: 'unreachable-redis.example.com',
          port: 6379,
          password: 'redis_password'
        }
      }

      const result = await mcpServicesAPI.validateMcpConnection(appId, validationData)

      expect(result).toEqual(validationResult)
    })

    it('should handle validation with custom configuration', async () => {
      const validationResult = {
        valid: true,
        connectionTime: 320,
        customChecks: {
          endpointsReachable: true,
          authTokenValid: true,
          rateLimitsOk: true
        }
      }
      mockSuccessAPIRequest(validationResult)

      const validationData = {
        type: 'rest-api',
        config: {
          baseUrl: 'https://api.example.com',
          authentication: {
            type: 'bearer',
            token: 'eyJhbGciOiJIUzI1NiIs...'
          },
          endpoints: [
            '/health',
            '/api/v1/status',
            '/api/v1/ping'
          ]
        },
        validationOptions: {
          checkAllEndpoints: true,
          validateAuthentication: true,
          testRateLimit: false,
          timeout: 10000
        }
      }

      const result = await mcpServicesAPI.validateMcpConnection(appId, validationData)

      expect(result).toEqual(validationResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Validation configuration is invalid', 400)

      const validationData = { type: 'invalid-type' }
      const error = await mcpServicesAPI.validateMcpConnection(appId, validationData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Validation configuration is invalid' },
        message: 'Validation configuration is invalid',
        status: 400
      })
    })

    it('fails when server responds with unsupported client type error', async () => {
      mockFailedAPIRequest('Unsupported MCP client type', 422)

      const validationData = { type: 'unsupported-type', config: {} }
      const error = await mcpServicesAPI.validateMcpConnection(appId, validationData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unsupported MCP client type' },
        message: 'Unsupported MCP client type',
        status: 422
      })
    })

    it('fails when server responds with validation timeout error', async () => {
      mockFailedAPIRequest('Connection validation timed out', 408)

      const validationData = {
        type: 'mysql',
        config: { host: 'slow-host.example.com', port: 3306 }
      }
      const error = await mcpServicesAPI.validateMcpConnection(appId, validationData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection validation timed out' },
        message: 'Connection validation timed out',
        status: 408
      })
    })
  })
})