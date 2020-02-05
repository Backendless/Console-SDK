import urls, { devTeam } from './urls'

export default req => ({
  getDevelopers(appId) {
    return req.get(devTeam(appId))
  },

  updateDevPermissions(appId, devId, permissions) {
    return req.put(`${devTeam(appId, devId)}/permissions`, permissions)
  },

  updateDevPermissionGroups(appId, devId, groups) {
    return req.put(`${devTeam(appId, devId)}/permission/groups`, groups)
  },

  inviteDeveloper(appId, email) {
    return req.post(devTeam(appId), email)
  },

  removeDeveloper(appId, devId) {
    return req.delete(`${devTeam(appId, devId)}`)
  },

  updateNotificationSettings(appId, settings) {
    return req.put(`${urls.appConsole(appId)}/notifications/limits`, settings)
  },

  transferOwnership(appId, developerId) {
    return req.put(`${devTeam(appId, 'owner')}`, { developerId })
  }
})