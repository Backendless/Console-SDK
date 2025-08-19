describe('apiClient.analytics', () => {
  let apiClient
  let analyticsAPI

  const appId = 'test-app-id'
  const successResult = { data: 'analytics-data' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    analyticsAPI = apiClient.analytics
  })

  describe('getAppStats', () => {
    it('should make GET request with default period', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await analyticsAPI.getAppStats(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/application/stats?period=MONTH',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should make GET request with specified period', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await analyticsAPI.getAppStats(appId, 'year')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/application/stats?period=YEAR',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should transform unknown period to MONTH', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await analyticsAPI.getAppStats(appId, 'unknown')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/application/stats?period=MONTH',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Analytics data unavailable', 503)

      const error = await analyticsAPI.getAppStats(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Analytics data unavailable' },
        code   : undefined,
        headers: undefined,
        message: 'Analytics data unavailable',
        status : 503
      })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/application/stats?period=MONTH',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })
  })

  describe('performance', () => {
    it('should make GET request with transformed parameters and response', async () => {
      const serverResponse = {
        1640995200: 100, // timestamp in seconds
        1640995260: 150,
        1640995320: 200
      }

      mockSuccessAPIRequest(serverResponse)

      const aggInterval = { name: 'MINUTE', value: 60000 }
      const from = 1640995200000 // timestamp in milliseconds
      const to = 1640995320000

      const result = await analyticsAPI.performance(appId, { aggInterval, from, to })

      // Verify transformed response
      expect(result).toEqual({
        1640995200000: 100,
        1640995260000: 150,
        1640995320000: 200
      })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/performance?aggregationPeriod=MINUTE&' +
          'startEpochSecond=1640995200&endEpochSecond=1640995320',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle missing data points in response', async () => {
      const serverResponse = {
        1640995200: 100
        // Missing data for other timestamps
      }

      mockSuccessAPIRequest(serverResponse)

      const aggInterval = { name: 'MINUTE', value: 60000 }
      const from = 1640995200000
      const to = 1640995320000

      const result = await analyticsAPI.performance(appId, { aggInterval, from, to })

      expect(result).toEqual({
        1640995200000: 100,
        1640995260000: undefined,
        1640995320000: undefined
      })
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Performance data error', 500)

      const aggInterval = { name: 'MINUTE', value: 60000 }
      const from = Date.now()
      const to = Date.now() + 60000

      const error = await analyticsAPI.performance(appId, { aggInterval, from, to }).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Performance data error')
    })
  })

  describe('concurrentRequests', () => {
    it('should make GET request with transformed parameters and response', async () => {
      const serverResponse = {
        1640995200: 50,
        1640995260: 75,
        1640995320: 100
      }

      mockSuccessAPIRequest(serverResponse)

      const aggInterval = { name: 'MINUTE', value: 60000 }
      const from = 1640995200000
      const to = 1640995320000

      const result = await analyticsAPI.concurrentRequests(appId, { aggInterval, from, to })

      expect(result).toEqual({
        1640995200000: 50,
        1640995260000: 75,
        1640995320000: 100
      })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/concurrent-requests?aggregationPeriod=MINUTE&' +
          'startEpochSecond=1640995200&endEpochSecond=1640995320',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Concurrent requests data error', 503)

      const aggInterval = { name: 'HOUR', value: 3600000 }
      const from = Date.now()
      const to = Date.now() + 3600000

      const error = await analyticsAPI.concurrentRequests(appId, { aggInterval, from, to }).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(503)
      expect(error.message).toBe('Concurrent requests data error')
    })
  })

  describe('apiCalls', () => {
    it('should make GET request with basic parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period : 'month',
        columns: {}
      }

      const result = await analyticsAPI.apiCalls(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/apicalls?withSuccessCallCount=true&' +
          'withErrorCount=true&period=MONTH',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should include client type segments in query', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        clientTypes: ['JS_SDK', 'REST_API'],
        period     : 'year',
        columns    : { services: true, methods: false }
      }

      const result = await analyticsAPI.apiCalls(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/apicalls?apiKeyName%5BJS_SDK%5D=true&' +
          'apiKeyName%5BREST_API%5D=true&withServiceName=true&withMethodName=false&' +
          'withSuccessCallCount=true&withErrorCount=true&period=YEAR',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should include custom date range for CUSTOM period', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period : 'custom',
        from   : '2023-01-01',
        to     : '2023-01-31',
        columns: {}
      }

      const result = await analyticsAPI.apiCalls(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/apicalls?withSuccessCallCount=true&' +
          'withErrorCount=true&period=CUSTOM&dateFrom=2023-01-01&dateTo=2023-01-31',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('API calls data error', 400)

      const options = { period: 'month', columns: {} }
      const error = await analyticsAPI.apiCalls(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('API calls data error')
    })
  })

  describe('messages', () => {
    it('should make GET request with basic parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period: 'month'
      }

      const result = await analyticsAPI.messages(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/messaging?period=MONTH',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should include client types and messaging types in query', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        clientTypes   : ['ANDROID', 'IOS'],
        messagingTypes: ['PUSH', 'EMAIL'],
        period        : 'year'
      }

      const result = await analyticsAPI.messages(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/messaging?apiKeyName%5BANDROID%5D=true&' +
          'apiKeyName%5BIOS%5D=true&messagingType%5BPUSH%5D=true&messagingType%5BEMAIL%5D=true&period=YEAR',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should include custom date range for CUSTOM period', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period: 'custom',
        from  : '2023-01-01',
        to    : '2023-01-31'
      }

      const result = await analyticsAPI.messages(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/messaging?period=CUSTOM&dateFrom=2023-01-01&dateTo=2023-01-31',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Messaging data error', 404)

      const options = { period: 'month' }
      const error = await analyticsAPI.messages(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Messaging data error')
    })
  })

  describe('users', () => {
    it('should make GET request with basic parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period: 'month'
      }

      const result = await analyticsAPI.users(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/userstats?withActiveUsers=true&' +
          'withNewUsers=true&withRegisteredUsers=true&withReturningUsers=true&period=MONTH',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should include custom date range for CUSTOM period', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period: 'custom',
        from  : '2023-01-01',
        to    : '2023-01-31'
      }

      const result = await analyticsAPI.users(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/userstats?withActiveUsers=true&' +
          'withNewUsers=true&withRegisteredUsers=true&withReturningUsers=true&' +
          'period=CUSTOM&dateFrom=2023-01-01&dateTo=2023-01-31',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle different period types', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        period: 'year'
      }

      const result = await analyticsAPI.users(appId, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/userstats?withActiveUsers=true&' +
          'withNewUsers=true&withRegisteredUsers=true&withReturningUsers=true&period=YEAR',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('User statistics error', 500)

      const options = { period: 'month' }
      const error = await analyticsAPI.users(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('User statistics error')
    })
  })

  describe('workers', () => {
    it('should make GET request with query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const query = {
        limit : 10,
        offset: 20,
        status: 'active'
      }

      const result = await analyticsAPI.workers(appId, query)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/workers?limit=10&offset=20&status=active',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle empty query object', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await analyticsAPI.workers(appId, {})

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/workers',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle null query', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await analyticsAPI.workers(appId, null)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/workers',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Workers data error', 403)

      const query = { status: 'active' }
      const error = await analyticsAPI.workers(appId, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
      expect(error.message).toBe('Workers data error')
    })
  })
})
