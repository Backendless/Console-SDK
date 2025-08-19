describe('apiClient.user', () => {
  let apiClient
  let userAPI

  const appId = 'test-app-id'
  const workspaceId = 'test-workspace-id'
  const successResult = { id: 'test-id', name: 'test-user' }

  function mockLoginAPIRequest(response) {
    mockAPIRequest({
      body   : JSON.stringify(response),
      headers: { 'auth-key': 'test-auth-key' },
      status : 200,
    })
  }

  beforeEach(() => {
    apiClient = createAPIClient('http://test-host:3000')
    userAPI = apiClient.user
  })

  describe('getAccountInfo', () => {
    it('should fetch account info without auth key', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.getAccountInfo()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/myaccount',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should fetch account info with auth key', async () => {
      mockLoginAPIRequest(successResult)

      const authKey = 'test-auth-key'
      const result = await userAPI.getAccountInfo(authKey)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/myaccount',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : { 'auth-key': authKey },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await userAPI.getAccountInfo().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Unauthorized')
    })
  })

  describe('register', () => {
    it('should register new user', async () => {
      mockLoginAPIRequest(successResult)

      const userData = {
        email   : 'test@example.com',
        password: 'password123',
        name    : 'Test User'
      }

      const result = await userAPI.register(userData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/devreg',
        method         : 'POST',
        body           : JSON.stringify(userData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Email already exists', 409)

      const userData = { email: 'duplicate@example.com' }
      const error = await userAPI.register(userData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
      expect(error.message).toBe('Email already exists')
    })
  })

  describe('suicide', () => {
    it('should delete developer account', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.suicide()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/developer-suicide',
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Account deletion failed', 500)

      const error = await userAPI.suicide().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Account deletion failed')
    })
  })

  describe('login', () => {
    it('should login user with credentials', async () => {
      const loginResult = { name: 'Test User', email: 'test@example.com' }
      mockLoginAPIRequest(loginResult)

      const result = await userAPI.login('test@example.com', 'password123')

      expect(result).toEqual({ ...loginResult, authKey: 'test-auth-key', })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/login',
        method         : 'POST',
        body           : JSON.stringify({ login: 'test@example.com', password: 'password123' }),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle OTP required response', async () => {
      const otpResponse = { otpCreated: true, sessionId: 'session-123' }
      mockLoginAPIRequest(otpResponse)

      const result = await userAPI.login('test@example.com', 'password123')

      expect(result).toEqual(otpResponse)
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid credentials', 401)

      const error = await userAPI.login('test@example.com', 'wrongpassword').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Invalid credentials')
    })
  })

  describe('loginWithTOTP', () => {
    it('should login with TOTP code', async () => {
      const loginResult = { name: 'Test User', email: 'test@example.com' }
      mockLoginAPIRequest(loginResult)

      const authData = {
        sessionId: 'session-123',
        otpCode  : '123456'
      }

      const result = await userAPI.loginWithTOTP(authData)

      expect(result).toEqual({ ...loginResult, authKey: 'test-auth-key', })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/otp-login',
        method         : 'POST',
        body           : JSON.stringify(authData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid OTP code', 401)

      const authData = { sessionId: 'session-123', otpCode: '000000' }
      const error = await userAPI.loginWithTOTP(authData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Invalid OTP code')
    })
  })

  describe('cloudLogin', () => {
    it('should login to cloud with credentials', async () => {
      const loginResult = { name: 'Test User', email: 'test@example.com' }
      mockLoginAPIRequest(loginResult)

      const result = await userAPI.cloudLogin('test@example.com', 'password123')

      expect(result).toEqual({ ...loginResult, authKey: 'test-auth-key', })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/cloud/login',
        method         : 'POST',
        body           : JSON.stringify({ login: 'test@example.com', password: 'password123' }),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle OTP required response', async () => {
      const otpResponse = { otpCreated: true, sessionId: 'cloud-session-123' }
      mockLoginAPIRequest(otpResponse)

      const result = await userAPI.cloudLogin('test@example.com', 'password123')

      expect(result).toEqual(otpResponse)
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid credentials', 401)

      const error = await userAPI.cloudLogin('test@example.com', 'wrongpassword').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Invalid credentials')
    })
  })

  describe('cloudLoginWithTOTP', () => {
    it('should login to cloud with TOTP code', async () => {
      const loginResult = { name: 'Test User', email: 'test@example.com' }
      mockLoginAPIRequest(loginResult)

      const authData = {
        sessionId: 'cloud-session-123',
        otpCode  : '654321'
      }

      const result = await userAPI.cloudLoginWithTOTP(authData)

      expect(result).toEqual({ ...loginResult, authKey: 'test-auth-key', })

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/cloud/otp-login',
        method         : 'POST',
        body           : JSON.stringify(authData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid OTP code', 401)

      const authData = { sessionId: 'cloud-session-123', otpCode: '000000' }
      const error = await userAPI.cloudLoginWithTOTP(authData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Invalid OTP code')
    })
  })

  describe('loginSocial', () => {
    it('should get social login URL for provider', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.loginSocial('google')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/social/oauth/google/request_url',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should work with different providers', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.loginSocial('facebook')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/social/oauth/facebook/request_url',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Provider not found', 404)

      const error = await userAPI.loginSocial('invalid-provider').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Provider not found')
    })
  })

  describe('logout', () => {
    it('should logout user', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.logout()

      expect(result).toEqual(undefined)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/logout',
        method         : 'DELETE',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Logout failed', 500)

      const error = await userAPI.logout().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Logout failed')
    })
  })

  describe('restorePassword', () => {
    it('should send password restore email', async () => {
      mockLoginAPIRequest(successResult)

      const email = 'test@example.com'
      const result = await userAPI.restorePassword(email)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/restorepassword',
        method         : 'POST',
        body           : 'email=test%40example.com',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should handle emails with special characters', async () => {
      mockLoginAPIRequest(successResult)

      const email = 'test+user@example.com'
      const result = await userAPI.restorePassword(email)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/restorepassword',
        method         : 'POST',
        body           : 'email=test%2Buser%40example.com',
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Email not found', 404)

      const error = await userAPI.restorePassword('nonexistent@example.com').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Email not found')
    })
  })

  describe('resendConfirmEmail', () => {
    it('should resend confirmation email', async () => {
      mockLoginAPIRequest(successResult)

      const email = 'test@example.com'
      const result = await userAPI.resendConfirmEmail(email)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/resend?email=test%40example.com',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Email already confirmed', 400)

      const error = await userAPI.resendConfirmEmail('test@example.com').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Email already confirmed')
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      mockLoginAPIRequest(successResult)

      const profile = {
        name    : 'Updated Name',
        company : 'New Company',
        timezone: 'UTC'
      }

      const result = await userAPI.updateProfile(profile)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/home/myaccount/',
        method         : 'PUT',
        body           : JSON.stringify(profile),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Profile update failed', 422)

      const profile = { name: '' }
      const error = await userAPI.updateProfile(profile).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
      expect(error.message).toBe('Profile update failed')
    })
  })

  describe('registerAndJoinAppTeam', () => {
    it('should register and join app team', async () => {
      const registrationResult = { name: 'Test User', email: 'test@example.com' }
      mockLoginAPIRequest(registrationResult)

      const userData = {
        name    : 'Test User',
        email   : 'test@example.com',
        password: 'password123'
      }
      const confirmationCode = 'confirm-123'

      const result = await userAPI.registerAndJoinAppTeam(appId, confirmationCode, userData)

      expect(result).toEqual({ ...registrationResult, authKey: 'test-auth-key', })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/activatedev?confirmation-code=confirm-123`,
        method         : 'POST',
        body           : JSON.stringify(userData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid confirmation code', 400)

      const userData = { email: 'test@example.com' }
      const error = await userAPI.registerAndJoinAppTeam(appId, 'invalid-code', userData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Invalid confirmation code')
    })
  })

  describe('registerAndJoinWorkspace', () => {
    it('should register and join automation workspace', async () => {
      const registrationResult = { name: 'Test User', email: 'test@example.com' }
      mockLoginAPIRequest(registrationResult)

      const userData = {
        name    : 'Test User',
        email   : 'test@example.com',
        password: 'password123'
      }
      const confirmationCode = 'workspace-confirm-123'

      const result = await userAPI.registerAndJoinWorkspace(workspaceId, confirmationCode, userData)

      expect(result).toEqual({ ...registrationResult, authKey: 'test-auth-key', })

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/console/automation/management/${workspaceId}/activatedev?confirmation-code=workspace-confirm-123`,
        method         : 'POST',
        body           : JSON.stringify(userData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid workspace confirmation code', 400)

      const userData = { email: 'test@example.com' }
      const error = await userAPI.registerAndJoinWorkspace(workspaceId, 'invalid-code', userData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Invalid workspace confirmation code')
    })
  })

  describe('loginToDiscourse', () => {
    it('should login to Discourse with SSO data', async () => {
      mockLoginAPIRequest(successResult)

      const ssoData = {
        user: 'testuser',
        sig : 'signature123',
        sso : 'sso-token-data'
      }

      const result = await userAPI.loginToDiscourse(ssoData.user, ssoData.sig, ssoData.sso)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/discourse/sso',
        method         : 'POST',
        body           : JSON.stringify(ssoData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid SSO data', 401)

      const error = await userAPI.loginToDiscourse('user', 'invalid-sig', 'sso').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Invalid SSO data')
    })
  })

  describe('getPermissions', () => {
    it('should fetch user permissions for app', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.getPermissions(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : `http://test-host:3000/${appId}/console/my-permissions`,
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await userAPI.getPermissions(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
      expect(error.message).toBe('Access denied')
    })
  })

  describe('completeStripeConnection', () => {
    it('should complete Stripe connection', async () => {
      mockLoginAPIRequest(successResult)

      const connectionData = {
        code : 'stripe-auth-code',
        state: 'state-token'
      }

      const result = await userAPI.completeStripeConnection(connectionData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/community/marketplace/stripe-connect/auth',
        method         : 'POST',
        body           : JSON.stringify(connectionData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Stripe connection failed', 400)

      const connectionData = { code: 'invalid-code' }
      const error = await userAPI.completeStripeConnection(connectionData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Stripe connection failed')
    })
  })

  describe('getStripeConnectToken', () => {
    it('should get Stripe connect token', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.getStripeConnectToken()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/community/marketplace/stripe-connect/token',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Token generation failed', 500)

      const error = await userAPI.getStripeConnectToken().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Token generation failed')
    })
  })

  describe('getStripeConnectAccountId', () => {
    it('should get Stripe connect account ID', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.getStripeConnectAccountId()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/developer/stripe-connect',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Account not found', 404)

      const error = await userAPI.getStripeConnectAccountId().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Account not found')
    })
  })

  describe('setStripeConnectAccountId', () => {
    it('should set Stripe connect account ID', async () => {
      mockLoginAPIRequest(successResult)

      const accountData = {
        accountId: 'acct_1234567890'
      }

      const result = await userAPI.setStripeConnectAccountId(accountData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/developer/stripe-connect',
        method         : 'PUT',
        body           : JSON.stringify(accountData),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid account ID', 400)

      const accountData = { accountId: 'invalid' }
      const error = await userAPI.setStripeConnectAccountId(accountData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Invalid account ID')
    })
  })

  describe('get2FAState', () => {
    it('should get 2FA state', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.get2FAState()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/developer/login/2fa',
        method         : 'GET',
        body           : undefined,
        encoding       : 'utf8',
        headers        : {},
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('2FA state unavailable', 500)

      const error = await userAPI.get2FAState().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('2FA state unavailable')
    })
  })

  describe('update2FAState', () => {
    it('should enable 2FA', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.update2FAState(true)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/developer/login/2fa',
        method         : 'PUT',
        body           : JSON.stringify({ enabled: true }),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('should disable 2FA', async () => {
      mockLoginAPIRequest(successResult)

      const result = await userAPI.update2FAState(false)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/developer/login/2fa',
        method         : 'PUT',
        body           : JSON.stringify({ enabled: false }),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('2FA update failed', 500)

      const error = await userAPI.update2FAState(true).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
      expect(error.message).toBe('2FA update failed')
    })
  })

  describe('changePassword', () => {
    it('should change user password', async () => {
      mockLoginAPIRequest(successResult)

      const userId = 'user-123'
      const newPassword = 'newpassword123'

      const result = await userAPI.changePassword(userId, newPassword)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path           : 'http://test-host:3000/console/passwordchange',
        method         : 'POST',
        body           : JSON.stringify({ id: userId, password: newPassword }),
        encoding       : 'utf8',
        headers        : { 'Content-Type': 'application/json' },
        timeout        : 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Password change failed', 400)

      const error = await userAPI.changePassword('user-123', 'weak').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Password change failed')
    })
  })
})
