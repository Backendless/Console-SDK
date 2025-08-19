import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.consolePreview', () => {
  let apiClient
  let consolePreviewAPI

  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    consolePreviewAPI = apiClient.consolePreview
  })

  describe('getPreviewInitToken', () => {
    it('should make GET request to get preview init token', async () => {
      const tokenResult = {
        token: 'preview-token-abc123',
        expiresAt: '2024-01-15T13:00:00Z',
        applicationId: 'app-123',
        userId: 'user-456',
        permissions: ['console.preview'],
        endpoints: {
          api: 'https://api.backendless.com',
          messaging: 'https://rt.backendless.com',
          files: 'https://files.backendless.com'
        }
      }
      mockSuccessAPIRequest(tokenResult)

      const result = await consolePreviewAPI.getPreviewInitToken('app-123')

      expect(result).toEqual(tokenResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/app-123/console/preview/preview-init-token',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive preview token with detailed configuration', async () => {
      const tokenResult = {
        token: 'preview-token-xyz789',
        expiresAt: '2024-01-15T14:00:00Z',
        applicationId: 'app-456',
        userId: 'user-789',
        sessionId: 'session-abc123',
        permissions: [
          'console.preview',
          'console.data.read',
          'console.ui.read',
          'console.logic.read'
        ],
        endpoints: {
          api: 'https://api.backendless.com',
          messaging: 'https://rt.backendless.com',
          files: 'https://files.backendless.com',
          console: 'https://console.backendless.com'
        },
        applicationInfo: {
          name: 'My Test App',
          version: '1.0.0',
          plan: 'Cloud9',
          region: 'us-east-1',
          environment: 'development'
        },
        userInfo: {
          email: 'developer@example.com',
          name: 'John Developer',
          role: 'admin',
          lastLogin: '2024-01-15T10:30:00Z'
        },
        previewSettings: {
          theme: 'light',
          layout: 'default',
          features: {
            dataExplorer: true,
            codeEditor: true,
            realTimeLog: true,
            debugMode: false
          },
          restrictions: {
            maxPreviewTime: 3600,
            allowedModules: ['data', 'ui', 'logic'],
            readOnly: true
          }
        },
        metadata: {
          generatedAt: '2024-01-15T12:00:00Z',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          version: '2024.1.5'
        }
      }
      mockSuccessAPIRequest(tokenResult)

      const result = await consolePreviewAPI.getPreviewInitToken('app-456')

      expect(result).toEqual(tokenResult)
    })

    it('should handle simple preview token', async () => {
      const tokenResult = {
        token: 'simple-token-123',
        expiresAt: '2024-01-15T12:30:00Z',
        applicationId: 'simple-app'
      }
      mockSuccessAPIRequest(tokenResult)

      const result = await consolePreviewAPI.getPreviewInitToken('simple-app')

      expect(result).toEqual(tokenResult)
    })

    it('should handle preview token with expiration warning', async () => {
      const tokenResult = {
        token: 'expiring-token-456',
        expiresAt: '2024-01-15T12:05:00Z',
        applicationId: 'app-789',
        warnings: [
          {
            code: 'TOKEN_EXPIRING_SOON',
            message: 'Token will expire in 5 minutes',
            severity: 'warning'
          }
        ]
      }
      mockSuccessAPIRequest(tokenResult)

      const result = await consolePreviewAPI.getPreviewInitToken('app-789')

      expect(result).toEqual(tokenResult)
    })

    it('should handle preview token with limited permissions', async () => {
      const tokenResult = {
        token: 'limited-token-789',
        expiresAt: '2024-01-15T13:30:00Z',
        applicationId: 'restricted-app',
        permissions: ['console.preview.read'],
        restrictions: {
          readOnly: true,
          allowedSections: ['data', 'files'],
          maxSessionTime: 1800
        },
        notice: 'Limited preview access - upgrade for full features'
      }
      mockSuccessAPIRequest(tokenResult)

      const result = await consolePreviewAPI.getPreviewInitToken('restricted-app')

      expect(result).toEqual(tokenResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized to access preview token', 401)

      const error = await consolePreviewAPI.getPreviewInitToken('app-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized to access preview token' },
        message: 'Unauthorized to access preview token',
        status: 401
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Preview feature not available for this plan', 403)

      const error = await consolePreviewAPI.getPreviewInitToken('app-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Preview feature not available for this plan' },
        message: 'Preview feature not available for this plan',
        status: 403
      })
    })

    it('fails when server responds with application not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await consolePreviewAPI.getPreviewInitToken('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })

    it('fails when server responds with preview quota exceeded error', async () => {
      mockFailedAPIRequest('Preview quota exceeded for today', 429)

      const error = await consolePreviewAPI.getPreviewInitToken('app-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Preview quota exceeded for today' },
        message: 'Preview quota exceeded for today',
        status: 429
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Console preview service temporarily unavailable', 503)

      const error = await consolePreviewAPI.getPreviewInitToken('app-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Console preview service temporarily unavailable' },
        message: 'Console preview service temporarily unavailable',
        status: 503
      })
    })

    it('fails when server responds with internal server error', async () => {
      mockFailedAPIRequest('Failed to generate preview token', 500)

      const error = await consolePreviewAPI.getPreviewInitToken('app-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Failed to generate preview token' },
        message: 'Failed to generate preview token',
        status: 500
      })
    })
  })
})