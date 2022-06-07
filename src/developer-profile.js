import { prepareRoutes } from './utils/routes'
import { developerPage } from './urls'

const routes = prepareRoutes({
  getProfile   : '/console/community/profile/me',
  removeProfile: '/console/community/profile/me',
  setProfile   : '/console/community/profile',
  getCountries : '/console/community/countries',
  checkUsername: '/console/community/profile/username/check',
})

export default req => ({

  getMyProfile() {
    return req.get(routes.getProfile())
  },

  createProfile(profileData) {
    return req.post(routes.setProfile(), profileData)
  },

  updateProfile(profileData) {
    return req.put(routes.setProfile(), profileData)
  },

  getCountries() {
    return req.get(routes.getCountries())
  },

  updateProfilePhoto(profilePhoto) {
    return req.post(routes.setProfile(), profilePhoto)
  },

  updateProfileAppIcon(appId, appIcon) {
    return req.post(`${developerPage()}/app-icon/${appId}`, appIcon)
  },

  checkUsernameAvailable(userName) {
    return req.get(routes.checkUsername()).query({ userName })
  },

  updateProfileBackground(background) {
    return req.post(routes.setProfile(), background)
  },

  remove() {
    return req.delete(routes.removeProfile())
  }
})
