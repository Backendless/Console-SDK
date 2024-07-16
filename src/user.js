import { cookieEnabled, deleteCookie, getCookie } from './utils/cookie'
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  myAccount         : '/console/home/myaccount',
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

/**
 *
 * @param req
 * @param {Context} context
 */
export default (req, context) => ({
  /**
   * @param {String=}authKey
   * @return {Promise|*}
   */
  getAccountInfo(authKey) {
    const request = req.get(routes.myAccount())

    if (authKey) {
      request.set('auth-key', authKey)
    }

    return request.send()
      .then(account => {
        context.setAuthKey(account.authKey)

        return account
      })
  },

  register(userData) {
    return req.post(routes.registerDev()).send(userData)
  },

  suicide() {
    return req.delete(routes.deleteDev()).send()
  },

  /**
   * @param {String} login
   * @param {String} password
   * @return {Promise.<{name:String, email:String, authKey:String}>}
   */
  login(login, password) {
    return req.post(routes.login())
      .unwrapBody(false)
      .send({ login, password })
      .then(res => {
        if (res.body.otpCreated) {
          return res.body
        }

        return contextifyWithAuthToken(res, context)
      })
  },

  loginWithTOTP(authData) {
    return req.post(routes.loginWithTOTP())
      .unwrapBody(false)
      .send(authData)
      .then(res => contextifyWithAuthToken(res, context))
  },

  /**
   * @param {String} login
   * @param {String} password
   * @return {Promise.<{name:String, email:String, authKey:String}>}
   */
  cloudLogin(login, password) {
    return req.post(routes.cloudLogin())
      .unwrapBody(false)
      .send({ login, password })
      .then(res => {
        if (res.body.otpCreated) {
          return res.body
        }

        return contextifyWithAuthToken(res, context)
      })
  },

  cloudLoginWithTOTP(authData) {
    return req.post(routes.cloudLoginWithTOTP())
      .unwrapBody(false)
      .send(authData)
      .then(res => contextifyWithAuthToken(res, context))
  },

  loginSocial(type) {
    return req.get(routes.socialLogin(type))
  },

  logout() {
    return req.delete(routes.logout()).then(() => {
      context.setAuthKey(null)

      if (cookieEnabled()) {
        deleteCookie('dev-auth-key')
      }
    })
  },

  restorePassword(email) {
    return req.post(routes.restorePassword())
      .type('application/x-www-form-urlencoded; charset=UTF-8')
      .send('email=' + encodeURIComponent(email))
  },

  resendConfirmEmail(email) {
    return req.get(routes.resendConfirmEmail()).query({ email })
  },

  updateProfile(profile) {
    return req.put(routes.myAccount(), profile)
  },

  registerAndJoinAppTeam(appId, confirmationCode, userData) {
    return req.post(routes.devToAppTeam(appId))
      .query({ 'confirmation-code': confirmationCode })
      .unwrapBody(false)
      .send(userData)
      .then(res => contextifyWithAuthToken(res, context))
  },

  registerAndJoinWorkspace(workspaceId, confirmationCode, userData) {
    return req.automation.post(routes.devToAutomationWorkspace(workspaceId))
      .query({ 'confirmation-code': confirmationCode })
      .unwrapBody(false)
      .send(userData)
      .then(res => contextifyWithAuthToken(res, context))
  },

  loginToDiscourse(user, sig, sso) {
    return req.post(routes.discourseSSO(), { user, sig, sso })
  },

  getPermissions(appId) {
    return req.get(routes.devPermissions(appId))
  },

  completeStripeConnection(data) {
    return req.post(routes.stripeConnectionAuth(), data)
  },

  getStripeConnectToken() {
    return req.get(routes.stripeConnectionToken())
  },

  getStripeConnectAccountId() {
    return req.get(routes.stripeConnect())
  },

  setStripeConnectAccountId(data) {
    return req.put(routes.stripeConnect(), data)
  },

  get2FAState() {
    return req.get(routes.twoFA())
  },

  update2FAState(enabled) {
    return req.put(routes.twoFA(), { enabled })
  },

  changePassword(id, password) {
    return req.post(routes.changePassword(), { id, password })
  }
})

function contextifyWithAuthToken(res, context) {
  const authKey = (cookieEnabled() && getCookie('dev-auth-key')) || res.headers['auth-key']

  context.setAuthKey(authKey)

  return { ...res.body, authKey }
}
