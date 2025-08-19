import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.warning', () => {
  let apiClient
  let warningAPI

  const appId = 'test-app-id'
  const successResult = { warnings: ['Warning 1', 'Warning 2'] }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    warningAPI = apiClient.warning
  })

  describe('warning', () => {
    it('should make GET request to fetch warnings for app', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await warningAPI(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/warning`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle different app IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const differentAppId = 'another-app-123'
      const result = await warningAPI(differentAppId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${differentAppId}/console/warning`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle special characters in app ID', async () => {
      mockSuccessAPIRequest(successResult)

      const specialAppId = 'app-with-special-chars_123'
      const result = await warningAPI(specialAppId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${specialAppId}/console/warning`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined app ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await warningAPI()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/undefined/console/warning',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle null app ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await warningAPI(null)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/null/console/warning',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty string app ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await warningAPI('')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000//console/warning',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle numeric app ID', async () => {
      mockSuccessAPIRequest(successResult)

      const numericAppId = 12345
      const result = await warningAPI(numericAppId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${numericAppId}/console/warning`,
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
      mockFailedAPIRequest('App not found', 404)

      const error = await warningAPI(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'App not found' },
        message: 'App not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/warning`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with internal server error', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const error = await warningAPI(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Internal server error' },
        message: 'Internal server error',
        status: 500
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/warning`,
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
      mockFailedAPIRequest('Unauthorized access', 401)

      const error = await warningAPI(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized access' },
        message: 'Unauthorized access',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/warning`,
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