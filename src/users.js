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
  },

  updateDevPermissions(appId, devId, operation, access) {
    const permission = { operation, access }

    return req.post(`${appUrl(appId)}/devteam/${devId}/permissions`, permission)
  },

  removeDeveloper(appId, userId) {
    return req.delete(`${appUrl(appId)}/devteam//${userId}`)
  },

  inviteDeveloper(appId, email) {
    return req.post(`${appUrl(appId)}/devteam`, email)
  }
})
