describe('apiClient.navigator', () => {
  let apiClient
  let navigatorAPI

  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    navigatorAPI = apiClient.navigator
  })

  describe('loadNavigatorOptions', () => {
    it('should make GET request to load navigator options', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await navigatorAPI.loadNavigatorOptions()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await navigatorAPI.loadNavigatorOptions().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await navigatorAPI.loadNavigatorOptions().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('log', () => {
    it('should make POST request with log data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        level: 'info',
        message: 'Navigator action performed',
        timestamp: Date.now(),
        user: 'user-123',
        action: 'navigate',
        target: '/dashboard'
      }

      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle simple log data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        message: 'Simple log entry'
      }

      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle complex nested log data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        level: 'error',
        message: 'Navigation error occurred',
        error: {
          code: 'NAV_ERROR_001',
          stack: 'Error stack trace here',
          context: {
            route: '/complex/path',
            params: { id: 123, type: 'admin' },
            user: {
              id: 'user-456',
              role: 'admin'
            }
          }
        },
        metadata: {
          browser: 'Chrome',
          version: '91.0',
          timestamp: new Date().toISOString()
        }
      }

      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty log data object', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {}
      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle string log data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = 'Simple string log message'
      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: data,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle null log data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = null
      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: data,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined log data', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await navigatorAPI.log()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle array log data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = [
        { message: 'First log entry', level: 'info' },
        { message: 'Second log entry', level: 'warn' },
        { message: 'Third log entry', level: 'error' }
      ]

      const result = await navigatorAPI.log(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Logging service unavailable', 503)

      const data = { message: 'Test log' }
      const error = await navigatorAPI.log(data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Logging service unavailable' },
        message: 'Logging service unavailable',
        status: 503
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with bad request error', async () => {
      mockFailedAPIRequest('Invalid log format', 400)

      const data = { message: 'Invalid log' }
      const error = await navigatorAPI.log(data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid log format' },
        message: 'Invalid log format',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const data = { message: 'Restricted log' }
      const error = await navigatorAPI.log(data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied' },
        message: 'Access denied',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/navigator/log',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })
})
