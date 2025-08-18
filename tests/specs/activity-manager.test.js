import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.activityManager', () => {
  let apiClient
  let activityAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    activityAPI = apiClient.activityManager
  })

  describe('send', () => {

    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const event = {
        type: 'user_action',
        data: { action: 'login', timestamp: Date.now() }
      }

      const result = await activityAPI.send(appId, event)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/user-activity',
          'body'           : JSON.stringify(event),
          'method'         : 'POST',
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should accept empty object as event', async () => {
      mockSuccessAPIRequest(successResult)

      const event = {}

      const result = await activityAPI.send(appId, event)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/test-app-id/console/user-activity',
        method         : 'POST',
        body           : JSON.stringify(event),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should accept complex event objects', async () => {
      mockSuccessAPIRequest(successResult)

      const event = {
        type     : 'complex_event',
        user     : { id: 123, name: 'John' },
        metadata : {
          source : 'web',
          version: '1.0.0',
          nested : { deep: { value: true } }
        },
        timestamp: new Date().toISOString()
      }

      const result = await activityAPI.send(appId, event)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path           : 'http://test-host:3000/test-app-id/console/user-activity',
          method         : 'POST',
          body           : JSON.stringify(event),
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest()

      const event = {}

      const error = await activityAPI.send(appId, event).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        'body'   : {
          'message': 'test error message'
        },
        'message': 'test error message',
        'status' : 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path           : 'http://test-host:3000/test-app-id/console/user-activity',
          method         : 'POST',
          body           : JSON.stringify(event),
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })
})
