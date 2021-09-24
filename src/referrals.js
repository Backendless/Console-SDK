import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  inviteCode: '/console/community/referrals/invite-code',

  invites      : '/console/community/referrals/invites',
  sendInvite   : '/console/community/referrals/send-invite',
  confirmInvite: '/console/community/referrals/confirm-invite',
})

export const referrals = req => ({

  //---- LOAD INVITE CODE ==>

  loadInviteCode() {
    return req.get(routes.inviteCode())
  },

  //---- LOAD INVITE CODE ----//

  //---- LOAD INVITES ==>

  loadInvites() {
    return req.get(routes.invites())
  },

  //---- LOAD INVITES ----//

  //---- SEND INVITE CODE ==>

  sendInvite(email) {
    return req.post(routes.sendInvite(), email)
  },

  //---- SEND INVITE CODE ----//

  //---- CONFIRM INVITE ==>

  confirmInvite(inviteData) {
    return req.post(routes.confirmInvite(), inviteData)
  },

  //---- CONFIRM INVITE ----//

})
