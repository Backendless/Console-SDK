describe('apiClient.messaging', () => {
  let apiClient
  let messagingAPI

  const appId = 'test-app-id'
  const channelId = 'test-channel-id'
  const channelName = 'test-channel'
  const templateName = 'test-template'
  const platform = 'ios'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    messagingAPI = apiClient.messaging
  })

  describe('loadChannels', () => {
    it('should make GET request to load channels', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.loadChannels(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels`,
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

      const error = await messagingAPI.loadChannels(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createChannel', () => {
    it('should make POST request to create channel with enriched settings', async () => {
      const expectedChannel = {
        name: channelName,
        settings: {
          polling: true,
          rtmp: 0,
          websocket: 8888
        }
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.createChannel(appId, channelName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels`,
        method: 'POST',
        body: JSON.stringify(expectedChannel),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Channel already exists', 409)

      const error = await messagingAPI.createChannel(appId, channelName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Channel already exists' },
        message: 'Channel already exists',
        status: 409
      })
    })
  })

  describe('renameChannel', () => {
    it('should make PUT request to rename channel with enriched settings', async () => {
      const oldChannel = { channelid: channelId, name: 'old-name' }
      const newName = 'new-name'
      const expectedChannel = {
        ...oldChannel,
        name: newName,
        settings: {
          polling: true,
          rtmp: 0,
          websocket: 8888
        }
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.renameChannel(appId, oldChannel, newName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}`,
        method: 'PUT',
        body: JSON.stringify(expectedChannel),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty oldChannel object', async () => {
      const oldChannel = {}
      const newName = 'new-name'

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.renameChannel(appId, oldChannel, newName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels/undefined`,
        method: 'PUT',
        body: expect.stringMatching(/"name":"new-name"/),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Channel not found', 404)

      const oldChannel = { channelid: channelId }
      const error = await messagingAPI.renameChannel(appId, oldChannel, 'new-name').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Channel not found' },
        message: 'Channel not found',
        status: 404
      })
    })
  })

  describe('deleteChannel', () => {
    it('should make DELETE request to remove channel with cache tags', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deleteChannel(appId, channelId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Channel not found', 404)

      const error = await messagingAPI.deleteChannel(appId, channelId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Channel not found' },
        message: 'Channel not found',
        status: 404
      })
    })
  })

  describe('loadDevices', () => {
    it('should make GET request to load devices with totalRows integration', async () => {
      const devicesData = [{ deviceId: '123' }, { deviceId: '456' }]
      const totalRowsCount = 2
      const params = { limit: 10, offset: 0 }

      // Mock the data request
      mockSuccessAPIRequest(devicesData)
      // Mock the count request
      mockSuccessAPIRequest(totalRowsCount)

      const result = await messagingAPI.loadDevices(appId, channelId, params)

      expect(result).toEqual({ data: devicesData, totalRows: totalRowsCount })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/devices?limit=10&offset=0`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/devices/count?limit=10`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle request without params', async () => {
      const devicesData = []
      const totalRowsCount = 0

      mockSuccessAPIRequest(devicesData)
      mockSuccessAPIRequest(totalRowsCount)

      const result = await messagingAPI.loadDevices(appId, channelId)

      expect(result).toEqual({ data: devicesData, totalRows: totalRowsCount })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/devices`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/devices/count`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await messagingAPI.loadDevices(appId, channelId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })
  })

  describe('deleteDevices', () => {
    it('should make DELETE request to remove devices with cache tags', async () => {
      const deviceIds = ['device1', 'device2', 'device3']

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deleteDevices(appId, channelId, deviceIds)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/devices`,
        method: 'DELETE',
        body: JSON.stringify(deviceIds),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty device IDs array', async () => {
      const deviceIds = []

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deleteDevices(appId, channelId, deviceIds)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/devices`,
        method: 'DELETE',
        body: JSON.stringify(deviceIds),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Devices not found', 404)

      const deviceIds = ['device1']
      const error = await messagingAPI.deleteDevices(appId, channelId, deviceIds).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Devices not found' },
        message: 'Devices not found',
        status: 404
      })
    })
  })

  describe('loadMessages', () => {
    it('should make GET request to load messages with totalRows integration and disabled caching', async () => {
      const messagesData = [{ messageId: '123' }, { messageId: '456' }]
      const totalRowsCount = 2
      const params = { limit: 20, offset: 10 }

      // Mock the data request
      mockSuccessAPIRequest(messagesData)
      // Mock the count request
      mockSuccessAPIRequest(totalRowsCount)

      const result = await messagingAPI.loadMessages(appId, channelId, params)

      expect(result).toEqual({ data: messagesData, totalRows: totalRowsCount })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/messages?limit=20&offset=10`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/messages/count?limit=20`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle request without params', async () => {
      const messagesData = []
      const totalRowsCount = 0

      mockSuccessAPIRequest(messagesData)
      mockSuccessAPIRequest(totalRowsCount)

      const result = await messagingAPI.loadMessages(appId, channelId)

      expect(result).toEqual({ data: messagesData, totalRows: totalRowsCount })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/messages`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/messaging/channels/${channelId}/messages/count`,
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Channel not found', 404)

      const error = await messagingAPI.loadMessages(appId, channelId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Channel not found' },
        message: 'Channel not found',
        status: 404
      })
    })
  })

  describe('publishMessage', () => {
    it('should make POST request to publish message', async () => {
      const messageParams = {
        message: 'Hello World',
        publisherId: 'user123',
        headers: { customHeader: 'value' }
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.publishMessage(appId, channelName, messageParams)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/${channelName}`,
        method: 'POST',
        body: JSON.stringify(messageParams),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty message params', async () => {
      const messageParams = {}

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.publishMessage(appId, channelName, messageParams)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/${channelName}`,
        method: 'POST',
        body: JSON.stringify(messageParams),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Channel not found', 404)

      const messageParams = { message: 'test' }
      const error = await messagingAPI.publishMessage(appId, channelName, messageParams).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Channel not found' },
        message: 'Channel not found',
        status: 404
      })
    })
  })

  describe('getMessagingChannels', () => {
    it('should make GET request to get messaging channels', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getMessagingChannels(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channels`,
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

      const error = await messagingAPI.getMessagingChannels(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('getPushTemplates', () => {
    it('should make GET request to get push templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push/templates`,
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

      const error = await messagingAPI.getPushTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('createPushTemplate', () => {
    it('should make POST request to create push template', async () => {
      const pushTemplate = {
        name: templateName,
        content: 'Hello {{name}}!',
        ios: { alert: 'New message' },
        android: { title: 'Notification' }
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.createPushTemplate(appId, pushTemplate)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push/templates`,
        method: 'POST',
        body: JSON.stringify(pushTemplate),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template already exists', 409)

      const pushTemplate = { name: templateName }
      const error = await messagingAPI.createPushTemplate(appId, pushTemplate).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template already exists' },
        message: 'Template already exists',
        status: 409
      })
    })
  })

  describe('updatePushTemplate', () => {
    it('should make PUT request to update push template', async () => {
      const pushTemplate = {
        content: 'Updated: Hello {{name}}!',
        ios: { alert: 'Updated message' }
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.updatePushTemplate(appId, templateName, pushTemplate)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push/templates/${templateName}`,
        method: 'PUT',
        body: JSON.stringify(pushTemplate),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const pushTemplate = { content: 'test' }
      const error = await messagingAPI.updatePushTemplate(appId, templateName, pushTemplate).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })
  })

  describe('getPushTemplate', () => {
    it('should make GET request to get specific push template', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushTemplate(appId, templateName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push/templates/${templateName}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const error = await messagingAPI.getPushTemplate(appId, templateName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })
  })

  describe('deletePushTemplates', () => {
    it('should make DELETE request to remove push templates with query parameter', async () => {
      const templateNames = ['template1', 'template2', 'template3']

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deletePushTemplates(appId, templateNames)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push/templates?names=template1%2Ctemplate2%2Ctemplate3`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle single template name', async () => {
      const templateNames = ['single-template']

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deletePushTemplates(appId, templateNames)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push/templates?names=single-template`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Templates not found', 404)

      const templateNames = ['nonexistent']
      const error = await messagingAPI.deletePushTemplates(appId, templateNames).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Templates not found' },
        message: 'Templates not found',
        status: 404
      })
    })
  })

  describe('getPushRecipientsCount', () => {
    it('should make GET request to get push recipients count with where clause', async () => {
      const whereClause = "age > 18 AND city = 'New York'"

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushRecipientsCount(appId, whereClause)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/pushsize?where=${encodeURIComponent(whereClause)}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty where clause', async () => {
      const whereClause = ''

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushRecipientsCount(appId, whereClause)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/pushsize?where=`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid where clause', 400)

      const whereClause = 'invalid syntax'
      const error = await messagingAPI.getPushRecipientsCount(appId, whereClause).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid where clause' },
        message: 'Invalid where clause',
        status: 400
      })
    })
  })

  describe('sendPush', () => {
    it('should make POST request to send push notification', async () => {
      const pushData = {
        where: 'age > 18',
        message: 'Hello World!',
        ios: { alert: 'New message' },
        android: { title: 'Notification' }
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.sendPush(appId, pushData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/push`,
        method: 'POST',
        body: JSON.stringify(pushData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid push data', 400)

      const pushData = { message: 'test' }
      const error = await messagingAPI.sendPush(appId, pushData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid push data' },
        message: 'Invalid push data',
        status: 400
      })
    })
  })

  describe('getPushButtonTemplates', () => {
    it('should make GET request to get push button templates with platform query', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushButtonTemplates(appId, platform)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/button-templates?platform=${platform}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined platform', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushButtonTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/button-templates`,
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

      const error = await messagingAPI.getPushButtonTemplates(appId, platform).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('createPushButtonTemplate', () => {
    it('should make POST request to create push button template', async () => {
      const templateData = {
        name: 'action-buttons',
        buttons: [
          { id: 'yes', title: 'Yes' },
          { id: 'no', title: 'No' }
        ]
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.createPushButtonTemplate(appId, templateData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/button-templates`,
        method: 'POST',
        body: JSON.stringify(templateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template already exists', 409)

      const templateData = { name: 'test' }
      const error = await messagingAPI.createPushButtonTemplate(appId, templateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template already exists' },
        message: 'Template already exists',
        status: 409
      })
    })
  })

  describe('updatePushButtonTemplate', () => {
    it('should make PUT request to update push button template', async () => {
      const templateData = {
        buttons: [
          { id: 'accept', title: 'Accept' },
          { id: 'decline', title: 'Decline' }
        ]
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.updatePushButtonTemplate(appId, templateName, templateData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/button-templates/${templateName}`,
        method: 'PUT',
        body: JSON.stringify(templateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const templateData = { buttons: [] }
      const error = await messagingAPI.updatePushButtonTemplate(appId, templateName, templateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })
  })

  describe('deletePushButtonTemplate', () => {
    it('should make DELETE request to remove push button template with platform query', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deletePushButtonTemplate(appId, templateName, platform)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/button-templates/${templateName}?platform=${platform}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined platform', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deletePushButtonTemplate(appId, templateName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/button-templates/${templateName}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const error = await messagingAPI.deletePushButtonTemplate(appId, templateName, platform).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })
  })

  describe('getPushChannelTemplates', () => {
    it('should make GET request to get push channel templates with platform query', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushChannelTemplates(appId, platform)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates?platform=${platform}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined platform', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.getPushChannelTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates`,
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

      const error = await messagingAPI.getPushChannelTemplates(appId, platform).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('createPushChannelTemplate', () => {
    it('should make POST request to create push channel template with platform query', async () => {
      const templateData = {
        name: 'news-channel',
        description: 'Channel for news notifications',
        importance: 'high'
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.createPushChannelTemplate(appId, templateData, platform)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates?platform=${platform}`,
        method: 'POST',
        body: JSON.stringify(templateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined platform', async () => {
      const templateData = { name: 'test-channel' }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.createPushChannelTemplate(appId, templateData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates`,
        method: 'POST',
        body: JSON.stringify(templateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template already exists', 409)

      const templateData = { name: 'test' }
      const error = await messagingAPI.createPushChannelTemplate(appId, templateData, platform).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template already exists' },
        message: 'Template already exists',
        status: 409
      })
    })
  })

  describe('updatePushChannelTemplate', () => {
    it('should make PUT request to update push channel template with platform query', async () => {
      const templateData = {
        description: 'Updated channel description',
        importance: 'medium'
      }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.updatePushChannelTemplate(appId, templateName, templateData, platform)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates/` +
          `${templateName}?platform=${platform}`,
        method: 'PUT',
        body: JSON.stringify(templateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined platform', async () => {
      const templateData = { description: 'test' }

      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.updatePushChannelTemplate(appId, templateName, templateData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates/${templateName}`,
        method: 'PUT',
        body: JSON.stringify(templateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const templateData = { description: 'test' }
      const error = await messagingAPI.updatePushChannelTemplate(appId, templateName, templateData, platform)
        .catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })
  })

  describe('deletePushChannelTemplate', () => {
    it('should make DELETE request to remove push channel template with platform query', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deletePushChannelTemplate(appId, templateName, platform)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates/${templateName}?platform=${platform}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle undefined platform', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await messagingAPI.deletePushChannelTemplate(appId, templateName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/messaging/channel-templates/${templateName}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const error = await messagingAPI.deletePushChannelTemplate(appId, templateName, platform).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })
  })
})
