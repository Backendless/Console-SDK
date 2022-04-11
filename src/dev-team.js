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
    return req.put(`${urls.appConsole(appId)}/devteam/owner`, { developerId })
  },

  loadOwnershipTransferProposals() {
    return req.get('/console/devteam/application-owner-change/pending-received-proposal')
  },

  confirmOwnershipChange(appId, data) {
    return req.put(`${urls.appConsole(appId)}/devteam/owner-confirm`, data)
  },

  loadSentOwnershipTransfer(appId) {
    return req.get(`${urls.appConsole(appId)}/devteam/application-owner-change/pending-sent-proposal`)
  },

  cancelSentOwnershipTransfer(appId) {
    return req.delete(`${urls.appConsole(appId)}/devteam/application-owner-change/pending-sent-proposal`)
  },

})
