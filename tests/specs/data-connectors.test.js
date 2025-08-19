describe('apiClient.dataConnectors', () => {
  let apiClient
  let dataConnectorsAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    dataConnectorsAPI = apiClient.dataConnectors
  })

  describe('getTemplates', () => {
    it('should make GET request to get connector templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataConnectorsAPI.getTemplates(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/templates`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await dataConnectorsAPI.getTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Unauthorized' },
        message: 'Unauthorized',
        status : 401
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await dataConnectorsAPI.getTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Service unavailable' },
        message: 'Service unavailable',
        status : 503
      })
    })
  })

  describe('getConnectors', () => {
    it('should make GET request to get connectors', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataConnectorsAPI.getConnectors(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('should make GET request with forceRefresh parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataConnectorsAPI.getConnectors(appId, true)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors?forceRefresh=true`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('should handle falsy forceRefresh parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataConnectorsAPI.getConnectors(appId, false)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors?forceRefresh=false`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await dataConnectorsAPI.getConnectors(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Access denied' },
        message: 'Access denied',
        status : 403
      })
    })
  })

  describe('activateConnector', () => {
    it('should make POST request to activate connector', async () => {
      mockSuccessAPIRequest(successResult)

      const connector = {
        name    : 'mysql-connector',
        type    : 'mysql',
        host    : 'localhost',
        port    : 3306,
        database: 'testdb',
        username: 'user',
        password: 'pass'
      }

      const result = await dataConnectorsAPI.activateConnector(appId, connector)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors`,
        body           : JSON.stringify(connector),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle PostgreSQL connector', async () => {
      mockSuccessAPIRequest(successResult)

      const connector = {
        name    : 'postgres-connector',
        type    : 'postgresql',
        host    : 'db.example.com',
        port    : 5432,
        database: 'production',
        username: 'dbuser',
        password: 'dbpass',
        ssl     : true
      }

      const result = await dataConnectorsAPI.activateConnector(appId, connector)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors`,
        body           : JSON.stringify(connector),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with bad request error', async () => {
      mockFailedAPIRequest('Invalid connector configuration', 400)

      const connector = { name: 'invalid-connector' }
      const error = await dataConnectorsAPI.activateConnector(appId, connector).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid connector configuration' },
        message: 'Invalid connector configuration',
        status : 400
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Connector already exists', 409)

      const connector = { name: 'existing-connector', type: 'mysql' }
      const error = await dataConnectorsAPI.activateConnector(appId, connector).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Connector already exists' },
        message: 'Connector already exists',
        status : 409
      })
    })
  })

  describe('deleteConnector', () => {
    it('should make DELETE request to delete connector', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'connector-123'
      const result = await dataConnectorsAPI.deleteConnector(appId, connectorId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}`,
        body           : undefined,
        method         : 'DELETE',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle UUID connector IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await dataConnectorsAPI.deleteConnector(appId, connectorId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}`,
        body           : undefined,
        method         : 'DELETE',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Connector not found', 404)

      const connectorId = 'nonexistent-connector'
      const error = await dataConnectorsAPI.deleteConnector(appId, connectorId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Connector not found' },
        message: 'Connector not found',
        status : 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Cannot delete system connector', 403)

      const connectorId = 'system-connector'
      const error = await dataConnectorsAPI.deleteConnector(appId, connectorId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Cannot delete system connector' },
        message: 'Cannot delete system connector',
        status : 403
      })
    })
  })

  describe('updateConnector', () => {
    it('should make PUT request to update connector', async () => {
      mockSuccessAPIRequest(successResult)

      const connector = {
        id      : 'connector-123',
        name    : 'updated-mysql-connector',
        type    : 'mysql',
        host    : 'updated-host.com',
        port    : 3306,
        database: 'updated_db'
      }

      const result = await dataConnectorsAPI.updateConnector(appId, connector)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connector.id}`,
        body           : JSON.stringify(connector),
        method         : 'PUT',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle partial connector updates', async () => {
      mockSuccessAPIRequest(successResult)

      const connector = {
        id  : 'connector-456',
        name: 'renamed-connector'
      }

      const result = await dataConnectorsAPI.updateConnector(appId, connector)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connector.id}`,
        body           : JSON.stringify(connector),
        method         : 'PUT',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid port number', 422)

      const connector = { id: 'connector-123', port: 'invalid' }
      const error = await dataConnectorsAPI.updateConnector(appId, connector).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid port number' },
        message: 'Invalid port number',
        status : 422
      })
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Connector not found', 404)

      const connector = { id: 'nonexistent-connector', name: 'test' }
      const error = await dataConnectorsAPI.updateConnector(appId, connector).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Connector not found' },
        message: 'Connector not found',
        status : 404
      })
    })
  })

  describe('getConnectorTables', () => {
    it('should make GET request to get connector tables', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'connector-123'
      const result = await dataConnectorsAPI.getConnectorTables(appId, connectorId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
        query          : undefined
      }])
    })

    it('should make GET request with query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'connector-123'
      const query = { filter: 'user_*', limit: 10 }
      const result = await dataConnectorsAPI.getConnectorTables(appId, connectorId, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables?filter=user_*&limit=10`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('should handle schema filtering', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'postgres-connector'
      const query = { schema: 'public', includeViews: true }
      const result = await dataConnectorsAPI.getConnectorTables(appId, connectorId, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables?schema=public&includeViews=true`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('fails when server responds with connection error', async () => {
      mockFailedAPIRequest('Failed to connect to database', 502)

      const connectorId = 'broken-connector'
      const error = await dataConnectorsAPI.getConnectorTables(appId, connectorId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Failed to connect to database' },
        message: 'No connection with server',
        status : 502
      })
    })
  })

  describe('getConnectorTableEntries', () => {
    it('should make POST request to get table entries', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'connector-123'
      const table = { name: 'users', columns: [] }
      const query = { sqlSearch: true, where: 'status = "active"', pageSize: 50 }

      const result = await dataConnectorsAPI.getConnectorTableEntries(appId, connectorId, table, query)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables/${table.name}/entries/find`,
        body           : JSON.stringify({ pageSize: 50, offset: 0, where: 'status = "active"', }),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle simple table queries', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'mysql-connector'
      const table = { name: 'products' }
      const query = { pageSize: 100 }

      const result = await dataConnectorsAPI.getConnectorTableEntries(appId, connectorId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables/${table.name}/entries/find`,
        body           : JSON.stringify({ ...query, offset: 0 }),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle complex queries with sorting', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'postgres-connector'
      const table = { name: 'orders', columns: [] }
      const query = {
        sqlSearch: true,
        where    : 'created_at > "2023-01-01"',
        sortBy   : 'created_at desc',
        pageSize : 25,
        offset   : 50
      }

      const result = await dataConnectorsAPI.getConnectorTableEntries(appId, connectorId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables/${table.name}/entries/find`,
        body           : JSON.stringify({
          pageSize: 25,
          offset  : 50,
          where   : 'created_at > "2023-01-01"',
          sortBy  : 'created_at desc'
        }),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with query syntax error', async () => {
      mockFailedAPIRequest('Invalid SQL syntax', 400)

      const connectorId = 'connector-123'
      const table = { name: 'users', columns: [] }
      const query = { where: 'invalid syntax here' }
      const error = await dataConnectorsAPI.getConnectorTableEntries(appId, connectorId, table, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid SQL syntax' },
        message: 'Invalid SQL syntax',
        status : 400
      })
    })
  })

  describe('getConnectorTableEntriesCount', () => {
    it('should make POST request to get entries count', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'connector-123'
      const table = { name: 'users', columns: [] }
      const query = { where: 'active = true' }

      const result = await dataConnectorsAPI.getConnectorTableEntriesCount(appId, connectorId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables/${table.name}/entries/count`,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle count with resetCache parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'mysql-connector'
      const table = { name: 'products', columns: [] }
      const query = { where: 'price > 100' }
      const resetCache = true

      const result = await dataConnectorsAPI.getConnectorTableEntriesCount(appId, connectorId, table, query, resetCache)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables/${table.name}/entries/count`,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle empty query for total count', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'postgres-connector'
      const table = { name: 'orders', columns: [] }
      const query = {}

      const result = await dataConnectorsAPI.getConnectorTableEntriesCount(appId, connectorId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/tables/${table.name}/entries/count`,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {  },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with database error', async () => {
      mockFailedAPIRequest('Database connection lost', 500)

      const connectorId = 'failing-connector'
      const table = { name: 'test_table', columns: [] }
      const query = {}
      const error = await dataConnectorsAPI.getConnectorTableEntriesCount(appId, connectorId, table, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Database connection lost' },
        message: 'Database connection lost',
        status : 500
      })
    })
  })

  describe('getConnectorStoredProcedures', () => {
    it('should make GET request to get stored procedures', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'connector-123'
      const result = await dataConnectorsAPI.getConnectorStoredProcedures(appId, connectorId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/storedprocs`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('should make GET request with forceRefresh option', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'postgres-connector'
      const options = { forceRefresh: true }
      const result = await dataConnectorsAPI.getConnectorStoredProcedures(appId, connectorId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/storedprocs?forceRefresh=true`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('should handle empty options object', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'mysql-connector'
      const options = {}
      const result = await dataConnectorsAPI.getConnectorStoredProcedures(appId, connectorId, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/storedprocs`,
        body           : undefined,
        method         : 'GET',
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false,
      }])
    })

    it('fails when server responds with not supported error', async () => {
      mockFailedAPIRequest('Stored procedures not supported for this connector type', 400)

      const connectorId = 'sqlite-connector'
      const error = await dataConnectorsAPI.getConnectorStoredProcedures(appId, connectorId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Stored procedures not supported for this connector type' },
        message: 'Stored procedures not supported for this connector type',
        status : 400
      })
    })
  })

  describe('executeConnectorStoredProcedure', () => {
    it('should make POST request to execute stored procedure', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'mysql-connector'
      const procedureId = 'sp_get_user_stats'
      const params = { userId: 12345, startDate: '2023-01-01' }

      const result = await dataConnectorsAPI.executeConnectorStoredProcedure(appId, connectorId, procedureId, params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/storedprocs/${procedureId}/execution`,
        body           : JSON.stringify(params),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle procedure execution without parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'postgres-connector'
      const procedureId = 'sp_get_all_users'
      const params = {}

      const result = await dataConnectorsAPI.executeConnectorStoredProcedure(appId, connectorId, procedureId, params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/storedprocs/${procedureId}/execution`,
        body           : JSON.stringify(params),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle complex procedure parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'oracle-connector'
      const procedureId = 'sp_complex_calculation'
      const params = {
        input_array: [1, 2, 3, 4, 5],
        config     : { precision: 2, rounding: 'up' },
        flags      : { debug: true, validate: false }
      }

      const result = await dataConnectorsAPI.executeConnectorStoredProcedure(appId, connectorId, procedureId, params)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/dataconnectors/${connectorId}/storedprocs/${procedureId}/execution`,
        body           : JSON.stringify(params),
        method         : 'POST',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with procedure not found error', async () => {
      mockFailedAPIRequest('Stored procedure not found', 404)

      const connectorId = 'mysql-connector'
      const procedureId = 'nonexistent_procedure'
      const params = {}
      const error = await dataConnectorsAPI.executeConnectorStoredProcedure(appId, connectorId, procedureId, params).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Stored procedure not found' },
        message: 'Stored procedure not found',
        status : 404
      })
    })

    it('fails when server responds with parameter validation error', async () => {
      mockFailedAPIRequest('Invalid procedure parameters', 422)

      const connectorId = 'postgres-connector'
      const procedureId = 'sp_validate_user'
      const params = { invalidParam: 'value' }
      const error = await dataConnectorsAPI.executeConnectorStoredProcedure(appId, connectorId, procedureId, params).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid procedure parameters' },
        message: 'Invalid procedure parameters',
        status : 422
      })
    })

    it('fails when server responds with execution timeout error', async () => {
      mockFailedAPIRequest('Procedure execution timeout', 408)

      const connectorId = 'slow-connector'
      const procedureId = 'sp_long_running_task'
      const params = { timeout: 300000 }
      const error = await dataConnectorsAPI.executeConnectorStoredProcedure(appId, connectorId, procedureId, params).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Procedure execution timeout' },
        message: 'Procedure execution timeout',
        status : 408
      })
    })
  })
})
