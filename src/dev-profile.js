import { prepareRoutes } from './utils/routes'
import { developerPage } from './urls'

const routes = prepareRoutes({
  getProfile   : '/console/marketplace/profile/me',
  setProfile   : '/console/marketplace/profile/',
  getCountries : '/console/marketplace/countries',
  checkUsername: '/console/marketplace/profile/checkUsername',
})

export default req => ({

  getMyProfile() {
    return req.get(routes.getProfile())
  },

  createProfile(profileData) {
    console.log('xxx createProfile profileData', profileData)
    return req.post(routes.setProfile(), profileData)//-
  },

  updateProfile(profileData) {
    console.log('xxx updateProfile profileData', profileData)
    return req.put(routes.setProfile(), profileData)//-
  },

  getCountries() {
    return req.get(routes.getCountries())
  },

  updateProfilePhoto(profilePhoto) {
    return req.post(routes.setProfile(), profilePhoto)
  },

  updateProfileAppIcon(appId, appIcon) {
    return req.post(`${developerPage()}/app-icon/${appId}`, appIcon)//-
  },

  checkUsernameAvailable(userName) {
    return req.get(routes.checkUsername()).query({ userName })
  },

  updateProfileBackground(background) {
    return req.post(routes.setProfile(), background)
  },

})
