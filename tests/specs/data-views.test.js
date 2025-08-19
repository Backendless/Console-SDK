import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.dataViews', () => {
  let apiClient
  let dataViewsAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    dataViewsAPI = apiClient.dataViews
  })

  describe('getViews', () => {
    it('should make GET request to get views', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataViewsAPI.getViews(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views`,
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

      const error = await dataViewsAPI.getViews(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await dataViewsAPI.getViews(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })
    })
  })

  describe('getViewRecords', () => {
    it('should make GET request to get view records', async () => {
      mockSuccessAPIRequest(successResult)

      const viewName = 'active-users-view'
      const result = await dataViewsAPI.getViewRecords(appId, viewName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${viewName}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle view names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const viewName = 'sales-report-2024'
      const result = await dataViewsAPI.getViewRecords(appId, viewName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${viewName}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('View not found', 404)

      const viewName = 'nonexistent-view'
      const error = await dataViewsAPI.getViewRecords(appId, viewName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View not found' },
        message: 'View not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Access denied to view', 403)

      const viewName = 'restricted-view'
      const error = await dataViewsAPI.getViewRecords(appId, viewName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to view' },
        message: 'Access denied to view',
        status: 403
      })
    })
  })

  describe('createView', () => {
    it('should make POST request to create view', async () => {
      mockSuccessAPIRequest(successResult)

      const view = {
        name: 'Active Users View',
        tableName: 'Users',
        whereClause: 'status = "active"',
        columns: ['objectId', 'name', 'email', 'created'],
        orderBy: 'created DESC'
      }

      const result = await dataViewsAPI.createView(appId, view)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views`,
        body: JSON.stringify(view),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal view creation', async () => {
      mockSuccessAPIRequest(successResult)

      const view = {
        name: 'Simple View',
        tableName: 'Products'
      }

      const result = await dataViewsAPI.createView(appId, view)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views`,
        body: JSON.stringify(view),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex view with joins and grouping', async () => {
      mockSuccessAPIRequest(successResult)

      const view = {
        name: 'User Orders Summary',
        tableName: 'Orders',
        whereClause: 'status != "cancelled"',
        columns: ['user.name', 'COUNT(*) as orderCount', 'SUM(total) as totalAmount'],
        joins: [{ table: 'Users', on: 'Orders.userId = Users.objectId', alias: 'user' }],
        groupBy: 'user.objectId',
        having: 'COUNT(*) > 1',
        orderBy: 'totalAmount DESC'
      }

      const result = await dataViewsAPI.createView(appId, view)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views`,
        body: JSON.stringify(view),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('View name is required', 400)

      const view = { tableName: 'Users' }
      const error = await dataViewsAPI.createView(appId, view).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View name is required' },
        message: 'View name is required',
        status: 400
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('View name already exists', 409)

      const view = { name: 'Existing View', tableName: 'Users' }
      const error = await dataViewsAPI.createView(appId, view).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View name already exists' },
        message: 'View name already exists',
        status: 409
      })
    })
  })

  describe('updateView', () => {
    it('should make PUT request to update view', async () => {
      mockSuccessAPIRequest(successResult)

      const view = {
        viewId: 'view-123',
        name: 'Updated Active Users View',
        tableName: 'Users',
        whereClause: 'status = "active" AND verified = true',
        columns: ['objectId', 'name', 'email', 'created', 'lastLogin'],
        orderBy: 'lastLogin DESC'
      }

      const result = await dataViewsAPI.updateView(appId, view)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${view.viewId}`,
        body: JSON.stringify(view),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial view updates', async () => {
      mockSuccessAPIRequest(successResult)

      const view = {
        viewId: 'view-456',
        whereClause: 'status = "premium"'
      }

      const result = await dataViewsAPI.updateView(appId, view)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${view.viewId}`,
        body: JSON.stringify(view),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID view IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const view = {
        viewId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Updated View Name'
      }

      const result = await dataViewsAPI.updateView(appId, view)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${view.viewId}`,
        body: JSON.stringify(view),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('View not found', 404)

      const view = { viewId: 'nonexistent-view', name: 'Updated Name' }
      const error = await dataViewsAPI.updateView(appId, view).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View not found' },
        message: 'View not found',
        status: 404
      })
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid WHERE clause syntax', 422)

      const view = { viewId: 'view-123', whereClause: 'invalid syntax here' }
      const error = await dataViewsAPI.updateView(appId, view).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid WHERE clause syntax' },
        message: 'Invalid WHERE clause syntax',
        status: 422
      })
    })
  })

  describe('renameView', () => {
    it('should make PUT request to rename view', async () => {
      mockSuccessAPIRequest(successResult)

      const viewId = 'view-789'
      const name = 'Renamed View'

      const result = await dataViewsAPI.renameView(appId, viewId, name)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${viewId}/name`,
        body: JSON.stringify({ name }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex view names', async () => {
      mockSuccessAPIRequest(successResult)

      const viewId = 'view-complex-123'
      const name = 'Complex View Name with Spaces & Symbols'

      const result = await dataViewsAPI.renameView(appId, viewId, name)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${viewId}/name`,
        body: JSON.stringify({ name }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('View not found', 404)

      const viewId = 'nonexistent-view'
      const name = 'New Name'
      const error = await dataViewsAPI.renameView(appId, viewId, name).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View not found' },
        message: 'View not found',
        status: 404
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('View name already exists', 409)

      const viewId = 'view-123'
      const name = 'Existing View Name'
      const error = await dataViewsAPI.renameView(appId, viewId, name).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View name already exists' },
        message: 'View name already exists',
        status: 409
      })
    })
  })

  describe('deleteView', () => {
    it('should make DELETE request to delete view', async () => {
      mockSuccessAPIRequest(successResult)

      const viewId = 'view-to-delete-123'
      const result = await dataViewsAPI.deleteView(appId, viewId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${viewId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID view IDs for deletion', async () => {
      mockSuccessAPIRequest(successResult)

      const viewId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await dataViewsAPI.deleteView(appId, viewId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-views/${viewId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('View not found', 404)

      const viewId = 'nonexistent-view'
      const error = await dataViewsAPI.deleteView(appId, viewId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'View not found' },
        message: 'View not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Cannot delete system view', 403)

      const viewId = 'system-view-123'
      const error = await dataViewsAPI.deleteView(appId, viewId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete system view' },
        message: 'Cannot delete system view',
        status: 403
      })
    })
  })

  describe('loadRecords', () => {
    it('should make POST request to load records', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Users', viewId: 'view-123' }
      const query = { pageSize: 50, offset: 0, where: 'status = "active"' }

      const result = await dataViewsAPI.loadRecords(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/Users/find`,
        body: JSON.stringify({ offset: 0, pageSize: 50, where: 'status = "active"' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty query', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Products', viewId: 'view-456' }
      const query = {}

      const result = await dataViewsAPI.loadRecords(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/Products/find`,
        body: JSON.stringify({ offset: 0, pageSize: 15 }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex query with sorting and relations', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Orders', viewId: 'view-789' }
      const query = {
        pageSize: 25,
        offset: 100,
        where: 'total > 100 AND status = "completed"',
        sortBy: 'created DESC',
        loadRelations: ['customer', 'items']
      }

      const result = await dataViewsAPI.loadRecords(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/Orders/find`,
        body: JSON.stringify({ offset: 100, pageSize: 25, where: 'total > 100 AND status = "completed"', loadRelations: ['customer', 'items'], sortBy: 'created DESC' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with query syntax error', async () => {
      mockFailedAPIRequest('Invalid query syntax', 400)

      const view = { name: 'Users', viewId: 'view-123' }
      const query = { where: 'invalid syntax here' }
      const error = await dataViewsAPI.loadRecords(appId, view, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid query syntax' },
        message: 'Invalid query syntax',
        status: 400
      })
    })
  })

  describe('getRecordsCount', () => {
    it('should make POST request to get records count', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Users', viewId: 'view-123' }
      const query = { where: 'status = "active"' }

      const result = await dataViewsAPI.getRecordsCount(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/Users/count`,
        body: JSON.stringify({ where: 'status = "active"' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle count with resetCache parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Products', viewId: 'view-456' }
      const query = { where: 'price > 50' }
      const resetCache = true

      const result = await dataViewsAPI.getRecordsCount(appId, view, query, resetCache)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/Products/count`,
        body: JSON.stringify({ where: 'price > 50' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty query for total count', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Orders', viewId: 'view-789' }
      const query = {}

      const result = await dataViewsAPI.getRecordsCount(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/Orders/count`,
        body: JSON.stringify({}),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with query error', async () => {
      mockFailedAPIRequest('Invalid WHERE clause', 400)

      const view = { name: 'Users', viewId: 'view-123' }
      const query = { where: 'invalid condition' }
      const error = await dataViewsAPI.getRecordsCount(appId, view, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid WHERE clause' },
        message: 'Invalid WHERE clause',
        status: 400
      })
    })
  })

  describe('getRecordsCounts', () => {
    it('should make POST request to get multiple records counts', async () => {
      mockSuccessAPIRequest(successResult)

      const views = [
        { name: 'Users', viewId: 'view-123' },
        { name: 'Orders', viewId: 'view-456' },
        { name: 'Products', viewId: 'view-789' }
      ]

      const result = await dataViewsAPI.getRecordsCounts(appId, views)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables-counters`,
        body: JSON.stringify({ tables: views, resetCache: undefined }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle counts with resetCache parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const views = [
        { name: 'Users', viewId: 'view-123' },
        { name: 'Products', viewId: 'view-456' }
      ]
      const resetCache = true

      const result = await dataViewsAPI.getRecordsCounts(appId, views, resetCache)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables-counters`,
        body: JSON.stringify({ tables: views, resetCache: true }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty views array', async () => {
      mockSuccessAPIRequest(successResult)

      const views = []

      const result = await dataViewsAPI.getRecordsCounts(appId, views)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables-counters`,
        body: JSON.stringify({ tables: views, resetCache: undefined }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadGroupRecords', () => {
    it('should make POST request to load group records', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Orders', viewId: 'view-123' }
      const query = { groupBy: 'status', aggregation: 'COUNT(*)', orderBy: 'count DESC' }

      const result = await dataViewsAPI.loadGroupRecords(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/data-grouping/Orders`,
        body: JSON.stringify({ offset: 0, pageSize: 15, groupPageSize: 5, recordsPageSize: 5, groupBy: 'status' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex grouping with multiple fields', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Sales', viewId: 'view-456' }
      const query = {
        groupBy: 'region, category',
        aggregation: 'SUM(amount), AVG(amount), COUNT(*)',
        having: 'COUNT(*) > 10',
        where: 'date > "2024-01-01"',
        orderBy: 'SUM(amount) DESC'
      }

      const result = await dataViewsAPI.loadGroupRecords(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/data-grouping/Sales`,
        body: JSON.stringify({ offset: 0, pageSize: 15, groupPageSize: 5, recordsPageSize: 5, where: 'date > "2024-01-01"', groupBy: 'region, category' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty query for basic grouping', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Users', viewId: 'view-789' }
      const query = {}

      const result = await dataViewsAPI.loadGroupRecords(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/data-grouping/Users`,
        body: JSON.stringify({ offset: 0, pageSize: 15, groupPageSize: 5, recordsPageSize: 5 }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getGroupRecordsCount', () => {
    it('should make POST request to get group records count', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Orders', viewId: 'view-123' }
      const query = { groupBy: 'status', where: 'created > "2024-01-01"' }

      const result = await dataViewsAPI.getGroupRecordsCount(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/data-grouping/Orders/count`,
        body: JSON.stringify({ where: 'created > "2024-01-01"' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle group count with having clause', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Sales', viewId: 'view-456' }
      const query = {
        groupBy: 'region',
        having: 'SUM(amount) > 1000',
        where: 'status = "completed"'
      }

      const result = await dataViewsAPI.getGroupRecordsCount(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/data-grouping/Sales/count`,
        body: JSON.stringify({ where: 'status = "completed"' }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty query for total group count', async () => {
      mockSuccessAPIRequest(successResult)

      const view = { name: 'Products', viewId: 'view-789' }
      const query = {}

      const result = await dataViewsAPI.getGroupRecordsCount(appId, view, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/data-grouping/Products/count`,
        body: JSON.stringify(query),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadSampleRecords', () => {
    it('should make POST request to load sample records', async () => {
      mockSuccessAPIRequest(successResult)

      const table = { name: 'Users', columns: [{ name: 'objectId', dataType: 'STRING' }] }
      const query = { pageSize: 10, where: 'created > "2024-01-01"' }

      const result = await dataViewsAPI.loadSampleRecords(appId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-pre-view/Users/find`,
        body: JSON.stringify({ pageSize: 10, offset: 0 }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle table names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const table = { name: 'User Profile Data', columns: [{ name: 'objectId', dataType: 'STRING' }] }
      const query = { pageSize: 5 }

      const result = await dataViewsAPI.loadSampleRecords(appId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-pre-view/User%20Profile%20Data/find`,
        body: JSON.stringify({ pageSize: 5, offset: 0 }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty query for default sample', async () => {
      mockSuccessAPIRequest(successResult)

      const table = { name: 'Products', columns: [{ name: 'objectId', dataType: 'STRING' }] }

      const result = await dataViewsAPI.loadSampleRecords(appId, table)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-pre-view/Products/find`,
        body: JSON.stringify({ pageSize: 15, offset: 0 }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex sample query with relations', async () => {
      mockSuccessAPIRequest(successResult)

      const table = { name: 'Orders', columns: [{ name: 'objectId', dataType: 'STRING' }] }
      const query = {
        pageSize: 15,
        where: 'total > 50',
        sortBy: 'created DESC',
        loadRelations: ['customer', 'items.product'],
        properties: ['objectId', 'total', 'status', 'customer.name']
      }

      const result = await dataViewsAPI.loadSampleRecords(appId, table, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/table-pre-view/Orders/find`,
        body: JSON.stringify({ pageSize: 15, offset: 0, sortBy: 'created DESC', loadRelations: ['customer', 'items.product'] }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with table not found error', async () => {
      mockFailedAPIRequest('Table not found', 404)

      const table = { name: 'NonexistentTable', columns: [{ name: 'objectId', dataType: 'STRING' }] }
      const query = { pageSize: 10 }
      const error = await dataViewsAPI.loadSampleRecords(appId, table, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Table not found' },
        message: 'Table not found',
        status: 404
      })
    })

    it('fails when server responds with query validation error', async () => {
      mockFailedAPIRequest('Invalid sample query', 400)

      const table = { name: 'Users', columns: [{ name: 'objectId', dataType: 'STRING' }] }
      const query = { where: 'invalid syntax' }
      const error = await dataViewsAPI.loadSampleRecords(appId, table, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid sample query' },
        message: 'Invalid sample query',
        status: 400
      })
    })
  })
})
