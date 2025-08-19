describe('apiClient.status', () => {
  let apiClient
  let statusAPI

  const successResult = { status: 'active', version: '1.0.0' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    statusAPI = apiClient.status
  })

  describe('status (deprecated)', () => {
    let consoleWarnSpy

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      // Clear the cached status request to ensure test isolation
      delete apiClient.request.context.statusRequest
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
    })

    it('should delegate to system.loadStatus and show deprecation warning', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await statusAPI()

      expect(result).toEqual(successResult)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'apiClient.status(force) is deprecated, use apiClient.system.loadStatus(force)'
      )

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/status',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should pass force parameter to system.loadStatus', async () => {
      mockSuccessAPIRequest(successResult)

      const force = true
      const result = await statusAPI(force)

      expect(result).toEqual(successResult)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'apiClient.status(force) is deprecated, use apiClient.system.loadStatus(force)'
      )

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/status',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle false force parameter and use cached request', async () => {
      // First call creates the cache
      mockSuccessAPIRequest(successResult)
      await statusAPI(true) // force=true creates initial request

      // Second call should reuse cached request
      const result = await statusAPI(false)

      expect(result).toEqual(successResult)

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'apiClient.status(force) is deprecated, use apiClient.system.loadStatus(force)'
      )

      // Only one actual request should be made due to caching
      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/status',
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

      // Force a new request by using force=true to bypass cache
      const error = await statusAPI(true).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'apiClient.status(force) is deprecated, use apiClient.system.loadStatus(force)'
      )

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/status',
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
})
