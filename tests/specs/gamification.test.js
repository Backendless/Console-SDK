describe('apiClient.gamification', () => {
  let apiClient
  let gamificationAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    gamificationAPI = apiClient.gamification
  })

  describe('loadPacks', () => {
    it('should make GET request to load packs', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadPacks()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/packs',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Server error', 500)

      const error = await gamificationAPI.loadPacks().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Server error' },
        message: 'Server error',
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/packs',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getMapItems', () => {
    it('should make GET request with packId query parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const packId = 'pack-123'
      const result = await gamificationAPI.getMapItems(packId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/map-items?packId=pack-123',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Pack not found', 404)

      const packId = 'invalid-pack'
      const error = await gamificationAPI.getMapItems(packId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Pack not found' },
        message: 'Pack not found',
        status: 404
      })
    })
  })

  describe('getProgress', () => {
    it('should make GET request to get progress', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.getProgress()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/progress',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await gamificationAPI.getProgress().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })
  })

  describe('loadLevels', () => {
    it('should make GET request to load levels', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadLevels()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/levels',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await gamificationAPI.loadLevels().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })
    })
  })

  describe('loadBadges', () => {
    it('should make GET request to load badges', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadBadges()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/badges',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Bad request', 400)

      const error = await gamificationAPI.loadBadges().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Bad request' },
        message: 'Bad request',
        status: 400
      })
    })
  })

  describe('loadEarnBBItems', () => {
    it('should make GET request to load earn BB items', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadEarnBBItems()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/earn',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const error = await gamificationAPI.loadEarnBBItems().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Internal server error' },
        message: 'Internal server error',
        status: 500
      })
    })
  })

  describe('loadRedeemBBItems', () => {
    it('should make GET request to load redeem BB items', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadRedeemBBItems()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/redeem',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Forbidden', 403)

      const error = await gamificationAPI.loadRedeemBBItems().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Forbidden' },
        message: 'Forbidden',
        status: 403
      })
    })
  })

  describe('loadActivityHistory', () => {
    it('should make GET request to load activity history', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadActivityHistory()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/activity-history',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Not found', 404)

      const error = await gamificationAPI.loadActivityHistory().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Not found' },
        message: 'Not found',
        status: 404
      })
    })
  })

  describe('loadTrivia', () => {
    it('should make GET request to load trivia', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.loadTrivia()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/trivia',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service error', 500)

      const error = await gamificationAPI.loadTrivia().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service error' },
        message: 'Service error',
        status: 500
      })
    })
  })

  describe('checkTriviaAnswer', () => {
    it('should make POST request with trivia answer data', async () => {
      mockSuccessAPIRequest(successResult)

      const triviaId = 'trivia-123'
      const answerId = 'answer-456'
      const taskId = 'task-789'

      const result = await gamificationAPI.checkTriviaAnswer(triviaId, answerId, taskId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/trivia',
        method: 'POST',
        body: JSON.stringify({ triviaId, answerId, taskId }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid answer', 422)

      const triviaId = 'trivia-123'
      const answerId = 'wrong-answer'
      const taskId = 'task-789'

      const error = await gamificationAPI.checkTriviaAnswer(triviaId, answerId, taskId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid answer' },
        message: 'Invalid answer',
        status: 422
      })
    })
  })

  describe('submitSocialSharing', () => {
    it('should make POST request with social sharing data', async () => {
      mockSuccessAPIRequest(successResult)

      const socialData = {
        platform: 'twitter',
        content: 'Check out this awesome feature!',
        url: 'https://example.com'
      }

      const result = await gamificationAPI.submitSocialSharing(socialData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/social-share',
        method: 'POST',
        body: JSON.stringify(socialData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid social data', 400)

      const socialData = { platform: 'invalid' }
      const error = await gamificationAPI.submitSocialSharing(socialData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid social data' },
        message: 'Invalid social data',
        status: 400
      })
    })
  })

  describe('reportSocialActivity', () => {
    it('should make POST request with social activity data', async () => {
      mockSuccessAPIRequest(successResult)

      const activityData = {
        type: 'share',
        platform: 'facebook',
        timestamp: Date.now()
      }

      const result = await gamificationAPI.reportSocialActivity(activityData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/social-link',
        method: 'POST',
        body: JSON.stringify(activityData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Activity tracking disabled', 409)

      const activityData = { type: 'invalid' }
      const error = await gamificationAPI.reportSocialActivity(activityData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Activity tracking disabled' },
        message: 'Activity tracking disabled',
        status: 409
      })
    })
  })

  describe('getUnnotifiedEvents', () => {
    it('should make GET request to get unnotified events', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.getUnnotifiedEvents()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/unnotified-events',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Events not available', 503)

      const error = await gamificationAPI.getUnnotifiedEvents().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Events not available' },
        message: 'Events not available',
        status: 503
      })
    })
  })

  describe('getUnnotifiedAchievements', () => {
    it('should make GET request to get unnotified achievements', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.getUnnotifiedAchievements()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/unnotified-achievements',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Achievements unavailable', 500)

      const error = await gamificationAPI.getUnnotifiedAchievements().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Achievements unavailable' },
        message: 'Achievements unavailable',
        status: 500
      })
    })
  })

  describe('markEventPlayed', () => {
    it('should make PUT request to mark event as played', async () => {
      mockSuccessAPIRequest(successResult)

      const taskId = 'task-123'
      const result = await gamificationAPI.markEventPlayed(taskId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/mark-event-played',
        method: 'PUT',
        body: JSON.stringify({ taskId }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Event not found', 404)

      const taskId = 'invalid-task'
      const error = await gamificationAPI.markEventPlayed(taskId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Event not found' },
        message: 'Event not found',
        status: 404
      })
    })
  })

  describe('enableAppAPITracking', () => {
    it('should make PUT request to enable API tracking for app', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.enableAppAPITracking(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/gamification/enable`,
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('App not found', 404)

      const error = await gamificationAPI.enableAppAPITracking('invalid-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'App not found' },
        message: 'App not found',
        status: 404
      })
    })
  })

  describe('disableAppAPITracking', () => {
    it('should make PUT request to disable API tracking for app', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.disableAppAPITracking(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/gamification/disable`,
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Permission denied', 403)

      const error = await gamificationAPI.disableAppAPITracking(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Permission denied' },
        message: 'Permission denied',
        status: 403
      })
    })
  })

  describe('isAppAPITrackingEnabled', () => {
    it('should make GET request to check if app API tracking is enabled', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.isAppAPITrackingEnabled(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/gamification/enabled`,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('App not accessible', 401)

      const error = await gamificationAPI.isAppAPITrackingEnabled(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'App not accessible' },
        message: 'App not accessible',
        status: 401
      })
    })
  })

  describe('enableAccountAPITracking', () => {
    it('should make PUT request to enable API tracking for account', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.enableAccountAPITracking()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/enable',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Account tracking error', 500)

      const error = await gamificationAPI.enableAccountAPITracking().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Account tracking error' },
        message: 'Account tracking error',
        status: 500
      })
    })
  })

  describe('disableAccountAPITracking', () => {
    it('should make PUT request to disable API tracking for account', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.disableAccountAPITracking()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/disable',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Disable failed', 422)

      const error = await gamificationAPI.disableAccountAPITracking().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Disable failed' },
        message: 'Disable failed',
        status: 422
      })
    })
  })

  describe('isAccountAPITrackingEnabled', () => {
    it('should make GET request to check if account API tracking is enabled', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.isAccountAPITrackingEnabled()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/enabled',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized access', 401)

      const error = await gamificationAPI.isAccountAPITrackingEnabled().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized access' },
        message: 'Unauthorized access',
        status: 401
      })
    })
  })

  describe('getFreeMilestoneProgress', () => {
    it('should make GET request to get free milestone progress', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.getFreeMilestoneProgress()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/free-plan-milestone-progress',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Progress not available', 503)

      const error = await gamificationAPI.getFreeMilestoneProgress().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Progress not available' },
        message: 'Progress not available',
        status: 503
      })
    })
  })

  describe('getSettings', () => {
    it('should make GET request to get gamification settings', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.getSettings()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/settings',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Settings not found', 404)

      const error = await gamificationAPI.getSettings().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Settings not found' },
        message: 'Settings not found',
        status: 404
      })
    })
  })

  describe('saveSettings', () => {
    it('should make PUT request to save gamification settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = {
        notifications: true,
        autoTrack: false,
        theme: 'dark'
      }

      const result = await gamificationAPI.saveSettings(settings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/settings',
        method: 'PUT',
        body: JSON.stringify(settings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid settings', 400)

      const settings = { invalid: 'value' }
      const error = await gamificationAPI.saveSettings(settings).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid settings' },
        message: 'Invalid settings',
        status: 400
      })
    })
  })

  describe('getSocialPostsCollection', () => {
    it('should make GET request to get social posts collection', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await gamificationAPI.getSocialPostsCollection()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/gamification/social-posts-templates',
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Templates unavailable', 500)

      const error = await gamificationAPI.getSocialPostsCollection().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Templates unavailable' },
        message: 'Templates unavailable',
        status: 500
      })
    })
  })

  describe('validateFlowRunnerAchievements', () => {
    it('should make POST request to validate flow runner achievements', async () => {
      mockSuccessAPIRequest(successResult)

      const event = {
        type: 'flow_completion',
        flowId: 'flow-123',
        timestamp: Date.now()
      }

      const result = await gamificationAPI.validateFlowRunnerAchievements(appId, event)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/gamification/${appId}/flowrunner-achievements/validate`,
        method: 'POST',
        body: JSON.stringify(event),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid flow event', 422)

      const event = { type: 'invalid' }
      const error = await gamificationAPI.validateFlowRunnerAchievements(appId, event).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid flow event' },
        message: 'Invalid flow event',
        status: 422
      })
    })
  })
})
