import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.users', () => {
  let apiClient
  let usersAPI

  const appId = 'test-app-id'
  const successResult = { id: 'test-id', name: 'test-name' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    usersAPI = apiClient.users
  })

  describe('getUsersRegs', () => {
    it('should fetch user registration configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getUsersRegs(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userregistration',
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

      const error = await usersAPI.getUsersRegs(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('updateUsersRegs', () => {
    it('should update user registration configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        enableRegistration: true,
        requireEmailConfirmation: false,
        defaultRole: 'user'
      }

      const result = await usersAPI.updateUsersRegs(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userregistration',
        method: 'PUT',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid configuration', 422)

      const data = { enableRegistration: true }
      const error = await usersAPI.updateUsersRegs(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Invalid configuration')
    })
  })

  describe('getUsersLogin', () => {
    it('should fetch user login configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getUsersLogin(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userlogin',
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

      const error = await usersAPI.getUsersLogin(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('logoutAllUsers', () => {
    it('should logout all users', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.logoutAllUsers(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userlogin/logout/all',
        method: 'POST',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Logout failed', 500)

      const error = await usersAPI.logoutAllUsers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Logout failed')
    })
  })

  describe('getUserSocialLogin', () => {
    it('should fetch social login URL for provider', async () => {
      mockSuccessAPIRequest(successResult)

      const provider = 'google'
      const result = await usersAPI.getUserSocialLogin(provider)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/social/oauth/google/request_url',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should work with different providers', async () => {
      mockSuccessAPIRequest(successResult)

      const provider = 'facebook'
      const result = await usersAPI.getUserSocialLogin(provider)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/social/oauth/facebook/request_url',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider not found', 404)

      const error = await usersAPI.getUserSocialLogin('invalid-provider').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Provider not found')
    })
  })

  describe('updateUsersLogin', () => {
    it('should update user login configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        enableLogin: true,
        lockoutPolicy: { enabled: false },
        sessionTimeout: 3600
      }

      const result = await usersAPI.updateUsersLogin(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userlogin',
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid login configuration', 422)

      const data = { enableLogin: true }
      const error = await usersAPI.updateUsersLogin(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Invalid login configuration')
    })
  })

  describe('getUsersProps', () => {
    it('should fetch user properties', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getUsersProps(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userproperties',
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

      const error = await usersAPI.getUsersProps(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('updateUsersProps', () => {
    it('should update user property', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'customProperty',
        type: 'STRING',
        required: true,
        identity: false
      }

      const result = await usersAPI.updateUsersProps(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userproperties/customProperty',
        method: 'PUT',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle property names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'custom-property_name',
        type: 'INT',
        required: false
      }

      const result = await usersAPI.updateUsersProps(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/userproperties/custom-property_name',
        method: 'PUT',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Property validation failed', 422)

      const data = { name: 'test', type: 'INVALID' }
      const error = await usersAPI.updateUsersProps(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Property validation failed')
    })
  })

  describe('updateSocialParams', () => {
    it('should update social parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const param = {
        provider: 'google',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      }

      const result = await usersAPI.updateSocialParams(appId, param)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/socialparams',
        method: 'POST',
        body: JSON.stringify(param),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid social parameters', 422)

      const param = { provider: 'google' }
      const error = await usersAPI.updateSocialParams(appId, param).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Invalid social parameters')
    })
  })

  describe('getOAuth1ProviderTemplates', () => {
    it('should fetch OAuth1 provider templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getOAuth1ProviderTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1-templates',
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

      const error = await usersAPI.getOAuth1ProviderTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getOAuth2ProviderTemplates', () => {
    it('should fetch OAuth2 provider templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getOAuth2ProviderTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2-templates',
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

      const error = await usersAPI.getOAuth2ProviderTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getOAuth1Providers', () => {
    it('should fetch OAuth1 providers', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getOAuth1Providers(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1',
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

      const error = await usersAPI.getOAuth1Providers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getOAuth2Providers', () => {
    it('should fetch OAuth2 providers', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getOAuth2Providers(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2',
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

      const error = await usersAPI.getOAuth2Providers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getOAuth1Provider', () => {
    it('should fetch specific OAuth1 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const providerId = 'twitter-provider'
      const result = await usersAPI.getOAuth1Provider(appId, providerId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1/twitter-provider',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider not found', 404)

      const error = await usersAPI.getOAuth1Provider(appId, 'non-existent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Provider not found')
    })
  })

  describe('getOAuth2Provider', () => {
    it('should fetch specific OAuth2 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const providerId = 'google-provider'
      const result = await usersAPI.getOAuth2Provider(appId, providerId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2/google-provider',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider not found', 404)

      const error = await usersAPI.getOAuth2Provider(appId, 'non-existent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Provider not found')
    })
  })

  describe('createOAuth2Provider', () => {
    it('should create OAuth2 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const provider = {
        name: 'Google OAuth',
        code: 'google',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        scope: 'email profile'
      }

      const result = await usersAPI.createOAuth2Provider(appId, provider)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2',
        method: 'POST',
        body: JSON.stringify(provider),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider creation failed', 422)

      const provider = { name: 'Invalid Provider' }
      const error = await usersAPI.createOAuth2Provider(appId, provider).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Provider creation failed')
    })
  })

  describe('updateOAuth1Provider', () => {
    it('should update OAuth1 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const provider = {
        id: 'twitter-provider-id',
        name: 'Twitter OAuth',
        consumerKey: 'test-consumer-key',
        consumerSecret: 'test-consumer-secret'
      }

      const result = await usersAPI.updateOAuth1Provider(appId, provider)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1/twitter-provider-id',
        method: 'PUT',
        body: JSON.stringify(provider),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider update failed', 422)

      const provider = { id: 'test-id', name: 'Invalid' }
      const error = await usersAPI.updateOAuth1Provider(appId, provider).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Provider update failed')
    })
  })

  describe('updateOAuth2Provider', () => {
    it('should update OAuth2 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const provider = {
        id: 'google-provider-id',
        name: 'Google OAuth Updated',
        clientId: 'updated-client-id',
        clientSecret: 'updated-client-secret',
        scope: 'email profile openid'
      }

      const result = await usersAPI.updateOAuth2Provider(appId, provider)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2/google-provider-id',
        method: 'PUT',
        body: JSON.stringify(provider),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider update failed', 422)

      const provider = { id: 'test-id', name: 'Invalid' }
      const error = await usersAPI.updateOAuth2Provider(appId, provider).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Provider update failed')
    })
  })

  describe('createOAuth1ProviderFromTemplate', () => {
    it('should create OAuth1 provider from template', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        templateId: 'twitter-template',
        name: 'My Twitter Provider',
        consumerKey: 'test-key',
        consumerSecret: 'test-secret'
      }

      const result = await usersAPI.createOAuth1ProviderFromTemplate(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1/create-from-template',
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template creation failed', 422)

      const data = { templateId: 'invalid' }
      const error = await usersAPI.createOAuth1ProviderFromTemplate(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Template creation failed')
    })
  })

  describe('createOAuth2ProviderFromTemplate', () => {
    it('should create OAuth2 provider from template', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        templateId: 'google-template',
        name: 'My Google Provider',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      }

      const result = await usersAPI.createOAuth2ProviderFromTemplate(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2/create-from-template',
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template creation failed', 422)

      const data = { templateId: 'invalid' }
      const error = await usersAPI.createOAuth2ProviderFromTemplate(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Template creation failed')
    })
  })

  describe('removeOAuth1Provider', () => {
    it('should remove OAuth1 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const providerId = 'twitter-provider-id'
      const result = await usersAPI.removeOAuth1Provider(appId, providerId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1/twitter-provider-id',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider not found', 404)

      const error = await usersAPI.removeOAuth1Provider(appId, 'non-existent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Provider not found')
    })
  })

  describe('removeOAuth2Provider', () => {
    it('should remove OAuth2 provider', async () => {
      mockSuccessAPIRequest(successResult)

      const providerId = 'google-provider-id'
      const result = await usersAPI.removeOAuth2Provider(appId, providerId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2/google-provider-id',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider not found', 404)

      const error = await usersAPI.removeOAuth2Provider(appId, 'non-existent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Provider not found')
    })
  })

  describe('getOAuth1CallbackUrls', () => {
    it('should fetch OAuth1 callback URLs', async () => {
      mockSuccessAPIRequest(successResult)

      const providerCode = 'twitter'
      const result = await usersAPI.getOAuth1CallbackUrls(appId, providerCode)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth1/twitter/callback-url',
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

      const error = await usersAPI.getOAuth1CallbackUrls(appId, 'invalid').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getOAuth2CallbackUrls', () => {
    it('should fetch OAuth2 callback URLs', async () => {
      mockSuccessAPIRequest(successResult)

      const providerCode = 'google'
      const result = await usersAPI.getOAuth2CallbackUrls(appId, providerCode)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/users/oauth2/google/callback-url',
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

      const error = await usersAPI.getOAuth2CallbackUrls(appId, 'invalid').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getAuth0Configuration', () => {
    it('should fetch Auth0 configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getAuth0Configuration(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/auth0/config',
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

      const error = await usersAPI.getAuth0Configuration(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('updateAuth0Configuration', () => {
    it('should update Auth0 configuration', async () => {
      mockSuccessAPIRequest(successResult)

      const config = {
        domain: 'my-tenant.auth0.com',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        audience: 'https://api.example.com'
      }

      const result = await usersAPI.updateAuth0Configuration(appId, config)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/auth0/config',
        method: 'PUT',
        body: JSON.stringify(config),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid Auth0 configuration', 422)

      const config = { domain: 'invalid' }
      const error = await usersAPI.updateAuth0Configuration(appId, config).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Invalid Auth0 configuration')
    })
  })

  describe('createAuth0ScopeBinding', () => {
    it('should create Auth0 scope binding', async () => {
      mockSuccessAPIRequest(successResult)

      const binding = {
        scope: 'read:users',
        role: 'admin',
        description: 'Admin access to user data'
      }

      const result = await usersAPI.createAuth0ScopeBinding(appId, binding)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/auth0/scope-to-role',
        method: 'POST',
        body: JSON.stringify(binding),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid scope binding', 422)

      const binding = { scope: 'invalid' }
      const error = await usersAPI.createAuth0ScopeBinding(appId, binding).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Invalid scope binding')
    })
  })

  describe('updateAuth0ScopeBinding', () => {
    it('should update Auth0 scope binding', async () => {
      mockSuccessAPIRequest(successResult)

      const binding = {
        id: 'binding-123',
        scope: 'write:users',
        role: 'superadmin',
        description: 'Super admin access to user data'
      }

      const result = await usersAPI.updateAuth0ScopeBinding(appId, binding)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/auth0/scope-to-role/binding-123',
        method: 'PUT',
        body: JSON.stringify(binding),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Binding update failed', 422)

      const binding = { id: 'test-id', scope: 'invalid' }
      const error = await usersAPI.updateAuth0ScopeBinding(appId, binding).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Binding update failed')
    })
  })

  describe('getAuth0ScopeBindings', () => {
    it('should fetch Auth0 scope bindings', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await usersAPI.getAuth0ScopeBindings(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/auth0/scope-to-role',
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

      const error = await usersAPI.getAuth0ScopeBindings(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('deleteAuth0ScopeBinding', () => {
    it('should delete Auth0 scope binding', async () => {
      mockSuccessAPIRequest(successResult)

      const bindingId = 'binding-123'
      const result = await usersAPI.deleteAuth0ScopeBinding(appId, bindingId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/auth0/scope-to-role/binding-123',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Binding not found', 404)

      const error = await usersAPI.deleteAuth0ScopeBinding(appId, 'non-existent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Binding not found')
    })
  })
})