describe('apiClient.dataHives', () => {
  let apiClient
  let dataHivesAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    dataHivesAPI = apiClient.dataHives
  })

  describe('getHiveNames', () => {
    it('should make GET request to get hive names', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataHivesAPI.getHiveNames(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await dataHivesAPI.getHiveNames(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await dataHivesAPI.getHiveNames(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })
    })
  })

  describe('createHive', () => {
    it('should make POST request to create hive', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-sessions'
      const result = await dataHivesAPI.createHive(appId, hiveName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}`,
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle hive names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'cache-store-2024'
      const result = await dataHivesAPI.createHive(appId, hiveName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}`,
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Hive already exists', 409)

      const hiveName = 'existing-hive'
      const error = await dataHivesAPI.createHive(appId, hiveName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Hive already exists' },
        message: 'Hive already exists',
        status: 409
      })
    })

    it('fails when server responds with bad request error', async () => {
      mockFailedAPIRequest('Invalid hive name', 400)

      const hiveName = ''
      const error = await dataHivesAPI.createHive(appId, hiveName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid hive name' },
        message: 'Invalid hive name',
        status: 400
      })
    })
  })

  describe('renameHive', () => {
    it('should make PUT request to rename hive', async () => {
      mockSuccessAPIRequest(successResult)

      const oldName = 'old-hive-name'
      const newName = 'new-hive-name'
      const result = await dataHivesAPI.renameHive(appId, oldName, newName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${oldName}?newName=new-hive-name`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('should handle complex hive names', async () => {
      mockSuccessAPIRequest(successResult)

      const oldName = 'session_cache_v1'
      const newName = 'session_cache_v2'
      const result = await dataHivesAPI.renameHive(appId, oldName, newName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${oldName}?newName=session_cache_v2`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Hive not found', 404)

      const oldName = 'nonexistent-hive'
      const newName = 'new-name'
      const error = await dataHivesAPI.renameHive(appId, oldName, newName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Hive not found' },
        message: 'Hive not found',
        status: 404
      })
    })

    it('fails when server responds with name conflict error', async () => {
      mockFailedAPIRequest('New hive name already exists', 409)

      const oldName = 'source-hive'
      const newName = 'existing-target-hive'
      const error = await dataHivesAPI.renameHive(appId, oldName, newName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'New hive name already exists' },
        message: 'New hive name already exists',
        status: 409
      })
    })
  })

  describe('deleteHive', () => {
    it('should make DELETE request to delete hive', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'temp-hive'
      const result = await dataHivesAPI.deleteHive(appId, hiveName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle deletion of hives with complex names', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'cache_store_2024_temp'
      const result = await dataHivesAPI.deleteHive(appId, hiveName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Hive not found', 404)

      const hiveName = 'nonexistent-hive'
      const error = await dataHivesAPI.deleteHive(appId, hiveName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Hive not found' },
        message: 'Hive not found',
        status: 404
      })
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Cannot delete system hive', 403)

      const hiveName = 'system-hive'
      const error = await dataHivesAPI.deleteHive(appId, hiveName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete system hive' },
        message: 'Cannot delete system hive',
        status: 403
      })
    })
  })

  describe('loadHiveStoreKeys', () => {
    it('should make GET request to load hive store keys', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-cache'
      const storeType = 'key-value'
      const options = { pageSize: 50, cursor: 'abc123' }
      const result = await dataHivesAPI.loadHiveStoreKeys(appId, hiveName, storeType, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/keys?pageSize=50&cursor=abc123`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('should handle list store type', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const options = { pageSize: 100 }
      const result = await dataHivesAPI.loadHiveStoreKeys(appId, hiveName, storeType, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/keys?pageSize=100`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('should handle set store type', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const storeType = 'set'
      const options = { cursor: 'xyz789' }
      const result = await dataHivesAPI.loadHiveStoreKeys(appId, hiveName, storeType, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/keys?cursor=xyz789`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('fails when server responds with hive not found error', async () => {
      mockFailedAPIRequest('Hive not found', 404)

      const hiveName = 'nonexistent-hive'
      const storeType = 'key-value'
      const options = { pageSize: 10 }
      const error = await dataHivesAPI.loadHiveStoreKeys(appId, hiveName, storeType, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Hive not found' },
        message: 'Hive not found',
        status: 404
      })
    })
  })

  describe('loadHiveStoreValues', () => {
    it('should make POST request for key-value store type', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-cache'
      const storeType = 'key-value'
      const keys = ['user:123', 'user:456', 'user:789']
      const result = await Promise.all(dataHivesAPI.loadHiveStoreValues(appId, hiveName, storeType, keys))

      expect(result).toEqual([successResult])

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}`,
        body: JSON.stringify(keys),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make multiple GET requests for sorted-set store type', async () => {
      mockSuccessAPIRequest(successResult)
      mockSuccessAPIRequest(successResult)

      const hiveName = 'leaderboard'
      const storeType = 'sorted-set'
      const keys = ['scores:game1', 'scores:game2']
      const result = await Promise.all(dataHivesAPI.loadHiveStoreValues(appId, hiveName, storeType, keys))

      expect(result).toEqual([successResult, successResult])
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[0]}/get-range-by-rank?startRank=0&stopRank=99&withScores=true`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false,
        },
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[1]}/get-range-by-rank?startRank=0&stopRank=99&withScores=true`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false,
        }
      ])
    })

    it('should make multiple GET requests for list store type', async () => {
      mockSuccessAPIRequest(successResult)
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const keys = ['pending:high', 'pending:normal']
      const result = await Promise.all(dataHivesAPI.loadHiveStoreValues(appId, hiveName, storeType, keys))

      expect(result).toEqual([successResult, successResult])
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[0]}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[1]}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should make multiple GET requests for set store type', async () => {
      mockSuccessAPIRequest(successResult)
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const storeType = 'set'
      const keys = ['admins', 'users']
      const result = await Promise.all(dataHivesAPI.loadHiveStoreValues(appId, hiveName, storeType, keys))

      expect(result).toEqual([successResult, successResult])
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[0]}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[1]}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should make multiple GET requests for map store type', async () => {
      mockSuccessAPIRequest(successResult)
      mockSuccessAPIRequest(successResult)

      const hiveName = 'config-store'
      const storeType = 'map'
      const keys = ['app:settings', 'user:preferences']
      const result = await Promise.all(dataHivesAPI.loadHiveStoreValues(appId, hiveName, storeType, keys))

      expect(result).toEqual([successResult, successResult])
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[0]}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keys[1]}`,
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

  describe('setHiveStoreValue', () => {
    it('should make PUT request to set hive store value', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-cache'
      const storeType = 'key-value'
      const keyName = 'user:123'
      const payload = { name: 'John Doe', email: 'john@example.com' }

      const result = await dataHivesAPI.setHiveStoreValue(appId, hiveName, storeType, keyName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}`,
        body: JSON.stringify(payload),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle list store value setting', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const keyName = 'pending:high'
      const payload = ['task1', 'task2', 'task3']

      const result = await dataHivesAPI.setHiveStoreValue(appId, hiveName, storeType, keyName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}`,
        body: JSON.stringify(payload),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle set store value setting', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const storeType = 'set'
      const keyName = 'admins'
      const payload = ['admin1', 'admin2', 'admin3']

      const result = await dataHivesAPI.setHiveStoreValue(appId, hiveName, storeType, keyName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}`,
        body: JSON.stringify(payload),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('addHiveStoreValue', () => {
    it('should make PUT request to add hive store value', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-cache'
      const storeType = 'key-value'
      const keyName = 'user:456'
      const payload = { score: 100, level: 5 }

      const result = await dataHivesAPI.addHiveStoreValue(appId, hiveName, storeType, keyName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}/add`,
        body: JSON.stringify(payload),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle adding to list store', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const keyName = 'pending:normal'
      const payload = ['new-task-1', 'new-task-2']

      const result = await dataHivesAPI.addHiveStoreValue(appId, hiveName, storeType, keyName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}/add`,
        body: JSON.stringify(payload),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle adding to sorted-set store', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'leaderboard'
      const storeType = 'sorted-set'
      const keyName = 'scores:game1'
      const payload = [{ member: 'player1', score: 95 }, { member: 'player2', score: 87 }]

      const result = await dataHivesAPI.addHiveStoreValue(appId, hiveName, storeType, keyName, payload)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}/add`,
        body: JSON.stringify(payload),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('removeHiveStoreRecords', () => {
    it('should make DELETE request to remove hive store records', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'temp-cache'
      const storeType = 'key-value'
      const keys = ['temp:1', 'temp:2', 'temp:3']

      const result = await dataHivesAPI.removeHiveStoreRecords(appId, hiveName, storeType, keys)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}`,
        body: JSON.stringify(keys),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle removing from list store', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const keys = ['completed:batch1', 'completed:batch2']

      const result = await dataHivesAPI.removeHiveStoreRecords(appId, hiveName, storeType, keys)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}`,
        body: JSON.stringify(keys),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle removing single key', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-sessions'
      const storeType = 'key-value'
      const keys = ['session:expired:abc123']

      const result = await dataHivesAPI.removeHiveStoreRecords(appId, hiveName, storeType, keys)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}`,
        body: JSON.stringify(keys),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('removeHiveStoreValue', () => {
    it('should make DELETE request to remove hive store value', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const storeType = 'set'
      const keyName = 'moderators'
      const values = ['user123', 'user456']

      const result = await dataHivesAPI.removeHiveStoreValue(appId, hiveName, storeType, keyName, values)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}/values`,
        body: JSON.stringify(values),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle removing single value', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'blacklist'
      const storeType = 'set'
      const keyName = 'banned-users'
      const values = ['spammer123']

      const result = await dataHivesAPI.removeHiveStoreValue(appId, hiveName, storeType, keyName, values)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}/values`,
        body: JSON.stringify(values),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle removing from list store', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const keyName = 'failed-tasks'
      const values = ['task-789', 'task-101']

      const result = await dataHivesAPI.removeHiveStoreValue(appId, hiveName, storeType, keyName, values)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${keyName}/values`,
        body: JSON.stringify(values),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('setKeyExpiration', () => {
    it('should make PUT request to set key expiration with TTL', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'session-cache'
      const storeType = 'key-value'
      const key = 'session:user123'
      const options = { ttl: 3600 }

      const result = await dataHivesAPI.setKeyExpiration(appId, hiveName, storeType, key, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/expire?ttl=3600`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('should make PUT request to set key expiration with unix time', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'temp-data'
      const storeType = 'key-value'
      const key = 'temp:data123'
      const options = { unixTime: 1672531200 }

      const result = await dataHivesAPI.setKeyExpiration(appId, hiveName, storeType, key, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/expire-at?unixTime=1672531200`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })

    it('should prioritize TTL over unix time when both are provided', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'cache-store'
      const storeType = 'key-value'
      const key = 'cache:item456'
      const options = { ttl: 7200, unixTime: 1672531200 }

      const result = await dataHivesAPI.setKeyExpiration(appId, hiveName, storeType, key, options)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/expire?ttl=7200`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
      }])
    })
  })

  describe('getKeyExpirationTTL', () => {
    it('should make GET request to get key expiration TTL', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'session-cache'
      const storeType = 'key-value'
      const key = 'session:user456'

      const result = await dataHivesAPI.getKeyExpirationTTL(appId, hiveName, storeType, key)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/get-expiration-ttl`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different store types', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const storeType = 'list'
      const key = 'urgent-tasks'

      const result = await dataHivesAPI.getKeyExpirationTTL(appId, hiveName, storeType, key)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/get-expiration-ttl`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('clearKeyExpiration', () => {
    it('should make PUT request to clear key expiration', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'persistent-cache'
      const storeType = 'key-value'
      const key = 'config:app-settings'

      const result = await dataHivesAPI.clearKeyExpiration(appId, hiveName, storeType, key)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/clear-expiration`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different store types for clearing expiration', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const storeType = 'set'
      const key = 'permanent-admins'

      const result = await dataHivesAPI.clearKeyExpiration(appId, hiveName, storeType, key)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/clear-expiration`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getKeySecondsSinceLastOperation', () => {
    it('should make GET request to get seconds since last operation', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'activity-tracker'
      const storeType = 'key-value'
      const key = 'user:last-seen:123'

      const result = await dataHivesAPI.getKeySecondsSinceLastOperation(appId, hiveName, storeType, key)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/seconds-since-last-operation`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different store types for last operation tracking', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'leaderboard'
      const storeType = 'sorted-set'
      const key = 'daily-scores'

      const result = await dataHivesAPI.getKeySecondsSinceLastOperation(appId, hiveName, storeType, key)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/${storeType}/${key}/seconds-since-last-operation`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('addHiveListStoreItems', () => {
    it('should make PUT request to add list store items', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const key = 'pending-tasks'
      const items = ['task1', 'task2', 'task3']

      const result = await dataHivesAPI.addHiveListStoreItems(appId, hiveName, key, items)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/list/${key}/add-last`,
        body: JSON.stringify(items),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle adding complex objects to list', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'notification-queue'
      const key = 'user:notifications:123'
      const items = [
        { type: 'message', content: 'Hello', timestamp: 1672531200 },
        { type: 'alert', content: 'Warning', timestamp: 1672531300 }
      ]

      const result = await dataHivesAPI.addHiveListStoreItems(appId, hiveName, key, items)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/list/${key}/add-last`,
        body: JSON.stringify(items),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('removeHiveListStoreItemByValue', () => {
    it('should make PUT request to remove list store item by value', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const key = 'pending-tasks'
      const value = 'completed-task'

      const result = await dataHivesAPI.removeHiveListStoreItemByValue(appId, hiveName, key, value)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/list/${key}/delete-value`,
        body: JSON.stringify({ value }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle removing complex objects from list', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'notification-queue'
      const key = 'user:notifications:456'
      const value = { type: 'alert', content: 'Dismissed', timestamp: 1672531400 }

      const result = await dataHivesAPI.removeHiveListStoreItemByValue(appId, hiveName, key, value)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/list/${key}/delete-value`,
        body: JSON.stringify({ value }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateHiveListStoreItemByIndex', () => {
    it('should make PUT request to update list store item by index', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'task-queue'
      const key = 'active-tasks'
      const index = 2
      const value = 'updated-task'

      const result = await dataHivesAPI.updateHiveListStoreItemByIndex(appId, hiveName, key, index, value)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/list/${key}/${index}`,
        body: JSON.stringify({ value }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle updating with complex object', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'workflow-steps'
      const key = 'process:abc123'
      const index = 0
      const value = { step: 'approval', status: 'pending', assignee: 'manager@example.com' }

      const result = await dataHivesAPI.updateHiveListStoreItemByIndex(appId, hiveName, key, index, value)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/list/${key}/${index}`,
        body: JSON.stringify({ value }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('addHiveSetStoreItems', () => {
    it('should make PUT request to add set store items', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const key = 'admins'
      const items = ['admin1', 'admin2', 'admin3']

      const result = await dataHivesAPI.addHiveSetStoreItems(appId, hiveName, key, items)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/set/${key}/add`,
        body: JSON.stringify(items),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle adding unique items to set', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'tags'
      const key = 'popular-tags'
      const items = ['javascript', 'react', 'nodejs', 'express']

      const result = await dataHivesAPI.addHiveSetStoreItems(appId, hiveName, key, items)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/set/${key}/add`,
        body: JSON.stringify(items),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('removeHiveSetStoreItemByValue', () => {
    it('should make DELETE request to remove set store item by value', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'user-roles'
      const key = 'moderators'
      const value = 'former-moderator'

      const result = await dataHivesAPI.removeHiveSetStoreItemByValue(appId, hiveName, key, value)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/set/${key}/values`,
        body: JSON.stringify([value]),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle removing complex values from set', async () => {
      mockSuccessAPIRequest(successResult)

      const hiveName = 'blacklist'
      const key = 'banned-ips'
      const value = '192.168.1.100'

      const result = await dataHivesAPI.removeHiveSetStoreItemByValue(appId, hiveName, key, value)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/hive/${hiveName}/set/${key}/values`,
        body: JSON.stringify([value]),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
