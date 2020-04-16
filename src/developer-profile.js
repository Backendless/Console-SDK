import { developerPage } from './urls'

export default req => ({
  loadProfile() {
    return req.get(developerPage())
  },

  createProfile(profileData) {
    return req.post(developerPage(), profileData)
  },

  updateProfile(profileData) {
    return req.put(developerPage(), profileData)
  },

  loadCountries() {
    return req.get(`${developerPage()}/countries`)
  },

  updateProfilePhoto(profilePhoto) {
    return req.post(`${developerPage()}/profile-photo`, profilePhoto)
  },

  updateProfileAppIcon(appId, appIcon) {
    return req.post(`${developerPage()}/app-icon/${appId}`, appIcon)
  }
})
