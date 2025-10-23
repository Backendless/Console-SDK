/* eslint-disable max-len */

import { cookieEnabled, deleteCookie, getCookie } from './utils/cookie'
import { prepareRoutes } from './utils/routes'
import BaseService from './base/base-service'

const routes = prepareRoutes({
  getMyAccount      : '/console/home/myaccount',
  updateMyAccount   : '/console/home/myaccount/',
  login             : '/console/home/login',
  loginWithTOTP     : '/console/home/otp-login',
  cloudLogin        : '/console/home/cloud/login',
  cloudLoginWithTOTP: '/console/home/cloud/otp-login',
  logout            : '/console/home/logout',
  registerDev       : '/console/devreg',
  deleteDev         : '/console/developer-suicide',
  twoFA             : '/console/developer/login/2fa',
  stripeConnect     : '/console/developer/stripe-connect',
  changePassword    : '/console/passwordchange',
  restorePassword   : '/console/restorepassword',
  resendConfirmEmail: '/console/resend',
  discourseSSO      : '/console/discourse/sso',
  socialLogin       : '/console/social/oauth/:type/request_url',

  devToAutomationWorkspace: '/console/automation/management/:workspaceId/activatedev',

  stripeConnectionAuth : '/console/community/marketplace/stripe-connect/auth',
  stripeConnectionToken: '/console/community/marketplace/stripe-connect/token',

  devToAppTeam  : '/:appId/console/activatedev',
  devPermissions: '/:appId/console/my-permissions',
})

class User extends BaseService {
  constructor(req, context) {
    super(req)
    this.context = context
    this.serviceName = 'user'
  }

  getAccountInfo(authKey) {
    const request = this.req.get(routes.getMyAccount())

    if (authKey) {
      request.set('auth-key', authKey)
    }

    return request.send()
      .then(account => {
        this.context.setAuthKey(account.authKey)

        return account
      })
  }

  register(userData) {
    return this.req.post(routes.registerDev()).send(userData)
  }

  suicide() {
    return this.req.delete(routes.deleteDev()).send()
  }

  login(login, password) {
    return this.req.post(routes.login())
      .unwrapBody(false)
      .send({ login, password })
      .then(res => {
        if (res.body.otpCreated) {
          return res.body
        }

        return contextifyWithAuthToken(res, this.context)
      })
  }

  loginWithTOTP(authData) {
    return this.req.post(routes.loginWithTOTP())
      .unwrapBody(false)
      .send(authData)
      .then(res => contextifyWithAuthToken(res, this.context))
  }

  cloudLogin(login, password) {
    return this.req.post(routes.cloudLogin())
      .unwrapBody(false)
      .send({ login, password })
      .then(res => {
        if (res.body.otpCreated) {
          return res.body
        }

        return contextifyWithAuthToken(res, this.context)
      })
  }

  cloudLoginWithTOTP(authData) {
    return this.req.post(routes.cloudLoginWithTOTP())
      .unwrapBody(false)
      .send(authData)
      .then(res => contextifyWithAuthToken(res, this.context))
  }

  loginSocial(type) {
    return this.req.get(routes.socialLogin(type))
  }

  logout() {
    return this.req.delete(routes.logout()).then(() => {
      this.context.setAuthKey(null)

      if (cookieEnabled()) {
        deleteCookie('dev-auth-key')
      }
    })
  }

  restorePassword(email) {
    return this.req.post(routes.restorePassword())
      .type('application/x-www-form-urlencoded; charset=UTF-8')
      .send('email=' + encodeURIComponent(email))
  }

  resendConfirmEmail(email) {
    return this.req.get(routes.resendConfirmEmail()).query({ email })
  }

  updateProfile(profile) {
    return this.req.put(routes.updateMyAccount(), profile)
  }

  registerAndJoinAppTeam(appId, confirmationCode, userData) {
    return this.req.post(routes.devToAppTeam(appId))
      .query({ 'confirmation-code': confirmationCode })
      .unwrapBody(false)
      .send(userData)
      .then(res => contextifyWithAuthToken(res, this.context))
  }

  registerAndJoinWorkspace(workspaceId, confirmationCode, userData) {
    return this.req.automation.post(routes.devToAutomationWorkspace(workspaceId))
      .query({ 'confirmation-code': confirmationCode })
      .unwrapBody(false)
      .send(userData)
      .then(res => contextifyWithAuthToken(res, this.context))
  }

  loginToDiscourse(user, sig, sso) {
    return this.req.post(routes.discourseSSO(), { user, sig, sso })
  }

  getPermissions(appId) {
    return this.req.get(routes.devPermissions(appId))
  }

  completeStripeConnection(data) {
    return this.req.post(routes.stripeConnectionAuth(), data)
  }

  getStripeConnectToken() {
    return this.req.get(routes.stripeConnectionToken())
  }

  getStripeConnectAccountId() {
    return this.req.get(routes.stripeConnect())
  }

  setStripeConnectAccountId(data) {
    return this.req.put(routes.stripeConnect(), data)
  }

  get2FAState() {
    return this.req.get(routes.twoFA())
  }

  update2FAState(enabled) {
    return this.req.put(routes.twoFA(), { enabled })
  }

  changePassword(id, password) {
    return this.req.post(routes.changePassword(), { id, password })
  }
}

export default (req, context) => User.create(req, context)

function contextifyWithAuthToken(res, context) {
  const authKey = (cookieEnabled() && getCookie('dev-auth-key')) || res.headers['auth-key']

  context.setAuthKey(authKey)

  return { ...res.body, authKey }
}
