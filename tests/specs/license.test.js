import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.license', () => {
  let apiClient
  let licenseAPI

  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    licenseAPI = apiClient.license
  })

  describe('get', () => {
    it('should make GET request to fetch license', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await licenseAPI.get()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
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
      mockFailedAPIRequest('License not found', 404)

      const error = await licenseAPI.get().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'License not found' },
        message: 'License not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
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

  describe('upload', () => {
    it('should make POST request with file data', async () => {
      mockSuccessAPIRequest(successResult)

      const file = {
        name: 'license.txt',
        content: 'license-content-data',
        type: 'text/plain'
      }

      const result = await licenseAPI.upload(file)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
          body: JSON.stringify(file),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle string file content', async () => {
      mockSuccessAPIRequest(successResult)

      const fileContent = 'license-key-string-content'
      const result = await licenseAPI.upload(fileContent)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
          body: fileContent,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty file object', async () => {
      mockSuccessAPIRequest(successResult)

      const file = {}
      const result = await licenseAPI.upload(file)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
          body: JSON.stringify(file),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined file parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await licenseAPI.upload()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid license file', 400)

      const file = { name: 'invalid.txt', content: 'invalid' }
      const error = await licenseAPI.upload(file).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid license file' },
        message: 'Invalid license file',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license',
          body: JSON.stringify(file),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('replaceCluster', () => {
    it('should make POST request with cluster data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        clusterId: 'cluster-123',
        newClusterUrl: 'https://new-cluster.example.com',
        configuration: {
          region: 'us-east-1',
          instances: 3
        }
      }

      const result = await licenseAPI.replaceCluster(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license/cluster/replace',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle minimal cluster data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        clusterId: 'cluster-456'
      }

      const result = await licenseAPI.replaceCluster(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license/cluster/replace',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty data object', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {}
      const result = await licenseAPI.replaceCluster(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license/cluster/replace',
          body: JSON.stringify(data),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined data parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await licenseAPI.replaceCluster()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license/cluster/replace',
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle string data parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const data = 'cluster-replacement-string'
      const result = await licenseAPI.replaceCluster(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license/cluster/replace',
          body: data,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Cluster replacement failed', 500)

      const data = { clusterId: 'invalid-cluster' }
      const error = await licenseAPI.replaceCluster(data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cluster replacement failed' },
        message: 'Cluster replacement failed',
        status: 500
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/license/cluster/replace',
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