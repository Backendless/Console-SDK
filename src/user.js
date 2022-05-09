import urls from './urls'
import { cookieEnabled, deleteCookie, getCookie } from './utils/cookie'

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
        const authKey = (cookieEnabled() && getCookie('dev-auth-key')) || res.headers['auth-key']

        context.setAuthKey(authKey)

        return { ...res.body, authKey }
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

  registerAndJoinTeam({ appId, confirmationCode, ...userData }) {
    return req.post(`${urls.appConsole(appId)}/activatedev`, userData)
      .query({ 'confirmation-code': confirmationCode })
      .then(authKey => {
        context.setAuthKey(authKey)

        return authKey
      })
  },

  joinTeam({ appId, ...userData }) {
    return req.put(`${urls.appConsole(appId)}/devconfirmation/${userData.devId}`, userData)
  },

  loginToDiscourse(user, sig, sso) {
    return req.post('/console/discourse/sso', { user, sig, sso })
  },

  getPermissions(appId) {
    return req.get(`${urls.appConsole(appId)}/my-permissions`)
  },

  loadSubscriptionsInfo({ zoneId } = {}) {
    return req.billing.get('/console/billing/developer/subscriptions-info')
      .query({ zoneId })
  },

  loadPaymentProfiles() {
    return req.get('/console/billing/developer/payment-profile')
  },

  setPaymentProfile(appId, paymentProfileId) {
    return req.put(`${urls.appConsole(appId)}/billing/creditcard/${paymentProfileId}`)
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
})
