describe('apiClient.codeless', () => {
  let apiClient
  let codelessAPI

  const appId = 'test-app-id'
  const functionId = 'test-function-id'
  const model = 'test-model'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    codelessAPI = apiClient.codeless
  })

  describe('loadApiServices', () => {

    it('should make GET request to load API services', async () => {
      const apiServices = [
        { id: 'service1', name: 'Test Service 1' },
        { id: 'service2', name: 'Test Service 2' }
      ]

      mockSuccessAPIRequest(apiServices)

      const result = await codelessAPI.loadApiServices(appId)

      expect(result).toEqual(apiServices)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/api-services',
          'method'         : 'GET',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await codelessAPI.loadApiServices(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/api-services',
          'method'         : 'GET',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

  describe('loadFunctions', () => {

    it('should make GET request to load functions', async () => {
      const functions = [
        { id: 'func1', name: 'Function 1', type: 'codeless' },
        { id: 'func2', name: 'Function 2', type: 'codeless' }
      ]

      mockSuccessAPIRequest(functions)

      const result = await codelessAPI.loadFunctions(appId)

      expect(result).toEqual(functions)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions',
          'method'         : 'GET',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Not Found', 404)

      const error = await codelessAPI.loadFunctions(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Not Found' },
        message: 'Not Found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions',
          'method'         : 'GET',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

  describe('createFunction', () => {

    it('should make POST request to create function', async () => {
      const functionData = {
        name: 'TestFunction',
        type: 'codeless',
        description: 'A test function'
      }

      const createdFunction = {
        id: 'new-func-id',
        ...functionData
      }

      mockSuccessAPIRequest(createdFunction)

      const result = await codelessAPI.createFunction(appId, functionData)

      expect(result).toEqual(createdFunction)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions',
          'method'         : 'POST',
          'body'           : JSON.stringify(functionData),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when function data is invalid', async () => {
      const invalidData = { name: '' }

      mockFailedAPIRequest('Function name is required', 400)

      const error = await codelessAPI.createFunction(appId, invalidData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Function name is required' },
        message: 'Function name is required',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions',
          'method'         : 'POST',
          'body'           : JSON.stringify(invalidData),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

  describe('loadFunctionSource', () => {

    it('should make GET request to load function source', async () => {
      const functionSource = {
        xml: '<blocks></blocks>',
        code: 'function test() { return true; }',
        definition: { inputs: [], outputs: [] }
      }

      mockSuccessAPIRequest(functionSource)

      const result = await codelessAPI.loadFunctionSource(appId, functionId)

      expect(result).toEqual(functionSource)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions/test-function-id',
          'method'         : 'GET',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when function is not found', async () => {
      mockFailedAPIRequest('Function not found', 404)

      const error = await codelessAPI.loadFunctionSource(appId, functionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Function not found' },
        message: 'Function not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions/test-function-id',
          'method'         : 'GET',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

  describe('updateFunctionSource', () => {

    it('should make PUT request to update function source', async () => {
      const xml = '<blocks><block type="start"></block></blocks>'
      const code = 'function updatedTest() { return false; }'
      const definition = {
        inputs: [{ name: 'param1', type: 'string' }],
        outputs: [{ name: 'result', type: 'boolean' }]
      }

      const updatedFunction = {
        id: functionId,
        xml,
        code,
        definition
      }

      mockSuccessAPIRequest(updatedFunction)

      const result = await codelessAPI.updateFunctionSource(appId, functionId, xml, code, definition)

      expect(result).toEqual(updatedFunction)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions/test-function-id',
          'method'         : 'PUT',
          'body'           : JSON.stringify({ xml, code, definition }),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when update data is invalid', async () => {
      const xml = null
      const code = ''
      const definition = {}

      mockFailedAPIRequest('Invalid function source data', 400)

      const error = await codelessAPI.updateFunctionSource(appId, functionId, xml, code, definition).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid function source data' },
        message: 'Invalid function source data',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions/test-function-id',
          'method'         : 'PUT',
          'body'           : JSON.stringify({ xml, code, definition }),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

  describe('removeFunctionSource', () => {

    it('should make DELETE request to remove function source', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await codelessAPI.removeFunctionSource(appId, functionId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions/test-function-id',
          'method'         : 'DELETE',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when function cannot be deleted', async () => {
      mockFailedAPIRequest('Function is in use and cannot be deleted', 409)

      const error = await codelessAPI.removeFunctionSource(appId, functionId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Function is in use and cannot be deleted' },
        message: 'Function is in use and cannot be deleted',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/functions/test-function-id',
          'method'         : 'DELETE',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

  describe('deployCodelessModel', () => {

    it('should make POST request to deploy codeless model', async () => {
      const deploymentItems = [
        { type: 'function', id: 'func1', name: 'Function 1' },
        { type: 'service', id: 'service1', name: 'Service 1' }
      ]

      const deploymentResult = {
        status: 'deployed',
        deployedItems: deploymentItems.length,
        timestamp: Date.now()
      }

      mockSuccessAPIRequest(deploymentResult)

      const result = await codelessAPI.deployCodelessModel(appId, model, deploymentItems)

      expect(result).toEqual(deploymentResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/deploy/test-model',
          'method'         : 'POST',
          'body'           : JSON.stringify(deploymentItems),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when deployment fails', async () => {
      const deploymentItems = []

      mockFailedAPIRequest('No items to deploy', 400)

      const error = await codelessAPI.deployCodelessModel(appId, model, deploymentItems).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'No items to deploy' },
        message: 'No items to deploy',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/deploy/test-model',
          'method'         : 'POST',
          'body'           : JSON.stringify(deploymentItems),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle deployment with empty items array', async () => {
      const deploymentItems = []

      const deploymentResult = {
        status: 'no_changes',
        deployedItems: 0
      }

      mockSuccessAPIRequest(deploymentResult)

      const result = await codelessAPI.deployCodelessModel(appId, model, deploymentItems)

      expect(result).toEqual(deploymentResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/codeless/deploy/test-model',
          'method'         : 'POST',
          'body'           : JSON.stringify(deploymentItems),
          'encoding'       : 'utf8',
          'headers'        : {
            'Content-Type': 'application/json'
          },
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

  })

})
