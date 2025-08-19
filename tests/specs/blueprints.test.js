describe('apiClient.blueprints', () => {
  let apiClient
  let blueprintsAPI

  const successResult = { id: 'blueprint-123', name: 'Test Blueprint' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    blueprintsAPI = apiClient.blueprints
  })

  describe('get', () => {
    it('should fetch all blueprints when no ID provided', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blueprintsAPI.get()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should fetch specific blueprint by ID', async () => {
      mockSuccessAPIRequest(successResult)

      const blueprintId = 'blueprint-123'
      const result = await blueprintsAPI.get(blueprintId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints/blueprint-123',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle numeric blueprint ID', async () => {
      mockSuccessAPIRequest(successResult)

      const blueprintId = 456
      const result = await blueprintsAPI.get(blueprintId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints/456',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle blueprint ID with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const blueprintId = 'blueprint-with-dashes'
      const result = await blueprintsAPI.get(blueprintId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints/blueprint-with-dashes',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty string ID as no ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blueprintsAPI.get('')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle null ID as no ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blueprintsAPI.get(null)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined ID as no ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blueprintsAPI.get(undefined)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/blueprints',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code for all blueprints', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await blueprintsAPI.get().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
      expect(error.message).toBe('Access denied')
    })

    it('fails when server responds with non 200 status code for specific blueprint', async () => {
      mockFailedAPIRequest('Blueprint not found', 404)

      const error = await blueprintsAPI.get('non-existent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Blueprint not found')
    })

    it('should handle server error', async () => {
      mockFailedAPIRequest()

      const error = await blueprintsAPI.get('blueprint-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })
})