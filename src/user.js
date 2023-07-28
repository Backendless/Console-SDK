import urls from './urls'
import { cookieEnabled, deleteCookie, getCookie } from './utils/cookie'
import { prepareRoutes } from './utils/routes'


// TODO: move all routes here
const routes = prepareRoutes({
  twoFA        : '/console/developer/login/2fa',
  loginWithTOTP: '/console/home/otp-login'
})

const contextifyWithAuthToken = (res, context) => {
  const authKey = (cookieEnabled() && getCookie('dev-auth-key')) || res.headers['auth-key']

  context.setAuthKey(authKey)

  return { ...res.body, authKey }
}

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
    const request = req.get('/console/home/myaccount')

    if (authKey) {
      request.set('auth-key', authKey)
    }

    return request.send()
      .then(account => {
        context.setAuthKey(account.authKey)

        return account
      })
  },

  /**
   * @param {String} login
   * @param {String} password
   * @return {Promise.<{name:String, email:String, authKey:String}>}
   */
  login(login, password) {
    return req.post('/console/home/login')
      .unwrapBody(false)
      .send({ login, password })
      .then(res => {
        if (res.body.otpCreated) {
          return res.body
        }

        return contextifyWithAuthToken(res, context)
      })
  },

  register(userData) {
    return req.post('/console/devreg').send(userData)
  },

  suicide() {
    return req.delete('/console/developer-suicide').send()
  },

  loginSocial(type) {
    return req.get(`/console/social/oauth/${type}/request_url`)
  },

  logout() {
    return req.delete('/console/home/logout').then(() => {
      context.setAuthKey(null)

      if (cookieEnabled()) {
        deleteCookie('dev-auth-key')
      }
    })
  },

  restorePassword(email) {
    return req.post('/console/restorepassword')
      .type('application/x-www-form-urlencoded; charset=UTF-8')
      .send('email=' + encodeURIComponent(email))
  },

  resendConfirmEmail(email) {
    return req.get('console/resend').query({ email })
  },

  updateProfile(profile) {
    return req.put('/console/home/myaccount/', profile)
  },

  registerAndJoinAppTeam(appId, confirmationCode, userData) {
    return req.post(`${urls.appConsole(appId)}/activatedev`)
      .query({ 'confirmation-code': confirmationCode })
      .unwrapBody(false)
      .send(userData)
      .then(res => contextifyWithAuthToken(res, context))
  },

  registerAndJoinWorkspace(workspaceId, confirmationCode, userData) {
    return req.automation.post(`/console/automation/management/${workspaceId}/activatedev`)
      .query({ 'confirmation-code': confirmationCode })
      .unwrapBody(false)
      .send(userData)
      .then(res => contextifyWithAuthToken(res, context))
  },

  loginToDiscourse(user, sig, sso) {
    return req.post('/console/discourse/sso', { user, sig, sso })
  },

  getPermissions(appId) {
    return req.get(`${urls.appConsole(appId)}/my-permissions`)
  },

  loadSubscriptionsInfo() {
    return req.billing.get('/console/billing/developer/subscriptions-info')
  },

  loadPaymentProfiles() {
    return req.get('/console/billing/developer/payment-profile')
  },

  setPaymentProfile(appId, paymentProfileId) {
    return req.billing.put(`${urls.appConsole(appId)}/billing/application/creditcard/${paymentProfileId}`)
  },

  addPaymentProfile(data) {
    return req.post('/console/billing/developer/payment-profile', data)
  },

  updatePaymentProfile(id, data) {
    return req.put(`/console/billing/developer/payment-profile/${id}`, data)
  },

  deletePaymentProfile(id) {
    return req.delete(`/console/billing/developer/payment-profile/${id}`)
  },

  completeStripeConnection(data) {
    return req.post('/console/community/marketplace/stripe-connect/auth', data)
  },

  getStripeConnectToken() {
    return req.get('/console/community/marketplace/stripe-connect/token')
  },

  getStripeConnectAccountId() {
    return req.get('/console/developer/stripe-connect')
  },

  setStripeConnectAccountId(data) {
    return req.put('/console/developer/stripe-connect', data)
  },

  get2FAState() {
    return req.get(routes.twoFA())
  },

  update2FAState(enabled) {
    return req.put(routes.twoFA(), { enabled })
  },

  loginWithTOTP(authData) {
    return req.post(routes.loginWithTOTP())
      .unwrapBody(false)
      .send(authData)
      .then(res => contextifyWithAuthToken(res, context))
  }
})
