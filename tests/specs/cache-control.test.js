describe('apiClient.cacheControl', () => {
  let apiClient
  let cacheControlAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    cacheControlAPI = apiClient.cacheControl
  })

  describe('loadAllServiceItems', () => {
    it('should make GET request to load all service items', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const result = await cacheControlAPI.loadAllServiceItems(appId, service)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different service types', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'messaging'
      const result = await cacheControlAPI.loadAllServiceItems(appId, service)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}`,
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

      const service = 'data-service'
      const error = await cacheControlAPI.loadAllServiceItems(appId, service).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const service = 'data-service'
      const error = await cacheControlAPI.loadAllServiceItems(appId, service).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })
    })
  })

  describe('loadServiceItem', () => {
    it('should make GET request to load specific service item', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'Person'
      const result = await cacheControlAPI.loadServiceItem(appId, service, target)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex target names', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'messaging'
      const target = 'push-notifications'
      const result = await cacheControlAPI.loadServiceItem(appId, service, target)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Service item not found', 404)

      const service = 'data-service'
      const target = 'NonExistentTable'
      const error = await cacheControlAPI.loadServiceItem(appId, service, target).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service item not found' },
        message: 'Service item not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const service = 'data-service'
      const target = 'RestrictedTable'
      const error = await cacheControlAPI.loadServiceItem(appId, service, target).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied' },
        message: 'Access denied',
        status: 403
      })
    })
  })

  describe('createServiceItem', () => {
    it('should make POST request to create service item', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'UserProfile'
      const data = {
        cacheTTL: 3600,
        enabled: true,
        conditions: ['status=active']
      }

      const result = await cacheControlAPI.createServiceItem(appId, service, target, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal cache configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'messaging'
      const target = 'channels'
      const data = { enabled: false }

      const result = await cacheControlAPI.createServiceItem(appId, service, target, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex cache configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'Orders'
      const data = {
        cacheTTL: 1800,
        enabled: true,
        maxSize: 1000,
        evictionPolicy: 'LRU',
        conditions: ['created > 2023-01-01', 'status != deleted'],
        refreshStrategy: 'ON_WRITE'
      }

      const result = await cacheControlAPI.createServiceItem(appId, service, target, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with bad request error', async () => {
      mockFailedAPIRequest('Invalid cache configuration', 400)

      const service = 'data-service'
      const target = 'InvalidTable'
      const data = { cacheTTL: -1 }
      const error = await cacheControlAPI.createServiceItem(appId, service, target, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid cache configuration' },
        message: 'Invalid cache configuration',
        status: 400
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Cache item already exists', 409)

      const service = 'data-service'
      const target = 'ExistingTable'
      const data = { enabled: true }
      const error = await cacheControlAPI.createServiceItem(appId, service, target, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cache item already exists' },
        message: 'Cache item already exists',
        status: 409
      })
    })
  })

  describe('updateServiceItem', () => {
    it('should make PUT request to update service item', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'UserProfile'
      const data = {
        cacheTTL: 7200,
        enabled: false,
        conditions: ['status=active', 'verified=true']
      }

      const result = await cacheControlAPI.updateServiceItem(appId, service, target, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: JSON.stringify(data),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial updates', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'messaging'
      const target = 'notifications'
      const data = { enabled: true }

      const result = await cacheControlAPI.updateServiceItem(appId, service, target, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: JSON.stringify(data),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle TTL updates', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'Products'
      const data = { cacheTTL: 14400 }

      const result = await cacheControlAPI.updateServiceItem(appId, service, target, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: JSON.stringify(data),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Service item not found', 404)

      const service = 'data-service'
      const target = 'NonExistentTable'
      const data = { enabled: false }
      const error = await cacheControlAPI.updateServiceItem(appId, service, target, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service item not found' },
        message: 'Service item not found',
        status: 404
      })
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid TTL value', 422)

      const service = 'data-service'
      const target = 'TestTable'
      const data = { cacheTTL: 'invalid' }
      const error = await cacheControlAPI.updateServiceItem(appId, service, target, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid TTL value' },
        message: 'Invalid TTL value',
        status: 422
      })
    })
  })

  describe('deleteServiceItem', () => {
    it('should make DELETE request to delete service item', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'UserProfile'
      const result = await cacheControlAPI.deleteServiceItem(appId, service, target)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different service types for deletion', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'messaging'
      const target = 'push-templates'
      const result = await cacheControlAPI.deleteServiceItem(appId, service, target)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex target names for deletion', async () => {
      mockSuccessAPIRequest(successResult)

      const service = 'data-service'
      const target = 'user-session-data'
      const result = await cacheControlAPI.deleteServiceItem(appId, service, target)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cachecontrol/${service}/${target}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Service item not found', 404)

      const service = 'data-service'
      const target = 'NonExistentTable'
      const error = await cacheControlAPI.deleteServiceItem(appId, service, target).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service item not found' },
        message: 'Service item not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Cannot delete system cache item', 403)

      const service = 'data-service'
      const target = 'SystemTable'
      const error = await cacheControlAPI.deleteServiceItem(appId, service, target).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete system cache item' },
        message: 'Cannot delete system cache item',
        status: 403
      })
    })

    it('fails when server responds with internal server error', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const service = 'data-service'
      const target = 'TestTable'
      const error = await cacheControlAPI.deleteServiceItem(appId, service, target).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Internal server error' },
        message: 'Internal server error',
        status: 500
      })
    })
  })
})
