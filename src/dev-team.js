/* eslint-disable max-len */

import urls, { devTeam } from './urls'
import BaseService from './base/base-service'

class DevTeam extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'devTeam'
  }

  getDevelopers(appId) {
    return this.req.get(devTeam(appId))
  }

  updateDevPermissions(appId, devId, permissions) {
    return this.req.put(`${devTeam(appId, devId)}/permissions`, permissions)
  }

  updateDevPermissionGroups(appId, devId, groups) {
    return this.req.put(`${devTeam(appId, devId)}/permission/groups`, groups)
  }

  inviteDeveloper(appId, email) {
    return this.req.post(devTeam(appId), email)
  }

  removeDeveloper(appId, devId) {
    return this.req.delete(`${devTeam(appId, devId)}`)
  }

  updateNotificationSettings(appId, settings) {
    return this.req.put(`${urls.appConsole(appId)}/notifications/limits`, settings)
  }

  transferOwnership(appId, developerId) {
    return this.req.put(`${urls.appConsole(appId)}/devteam/owner`, { developerId })
  }

  loadOwnershipTransferProposals() {
    return this.req.get('/console/devteam/application-owner-change/pending-received-proposal')
  }

  confirmOwnershipChange(appId, data) {
    return this.req.put(`${urls.appConsole(appId)}/devteam/owner-confirm`, data)
  }

  loadSentOwnershipTransfer(appId) {
    return this.req.get(`${urls.appConsole(appId)}/devteam/application-owner-change/pending-sent-proposal`)
  }

  cancelSentOwnershipTransfer(appId) {
    return this.req.delete(`${urls.appConsole(appId)}/devteam/application-owner-change/pending-sent-proposal`)
  }

  generateDeveloperSignature() {
    return this.req.get(`${urls.console()}/developer/signature`)
  }
}

export default req => DevTeam.create(req)
