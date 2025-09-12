/* eslint-disable max-len */

import urls, { devTeam } from './urls'

class DevTeam {
  constructor(req) {
    this.req = req
    this.serviceName = 'devTeam'
  }

  /**
   * @aiToolName Get Developers
   * @category Development Team
   * @description Retrieve list of developers for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"id":"D7ED38DB-2CD5-4E2D-BBCE-131F7D40254C","name":"Sergey Androsov","email":"androsov.srg@gmail.com"}]
   */
  getDevelopers(appId) {
    return this.req.get(devTeam(appId))
  }

  updateDevPermissions(appId, devId, permissions) {
    return this.req.put(`${devTeam(appId, devId)}/permissions`, permissions)
  }

  updateDevPermissionGroups(appId, devId, groups) {
    return this.req.put(`${devTeam(appId, devId)}/permission/groups`, groups)
  }

  /**
   * @typedef {Object} inviteDeveloper__email
   * @paramDef {"type":"string","label":"Email Address","name":"email","required":true,"description":"The email address of the developer to invite to the team"}
   */

  /**
   * @aiToolName Invite Developer
   * @category Development Team
   * @description Send an invitation to a developer to join the application team
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"inviteDeveloper__email","name":"email","label":"Email Object","description":"Object containing the email address of the developer to invite","required":true}
   * @sampleResult {"id":"ABC123-DEF456-GHI789","name":"Invited","email":"developer@example.com","lastLogin":null,"registrationDate":1672531200000,"system":false,"permissionGroups":[{"groupName":"Data Service","permissions":[{"id":"40","operation":"Create/Rename/Delete tables","access":"DENY","visible":true}],"visible":true}],"notifications":[{"type":"PERCENT_80","group":"Limits","enabled":false}]}
   */
  inviteDeveloper(appId, email) {
    return this.req.post(devTeam(appId), email)
  }

  /**
   * @aiToolName Remove Developer
   * @category Development Team
   * @description Remove a developer from the application team
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"devId","label":"Developer ID","description":"The identifier of the developer to remove","required":true}
   * @sampleResult ""
   */
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

  /**
   * @aiToolName Generate Developer Signature
   * @category Development Team
   * @description Generate a signature for the current developer
   * @sampleResult "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sampleSignatureHashExample"
   */
  generateDeveloperSignature() {
    return this.req.get(`${urls.console()}/developer/signature`)
  }
}

export default req => new DevTeam(req)
