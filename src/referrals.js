import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  inviteCode            : '/console/community/referrals/invite-code',
  invites               : '/console/community/referrals/invites',
  confirmUserRegistered : '/console/community/referrals/events/confirm-user-registered',
  confirmFirstAppCreated: '/console/community/referrals/events/confirm-first-app-created',
})

export const referrals = req => ({

  //---- LOAD INVITE CODE ==>

  loadInviteCode() {
    return req.community.get(routes.inviteCode())
  },

  //---- LOAD INVITE CODE ----//

  //---- LOAD INVITES ==>

  loadInvites() {
    return req.community.get(routes.invites())
  },

  //---- LOAD INVITES ----//

  //---- SEND INVITE CODE ==>

  sendInvite(inviteData) {
    return req.community.post(routes.invites(), inviteData)
  },

  //---- SEND INVITE CODE ----//

  //---- USER REGISTERED ==>

  confirmUserRegistered(inviteData) {
    return req.community.post(routes.confirmUserRegistered(), inviteData)
  },

  //---- USER REGISTERED ----//

  //---- FIRST APP CREATED ==>

  confirmFirstAppCreated() {
    return req.community.post(routes.confirmFirstAppCreated())
  },

  //---- FIRST APP CREATED ----//
})
