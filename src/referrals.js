import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  inviteCode            : '/console/community/referrals/invite-code',
  inviteId              : '/console/community/referrals/invite-id',
  invites               : '/console/community/referrals/invites',
  confirmUserRegistered : '/console/community/referrals/events/confirm-user-registered',
  confirmFirstAppCreated: '/console/community/referrals/events/confirm-first-app-created',
})

export const referrals = req => ({
  loadInviteCode() {
    return req.community.get(routes.inviteCode())
  },

  loadInvites() {
    return req.community.get(routes.invites())
  },

  sendInvite(inviteData) {
    return req.community.post(routes.invites(), inviteData)
  },

  checkInviteId(id) {
    return req.community.post(routes.inviteId(), id)
  },

  confirmUserRegistered(inviteData) {
    return req.community.post(routes.confirmUserRegistered(), inviteData)
  },

  confirmFirstAppCreated() {
    return req.community.post(routes.confirmFirstAppCreated())
  },
})
