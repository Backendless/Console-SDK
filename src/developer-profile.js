import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  getProfile   : '/console/community/profile/me',
  removeProfile: '/console/community/profile/me',
  removeApp    : '/console/community/profile/app',
  setProfile   : '/console/community/profile',
  getCountries : '/console/community/countries',
  checkUsername: '/console/community/profile/username/check',
})

export default req => ({

  getMyProfile() {
    return req.community.get(routes.getProfile())
  },

  createProfile(profileData) {
    return req.community.post(routes.setProfile(), profileData)
  },

  updateProfile(profileData) {
    return req.community.put(routes.setProfile(), profileData)
  },

  getCountries() {
    return req.community.get(routes.getCountries())
  },

  updateProfilePhoto(profilePhoto) {
    return req.community.post(routes.setProfile(), profilePhoto)
  },

  checkUsernameAvailable(userName) {
    return req.community.get(routes.checkUsername()).query({ userName })
  },

  updateProfileBackground(background) {
    return req.community.post(routes.setProfile(), background)
  },

  remove() {
    return req.community.delete(routes.removeProfile())
  },

  removeApp(appId) {
    return req.community.delete(routes.removeApp()).query({ appId })
  }
})
