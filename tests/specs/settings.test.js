describe('apiClient.settings', () => {
  let apiClient
  let settingsAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    settingsAPI = apiClient.settings
  })

  describe('getMobileSettings', () => {
    it('should make GET request to get mobile settings', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.getMobileSettings(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await settingsAPI.getMobileSettings(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Service unavailable' },
        message: 'Service unavailable',
        status : 503
      })
    })
  })

  describe('createAndroidMobileSettings', () => {
    it('should make POST request to create Android mobile settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = { packageName: 'com.example.app', keyStore: 'keystore-data' }
      const result = await settingsAPI.createAndroidMobileSettings(appId, settings)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings/android`,
          body           : JSON.stringify(settings),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid Android settings', 400)

      const settings = { packageName: 'invalid-package' }
      const error = await settingsAPI.createAndroidMobileSettings(appId, settings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid Android settings' },
        message: 'Invalid Android settings',
        status : 400
      })
    })
  })

  describe('updateAndroidMobileSettings', () => {
    it('should make PUT request to update Android mobile settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = { packageName: 'com.example.updated' }
      const id = 'setting-123'
      const result = await settingsAPI.updateAndroidMobileSettings(appId, settings, id)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings/android/${id}`,
          body           : JSON.stringify(settings),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Settings not found', 404)

      const settings = { packageName: 'com.example.nonexistent' }
      const id = 'nonexistent-id'
      const error = await settingsAPI.updateAndroidMobileSettings(appId, settings, id).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Settings not found' },
        message: 'Settings not found',
        status : 404
      })
    })
  })

  describe('deleteAndroidMobileSettings', () => {
    it('should make DELETE request to delete Android mobile settings', async () => {
      mockSuccessAPIRequest(successResult)

      const id = 'setting-123'
      const result = await settingsAPI.deleteAndroidMobileSettings(appId, id)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings/android/${id}`,
          body           : undefined,
          method         : 'DELETE',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Cannot delete settings', 403)

      const id = 'protected-setting'
      const error = await settingsAPI.deleteAndroidMobileSettings(appId, id).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Cannot delete settings' },
        message: 'Cannot delete settings',
        status : 403
      })
    })
  })

  describe('createAppleMobileSettings', () => {
    it('should make POST request to create Apple mobile settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = { bundleId: 'com.example.ios', certificate: 'cert-data' }
      const deviceType = 'ios'
      const result = await settingsAPI.createAppleMobileSettings(appId, settings, deviceType)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings/${deviceType}`,
          body           : JSON.stringify(settings),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid Apple certificate', 400)

      const settings = { bundleId: 'com.example.invalid' }
      const deviceType = 'ios'
      const error = await settingsAPI.createAppleMobileSettings(appId, settings, deviceType).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid Apple certificate' },
        message: 'Invalid Apple certificate',
        status : 400
      })
    })
  })

  describe('updateAppleMobileSettings', () => {
    it('should make PUT request to update Apple mobile settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = { bundleId: 'com.example.updated' }
      const id = 'setting-456'
      const deviceType = 'ios'
      const result = await settingsAPI.updateAppleMobileSettings(appId, settings, id, deviceType)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings/${deviceType}/${id}`,
          body           : JSON.stringify(settings),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Apple settings not found', 404)

      const settings = { bundleId: 'com.example.notfound' }
      const id = 'nonexistent-id'
      const deviceType = 'ios'
      const error = await settingsAPI.updateAppleMobileSettings(appId, settings, id, deviceType).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Apple settings not found' },
        message: 'Apple settings not found',
        status : 404
      })
    })
  })

  describe('deleteAppleMobileCertificate', () => {
    it('should make DELETE request to delete Apple mobile certificate', async () => {
      mockSuccessAPIRequest(successResult)

      const id = 'cert-789'
      const deviceType = 'ios'
      const result = await settingsAPI.deleteAppleMobileCertificate(appId, id, deviceType)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/mobilesettings/${deviceType}/${id}`,
          body           : undefined,
          method         : 'DELETE',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Certificate not found', 404)

      const id = 'nonexistent-cert'
      const deviceType = 'ios'
      const error = await settingsAPI.deleteAppleMobileCertificate(appId, id, deviceType).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Certificate not found' },
        message: 'Certificate not found',
        status : 404
      })
    })
  })

  describe('getCustomDomains', () => {
    it('should make GET request to get custom domains', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.getCustomDomains(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/settings/custom-domain`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await settingsAPI.getCustomDomains(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Access denied' },
        message: 'Access denied',
        status : 403
      })
    })
  })

  describe('createCustomDomain', () => {
    it('should make POST request to create custom domain', async () => {
      mockSuccessAPIRequest(successResult)

      const domainData = { domain: 'example.com', subdomain: 'app' }
      const result = await settingsAPI.createCustomDomain(appId, domainData)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/settings/custom-domain`,
          body           : JSON.stringify(domainData),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('assignCustomDomain', () => {
    it('should make POST request to assign generated custom domain', async () => {
      mockSuccessAPIRequest(successResult)

      const domainData = { generatedDomain: 'auto-generated.backendless.app' }
      const result = await settingsAPI.assignCustomDomain(appId, domainData)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/settings/custom-domain/assign-generated-domain`,
          body           : JSON.stringify(domainData),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('changeCustomDomain', () => {
    it('should make PUT request to change custom domain', async () => {
      mockSuccessAPIRequest(successResult)

      const domainData = { id: 'domain-123', domain: 'updated.com' }
      const result = await settingsAPI.changeCustomDomain(appId, domainData)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/settings/custom-domain/${domainData.id}`,
          body           : JSON.stringify(domainData),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteCustomDomain', () => {
    it('should make DELETE request to delete custom domain', async () => {
      mockSuccessAPIRequest(successResult)

      const domainId = 'domain-456'
      const result = await settingsAPI.deleteCustomDomain(appId, domainId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/settings/custom-domain/${domainId}`,
          body           : undefined,
          method         : 'DELETE',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getDataValidators', () => {
    it('should make GET request to get data validators', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.getDataValidators()

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : 'http://test-host:3000/console/datavalidators',
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await settingsAPI.getDataValidators().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Service unavailable' },
        message: 'Service unavailable',
        status : 503
      })
    })
  })

  describe('getAppSettings', () => {
    it('should make GET request to get app settings and normalize API keys', async () => {
      const mockSettings = {
        apiKeys: [
          { deviceType: 'JS', apiKey: 'js-key-123' },
          { deviceType: 'REST', apiKey: 'rest-key-456' },
          { deviceType: 'CUSTOM', apiKey: 'custom-key-789' }
        ]
      }
      mockSuccessAPIRequest(mockSettings)

      const result = await settingsAPI.getAppSettings(appId)

      expect(result.apiKeysMap).toEqual({
        JS  : 'js-key-123',
        REST: 'rest-key-456'
      })
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/appsettings`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('should normalize API keys with correct SYSTEM_API_KEYS ordering', async () => {
      const mockSettings = {
        apiKeys: [
          { deviceType: 'CUSTOM1', apiKey: 'custom-key-1' },
          { deviceType: 'IOS', apiKey: 'ios-key' },
          { deviceType: 'CUSTOM2', apiKey: 'custom-key-2' },
          { deviceType: 'ANDROID', apiKey: 'android-key' },
          { deviceType: 'WP', apiKey: 'wp-key' },
          { deviceType: 'REST', apiKey: 'rest-key' },
          { deviceType: 'JS', apiKey: 'js-key' }
        ]
      }
      mockSuccessAPIRequest(mockSettings)

      const result = await settingsAPI.getAppSettings(appId)

      // Should maintain SYSTEM_API_KEYS order: ['ANDROID', 'IOS', 'JS', 'REST', 'WP', 'AS', 'BL']
      expect(result.apiKeys).toEqual([
        { deviceType: 'ANDROID', apiKey: 'android-key' },
        { deviceType: 'IOS', apiKey: 'ios-key' },
        { deviceType: 'JS', apiKey: 'js-key' },
        { deviceType: 'REST', apiKey: 'rest-key' },
        { deviceType: 'WP', apiKey: 'wp-key' },
        { deviceType: 'CUSTOM1', apiKey: 'custom-key-1' },
        { deviceType: 'CUSTOM2', apiKey: 'custom-key-2' }
      ])

      expect(result.apiKeysMap).toEqual({
        ANDROID: 'android-key',
        IOS    : 'ios-key',
        JS     : 'js-key',
        REST   : 'rest-key',
        WP     : 'wp-key'
      })
    })

    it('should normalize API keys with empty apiKey values', async () => {
      const mockSettings = {
        apiKeys: [
          { deviceType: 'CUSTOM1', apiKey: 'custom1-key' },
          { deviceType: 'ANDROID', apiKey: 'android-key' },
          { deviceType: 'REST', apiKey: 'rest-key' },
          { deviceType: 'BL', apiKey: 'bl-key' }
        ]
      }

      mockSuccessAPIRequest(mockSettings)

      const result = await settingsAPI.getAppSettings(appId)

      // Should maintain SYSTEM_API_KEYS order: ['ANDROID', 'IOS', 'JS', 'REST', 'WP', 'AS', 'BL']
      expect(result.apiKeys).toEqual([
        { apiKey: 'android-key', deviceType: 'ANDROID' },
        { apiKey: 'rest-key', deviceType: 'REST' },
        { apiKey: 'bl-key', deviceType: 'BL' },
        { apiKey: 'custom1-key', deviceType: 'CUSTOM1' }
      ])

      expect(result.apiKeysMap).toEqual({
        ANDROID: 'android-key',
        BL     : 'bl-key',
        REST   : 'rest-key'
      })
    })

    it('should handle empty API keys array', async () => {
      const mockSettings = { apiKeys: [] }
      mockSuccessAPIRequest(mockSettings)

      const result = await settingsAPI.getAppSettings(appId)

      expect(result.apiKeys).toEqual([])
      expect(result.apiKeysMap).toEqual({})
    })

    it('should handle missing system API keys', async () => {
      const mockSettings = {
        apiKeys: [
          { deviceType: 'AS', apiKey: 'as-key' },
          { deviceType: 'BL', apiKey: 'bl-key' },
          { deviceType: 'CUSTOM', apiKey: 'custom-key' }
        ]
      }
      mockSuccessAPIRequest(mockSettings)

      const result = await settingsAPI.getAppSettings(appId)

      // Should only include existing system keys and custom keys
      expect(result.apiKeys).toEqual([
        { deviceType: 'AS', apiKey: 'as-key' },
        { deviceType: 'BL', apiKey: 'bl-key' },
        { deviceType: 'CUSTOM', apiKey: 'custom-key' }
      ])

      expect(result.apiKeysMap).toEqual({
        AS: 'as-key',
        BL: 'bl-key'
      })
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('App settings not found', 404)

      const error = await settingsAPI.getAppSettings(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'App settings not found' },
        message: 'App settings not found',
        status : 404
      })
    })
  })

  describe('regenerateAPIKey', () => {
    it('should make POST request to regenerate API key', async () => {
      mockSuccessAPIRequest(successResult)

      const apiKeyId = 'key-123'
      const result = await settingsAPI.regenerateAPIKey(appId, apiKeyId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/apikey/${apiKeyId}/regenerate`,
          body           : undefined,
          method         : 'POST',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getAPIKey', () => {
    it('should make GET request to get API key', async () => {
      mockSuccessAPIRequest(successResult)

      const apiKeyId = 'key-456'
      const result = await settingsAPI.getAPIKey(appId, apiKeyId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/apikey/${apiKeyId}`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('createAPIKey', () => {
    it('should make POST request to create API key', async () => {
      mockSuccessAPIRequest(successResult)

      const apiKey = { deviceType: 'CUSTOM', name: 'My Custom Key' }
      const result = await settingsAPI.createAPIKey(appId, apiKey)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/apikey`,
          body           : JSON.stringify(apiKey),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateAPIKey', () => {
    it('should make PUT request to update API key', async () => {
      mockSuccessAPIRequest(successResult)

      const apiKeyId = 'key-789'
      const apiKey = { name: 'Updated Key Name' }
      const result = await settingsAPI.updateAPIKey(appId, apiKeyId, apiKey)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/apikey/${apiKeyId}`,
          body           : JSON.stringify(apiKey),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteAPIKey', () => {
    it('should make DELETE request to delete API key', async () => {
      mockSuccessAPIRequest(successResult)

      const apiKeyId = 'key-000'
      const result = await settingsAPI.deleteAPIKey(appId, apiKeyId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/apikey/${apiKeyId}`,
          body           : undefined,
          method         : 'DELETE',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getAppLogging', () => {
    it('should make GET request to get app logging config', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.getAppLogging(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/logging/config`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('setAppLoggingConfig', () => {
    it('should make POST request to set app logging config', async () => {
      mockSuccessAPIRequest(successResult)

      const config = { level: 'DEBUG', enabled: true }
      const result = await settingsAPI.setAppLoggingConfig(appId, config)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/logging/config`,
          body           : JSON.stringify(config),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('setAppLoggingIntegration', () => {
    it('should make POST request to set app logging integration', async () => {
      mockSuccessAPIRequest(successResult)

      const integration = { type: 'webhook', url: 'https://example.com/logs' }
      const result = await settingsAPI.setAppLoggingIntegration(appId, integration)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/logging/integration`,
          body           : JSON.stringify(integration),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('clearLoggers', () => {
    it('should make DELETE request to clear loggers', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.clearLoggers(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/logging/loggers`,
          body           : undefined,
          method         : 'DELETE',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateSocialParams', () => {
    it('should make POST request to update social params', async () => {
      mockSuccessAPIRequest(successResult)

      const param = { provider: 'facebook', clientId: 'fb-client-123' }
      const result = await settingsAPI.updateSocialParams(appId, param)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/socialparams`,
          body           : JSON.stringify(param),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getLandingPageData', () => {
    it('should make GET request to get landing page data', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.getLandingPageData(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/landing-page`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getLandingPageTemplates', () => {
    it('should make GET request to get landing page templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await settingsAPI.getLandingPageTemplates(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/landing-page/templates`,
          body           : undefined,
          method         : 'GET',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('saveLandingPageData', () => {
    it('should make PUT request to save landing page data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { title: 'My App', description: 'App description' }
      const result = await settingsAPI.saveLandingPageData(appId, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/landing-page`,
          body           : JSON.stringify(data),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('publishLandingPageData', () => {
    it('should make POST request to publish landing page data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { title: 'Published App', live: true }
      const result = await settingsAPI.publishLandingPageData(appId, data)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/landing-page/publish`,
          body           : JSON.stringify(data),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('uploadLandingPageFile', () => {
    it('should make POST request to upload landing page file', async () => {
      mockSuccessAPIRequest(successResult)

      const file = 'mock-file-content'
      const section = 'hero'
      const name = 'hero-image'
      const result = await settingsAPI.uploadLandingPageFile(appId, file, section, name)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/landing-page/file?section=${section}&name=${name}`,
          body           : expect.any(Object),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('File upload failed', 413)

      const file = 'large-file-content'
      const section = 'gallery'
      const name = 'large-image'
      const error = await settingsAPI.uploadLandingPageFile(appId, file, section, name).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'File upload failed' },
        message: 'File upload failed',
        status : 413
      })
    })
  })

  describe('updateIOSCert', () => {
    it('should make POST request to update iOS certificate', async () => {
      mockSuccessAPIRequest(successResult)

      const certData = { certificate: 'cert-content', password: 'cert-password' }
      const result = await settingsAPI.updateIOSCert(appId, certData)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/ioscert`,
          body           : JSON.stringify(certData),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid certificate', 400)

      const certData = { certificate: 'invalid-cert' }
      const error = await settingsAPI.updateIOSCert(appId, certData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid certificate' },
        message: 'Invalid certificate',
        status : 400
      })
    })
  })

  describe('setAppLogging (deprecated)', () => {
    let consoleWarnSpy

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
      })
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
    })

    it('should make POST request to set app logging config with deprecation warning', async () => {
      mockSuccessAPIRequest(successResult)

      const logging = { level: 'ERROR', enabled: false }
      const result = await settingsAPI.setAppLogging(appId, logging)

      expect(result).toEqual(successResult)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '"ApiClient.settings.setAppLogging" is deprecated method, will be removed when fixed BKNDLSS-18585'
      )
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/logging/config`,
          body           : JSON.stringify(logging),
          method         : 'POST',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid logging config', 400)

      const logging = { level: 'INVALID' }
      const error = await settingsAPI.setAppLogging(appId, logging).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid logging config' },
        message: 'Invalid logging config',
        status : 400
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe('updateDomainNames (deprecated)', () => {
    it('should make PUT request to update domain names', async () => {
      mockSuccessAPIRequest(successResult)

      const domainNames = 'example.com subdomain.example.com'
      const result = await settingsAPI.updateDomainNames(appId, domainNames)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/domaincontrolsettings`,
          body           : JSON.stringify(['example.com', 'subdomain.example.com']),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('should handle single domain name', async () => {
      mockSuccessAPIRequest(successResult)

      const domainNames = 'single.example.com'
      const result = await settingsAPI.updateDomainNames(appId, domainNames)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/domaincontrolsettings`,
          body           : JSON.stringify(['single.example.com']),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('should handle multiple whitespace-separated domains', async () => {
      mockSuccessAPIRequest(successResult)

      const domainNames = 'first.com   second.com\tthird.com\nfourth.com'
      const result = await settingsAPI.updateDomainNames(appId, domainNames)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/domaincontrolsettings`,
          body           : JSON.stringify(['first.com', 'second.com', 'third.com', 'fourth.com']),
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : { 'Content-Type': 'application/json' },
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid domain format', 400)

      const domainNames = 'invalid-domain'
      const error = await settingsAPI.updateDomainNames(appId, domainNames).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Invalid domain format' },
        message: 'Invalid domain format',
        status : 400
      })
    })
  })

  describe('updateCustomDomain (deprecated)', () => {
    it('should make PUT request to update custom domain', async () => {
      mockSuccessAPIRequest(successResult)

      const domainName = 'custom.example.com'
      const result = await settingsAPI.updateCustomDomain(appId, domainName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path           : `http://test-host:3000/${appId}/console/dnsmapping`,
          body           : domainName,
          method         : 'PUT',
          encoding       : 'utf8',
          headers        : {},
          timeout        : 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Domain already exists', 409)

      const domainName = 'existing.example.com'
      const error = await settingsAPI.updateCustomDomain(appId, domainName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body   : { message: 'Domain already exists' },
        message: 'Domain already exists',
        status : 409
      })
    })
  })
})
