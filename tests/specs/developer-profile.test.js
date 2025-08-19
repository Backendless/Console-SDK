import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.developerProfile', () => {
  let apiClient
  let developerProfileAPI

  const successResult = { foo: 'bar' }
  const appId = 'test-app-id'
  const userName = 'testuser'

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    developerProfileAPI = apiClient.developerProfile
  })

  describe('getMyProfile', () => {
    it('should make GET request to profile endpoint', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.getMyProfile()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile/me',
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
      mockFailedAPIRequest('Profile not found', 404)

      const error = await developerProfileAPI.getMyProfile().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Profile not found' },
        message: 'Profile not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile/me',
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

  describe('createProfile', () => {
    it('should make POST request with profile data', async () => {
      mockSuccessAPIRequest(successResult)

      const profileData = {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        country: 'US'
      }

      const result = await developerProfileAPI.createProfile(profileData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profileData),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty profile data', async () => {
      mockSuccessAPIRequest(successResult)

      const profileData = {}
      const result = await developerProfileAPI.createProfile(profileData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profileData),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Username already exists', 409)

      const profileData = { username: 'taken' }
      const error = await developerProfileAPI.createProfile(profileData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Username already exists' },
        message: 'Username already exists',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profileData),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateProfile', () => {
    it('should make PUT request with profile data', async () => {
      mockSuccessAPIRequest(successResult)

      const profileData = {
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Software developer',
        location: 'New York'
      }

      const result = await developerProfileAPI.updateProfile(profileData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profileData),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle partial profile updates', async () => {
      mockSuccessAPIRequest(successResult)

      const profileData = { bio: 'Updated bio' }
      const result = await developerProfileAPI.updateProfile(profileData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profileData),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid profile data', 400)

      const profileData = { firstName: '' }
      const error = await developerProfileAPI.updateProfile(profileData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid profile data' },
        message: 'Invalid profile data',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profileData),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getCountries', () => {
    it('should make GET request to countries endpoint', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.getCountries()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/countries',
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
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await developerProfileAPI.getCountries().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/countries',
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

  describe('updateProfilePhoto', () => {
    it('should make POST request with profile photo data', async () => {
      mockSuccessAPIRequest(successResult)

      const profilePhoto = {
        photoUrl: 'https://example.com/photo.jpg',
        photoData: 'base64-encoded-image-data'
      }

      const result = await developerProfileAPI.updateProfilePhoto(profilePhoto)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profilePhoto),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty photo object', async () => {
      mockSuccessAPIRequest(successResult)

      const profilePhoto = {}
      const result = await developerProfileAPI.updateProfilePhoto(profilePhoto)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profilePhoto),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid image format', 400)

      const profilePhoto = { photoData: 'invalid-data' }
      const error = await developerProfileAPI.updateProfilePhoto(profilePhoto).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid image format' },
        message: 'Invalid image format',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(profilePhoto),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('checkUsernameAvailable', () => {
    it('should make GET request with username query parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.checkUsernameAvailable(userName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/profile/username/check?userName=${userName}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle special characters in username', async () => {
      mockSuccessAPIRequest(successResult)

      const specialUserName = 'user@special-123'
      const result = await developerProfileAPI.checkUsernameAvailable(specialUserName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/profile/username/check?userName=${encodeURIComponent(specialUserName)}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined username', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.checkUsernameAvailable()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile/username/check',
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
      mockFailedAPIRequest('Username not available', 409)

      const error = await developerProfileAPI.checkUsernameAvailable(userName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Username not available' },
        message: 'Username not available',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/profile/username/check?userName=${userName}`,
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

  describe('updateProfileBackground', () => {
    it('should make POST request with background data', async () => {
      mockSuccessAPIRequest(successResult)

      const background = {
        backgroundUrl: 'https://example.com/background.jpg',
        backgroundData: 'base64-encoded-image-data'
      }

      const result = await developerProfileAPI.updateProfileBackground(background)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(background),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty background object', async () => {
      mockSuccessAPIRequest(successResult)

      const background = {}
      const result = await developerProfileAPI.updateProfileBackground(background)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(background),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid background format', 400)

      const background = { backgroundData: 'invalid-data' }
      const error = await developerProfileAPI.updateProfileBackground(background).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid background format' },
        message: 'Invalid background format',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile',
          body: JSON.stringify(background),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('remove', () => {
    it('should make DELETE request to remove profile', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.remove()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile/me',
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
      mockFailedAPIRequest('Profile cannot be deleted', 403)

      const error = await developerProfileAPI.remove().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Profile cannot be deleted' },
        message: 'Profile cannot be deleted',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile/me',
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

  describe('removeApp', () => {
    it('should make DELETE request with appId query parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.removeApp(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/profile/app?appId=${appId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined appId', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await developerProfileAPI.removeApp()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/profile/app',
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
      mockFailedAPIRequest('App not found', 404)

      const error = await developerProfileAPI.removeApp(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'App not found' },
        message: 'App not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/profile/app?appId=${appId}`,
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
})