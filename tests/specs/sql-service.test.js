import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.sqlService', () => {
  let apiClient
  let sqlServiceAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    sqlServiceAPI = apiClient.sqlService
  })

  describe('getConnections', () => {
    it('should make GET request to get connections', async () => {
      const connectionsResult = {
        connections: [
          {
            id: 'conn-123',
            name: 'production-db',
            type: 'mysql',
            host: 'prod-mysql.example.com',
            port: 3306,
            database: 'myapp_prod',
            status: 'connected',
            createdAt: '2024-01-10T09:00:00Z',
            lastUsed: '2024-01-15T11:30:00Z'
          },
          {
            id: 'conn-456',
            name: 'analytics-db',
            type: 'postgresql',
            host: 'analytics-pg.example.com',
            port: 5432,
            database: 'analytics',
            status: 'connected',
            createdAt: '2024-01-12T14:30:00Z',
            lastUsed: '2024-01-15T10:15:00Z'
          }
        ],
        totalCount: 2,
        connectedCount: 2,
        disconnectedCount: 0
      }
      mockSuccessAPIRequest(connectionsResult)

      const result = await sqlServiceAPI.getConnections(appId)

      expect(result).toEqual(connectionsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/connection/`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty connections list', async () => {
      const connectionsResult = {
        connections: [],
        totalCount: 0,
        message: 'No database connections configured'
      }
      mockSuccessAPIRequest(connectionsResult)

      const result = await sqlServiceAPI.getConnections(appId)

      expect(result).toEqual(connectionsResult)
    })

    it('should handle comprehensive connections with detailed status', async () => {
      const connectionsResult = {
        connections: [
          {
            id: 'conn-enterprise-789',
            name: 'enterprise-warehouse',
            type: 'postgresql',
            host: 'data-warehouse.company.com',
            port: 5432,
            database: 'enterprise_dw',
            status: 'connected',
            ssl: {
              enabled: true,
              mode: 'require'
            },
            pool: {
              maxConnections: 20,
              activeConnections: 5,
              idleConnections: 3
            },
            performance: {
              averageQueryTime: 125,
              slowQueries: 3,
              totalQueries: 1547
            },
            health: {
              lastHealthCheck: '2024-01-15T12:00:00Z',
              uptime: '99.8%',
              responseTime: 45
            },
            metadata: {
              version: 'PostgreSQL 15.2',
              encoding: 'UTF8',
              timezone: 'UTC'
            },
            permissions: {
              canRead: true,
              canWrite: true,
              canExecute: true,
              canCreateTables: false
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T09:30:00Z',
            lastUsed: '2024-01-15T11:45:00Z'
          }
        ],
        statistics: {
          totalConnections: 1,
          connectedCount: 1,
          byType: {
            postgresql: 1,
            mysql: 0,
            oracle: 0,
            sqlserver: 0
          },
          totalQueries: 1547,
          averageResponseTime: 125
        },
        quotas: {
          maxConnections: 10,
          maxQueriesPerHour: 10000
        }
      }
      mockSuccessAPIRequest(connectionsResult)

      const result = await sqlServiceAPI.getConnections(appId)

      expect(result).toEqual(connectionsResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await sqlServiceAPI.getConnections(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await sqlServiceAPI.getConnections('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('createConnection', () => {
    it('should make POST request to create connection', async () => {
      const createResult = {
        id: 'new-conn-123',
        name: 'staging-db',
        type: 'mysql',
        status: 'connecting',
        message: 'Connection creation initiated',
        estimatedTime: '30-60 seconds',
        createdAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(createResult)

      const data = {
        name: 'staging-db',
        type: 'mysql',
        host: 'staging-mysql.example.com',
        port: 3306,
        database: 'myapp_staging',
        username: 'staging_user',
        password: 'staging_password',
        ssl: {
          enabled: true,
          rejectUnauthorized: false
        }
      }

      const result = await sqlServiceAPI.createConnection(appId, data)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/connection/`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex connection creation', async () => {
      const createResult = {
        id: 'enterprise-conn-456',
        name: 'enterprise-analytics',
        status: 'connected',
        testConnection: {
          successful: true,
          responseTime: 85
        }
      }
      mockSuccessAPIRequest(createResult)

      const data = {
        name: 'enterprise-analytics',
        type: 'postgresql',
        host: 'analytics.enterprise.com',
        port: 5432,
        database: 'analytics_prod',
        username: 'analytics_ro',
        password: 'complex_secure_password_123',
        ssl: {
          enabled: true,
          mode: 'require',
          ca: '-----BEGIN CERTIFICATE-----...',
          cert: '-----BEGIN CERTIFICATE-----...',
          key: '-----BEGIN PRIVATE KEY-----...'
        },
        connectionOptions: {
          connectTimeout: 60000,
          acquireTimeout: 60000,
          timeout: 60000,
          timezone: 'UTC',
          charset: 'utf8mb4'
        },
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          idleTimeoutMillis: 600000
        },
        security: {
          encryptConnection: true,
          trustServerCertificate: false,
          enableArithAbort: true
        },
        advanced: {
          multipleStatements: false,
          bigNumberStrings: true,
          supportBigNumbers: true,
          dateStrings: true
        }
      }

      const result = await sqlServiceAPI.createConnection(appId, data)

      expect(result).toEqual(createResult)
    })

    it('should handle minimal connection creation', async () => {
      const createResult = { id: 'simple-conn-789', status: 'connecting' }
      mockSuccessAPIRequest(createResult)

      const data = {
        name: 'simple-connection',
        type: 'sqlite',
        file: '/data/myapp.db'
      }

      const result = await sqlServiceAPI.createConnection(appId, data)

      expect(result).toEqual(createResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Connection configuration is invalid', 400)

      const data = { name: 'invalid-connection' } // Missing required fields
      const error = await sqlServiceAPI.createConnection(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection configuration is invalid' },
        message: 'Connection configuration is invalid',
        status: 400
      })
    })

    it('fails when server responds with connection test failed error', async () => {
      mockFailedAPIRequest('Failed to connect to database', 422)

      const data = {
        name: 'unreachable-db',
        type: 'mysql',
        host: 'unreachable.example.com'
      }
      const error = await sqlServiceAPI.createConnection(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Failed to connect to database' },
        message: 'Failed to connect to database',
        status: 422
      })
    })

    it('fails when server responds with connection name exists error', async () => {
      mockFailedAPIRequest('Connection with this name already exists', 409)

      const data = { name: 'existing-connection', type: 'mysql' }
      const error = await sqlServiceAPI.createConnection(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection with this name already exists' },
        message: 'Connection with this name already exists',
        status: 409
      })
    })
  })

  describe('updateConnection', () => {
    it('should make PUT request to update connection', async () => {
      const updateResult = {
        id: 'conn-123',
        name: 'updated-production-db',
        message: 'Connection updated successfully',
        testConnection: {
          successful: true,
          responseTime: 95
        },
        updatedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(updateResult)

      const data = {
        id: 'conn-123',
        name: 'updated-production-db',
        host: 'new-prod-mysql.example.com',
        port: 3306,
        database: 'myapp_prod_v2',
        username: 'prod_user_v2',
        password: 'updated_password',
        pool: {
          max: 15
        }
      }

      const result = await sqlServiceAPI.updateConnection(appId, data)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/connection/${data.id}`,
        body: JSON.stringify(data),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial connection updates', async () => {
      const updateResult = { success: true, updated: ['pool.max', 'ssl.enabled'] }
      mockSuccessAPIRequest(updateResult)

      const data = {
        id: 'conn-456',
        pool: {
          max: 20
        },
        ssl: {
          enabled: true
        }
      }

      const result = await sqlServiceAPI.updateConnection(appId, data)

      expect(result).toEqual(updateResult)
    })

    it('should handle connection credentials update', async () => {
      const updateResult = {
        id: 'conn-789',
        message: 'Credentials updated successfully',
        requiresReconnect: true
      }
      mockSuccessAPIRequest(updateResult)

      const data = {
        id: 'conn-789',
        username: 'new_username',
        password: 'new_secure_password_456'
      }

      const result = await sqlServiceAPI.updateConnection(appId, data)

      expect(result).toEqual(updateResult)
    })

    it('fails when server responds with connection not found error', async () => {
      mockFailedAPIRequest('Connection not found', 404)

      const data = { id: 'nonexistent-connection', name: 'Updated Name' }
      const error = await sqlServiceAPI.updateConnection(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection not found' },
        message: 'Connection not found',
        status: 404
      })
    })

    it('fails when server responds with invalid configuration error', async () => {
      mockFailedAPIRequest('Connection update validation failed', 422)

      const data = { id: 'conn-123', port: 'invalid-port' }
      const error = await sqlServiceAPI.updateConnection(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection update validation failed' },
        message: 'Connection update validation failed',
        status: 422
      })
    })
  })

  describe('getConnectionTables', () => {
    it('should make GET request to get connection tables', async () => {
      const tablesResult = {
        tables: [
          {
            name: 'users',
            schema: 'public',
            type: 'table',
            rows: 15420,
            columns: 12,
            size: '2.1 MB',
            lastModified: '2024-01-15T10:30:00Z'
          },
          {
            name: 'orders',
            schema: 'public',
            type: 'table',
            rows: 8734,
            columns: 8,
            size: '1.5 MB',
            lastModified: '2024-01-15T09:45:00Z'
          },
          {
            name: 'product_stats',
            schema: 'analytics',
            type: 'view',
            rows: null,
            columns: 15,
            size: null,
            lastModified: '2024-01-14T16:20:00Z'
          }
        ],
        schemas: ['public', 'analytics'],
        totalTables: 2,
        totalViews: 1,
        totalSize: '3.6 MB'
      }
      mockSuccessAPIRequest(tablesResult)

      const connectionId = 'conn-123'
      const result = await sqlServiceAPI.getConnectionTables(appId, connectionId)

      expect(result).toEqual(tablesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/connection/${connectionId}/tables`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty tables list', async () => {
      const tablesResult = {
        tables: [],
        schemas: [],
        totalTables: 0,
        message: 'No tables found in this database'
      }
      mockSuccessAPIRequest(tablesResult)

      const connectionId = 'empty-conn-456'
      const result = await sqlServiceAPI.getConnectionTables(appId, connectionId)

      expect(result).toEqual(tablesResult)
    })

    it('should handle comprehensive table information', async () => {
      const tablesResult = {
        tables: [
          {
            name: 'audit_log',
            schema: 'audit',
            type: 'table',
            rows: 1547832,
            columns: 18,
            size: '245.7 MB',
            indexes: 5,
            primaryKey: ['id'],
            foreignKeys: [
              { column: 'user_id', references: 'users.id' },
              { column: 'resource_id', references: 'resources.id' }
            ],
            columns_details: [
              { name: 'id', type: 'BIGINT', nullable: false, primary: true },
              { name: 'user_id', type: 'INT', nullable: false },
              { name: 'action', type: 'VARCHAR(100)', nullable: false },
              { name: 'timestamp', type: 'TIMESTAMP', nullable: false },
              { name: 'ip_address', type: 'INET', nullable: true }
            ],
            statistics: {
              avgRowSize: 167,
              indexSize: '45.2 MB',
              lastAnalyzed: '2024-01-14T03:00:00Z',
              autoVacuum: true
            },
            permissions: {
              select: true,
              insert: true,
              update: false,
              delete: false
            },
            partitioned: true,
            partitionType: 'RANGE',
            partitionKey: 'timestamp'
          }
        ],
        metadata: {
          databaseVersion: 'PostgreSQL 15.2',
          totalSize: '245.7 MB',
          availableSpace: '15.3 GB',
          connectionInfo: {
            maxConnections: 100,
            activeConnections: 5
          }
        }
      }
      mockSuccessAPIRequest(tablesResult)

      const connectionId = 'enterprise-conn'
      const result = await sqlServiceAPI.getConnectionTables(appId, connectionId)

      expect(result).toEqual(tablesResult)
    })

    it('fails when server responds with connection not found error', async () => {
      mockFailedAPIRequest('Connection not found', 404)

      const connectionId = 'nonexistent-connection'
      const error = await sqlServiceAPI.getConnectionTables(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection not found' },
        message: 'Connection not found',
        status: 404
      })
    })

    it('fails when server responds with connection not active error', async () => {
      mockFailedAPIRequest('Connection is not active', 503)

      const connectionId = 'inactive-connection'
      const error = await sqlServiceAPI.getConnectionTables(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection is not active' },
        message: 'Connection is not active',
        status: 503
      })
    })
  })

  describe('getConnectionRoutines', () => {
    it('should make GET request to get connection routines', async () => {
      const routinesResult = {
        routines: [
          {
            name: 'calculate_order_total',
            schema: 'public',
            type: 'function',
            returnType: 'DECIMAL',
            parameters: [
              { name: 'order_id', type: 'INT', mode: 'IN' },
              { name: 'include_tax', type: 'BOOLEAN', mode: 'IN', default: true }
            ],
            language: 'plpgsql',
            createdAt: '2024-01-10T14:30:00Z',
            lastModified: '2024-01-14T09:15:00Z'
          },
          {
            name: 'process_monthly_reports',
            schema: 'analytics',
            type: 'procedure',
            returnType: null,
            parameters: [
              { name: 'report_month', type: 'DATE', mode: 'IN' },
              { name: 'send_email', type: 'BOOLEAN', mode: 'IN', default: false }
            ],
            language: 'plpgsql',
            createdAt: '2024-01-08T11:45:00Z',
            lastModified: '2024-01-12T16:20:00Z'
          }
        ],
        schemas: ['public', 'analytics'],
        totalFunctions: 1,
        totalProcedures: 1,
        totalRoutines: 2
      }
      mockSuccessAPIRequest(routinesResult)

      const connectionId = 'conn-123'
      const result = await sqlServiceAPI.getConnectionRoutines(appId, connectionId)

      expect(result).toEqual(routinesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/connection/${connectionId}/routines`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty routines list', async () => {
      const routinesResult = {
        routines: [],
        schemas: [],
        totalFunctions: 0,
        totalProcedures: 0,
        message: 'No stored procedures or functions found'
      }
      mockSuccessAPIRequest(routinesResult)

      const connectionId = 'simple-conn'
      const result = await sqlServiceAPI.getConnectionRoutines(appId, connectionId)

      expect(result).toEqual(routinesResult)
    })

    it('should handle comprehensive routine information', async () => {
      const routinesResult = {
        routines: [
          {
            name: 'complex_analytics_function',
            schema: 'analytics',
            type: 'function',
            returnType: 'TABLE',
            returnColumns: [
              { name: 'metric_name', type: 'VARCHAR(100)' },
              { name: 'metric_value', type: 'DECIMAL(10,2)' },
              { name: 'calculated_at', type: 'TIMESTAMP' }
            ],
            parameters: [
              { name: 'start_date', type: 'DATE', mode: 'IN', description: 'Analysis start date' },
              { name: 'end_date', type: 'DATE', mode: 'IN', description: 'Analysis end date' },
              { name: 'metrics_filter', type: 'TEXT[]', mode: 'IN', default: null }
            ],
            language: 'plpgsql',
            volatility: 'stable',
            parallel: 'safe',
            cost: 1000,
            rows: 100,
            definition: 'BEGIN\n  -- Function implementation\n  ...\nEND',
            dependencies: [
              'analytics.daily_metrics',
              'analytics.metric_definitions'
            ],
            privileges: {
              execute: true,
              owner: 'analytics_user'
            },
            usage: {
              callCount: 247,
              avgExecutionTime: '1.2s',
              lastCalled: '2024-01-15T11:30:00Z'
            },
            createdAt: '2024-01-05T10:00:00Z',
            lastModified: '2024-01-13T14:45:00Z'
          }
        ],
        metadata: {
          supportedLanguages: ['sql', 'plpgsql', 'plpython3u'],
          totalSize: '45.2 KB'
        }
      }
      mockSuccessAPIRequest(routinesResult)

      const connectionId = 'analytics-conn'
      const result = await sqlServiceAPI.getConnectionRoutines(appId, connectionId)

      expect(result).toEqual(routinesResult)
    })

    it('fails when server responds with connection not found error', async () => {
      mockFailedAPIRequest('Connection not found', 404)

      const connectionId = 'nonexistent-connection'
      const error = await sqlServiceAPI.getConnectionRoutines(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection not found' },
        message: 'Connection not found',
        status: 404
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to access routines', 403)

      const connectionId = 'restricted-conn'
      const error = await sqlServiceAPI.getConnectionRoutines(appId, connectionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to access routines' },
        message: 'Insufficient permissions to access routines',
        status: 403
      })
    })
  })

  describe('getConnectionQueries', () => {
    it('should make GET request to get connection queries', async () => {
      const queriesResult = {
        queries: [
          {
            id: 'query-123',
            name: 'active_users_report',
            description: 'Get active users in the last 30 days',
            sql: 'SELECT COUNT(*) as active_users FROM users WHERE last_login > NOW() - INTERVAL 30 DAY',
            parameters: [],
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-12T14:30:00Z',
            lastRun: '2024-01-15T10:15:00Z'
          },
          {
            id: 'query-456',
            name: 'sales_by_product',
            description: 'Sales report grouped by product category',
            sql: 'SELECT product_category, SUM(amount) as total_sales FROM orders WHERE created_at BETWEEN ? AND ? GROUP BY product_category',
            parameters: [
              { name: 'start_date', type: 'DATE', required: true },
              { name: 'end_date', type: 'DATE', required: true }
            ],
            createdAt: '2024-01-08T11:30:00Z',
            updatedAt: '2024-01-14T16:45:00Z',
            lastRun: '2024-01-15T09:30:00Z'
          }
        ],
        totalCount: 2,
        categories: ['reports', 'analytics', 'maintenance']
      }
      mockSuccessAPIRequest(queriesResult)

      const connectionName = 'production-db'
      const result = await sqlServiceAPI.getConnectionQueries(appId, connectionName)

      expect(result).toEqual(queriesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/${connectionName}/query`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty queries list', async () => {
      const queriesResult = {
        queries: [],
        totalCount: 0,
        message: 'No saved queries found for this connection'
      }
      mockSuccessAPIRequest(queriesResult)

      const connectionName = 'new-connection'
      const result = await sqlServiceAPI.getConnectionQueries(appId, connectionName)

      expect(result).toEqual(queriesResult)
    })

    it('fails when server responds with connection not found error', async () => {
      mockFailedAPIRequest('Connection not found', 404)

      const connectionName = 'nonexistent-connection'
      const error = await sqlServiceAPI.getConnectionQueries(appId, connectionName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Connection not found' },
        message: 'Connection not found',
        status: 404
      })
    })
  })

  describe('createConnectionQuery', () => {
    it('should make POST request to create connection query', async () => {
      const createResult = {
        id: 'new-query-123',
        name: 'user_activity_report',
        message: 'Query created successfully',
        createdAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(createResult)

      const connectionName = 'production-db'
      const data = {
        name: 'user_activity_report',
        description: 'Report showing user activity patterns',
        sql: 'SELECT user_id, COUNT(*) as activity_count, MAX(created_at) as last_activity FROM user_activities WHERE created_at >= ? GROUP BY user_id ORDER BY activity_count DESC',
        parameters: [
          { name: 'since_date', type: 'DATETIME', required: true, description: 'Show activity since this date' }
        ],
        category: 'reports',
        tags: ['users', 'activity', 'analytics']
      }

      const result = await sqlServiceAPI.createConnectionQuery(appId, connectionName, data)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/${connectionName}/query`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle simple query creation', async () => {
      const createResult = { id: 'simple-query-456', success: true }
      mockSuccessAPIRequest(createResult)

      const connectionName = 'analytics-db'
      const data = {
        name: 'total_users',
        sql: 'SELECT COUNT(*) FROM users'
      }

      const result = await sqlServiceAPI.createConnectionQuery(appId, connectionName, data)

      expect(result).toEqual(createResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid SQL syntax', 400)

      const connectionName = 'test-db'
      const data = { name: 'invalid-query', sql: 'INVALID SQL SYNTAX' }
      const error = await sqlServiceAPI.createConnectionQuery(appId, connectionName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid SQL syntax' },
        message: 'Invalid SQL syntax',
        status: 400
      })
    })

    it('fails when server responds with query name exists error', async () => {
      mockFailedAPIRequest('Query with this name already exists', 409)

      const connectionName = 'prod-db'
      const data = { name: 'existing-query', sql: 'SELECT 1' }
      const error = await sqlServiceAPI.createConnectionQuery(appId, connectionName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Query with this name already exists' },
        message: 'Query with this name already exists',
        status: 409
      })
    })
  })

  describe('updateConnectionQuery', () => {
    it('should make PUT request to update connection query', async () => {
      const updateResult = {
        id: 'query-123',
        name: 'updated_user_report',
        message: 'Query updated successfully',
        updatedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(updateResult)

      const connectionName = 'production-db'
      const queryId = 'query-123'
      const data = {
        name: 'updated_user_report',
        description: 'Updated user activity report with additional metrics',
        sql: 'SELECT user_id, COUNT(*) as activity_count, MAX(created_at) as last_activity, AVG(session_duration) as avg_session FROM user_activities WHERE created_at >= ? GROUP BY user_id ORDER BY activity_count DESC',
        parameters: [
          { name: 'since_date', type: 'DATETIME', required: true }
        ]
      }

      const result = await sqlServiceAPI.updateConnectionQuery(appId, connectionName, queryId, data)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/${connectionName}/query/${queryId}`,
        body: JSON.stringify(data),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial query updates', async () => {
      const updateResult = { success: true, updated: ['description', 'sql'] }
      mockSuccessAPIRequest(updateResult)

      const connectionName = 'analytics-db'
      const queryId = 'query-456'
      const data = {
        description: 'Updated description',
        sql: 'SELECT * FROM users WHERE active = 1'
      }

      const result = await sqlServiceAPI.updateConnectionQuery(appId, connectionName, queryId, data)

      expect(result).toEqual(updateResult)
    })

    it('fails when server responds with query not found error', async () => {
      mockFailedAPIRequest('Query not found', 404)

      const connectionName = 'test-db'
      const queryId = 'nonexistent-query'
      const data = { name: 'Updated Query' }
      const error = await sqlServiceAPI.updateConnectionQuery(appId, connectionName, queryId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Query not found' },
        message: 'Query not found',
        status: 404
      })
    })
  })

  describe('runConnectionDynamicSelect', () => {
    it('should make POST request to run dynamic select', async () => {
      const queryResult = {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true },
          { id: 3, name: 'Bob Wilson', email: 'bob@example.com', active: false }
        ],
        columns: [
          { name: 'id', type: 'INT' },
          { name: 'name', type: 'VARCHAR' },
          { name: 'email', type: 'VARCHAR' },
          { name: 'active', type: 'BOOLEAN' }
        ],
        rowCount: 3,
        executionTime: 45,
        query: 'SELECT id, name, email, active FROM users WHERE active = ?',
        parameters: [true]
      }
      mockSuccessAPIRequest(queryResult)

      const connectionName = 'production-db'
      const data = {
        sql: 'SELECT id, name, email, active FROM users WHERE active = ?',
        parameters: [true],
        limit: 100
      }

      const result = await sqlServiceAPI.runConnectionDynamicSelect(appId, connectionName, data)

      expect(result).toEqual(queryResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/${connectionName}/select`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex query with multiple parameters', async () => {
      const queryResult = {
        data: [
          { product: 'Widget A', total_sales: 15420.50, order_count: 142 },
          { product: 'Widget B', total_sales: 8735.25, order_count: 89 }
        ],
        columns: [
          { name: 'product', type: 'VARCHAR' },
          { name: 'total_sales', type: 'DECIMAL' },
          { name: 'order_count', type: 'INT' }
        ],
        rowCount: 2,
        executionTime: 234,
        aggregations: {
          total_revenue: 24155.75,
          total_orders: 231
        }
      }
      mockSuccessAPIRequest(queryResult)

      const connectionName = 'analytics-db'
      const data = {
        sql: `
          SELECT 
            p.name as product,
            SUM(o.amount) as total_sales,
            COUNT(o.id) as order_count
          FROM products p
          JOIN orders o ON p.id = o.product_id
          WHERE o.created_at BETWEEN ? AND ?
          AND o.status = ?
          GROUP BY p.id, p.name
          ORDER BY total_sales DESC
        `,
        parameters: ['2024-01-01', '2024-01-31', 'completed'],
        options: {
          limit: 50,
          includeAggregations: true,
          format: 'detailed'
        }
      }

      const result = await sqlServiceAPI.runConnectionDynamicSelect(appId, connectionName, data)

      expect(result).toEqual(queryResult)
    })

    it('should handle empty result set', async () => {
      const queryResult = {
        data: [],
        columns: [
          { name: 'id', type: 'INT' },
          { name: 'name', type: 'VARCHAR' }
        ],
        rowCount: 0,
        executionTime: 12,
        message: 'No results found'
      }
      mockSuccessAPIRequest(queryResult)

      const connectionName = 'test-db'
      const data = {
        sql: 'SELECT id, name FROM users WHERE created_at > ?',
        parameters: ['2025-01-01']
      }

      const result = await sqlServiceAPI.runConnectionDynamicSelect(appId, connectionName, data)

      expect(result).toEqual(queryResult)
    })

    it('fails when server responds with SQL syntax error', async () => {
      mockFailedAPIRequest('SQL syntax error near SELECT', 400)

      const connectionName = 'test-db'
      const data = { sql: 'INVALID SELECT SYNTAX' }
      const error = await sqlServiceAPI.runConnectionDynamicSelect(appId, connectionName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'SQL syntax error near SELECT' },
        message: 'SQL syntax error near SELECT',
        status: 400
      })
    })

    it('fails when server responds with query timeout error', async () => {
      mockFailedAPIRequest('Query execution timeout', 408)

      const connectionName = 'slow-db'
      const data = { sql: 'SELECT * FROM very_large_table WHERE complex_calculation(column) > 1000000' }
      const error = await sqlServiceAPI.runConnectionDynamicSelect(appId, connectionName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Query execution timeout' },
        message: 'Query execution timeout',
        status: 408
      })
    })
  })

  describe('runConnectionNamedSelect', () => {
    it('should make POST request to run named select', async () => {
      const queryResult = {
        data: [
          { user_id: 123, activity_count: 45, last_activity: '2024-01-15T10:30:00Z' },
          { user_id: 456, activity_count: 32, last_activity: '2024-01-15T09:15:00Z' },
          { user_id: 789, activity_count: 28, last_activity: '2024-01-15T08:45:00Z' }
        ],
        columns: [
          { name: 'user_id', type: 'INT' },
          { name: 'activity_count', type: 'INT' },
          { name: 'last_activity', type: 'TIMESTAMP' }
        ],
        rowCount: 3,
        executionTime: 67,
        query: {
          name: 'user_activity_report',
          parameters: ['2024-01-01']
        }
      }
      mockSuccessAPIRequest(queryResult)

      const connectionName = 'production-db'
      const queryName = 'user_activity_report'
      const data = {
        parameters: ['2024-01-01'],
        options: {
          limit: 100,
          offset: 0
        }
      }

      const result = await sqlServiceAPI.runConnectionNamedSelect(appId, connectionName, queryName, data)

      expect(result).toEqual(queryResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/sql/${connectionName}/select/${queryName}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle named query without parameters', async () => {
      const queryResult = {
        data: [{ total_users: 15420 }],
        columns: [{ name: 'total_users', type: 'BIGINT' }],
        rowCount: 1,
        executionTime: 23
      }
      mockSuccessAPIRequest(queryResult)

      const connectionName = 'analytics-db'
      const queryName = 'total_users'
      const data = {}

      const result = await sqlServiceAPI.runConnectionNamedSelect(appId, connectionName, queryName, data)

      expect(result).toEqual(queryResult)
    })

    it('should handle named query with complex parameters', async () => {
      const queryResult = {
        data: [
          { region: 'North America', revenue: 125430.50, orders: 1247 },
          { region: 'Europe', revenue: 89760.25, orders: 892 },
          { region: 'Asia Pacific', revenue: 67890.75, orders: 679 }
        ],
        summary: {
          total_revenue: 283081.50,
          total_orders: 2818,
          avg_order_value: 100.46
        },
        executionTime: 156
      }
      mockSuccessAPIRequest(queryResult)

      const connectionName = 'sales-db'
      const queryName = 'regional_sales_report'
      const data = {
        parameters: {
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          include_pending: false,
          currency: 'USD'
        },
        options: {
          includeSummary: true,
          groupBy: 'region',
          orderBy: 'revenue DESC'
        }
      }

      const result = await sqlServiceAPI.runConnectionNamedSelect(appId, connectionName, queryName, data)

      expect(result).toEqual(queryResult)
    })

    it('fails when server responds with query not found error', async () => {
      mockFailedAPIRequest('Named query not found', 404)

      const connectionName = 'test-db'
      const queryName = 'nonexistent-query'
      const data = {}
      const error = await sqlServiceAPI.runConnectionNamedSelect(appId, connectionName, queryName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Named query not found' },
        message: 'Named query not found',
        status: 404
      })
    })

    it('fails when server responds with parameter validation error', async () => {
      mockFailedAPIRequest('Required parameter "start_date" is missing', 422)

      const connectionName = 'prod-db'
      const queryName = 'date-range-report'
      const data = { parameters: {} } // Missing required parameters
      const error = await sqlServiceAPI.runConnectionNamedSelect(appId, connectionName, queryName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Required parameter "start_date" is missing' },
        message: 'Required parameter "start_date" is missing',
        status: 422
      })
    })

    it('fails when server responds with connection unavailable error', async () => {
      mockFailedAPIRequest('Database connection is temporarily unavailable', 503)

      const connectionName = 'maintenance-db'
      const queryName = 'simple-query'
      const data = {}
      const error = await sqlServiceAPI.runConnectionNamedSelect(appId, connectionName, queryName, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Database connection is temporarily unavailable' },
        message: 'Database connection is temporarily unavailable',
        status: 503
      })
    })
  })
})