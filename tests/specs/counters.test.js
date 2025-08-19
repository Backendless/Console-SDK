import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.counters', () => {
  let apiClient
  let countersAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    countersAPI = apiClient.counters
  })

  describe('get', () => {
    it('should make GET request with default pattern', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await countersAPI.get(appId, {})

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?pattern=*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make GET request with custom pattern', async () => {
      mockSuccessAPIRequest(successResult)

      const params = { pattern: 'user_*' }
      const result = await countersAPI.get(appId, params)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?pattern=user_*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make GET request with pagination parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        pageSize: 10,
        offset: 20,
        pattern: 'counter_*'
      }
      const result = await countersAPI.get(appId, params)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?pageSize=10&offset=20&pattern=counter_*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make GET request with sorting parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        sortField: 'name',
        sortDir: 'ASC',
        pattern: 'test_*'
      }
      const result = await countersAPI.get(appId, params)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?sortField=name&sortDir=ASC&pattern=test_*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make GET request with all parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        pageSize: 25,
        offset: 50,
        sortField: 'value',
        sortDir: 'DESC',
        pattern: 'admin_*'
      }
      const result = await countersAPI.get(appId, params)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?pageSize=25&offset=50&sortField=value&sortDir=DESC&pattern=admin_*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined parameters by using defaults', async () => {
      mockSuccessAPIRequest(successResult)

      const params = {
        pageSize: undefined,
        offset: undefined,
        sortField: undefined,
        sortDir: undefined
      }
      const result = await countersAPI.get(appId, params)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?pattern=*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest()

      const error = await countersAPI.get(appId, {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: {
          message: 'test error message'
        },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters?pattern=*',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('listNames', () => {
    it('should make GET request with default pattern', async () => {
      mockSuccessAPIRequest(['counter1', 'counter2', 'counter3'])

      const result = await countersAPI.listNames(appId)

      expect(result).toEqual(['counter1', 'counter2', 'counter3'])

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/*/list-names',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make GET request with custom pattern', async () => {
      mockSuccessAPIRequest(['user_counter1', 'user_counter2'])

      const pattern = 'user_*'
      const result = await countersAPI.listNames(appId, pattern)

      expect(result).toEqual(['user_counter1', 'user_counter2'])

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/user_*/list-names',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle special characters in pattern by URL encoding', async () => {
      mockSuccessAPIRequest(['special counter'])

      const pattern = 'special counter*'
      const result = await countersAPI.listNames(appId, pattern)

      expect(result).toEqual(['special counter'])

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/special%20counter*/list-names',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Not found', 404)

      const error = await countersAPI.listNames(appId, 'missing_*').catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: {
          message: 'Not found'
        },
        message: 'Not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/missing_*/list-names',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('listCounters', () => {
    it('should make POST request with counter names array', async () => {
      const countersData = [
        { name: 'counter1', value: 10 },
        { name: 'counter2', value: 25 }
      ]
      mockSuccessAPIRequest(countersData)

      const names = ['counter1', 'counter2']
      const result = await countersAPI.listCounters(appId, names)

      expect(result).toEqual(countersData)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/list-by-names',
        method: 'POST',
        body: JSON.stringify(names),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty names array', async () => {
      mockSuccessAPIRequest([])

      const names = []
      const result = await countersAPI.listCounters(appId, names)

      expect(result).toEqual([])

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/list-by-names',
        method: 'POST',
        body: JSON.stringify(names),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle single counter name', async () => {
      const countersData = [{ name: 'single_counter', value: 42 }]
      mockSuccessAPIRequest(countersData)

      const names = ['single_counter']
      const result = await countersAPI.listCounters(appId, names)

      expect(result).toEqual(countersData)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/list-by-names',
        method: 'POST',
        body: JSON.stringify(names),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid request', 400)

      const names = ['invalid_counter']
      const error = await countersAPI.listCounters(appId, names).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: {
          message: 'Invalid request'
        },
        message: 'Invalid request',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/list-by-names',
        method: 'POST',
        body: JSON.stringify(names),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('create', () => {
    it('should make POST request and normalize response', async () => {
      const serverResponse = { name: 'test_counter', value: 10 }
      const normalizedResponse = { name: 'test_counter', value: 10, objectId: 'test_counter' }
      mockSuccessAPIRequest(serverResponse)

      const name = 'test_counter'
      const value = 10
      const result = await countersAPI.create(appId, name, value)

      expect(result).toEqual(normalizedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/test_counter',
        method: 'POST',
        body: JSON.stringify({ value }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should URL encode counter name with special characters', async () => {
      const serverResponse = { name: 'special counter!', value: 0 }
      const normalizedResponse = { name: 'special counter!', value: 0, objectId: 'special counter!' }
      mockSuccessAPIRequest(serverResponse)

      const name = 'special counter!'
      const value = 0
      const result = await countersAPI.create(appId, name, value)

      expect(result).toEqual(normalizedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/special%20counter!',
        method: 'POST',
        body: JSON.stringify({ value }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle negative initial values', async () => {
      const serverResponse = { name: 'negative_counter', value: -5 }
      const normalizedResponse = { name: 'negative_counter', value: -5, objectId: 'negative_counter' }
      mockSuccessAPIRequest(serverResponse)

      const name = 'negative_counter'
      const value = -5
      const result = await countersAPI.create(appId, name, value)

      expect(result).toEqual(normalizedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/negative_counter',
        method: 'POST',
        body: JSON.stringify({ value }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle zero initial value', async () => {
      const serverResponse = { name: 'zero_counter', value: 0 }
      const normalizedResponse = { name: 'zero_counter', value: 0, objectId: 'zero_counter' }
      mockSuccessAPIRequest(serverResponse)

      const name = 'zero_counter'
      const value = 0
      const result = await countersAPI.create(appId, name, value)

      expect(result).toEqual(normalizedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/zero_counter',
        method: 'POST',
        body: JSON.stringify({ value }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Counter already exists', 409)

      const name = 'existing_counter'
      const value = 1
      const error = await countersAPI.create(appId, name, value).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: {
          message: 'Counter already exists'
        },
        message: 'Counter already exists',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/existing_counter',
        method: 'POST',
        body: JSON.stringify({ value }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('update', () => {
    it('should make PUT request with current and new values', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'test_counter'
      const currentValue = 10
      const newValue = 15
      const result = await countersAPI.update(appId, name, currentValue, newValue)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/test_counter',
        method: 'PUT',
        body: JSON.stringify({ currentValue, newValue }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should URL encode counter name with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'counter with spaces & symbols!'
      const currentValue = 5
      const newValue = 8
      const result = await countersAPI.update(appId, name, currentValue, newValue)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/counter%20with%20spaces%20%26%20symbols!',
        method: 'PUT',
        body: JSON.stringify({ currentValue, newValue }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle negative values', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'negative_counter'
      const currentValue = -10
      const newValue = -5
      const result = await countersAPI.update(appId, name, currentValue, newValue)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/negative_counter',
        method: 'PUT',
        body: JSON.stringify({ currentValue, newValue }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle zero values', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'zero_counter'
      const currentValue = 0
      const newValue = 0
      const result = await countersAPI.update(appId, name, currentValue, newValue)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/zero_counter',
        method: 'PUT',
        body: JSON.stringify({ currentValue, newValue }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Current value mismatch', 409)

      const name = 'test_counter'
      const currentValue = 10
      const newValue = 15
      const error = await countersAPI.update(appId, name, currentValue, newValue).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: {
          message: 'Current value mismatch'
        },
        message: 'Current value mismatch',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/test_counter',
        method: 'PUT',
        body: JSON.stringify({ currentValue, newValue }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('remove', () => {
    it('should make DELETE request', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'test_counter'
      const result = await countersAPI.remove(appId, name)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/test_counter',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should URL encode counter name with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'counter/with/slashes & spaces!'
      const result = await countersAPI.remove(appId, name)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/counter%2Fwith%2Fslashes%20%26%20spaces!',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle unicode characters in counter name', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'カウンター_名前_🔢'
      const result = await countersAPI.remove(appId, name)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC_%E5%90%8D%E5%89%8D_%F0%9F%94%A2',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Counter not found', 404)

      const name = 'nonexistent_counter'
      const error = await countersAPI.remove(appId, name).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: {
          message: 'Counter not found'
        },
        message: 'Counter not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/counters/nonexistent_counter',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})