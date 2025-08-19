describe('apiClient.integrations', () => {
  let apiClient
  let integrationsAPI

  const appId = 'test-app-id'
  const successResult = { integrations: [] }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    integrationsAPI = apiClient.integrations
  })

  describe('getIntegrations', () => {
    it('should make GET request to get integrations', async () => {
      const integrationsResult = {
        integrations: [
          {
            name: 'stripe',
            type: 'payment',
            status: 'active',
            config: { apiKey: '****', webhookUrl: 'https://app.com/webhook' }
          },
          {
            name: 'sendgrid',
            type: 'email',
            status: 'inactive',
            config: { apiKey: '****' }
          }
        ]
      }
      mockSuccessAPIRequest(integrationsResult)

      const result = await integrationsAPI.getIntegrations(appId)

      expect(result).toEqual(integrationsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty integrations list', async () => {
      mockSuccessAPIRequest({ integrations: [] })

      const result = await integrationsAPI.getIntegrations(appId)

      expect(result).toEqual({ integrations: [] })
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive integrations data', async () => {
      const integrationsResult = {
        integrations: [
          {
            name: 'google-analytics',
            type: 'analytics',
            status: 'active',
            config: {
              trackingId: 'GA-123456789',
              enableEcommerce: true,
              customDimensions: ['user_type', 'plan_level']
            },
            lastSync: '2024-01-15T10:30:00Z',
            metrics: {
              eventsTracked: 15420,
              conversions: 324
            }
          },
          {
            name: 'slack',
            type: 'communication',
            status: 'active',
            config: {
              webhookUrl: 'https://hooks.slack.com/...',
              channel: '#notifications',
              mentionUsers: ['@admin', '@dev-team']
            },
            features: ['alerts', 'reports', 'user-activity'],
            lastUsed: '2024-01-14T16:45:00Z'
          }
        ],
        categories: ['payment', 'email', 'analytics', 'communication', 'storage'],
        totalActive: 2,
        totalAvailable: 25
      }
      mockSuccessAPIRequest(integrationsResult)

      const result = await integrationsAPI.getIntegrations(appId)

      expect(result).toEqual(integrationsResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await integrationsAPI.getIntegrations(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await integrationsAPI.getIntegrations('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('saveIntegration', () => {
    it('should make POST request to save integration', async () => {
      const saveResult = {
        integration: {
          name: 'stripe',
          type: 'payment',
          status: 'active',
          id: 'integration-123'
        }
      }
      mockSuccessAPIRequest(saveResult)

      const configData = {
        name: 'stripe',
        type: 'payment',
        config: {
          apiKey: 'sk_test_123456789',
          webhookSecret: 'whsec_123456789',
          currency: 'USD',
          captureMethod: 'automatic'
        },
        settings: {
          testMode: true,
          enableWebhooks: true,
          subscriptionsEnabled: false
        }
      }

      const result = await integrationsAPI.saveIntegration(appId, configData)

      expect(result).toEqual(saveResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations`,
        body: JSON.stringify(configData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex integration configuration', async () => {
      const saveResult = { success: true, integrationId: 'aws-s3-456' }
      mockSuccessAPIRequest(saveResult)

      const configData = {
        name: 'aws-s3',
        type: 'storage',
        config: {
          accessKeyId: 'AKIAI44QH8DHBEXAMPLE',
          secretAccessKey: '****',
          region: 'us-west-2',
          bucket: 'my-app-storage',
          encryption: {
            enabled: true,
            method: 'AES256'
          }
        },
        permissions: {
          read: true,
          write: true,
          delete: false
        },
        lifecycle: {
          enabled: true,
          rules: [
            {
              name: 'DeleteOldUploads',
              expiration: '30 days',
              prefix: 'uploads/'
            }
          ]
        },
        monitoring: {
          cloudWatch: true,
          alertsEnabled: true,
          thresholds: {
            storageUsage: '80%',
            requestCount: 10000
          }
        }
      }

      const result = await integrationsAPI.saveIntegration(appId, configData)

      expect(result).toEqual(saveResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations`,
        body: JSON.stringify(configData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal integration configuration', async () => {
      const saveResult = { success: true }
      mockSuccessAPIRequest(saveResult)

      const configData = {
        name: 'webhook',
        type: 'custom',
        config: { url: 'https://example.com/webhook' }
      }

      const result = await integrationsAPI.saveIntegration(appId, configData)

      expect(result).toEqual(saveResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations`,
        body: JSON.stringify(configData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid integration configuration', 400)

      const configData = { name: 'invalid' } // Missing required fields
      const error = await integrationsAPI.saveIntegration(appId, configData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid integration configuration' },
        message: 'Invalid integration configuration',
        status: 400
      })
    })

    it('fails when server responds with integration already exists error', async () => {
      mockFailedAPIRequest('Integration already exists', 409)

      const configData = { name: 'existing-integration', type: 'payment' }
      const error = await integrationsAPI.saveIntegration(appId, configData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Integration already exists' },
        message: 'Integration already exists',
        status: 409
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('Integration quota exceeded', 429)

      const configData = { name: 'new-integration', type: 'analytics' }
      const error = await integrationsAPI.saveIntegration(appId, configData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Integration quota exceeded' },
        message: 'Integration quota exceeded',
        status: 429
      })
    })
  })

  describe('updateIntegration', () => {
    it('should make PUT request to update integration', async () => {
      const updateResult = {
        integration: {
          name: 'stripe',
          status: 'active',
          lastUpdated: '2024-01-15T12:00:00Z'
        }
      }
      mockSuccessAPIRequest(updateResult)

      const integrationName = 'stripe'
      const configData = {
        config: {
          apiKey: 'sk_live_updated_key',
          webhookSecret: 'whsec_updated_secret',
          currency: 'EUR'
        },
        settings: {
          testMode: false,
          enableWebhooks: true,
          subscriptionsEnabled: true
        }
      }

      const result = await integrationsAPI.updateIntegration(appId, integrationName, configData)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations/${integrationName}`,
        body: JSON.stringify(configData),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial configuration updates', async () => {
      const updateResult = { success: true, updated: ['config.currency'] }
      mockSuccessAPIRequest(updateResult)

      const integrationName = 'paypal'
      const configData = {
        config: {
          currency: 'GBP'
        }
      }

      const result = await integrationsAPI.updateIntegration(appId, integrationName, configData)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations/${integrationName}`,
        body: JSON.stringify(configData),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle integration name with special characters', async () => {
      const updateResult = { success: true }
      mockSuccessAPIRequest(updateResult)

      const integrationName = 'google-analytics-4'
      const configData = {
        settings: { enableEnhancedEcommerce: true }
      }

      const result = await integrationsAPI.updateIntegration(appId, integrationName, configData)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations/${integrationName}`,
        body: JSON.stringify(configData),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with integration not found error', async () => {
      mockFailedAPIRequest('Integration not found', 404)

      const integrationName = 'nonexistent-integration'
      const configData = { config: { apiKey: 'test' } }
      const error = await integrationsAPI.updateIntegration(appId, integrationName, configData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Integration not found' },
        message: 'Integration not found',
        status: 404
      })
    })

    it('fails when server responds with invalid configuration error', async () => {
      mockFailedAPIRequest('Invalid configuration update', 422)

      const integrationName = 'stripe'
      const configData = { config: { apiKey: 'invalid_key_format' } }
      const error = await integrationsAPI.updateIntegration(appId, integrationName, configData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid configuration update' },
        message: 'Invalid configuration update',
        status: 422
      })
    })
  })

  describe('deleteIntegration', () => {
    it('should make DELETE request to delete integration', async () => {
      const deleteResult = {
        success: true,
        message: 'Integration deleted successfully',
        deletedIntegration: 'old-webhook'
      }
      mockSuccessAPIRequest(deleteResult)

      const integrationName = 'old-webhook'
      const result = await integrationsAPI.deleteIntegration(appId, integrationName)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations/${integrationName}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle integration names with special characters for deletion', async () => {
      const deleteResult = { success: true }
      mockSuccessAPIRequest(deleteResult)

      const integrationName = 'google-analytics-4'
      const result = await integrationsAPI.deleteIntegration(appId, integrationName)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/integrations/${integrationName}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle deletion with cleanup information', async () => {
      const deleteResult = {
        success: true,
        cleanup: {
          webhooksRemoved: 3,
          configurationsCleaned: ['api_keys', 'cached_tokens'],
          backupCreated: true,
          backupLocation: 'backups/integrations/stripe_backup_20240115.json'
        },
        warnings: [
          'Active subscriptions will be cancelled',
          'Webhook endpoints will be deregistered'
        ]
      }
      mockSuccessAPIRequest(deleteResult)

      const integrationName = 'stripe'
      const result = await integrationsAPI.deleteIntegration(appId, integrationName)

      expect(result).toEqual(deleteResult)
    })

    it('fails when server responds with integration not found error', async () => {
      mockFailedAPIRequest('Integration not found', 404)

      const integrationName = 'nonexistent-integration'
      const error = await integrationsAPI.deleteIntegration(appId, integrationName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Integration not found' },
        message: 'Integration not found',
        status: 404
      })
    })

    it('fails when server responds with cannot delete active integration error', async () => {
      mockFailedAPIRequest('Cannot delete active integration', 409)

      const integrationName = 'active-payment-gateway'
      const error = await integrationsAPI.deleteIntegration(appId, integrationName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete active integration' },
        message: 'Cannot delete active integration',
        status: 409
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to delete integration', 403)

      const integrationName = 'system-integration'
      const error = await integrationsAPI.deleteIntegration(appId, integrationName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to delete integration' },
        message: 'Insufficient permissions to delete integration',
        status: 403
      })
    })
  })
})
