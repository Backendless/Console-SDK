import { appConsole as appUrl } from './urls'

export default req => ({
  getUsersRegs(appId) {
    return req.get(`${appUrl(appId)}/userregistration`)
  },

  updateUsersRegs(appId, data) {
    return req.put(`${appUrl(appId)}/userregistration`, data)
  },

  getUsersLogin(appId) {
    return req.get(`${appUrl(appId)}/userlogin`)
  },

  logoutAllUsers(appId) {
    return req.post(`${appUrl(appId)}/userlogin/logout/all`)
  },

  getUserSocialLogin(provider) {
    return req.get(`/console/social/oauth/${provider}/request_url`)
  },

  updateUsersLogin(appId, data) {
    return req.post(`${appUrl(appId)}/userlogin`, data)
  },

  getUsersProps(appId) {
    return req.get(`${appUrl(appId)}/userproperties`)
  },

  updateUsersProps(appId, data) {
    return req.put(`${appUrl(appId)}/userproperties/${data.name}`, data)
  },

  updateSocialParams(appId, param) {
    return req.post(`${appUrl(appId)}/socialparams`, param)
  }
})
