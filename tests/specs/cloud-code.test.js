import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.cloudCode', () => {
  let apiClient
  let cloudCodeAPI

  const appId = 'test-app-id'
  const productId = 'test-product-id'
  const successResult = { success: true }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    cloudCodeAPI = apiClient.cloudCode
  })

  describe('installMarketplaceDeploymentModel', () => {

    it('should make POST request with correct parameters and version query', async () => {
      mockSuccessAPIRequest(successResult)

      const version = '1.0.0'
      const result = await cloudCodeAPI.installMarketplaceDeploymentModel(appId, productId, version)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/install/test-product-id?version=1.0.0',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle different appId and productId values', async () => {
      mockSuccessAPIRequest(successResult)

      const differentAppId = 'my-custom-app'
      const differentProductId = 'special-product-123'
      const version = '2.1.0'
      
      const result = await cloudCodeAPI.installMarketplaceDeploymentModel(differentAppId, differentProductId, version)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/my-custom-app/console/cloud-code/deployment-models/marketplace/install/special-product-123?version=2.1.0',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle special characters in version parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const version = '1.0.0-beta+build.123'
      
      const result = await cloudCodeAPI.installMarketplaceDeploymentModel(appId, productId, version)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/install/test-product-id?version=1.0.0-beta%2Bbuild.123',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle undefined version parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await cloudCodeAPI.installMarketplaceDeploymentModel(appId, productId, undefined)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/install/test-product-id',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle empty string version parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await cloudCodeAPI.installMarketplaceDeploymentModel(appId, productId, '')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/install/test-product-id?version=',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Product not found', 404)

      const version = '1.0.0'
      const error = await cloudCodeAPI.installMarketplaceDeploymentModel(appId, productId, version).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        'body'   : {
          'message': 'Product not found'
        },
        'message': 'Product not found',
        'status' : 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/install/test-product-id?version=1.0.0',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with authorization error', async () => {
      mockFailedAPIRequest('Unauthorized access', 401)

      const version = '1.0.0'
      const error = await cloudCodeAPI.installMarketplaceDeploymentModel(appId, productId, version).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        'body'   : {
          'message': 'Unauthorized access'
        },
        'message': 'Unauthorized access',
        'status' : 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/install/test-product-id?version=1.0.0',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })
  })

  describe('uninstallMarketplaceDeploymentModel', () => {

    it('should make POST request with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await cloudCodeAPI.uninstallMarketplaceDeploymentModel(appId, productId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/uninstall/test-product-id',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle different appId and productId values', async () => {
      mockSuccessAPIRequest(successResult)

      const differentAppId = 'another-app-id'
      const differentProductId = 'another-product-id'
      
      const result = await cloudCodeAPI.uninstallMarketplaceDeploymentModel(differentAppId, differentProductId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/another-app-id/console/cloud-code/deployment-models/marketplace/uninstall/another-product-id',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('should handle appId and productId with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const appIdWithSpecialChars = 'app-with-dashes_and_underscores'
      const productIdWithSpecialChars = 'product.with.dots'
      
      const result = await cloudCodeAPI.uninstallMarketplaceDeploymentModel(appIdWithSpecialChars, productIdWithSpecialChars)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/app-with-dashes_and_underscores/console/cloud-code/deployment-models/marketplace/uninstall/product.with.dots',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Product not installed', 400)

      const error = await cloudCodeAPI.uninstallMarketplaceDeploymentModel(appId, productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        'body'   : {
          'message': 'Product not installed'
        },
        'message': 'Product not installed',
        'status' : 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/uninstall/test-product-id',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Insufficient permissions', 403)

      const error = await cloudCodeAPI.uninstallMarketplaceDeploymentModel(appId, productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        'body'   : {
          'message': 'Insufficient permissions'
        },
        'message': 'Insufficient permissions',
        'status' : 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/uninstall/test-product-id',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })

    it('fails when server responds with internal server error', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const error = await cloudCodeAPI.uninstallMarketplaceDeploymentModel(appId, productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        'body'   : {
          'message': 'Internal server error'
        },
        'message': 'Internal server error',
        'status' : 500
      })

      expect(apiRequestCalls()).toEqual([
        {
          'path'           : 'http://test-host:3000/test-app-id/console/cloud-code/deployment-models/marketplace/uninstall/test-product-id',
          'method'         : 'POST',
          'body'           : undefined,
          'encoding'       : 'utf8',
          'headers'        : {},
          'timeout'        : 0,
          'withCredentials': false
        }
      ])
    })
  })
})