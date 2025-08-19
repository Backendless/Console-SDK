describe('apiClient.bl', () => {
  let apiClient
  let blAPI

  const appId = 'test-app-id'
  const serviceId = 'test-service-id'
  const methodId = 'test-method-id'
  const successResult = { id: 'test-result' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    blAPI = apiClient.bl
  })

  describe('getServices', () => {
    it('should get services and normalize them', async () => {
      const mockServices = [
        {
          id: 'service1',
          name: 'Test Service',
          configuration: [
            { name: 'config1', displayName: 'Config 1', type: 'string' }
          ]
        }
      ]

      const expectedServices = [
        {
          id: 'service1',
          name: 'Test Service',
          configDescriptions: [
            { name: 'config1', label: 'Config 1', type: 'string' }
          ]
        }
      ]

      mockSuccessAPIRequest(mockServices)

      const result = await blAPI.getServices(appId)

      expect(result).toEqual(expectedServices)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle services without configuration', async () => {
      const mockServices = [{ id: 'service1', name: 'Test Service' }]

      mockSuccessAPIRequest(mockServices)

      const result = await blAPI.getServices(appId)

      expect(result).toEqual(mockServices)
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Service error', 500)

      const error = await blAPI.getServices(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Service error')
    })
  })

  describe('getServiceSpec', () => {
    it('should get and transform service spec by default', async () => {
      const mockSpec = {
        info: { title: 'Test API' },
        paths: {
          '/test': {
            get: {
              operationId: 'testMethod',
              summary: 'Test method'
            },
            post: {
              operationId: 'createTest',
              summary: 'Create test'
            }
          }
        }
      }

      const expectedResult = {
        summary: { info: { title: 'Test API' } },
        methods: {
          testMethod: {
            operationId: 'testMethod',
            summary: 'Test method',
            path: '/test',
            type: 'get',
            id: 'testMethod'
          },
          createTest: {
            operationId: 'createTest',
            summary: 'Create test',
            path: '/test',
            type: 'post',
            id: 'createTest'
          }
        }
      }

      mockSuccessAPIRequest(mockSpec)

      const result = await blAPI.getServiceSpec(appId, serviceId)

      expect(result).toEqual(expectedResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/${serviceId}/api-docs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should return raw spec when transformSpec is false', async () => {
      const mockSpec = { info: { title: 'Test API' }, paths: {} }

      mockSuccessAPIRequest(mockSpec)

      const result = await blAPI.getServiceSpec(appId, serviceId, false)

      expect(result).toEqual(mockSpec)
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Spec not found', 404)

      const error = await blAPI.getServiceSpec(appId, serviceId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('getServiceMethods', () => {
    it('should get service methods', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.getServiceMethods(appId, serviceId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/${serviceId}/methods`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('importService', () => {
    it('should import service with file upload', async () => {
      const file = new File(['test content'], 'service.zip')
      const formData = new FormData()
      formData.append('file', file)

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.importService(appId, { file })

      expect(result).toEqual(successResult)

      const calls = apiRequestCalls()
      expect(calls[0].path).toBe(`http://test-host:3000/${appId}/console/localservices/import`)
      expect(calls[0].method).toBe('POST')
      expect(calls[0].encoding).toBe('utf8')
      expect(calls[0].headers).toEqual({ 'Content-Type': 'application/json' })
      expect(calls[0].timeout).toBe(0)
      expect(calls[0].withCredentials).toBe(false)
    })

    it('should import service with service object', async () => {
      const service = { name: 'TestService', version: '1.0' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.importService(appId, { service })

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/import`,
        method: 'POST',
        body: JSON.stringify({ appId, service }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should import service with service URL', async () => {
      const serviceURL = 'https://example.com/service.json'

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.importService(appId, { serviceURL })

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/import`,
        method: 'POST',
        body: JSON.stringify({ serviceURL }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createService', () => {
    it('should create service with file upload', async () => {
      const file = new File(['test content'], 'service.zip')
      const data = { file, model: 'test-model' }

      const mockServices = [{ id: 'new-service', name: 'New Service' }]
      mockSuccessAPIRequest(mockServices)

      const result = await blAPI.createService(appId, data)

      expect(result).toEqual(mockServices)

      const calls = apiRequestCalls()
      expect(calls[0].path).toBe(`http://test-host:3000/${appId}/console/localservices/generic`)
      expect(calls[0].method).toBe('POST')
      expect(calls[0].encoding).toBe('utf8')
      expect(calls[0].headers).toEqual({ 'Content-Type': 'application/json' })
      expect(calls[0].timeout).toBe(0)
      expect(calls[0].withCredentials).toBe(false)
    })

    it('should create service from sample', async () => {
      const data = { createFromSample: true, sampleName: 'test-sample' }

      const mockServices = [{ id: 'sample-service', name: 'Sample Service' }]
      mockSuccessAPIRequest(mockServices)

      const result = await blAPI.createService(appId, data)

      expect(result).toEqual(mockServices)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic`,
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createAWSLambdaService', () => {
    it('should create AWS Lambda service', async () => {
      const credentials = { accessKey: 'test-key', secretKey: 'test-secret' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.createAWSLambdaService(appId, credentials)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/aws-lambda`,
        method: 'POST',
        body: JSON.stringify({ ...credentials, appId }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createCodelessService', () => {
    it('should create codeless service with cache tags', async () => {
      const service = { name: 'TestService', language: 'CODELESS' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.createCodelessService(appId, service)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless`,
        method: 'POST',
        body: JSON.stringify(service),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createJsService', () => {
    it('should create JS service with cache tags', async () => {
      const service = { name: 'TestService', language: 'JS' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.createJsService(appId, service)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/js`,
        method: 'POST',
        body: JSON.stringify(service),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateCodelessService', () => {
    it('should update codeless service', async () => {
      const updates = { name: 'Updated Service' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.updateCodelessService(appId, serviceId, updates)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}`,
        method: 'PUT',
        body: JSON.stringify(updates),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteCodelessService', () => {
    it('should delete codeless service', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deleteCodelessService(appId, serviceId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createCodelessMethod', () => {
    it('should create codeless method', async () => {
      const method = { name: 'testMethod', type: 'GET' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.createCodelessMethod(appId, serviceId, method)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}/`,
        method: 'POST',
        body: JSON.stringify(method),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateCodelessMethod', () => {
    it('should update codeless method', async () => {
      const method = { name: 'updatedMethod' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.updateCodelessMethod(appId, serviceId, methodId, method)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}/${methodId}`,
        method: 'PUT',
        body: JSON.stringify(method),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteCodelessMethod', () => {
    it('should delete codeless method', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deleteCodelessMethod(appId, serviceId, methodId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}/${methodId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getCodelessMethodLogic', () => {
    it('should get codeless method logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.getCodelessMethodLogic(appId, serviceId, methodId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}/${methodId}/logic`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deployCodelessMethodLogic', () => {
    it('should deploy codeless method logic with query params', async () => {
      const logic = { blocks: [] }
      const params = { validate: true }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deployCodelessMethodLogic(appId, serviceId, methodId, logic, params)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}/${methodId}/logic?validate=true`,
        method: 'PUT',
        body: JSON.stringify(logic),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should deploy codeless method logic without query params', async () => {
      const logic = { blocks: [] }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deployCodelessMethodLogic(appId, serviceId, methodId, logic)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/codeless/${serviceId}/${methodId}/logic`,
        method: 'PUT',
        body: JSON.stringify(logic),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteService', () => {
    it('should delete service', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deleteService(appId, serviceId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic`,
        method: 'DELETE',
        body: JSON.stringify([serviceId]),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateService', () => {
    it('should update service', async () => {
      const updates = { name: 'Updated Service' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.updateService(appId, serviceId, updates)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/${serviceId}/update`,
        method: 'PUT',
        body: JSON.stringify(updates),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateServiceDefaultModel', () => {
    it('should update service default model', async () => {
      const updates = { defaultModel: 'new-model' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.updateServiceDefaultModel(appId, updates)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/default-model`,
        method: 'PUT',
        body: JSON.stringify(updates),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadServiceConfig', () => {
    it('should load service config', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.loadServiceConfig(appId, serviceId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/configure/${serviceId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('setServiceConfig', () => {
    it('should set service config', async () => {
      const config = { timeout: 5000 }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.setServiceConfig(appId, serviceId, config)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/configure/${serviceId}`,
        method: 'POST',
        body: JSON.stringify(config),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('setMarketplaceServiceConfig', () => {
    it('should set marketplace service config', async () => {
      const serviceName = 'test-service'
      const modelName = 'test-model'
      const config = { apiKey: 'test-key' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.setMarketplaceServiceConfig(appId, serviceName, modelName, config)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/marketplace/configure/${modelName}/${serviceName}`,
        method: 'POST',
        body: JSON.stringify(config),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('testServiceConfig', () => {
    it('should test service config', async () => {
      const config = { endpoint: 'https://api.test.com' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.testServiceConfig(appId, serviceId, config)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/localservices/generic/configure/test/${serviceId}`,
        method: 'POST',
        body: JSON.stringify(config),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getDraftFiles', () => {
    it('should get draft files', async () => {
      const language = 'JS'
      const model = 'test-model'

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.getDraftFiles(appId, language, model)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/${model}/draft/${language}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('saveDraftFiles', () => {
    it('should save draft files with path encoding and sync param', async () => {
      const language = 'JS'
      const model = 'test-model'
      const files = [
        { id: 'path/to/file.js', content: 'console.log("test")' },
        { id: 'nested/path/to/file.js', content: 'const x = 1' }
      ]

      const expectedEncodedFiles = [
        { id: 'path%2Fto%2Ffile.js', content: 'console.log("test")' },
        { id: 'nested%2Fpath%2Fto%2Ffile.js', content: 'const x = 1' }
      ]

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.saveDraftFiles(appId, language, model, files, false)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/${model}/draft/${language}?sync=false`,
        method: 'PUT',
        body: JSON.stringify(files),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should use sync=true by default', async () => {
      const language = 'JS'
      const model = 'test-model'
      const files = [{ id: 'test.js', content: 'test' }]

      mockSuccessAPIRequest(successResult)

      await blAPI.saveDraftFiles(appId, language, model, files)

      expect(apiRequestCalls()[0].path).toContain('?sync=true')
    })
  })

  describe('deployDraftFiles', () => {
    it('should deploy draft files with sync param', async () => {
      const language = 'JS'
      const model = 'test-model'
      const files = [{ id: 'test.js', content: 'test' }]

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deployDraftFiles(appId, language, model, files, false)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/${model}/production/${language}?sync=false`,
        method: 'PUT',
        body: JSON.stringify(files),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should deploy draft files without sync param, by default it is true', async () => {
      const language = 'JS'
      const model = 'test-model'
      const files = [{ id: 'test.js', content: 'test' }]

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deployDraftFiles(appId, language, model, files)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/${model}/production/${language}?sync=true`,
        method: 'PUT',
        body: JSON.stringify(files),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getDraftFileContent', () => {
    it('should get draft file content with encoded path', async () => {
      const language = 'JS'
      const model = 'test-model'
      const fileId = 'path/to/file.js'

      mockSuccessAPIRequest('file content')

      const result = await blAPI.getDraftFileContent(appId, language, model, fileId)

      expect(result).toBe('file content')

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/${model}/draft/${language}/path/to/file.js`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getLanguages', () => {
    it('should get supported languages', async () => {
      const languages = ['JS', 'JAVA', 'CODELESS']

      mockSuccessAPIRequest(languages)

      const result = await blAPI.getLanguages()

      expect(result).toEqual(languages)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/servercode/languages',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getModels', () => {
    it('should get models with cache tags', async () => {
      const language = 'JS'
      const models = ['model1', 'model2']

      mockSuccessAPIRequest(models)

      const result = await blAPI.getModels(appId, language)

      expect(result).toEqual(models)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/models/${language}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getAllModels', () => {
    it('should get all models', async () => {
      const models = { JS: ['model1'], JAVA: ['model2'] }

      mockSuccessAPIRequest(models)

      const result = await blAPI.getAllModels(appId)

      expect(result).toEqual(models)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/models`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createModel', () => {
    it('should create model', async () => {
      const language = 'JS'
      const model = 'new-model'

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.createModel(appId, language, model)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/models/create`,
        method: 'POST',
        body: JSON.stringify({ appId, language, model }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createEventHandler', () => {
    it('should create event handler with cache tags', async () => {
      const handler = {
        category: 'events',
        mode: 'DRAFT',
        language: 'JS',
        name: 'testHandler',
        eventType: 'beforeCreate'
      }

      const expectedData = {
        language: 'JS',
        name: 'testHandler',
        eventType: 'beforeCreate'
      }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.createEventHandler(appId, handler)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/draft/events`,
        method: 'POST',
        body: JSON.stringify(expectedData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle timer category', async () => {
      const handler = {
        category: 'TIMER',
        mode: 'PROD',
        language: 'JS',
        name: 'testTimer'
      }

      mockSuccessAPIRequest(successResult)

      await blAPI.createEventHandler(appId, handler)

      expect(apiRequestCalls()[0].path).toBe(`http://test-host:3000/${appId}/console/servercode/prod/timers`)
    })
  })

  describe('updateEventHandler', () => {
    it('should update event handler and normalize result', async () => {
      const handler = {
        id: 'handler-123',
        category: 'events',
        mode: 'DRAFT',
        name: 'updatedHandler'
      }

      const mockResponse = {
        id: 'handler-123',
        name: 'updatedHandler',
        mode: 'DRAFT'
      }

      mockSuccessAPIRequest(mockResponse)

      const result = await blAPI.updateEventHandler(appId, handler)

      expect(result).toEqual(mockResponse)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/draft/events/handler-123`,
        method: 'PUT',
        body: JSON.stringify(handler),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle marketplace handler transformation', async () => {
      const handler = {
        id: 'handler-123',
        category: 'events',
        fromMarketplace: true,
        mode: 'DRAFT',
        name: 'marketplaceHandler'
      }

      const expectedHandler = { ...handler, mode: 'MARKETPLACE' }

      mockSuccessAPIRequest({ id: 'handler-123', mode: 'PRODUCTION' })

      await blAPI.updateEventHandler(appId, handler)

      expect(apiRequestCalls()[0].path).toBe(`http://test-host:3000/${appId}/console/servercode/marketplace/events/handler-123`)
      expect(JSON.parse(apiRequestCalls()[0].body)).toEqual(expectedHandler)
    })
  })

  describe('getEventHandlers', () => {
    it('should get event handlers and normalize them', async () => {
      const mockHandlers = [
        { id: '1', mode: 'DRAFT', name: 'handler1' },
        { id: '2', mode: 'MARKETPLACE', name: 'handler2' }
      ]

      const expectedHandlers = [
        { id: '1', mode: 'DRAFT', name: 'handler1' },
        { id: '2', mode: 'PRODUCTION', name: 'handler2', fromMarketplace: true }
      ]

      mockSuccessAPIRequest(mockHandlers)

      const result = await blAPI.getEventHandlers(appId, ['DRAFT', 'PROD'])

      expect(result).toEqual(expectedHandlers)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode?mode=DRAFT&mode=PROD`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should get all event handlers when no modes specified', async () => {
      mockSuccessAPIRequest([])

      await blAPI.getEventHandlers(appId)

      expect(apiRequestCalls()[0].path).toBe(`http://test-host:3000/${appId}/console/servercode`)
    })
  })

  describe('deleteEventHandler', () => {
    it('should delete event handler', async () => {
      const handler = {
        id: 'handler-123',
        mode: 'DRAFT',
        category: 'events'
      }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.deleteEventHandler(appId, handler)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/draft/events/handler-123`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getHandlerInvocationChain', () => {
    it('should get handler invocation chain with cache tags', async () => {
      const eventId = 'beforeCreate'
      const context = 'Person'

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.getHandlerInvocationChain(appId, eventId, context)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/chain/${eventId}/${context}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateHandlerInvocationChain', () => {
    it('should update handler invocation chain with cache tags', async () => {
      const eventId = 'beforeCreate'
      const context = 'Person'
      const updates = { handlers: ['handler1', 'handler2'] }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.updateHandlerInvocationChain(appId, eventId, context, updates)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/chain/${eventId}/${context}`,
        method: 'PUT',
        body: JSON.stringify(updates),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('invokeTimer', () => {
    it('should invoke timer', async () => {
      const timer = {
        timername: 'testTimer',
        mode: 'PROD',
        category: 'TIMER'
      }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.invokeTimer(appId, timer)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/prod/timers/${timer.timername}/run`,
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('changeHandlerState', () => {
    it('should change handler state', async () => {
      const mode = 'PROD'
      const category = 'events'
      const timerId = 'handler-123'
      const enabled = false

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.changeHandlerState(appId, mode, category, timerId, enabled)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/prod/events/${timerId}/state`,
        method: 'PUT',
        body: JSON.stringify({ enabled }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getCategories', () => {
    it('should get categories', async () => {
      const categories = ['events', 'timers']

      mockSuccessAPIRequest(categories)

      const result = await blAPI.getCategories(appId)

      expect(result).toEqual(categories)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/categories`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getEvents', () => {
    it('should get events', async () => {
      const events = ['beforeCreate', 'afterCreate', 'beforeUpdate']

      mockSuccessAPIRequest(events)

      const result = await blAPI.getEvents(appId)

      expect(result).toEqual(events)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/events`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getTimerLogs', () => {
    it('should get timer logs with query parameters', async () => {
      const query = { limit: 100, offset: 0, fromDate: '2023-01-01' }

      mockSuccessAPIRequest(successResult)

      const result = await blAPI.getTimerLogs(appId, query)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/timers/logs?limit=100&offset=0&fromDate=2023-01-01`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should get timer logs without query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await blAPI.getTimerLogs(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/servercode/timers/logs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  // Test error scenarios for key methods
  describe('error handling', () => {
    it('should handle createService file upload errors', async () => {
      mockFailedAPIRequest('File upload failed', 500)

      const file = new File(['test'], 'service.zip')
      const error = await blAPI.createService(appId, { file, model: 'test' }).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('File upload failed')
    })

    it('should handle getServiceSpec parsing errors', async () => {
      mockFailedAPIRequest('Invalid spec format', 422)

      const error = await blAPI.getServiceSpec(appId, serviceId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
    })

    it('should handle createEventHandler validation errors', async () => {
      mockFailedAPIRequest('Invalid handler configuration', 400)

      const handler = { category: 'events', mode: 'DRAFT', language: 'JS' }
      const error = await blAPI.createEventHandler(appId, handler).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
    })

    it('should handle saveDraftFiles sync errors', async () => {
      mockFailedAPIRequest('Synchronization failed', 500)

      const files = [{ id: 'test.js', content: 'test' }]
      const error = await blAPI.saveDraftFiles(appId, 'JS', 'model', files).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  // Test helper functions and complex transformations
  describe('helper functions and transformations', () => {
    it('should normalize service configuration', async () => {
      const mockServices = [
        {
          id: 'service1',
          configuration: [
            { name: 'apiKey', displayName: 'API Key', type: 'password' },
            { name: 'endpoint', displayName: 'Endpoint URL', type: 'url' }
          ]
        }
      ]

      const expectedServices = [
        {
          id: 'service1',
          configDescriptions: [
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'endpoint', label: 'Endpoint URL', type: 'url' }
          ]
        }
      ]

      mockSuccessAPIRequest(mockServices)

      const result = await blAPI.getServices(appId)

      expect(result).toEqual(expectedServices)
    })

    it('should parse service spec correctly', async () => {
      const mockSpec = {
        info: { title: 'Test API', version: '1.0' },
        servers: [{ url: 'https://api.test.com' }],
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              summary: 'Get all users',
              parameters: []
            },
            post: {
              operationId: 'createUser',
              summary: 'Create new user',
              requestBody: {}
            }
          },
          '/users/{id}': {
            get: {
              operationId: 'getUserById',
              summary: 'Get user by ID'
            }
          }
        }
      }

      const expectedResult = {
        summary: {
          info: { title: 'Test API', version: '1.0' },
          servers: [{ url: 'https://api.test.com' }]
        },
        methods: {
          getUsers: {
            operationId: 'getUsers',
            summary: 'Get all users',
            parameters: [],
            path: '/users',
            type: 'get',
            id: 'getUsers'
          },
          createUser: {
            operationId: 'createUser',
            summary: 'Create new user',
            requestBody: {},
            path: '/users',
            type: 'post',
            id: 'createUser'
          },
          getUserById: {
            operationId: 'getUserById',
            summary: 'Get user by ID',
            path: '/users/{id}',
            type: 'get',
            id: 'getUserById'
          }
        }
      }

      mockSuccessAPIRequest(mockSpec)

      const result = await blAPI.getServiceSpec(appId, serviceId, true)

      expect(result).toEqual(expectedResult)
    })

    it('should normalize handlers correctly', async () => {
      const mockHandlers = [
        { id: '1', mode: 'DRAFT', name: 'handler1' },
        { id: '2', mode: 'PRODUCTION', name: 'handler2' },
        { id: '3', mode: 'MARKETPLACE', name: 'handler3' }
      ]

      const expectedHandlers = [
        { id: '1', mode: 'DRAFT', name: 'handler1' },
        { id: '2', mode: 'PRODUCTION', name: 'handler2' },
        { id: '3', mode: 'PRODUCTION', name: 'handler3', fromMarketplace: true }
      ]

      mockSuccessAPIRequest(mockHandlers)

      const result = await blAPI.getEventHandlers(appId)

      expect(result).toEqual(expectedHandlers)
    })

    it('should encode file paths correctly', async () => {
      const fileId = 'folder/subfolder/file with spaces.js'
      const language = 'JS'
      const model = 'test-model'

      mockSuccessAPIRequest('file content')

      await blAPI.getDraftFileContent(appId, language, model, fileId)

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/servercode/${model}/draft/${language}/folder/subfolder/file%20with%20spaces.js`
      )
    })

    it('should handle complex file encoding in saveDraftFiles', async () => {
      const language = 'JS'
      const model = 'test-model'
      const files = [
        { id: 'src/main.js', content: 'main content' },
        { id: 'lib/utils/helper.js', content: 'helper content' },
        { id: 'config/settings.json', content: '{}' }
      ]

      const expectedEncodedFiles = [
        { id: 'src/main.js', content: 'main content' },
        { id: 'lib/utils/helper.js', content: 'helper content' },
        { id: 'config/settings.json', content: '{}' }
      ]

      mockSuccessAPIRequest(successResult)

      await blAPI.saveDraftFiles(appId, language, model, files)

      expect(JSON.parse(apiRequestCalls()[0].body)).toEqual(expectedEncodedFiles)
    })
  })
})
