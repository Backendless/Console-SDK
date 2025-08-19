import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.cache', () => {
  let apiClient
  let cacheAPI

  const appId = 'test-app-id'

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    cacheAPI = apiClient.cache
  })

  describe('get', () => {
    it('should make parallel requests and combine results', async () => {
      const cacheResponse = {
        'key1': { value: 'string-value', expireAt: 1640995200000 },
        'key2': { value: { nested: 'object' }, expireAt: 1640995300000 },
        'key3': { value: ['array', 'value'], expireAt: null }
      }
      const countResponse = 25

      // Mock both requests that will be made in parallel
      mockSuccessAPIRequest(cacheResponse)
      mockSuccessAPIRequest(countResponse)

      const result = await cacheAPI.get(appId, { pageSize: 10, offset: 20 })

      expect(result).toEqual({
        data: [
          {
            objectId: 'key1',
            value: 'string-value',
            expireAt: 1640995200000,
            key: 'key1'
          },
          {
            objectId: 'key2',
            value: '{"nested":"object"}',
            expireAt: 1640995300000,
            key: 'key2'
          },
          {
            objectId: 'key3',
            value: '["array","value"]',
            expireAt: null,
            key: 'key3'
          }
        ],
        totalRows: 25
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache?pagesize=10&offset=20',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: 'http://test-host:3000/test-app-id/console/cache/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty cache response', async () => {
      const cacheResponse = {}
      const countResponse = 0

      mockSuccessAPIRequest(cacheResponse)
      mockSuccessAPIRequest(countResponse)

      const result = await cacheAPI.get(appId, { pageSize: 5, offset: 0 })

      expect(result).toEqual({
        data: [],
        totalRows: 0
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache?pagesize=5&offset=0',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: 'http://test-host:3000/test-app-id/console/cache/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should normalize different value types correctly', async () => {
      const cacheResponse = {
        'stringKey': { value: 'already-a-string', expireAt: 1640995200000 },
        'numberKey': { value: 42, expireAt: 1640995300000 },
        'booleanKey': { value: true, expireAt: 1640995400000 },
        'nullKey': { value: null, expireAt: 1640995500000 },
        'objectKey': { value: { complex: { nested: 'object' } }, expireAt: 1640995600000 }
      }
      const countResponse = 5

      mockSuccessAPIRequest(cacheResponse)
      mockSuccessAPIRequest(countResponse)

      const result = await cacheAPI.get(appId, { pageSize: 10, offset: 0 })

      expect(result.data).toEqual([
        {
          objectId: 'stringKey',
          value: 'already-a-string',
          expireAt: 1640995200000,
          key: 'stringKey'
        },
        {
          objectId: 'numberKey',
          value: '42',
          expireAt: 1640995300000,
          key: 'numberKey'
        },
        {
          objectId: 'booleanKey',
          value: 'true',
          expireAt: 1640995400000,
          key: 'booleanKey'
        },
        {
          objectId: 'nullKey',
          value: 'null',
          expireAt: 1640995500000,
          key: 'nullKey'
        },
        {
          objectId: 'objectKey',
          value: '{"complex":{"nested":"object"}}',
          expireAt: 1640995600000,
          key: 'objectKey'
        }
      ])
    })

    it('fails when first request returns error', async () => {
      mockFailedAPIRequest()
      mockSuccessAPIRequest(42) // Provide a second mock just in case

      const error = await cacheAPI.get(appId, { pageSize: 10, offset: 0 }).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache?pagesize=10&offset=0',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: 'http://test-host:3000/test-app-id/console/cache/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when count request returns error', async () => {
      const cacheResponse = { 'key1': { value: 'test', expireAt: 1640995200000 } }
      
      mockSuccessAPIRequest(cacheResponse)
      mockFailedAPIRequest()

      const error = await cacheAPI.get(appId, { pageSize: 10, offset: 0 }).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache?pagesize=10&offset=0',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: 'http://test-host:3000/test-app-id/console/cache/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('count', () => {
    it('should make GET request to count endpoint', async () => {
      const countResponse = 42

      mockSuccessAPIRequest(countResponse)

      const result = await cacheAPI.count(appId)

      expect(result).toBe(42)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest()

      const error = await cacheAPI.count(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('update', () => {
    it('should make PUT request with key and JSON stringify value', async () => {
      const updateResponse = { success: true }
      const record = {
        key: 'test-key',
        value: { data: 'complex object' },
        expireAt: 1640995200000
      }

      mockSuccessAPIRequest(updateResponse)

      const result = await cacheAPI.update(appId, record)

      expect(result).toEqual(updateResponse)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/test-key?expireAt=1640995200000',
          method: 'PUT',
          body: '{"data":"complex object"}',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should use objectId when key is not provided', async () => {
      const updateResponse = { success: true }
      const record = {
        objectId: 'object-id-123',
        value: 'string value',
        expireAt: 1640995300000
      }

      mockSuccessAPIRequest(updateResponse)

      const result = await cacheAPI.update(appId, record)

      expect(result).toEqual(updateResponse)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/object-id-123?expireAt=1640995300000',
          method: 'PUT',
          body: '"string value"',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should prefer key over objectId when both are provided', async () => {
      const updateResponse = { success: true }
      const record = {
        key: 'preferred-key',
        objectId: 'object-id-123',
        value: 'test value',
        expireAt: 1640995400000
      }

      mockSuccessAPIRequest(updateResponse)

      const result = await cacheAPI.update(appId, record)

      expect(result).toEqual(updateResponse)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/preferred-key?expireAt=1640995400000',
          method: 'PUT',
          body: '"test value"',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle different value types correctly', async () => {
      const updateResponse = { success: true }

      // Test string value
      mockSuccessAPIRequest(updateResponse)
      await cacheAPI.update(appId, { key: 'string-key', value: 'already string', expireAt: 1640995200000 })

      expect(apiRequestCalls()[0].body).toBe('"already string"')

      // Test number value
      mockSuccessAPIRequest(updateResponse)
      await cacheAPI.update(appId, { key: 'number-key', value: 42, expireAt: 1640995300000 })

      expect(apiRequestCalls()[1].body).toBe('42')

      // Test boolean value
      mockSuccessAPIRequest(updateResponse)
      await cacheAPI.update(appId, { key: 'boolean-key', value: true, expireAt: 1640995400000 })

      expect(apiRequestCalls()[2].body).toBe('true')

      // Test array value
      mockSuccessAPIRequest(updateResponse)
      await cacheAPI.update(appId, { key: 'array-key', value: ['item1', 'item2'], expireAt: 1640995500000 })

      expect(apiRequestCalls()[3].body).toBe('["item1","item2"]')

      // Test object value
      mockSuccessAPIRequest(updateResponse)
      await cacheAPI.update(appId, { key: 'object-key', value: { nested: { data: 'value' } }, expireAt: 1640995600000 })

      expect(apiRequestCalls()[4].body).toBe('{"nested":{"data":"value"}}')
    })

    it('should handle expireAt as undefined', async () => {
      const updateResponse = { success: true }
      const record = {
        key: 'no-expire-key',
        value: 'test value'
        // expireAt is undefined
      }

      mockSuccessAPIRequest(updateResponse)

      const result = await cacheAPI.update(appId, record)

      expect(result).toEqual(updateResponse)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/no-expire-key',
          method: 'PUT',
          body: '"test value"',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should set correct content-type header', async () => {
      const updateResponse = { success: true }
      const record = {
        key: 'content-type-test',
        value: { test: 'data' },
        expireAt: 1640995200000
      }

      mockSuccessAPIRequest(updateResponse)

      await cacheAPI.update(appId, record)

      expect(apiRequestCalls()[0].headers).toEqual({
        'Content-Type': 'application/json'
      })
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest()

      const record = {
        key: 'test-key',
        value: 'test value',
        expireAt: 1640995200000
      }

      const error = await cacheAPI.update(appId, record).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/test-key?expireAt=1640995200000',
          method: 'PUT',
          body: '"test value"',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('remove', () => {
    it('should make DELETE request with key', async () => {
      const deleteResponse = { success: true }
      const key = 'key-to-delete'

      mockSuccessAPIRequest(deleteResponse)

      const result = await cacheAPI.remove(appId, key)

      expect(result).toEqual(deleteResponse)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/key-to-delete',
          method: 'DELETE',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle keys with special characters', async () => {
      const deleteResponse = { success: true }
      const key = 'key-with-special-chars-123'

      mockSuccessAPIRequest(deleteResponse)

      const result = await cacheAPI.remove(appId, key)

      expect(result).toEqual(deleteResponse)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/key-with-special-chars-123',
          method: 'DELETE',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest()

      const key = 'non-existent-key'
      const error = await cacheAPI.remove(appId, key).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/cache/non-existent-key',
          method: 'DELETE',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  // Additional edge case tests for helper functions
  describe('helper functions behavior', () => {
    it('should normalize response with mixed value types', async () => {
      const cacheResponse = {
        'key1': { value: 'string', expireAt: 1640995200000 },
        'key2': { value: { obj: 'value' }, expireAt: null },
        'key3': { value: 123, expireAt: 1640995300000 }
      }
      const countResponse = 3

      mockSuccessAPIRequest(cacheResponse)
      mockSuccessAPIRequest(countResponse)

      const result = await cacheAPI.get(appId, { pageSize: 10, offset: 0 })

      // Verify normalizeResponse correctly transforms the response
      expect(result.data).toEqual([
        {
          objectId: 'key1',
          value: 'string', // string stays as string
          expireAt: 1640995200000,
          key: 'key1'
        },
        {
          objectId: 'key2',
          value: '{"obj":"value"}', // object becomes JSON string
          expireAt: null,
          key: 'key2'
        },
        {
          objectId: 'key3',
          value: '123', // number becomes JSON string
          expireAt: 1640995300000,
          key: 'key3'
        }
      ])
    })

    it('should handle update with complex nested objects', async () => {
      const updateResponse = { success: true }
      const complexValue = {
        level1: {
          level2: {
            array: [1, 2, { nested: true }],
            nullValue: null,
            boolValue: false,
            stringValue: 'test'
          }
        }
      }

      mockSuccessAPIRequest(updateResponse)

      await cacheAPI.update(appId, { 
        key: 'complex-key', 
        value: complexValue, 
        expireAt: 1640995200000 
      })

      expect(apiRequestCalls()[0].body).toBe(JSON.stringify(complexValue))
    })
  })
})