import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.devTeam', () => {
  let apiClient
  let devTeamAPI

  const appId = 'test-app-id'
  const devId = 'dev-123'
  const email = 'developer@example.com'
  const developerId = 'developer-456'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    devTeamAPI = apiClient.devTeam
  })

  describe('getDevelopers', () => {
    it('should make GET request to get developers', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.getDevelopers(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam`,
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
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await devTeamAPI.getDevelopers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam`,
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

  describe('updateDevPermissions', () => {
    it('should make PUT request with permissions data', async () => {
      mockSuccessAPIRequest(successResult)

      const permissions = {
        read: true,
        write: false,
        delete: false,
        admin: false
      }

      const result = await devTeamAPI.updateDevPermissions(appId, devId, permissions)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}/permissions`,
          body: JSON.stringify(permissions),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty permissions object', async () => {
      mockSuccessAPIRequest(successResult)

      const permissions = {}
      const result = await devTeamAPI.updateDevPermissions(appId, devId, permissions)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}/permissions`,
          body: JSON.stringify(permissions),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Developer not found', 404)

      const permissions = { read: true }
      const error = await devTeamAPI.updateDevPermissions(appId, devId, permissions).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Developer not found' },
        message: 'Developer not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}/permissions`,
          body: JSON.stringify(permissions),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateDevPermissionGroups', () => {
    it('should make PUT request with permission groups data', async () => {
      mockSuccessAPIRequest(successResult)

      const groups = {
        groups: ['admin', 'developer', 'viewer'],
        roles: ['read-only', 'contributor']
      }

      const result = await devTeamAPI.updateDevPermissionGroups(appId, devId, groups)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}/permission/groups`,
          body: JSON.stringify(groups),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty groups object', async () => {
      mockSuccessAPIRequest(successResult)

      const groups = {}
      const result = await devTeamAPI.updateDevPermissionGroups(appId, devId, groups)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}/permission/groups`,
          body: JSON.stringify(groups),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid groups', 400)

      const groups = { groups: ['invalid'] }
      const error = await devTeamAPI.updateDevPermissionGroups(appId, devId, groups).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid groups' },
        message: 'Invalid groups',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}/permission/groups`,
          body: JSON.stringify(groups),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('inviteDeveloper', () => {
    it('should make POST request with email data', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.inviteDeveloper(appId, email)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam`,
          body: email,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle complex email object', async () => {
      mockSuccessAPIRequest(successResult)

      const emailData = {
        email: 'test@example.com',
        message: 'Welcome to the team',
        permissions: ['read', 'write']
      }

      const result = await devTeamAPI.inviteDeveloper(appId, emailData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam`,
          body: JSON.stringify(emailData),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Email already invited', 409)

      const error = await devTeamAPI.inviteDeveloper(appId, email).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Email already invited' },
        message: 'Email already invited',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam`,
          body: email,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('removeDeveloper', () => {
    it('should make DELETE request to remove developer', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.removeDeveloper(appId, devId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Developer not found', 404)

      const error = await devTeamAPI.removeDeveloper(appId, devId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Developer not found' },
        message: 'Developer not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/${devId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateNotificationSettings', () => {
    it('should make PUT request with notification settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = {
        emailNotifications: true,
        pushNotifications: false,
        frequency: 'daily',
        types: ['error', 'warning']
      }

      const result = await devTeamAPI.updateNotificationSettings(appId, settings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/notifications/limits`,
          body: JSON.stringify(settings),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty settings object', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = {}
      const result = await devTeamAPI.updateNotificationSettings(appId, settings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/notifications/limits`,
          body: JSON.stringify(settings),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid settings', 400)

      const settings = { frequency: 'invalid' }
      const error = await devTeamAPI.updateNotificationSettings(appId, settings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid settings' },
        message: 'Invalid settings',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/notifications/limits`,
          body: JSON.stringify(settings),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('transferOwnership', () => {
    it('should make PUT request with developer ID', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.transferOwnership(appId, developerId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/owner`,
          body: JSON.stringify({ developerId }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined developerId', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.transferOwnership(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/owner`,
          body: JSON.stringify({ developerId: undefined }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Transfer not allowed', 403)

      const error = await devTeamAPI.transferOwnership(appId, developerId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Transfer not allowed' },
        message: 'Transfer not allowed',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/owner`,
          body: JSON.stringify({ developerId }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('loadOwnershipTransferProposals', () => {
    it('should make GET request to load proposals', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.loadOwnershipTransferProposals()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/devteam/application-owner-change/pending-received-proposal',
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
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await devTeamAPI.loadOwnershipTransferProposals().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/devteam/application-owner-change/pending-received-proposal',
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

  describe('confirmOwnershipChange', () => {
    it('should make PUT request with confirmation data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        accept: true,
        transferId: 'transfer-123',
        signature: 'signed-data'
      }

      const result = await devTeamAPI.confirmOwnershipChange(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/owner-confirm`,
          body: JSON.stringify(data),
          method: 'PUT',
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
      const result = await devTeamAPI.confirmOwnershipChange(appId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/owner-confirm`,
          body: JSON.stringify(data),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid confirmation', 400)

      const data = { accept: false }
      const error = await devTeamAPI.confirmOwnershipChange(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid confirmation' },
        message: 'Invalid confirmation',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/owner-confirm`,
          body: JSON.stringify(data),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('loadSentOwnershipTransfer', () => {
    it('should make GET request to load sent transfer', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.loadSentOwnershipTransfer(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/application-owner-change/pending-sent-proposal`,
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
      mockFailedAPIRequest('No pending transfer', 404)

      const error = await devTeamAPI.loadSentOwnershipTransfer(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'No pending transfer' },
        message: 'No pending transfer',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/application-owner-change/pending-sent-proposal`,
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

  describe('cancelSentOwnershipTransfer', () => {
    it('should make DELETE request to cancel sent transfer', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.cancelSentOwnershipTransfer(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/application-owner-change/pending-sent-proposal`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Cannot cancel transfer', 409)

      const error = await devTeamAPI.cancelSentOwnershipTransfer(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot cancel transfer' },
        message: 'Cannot cancel transfer',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/devteam/application-owner-change/pending-sent-proposal`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('generateDeveloperSignature', () => {
    it('should make GET request to generate signature', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await devTeamAPI.generateDeveloperSignature()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/developer/signature',
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
      mockFailedAPIRequest('Signature generation failed', 500)

      const error = await devTeamAPI.generateDeveloperSignature().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Signature generation failed' },
        message: 'Signature generation failed',
        status: 500
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/developer/signature',
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
})