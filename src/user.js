import urls from './urls'

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
        const { name, email } = res.body
        const authKey = res.headers['auth-key']

        context.setAuthKey(authKey)

        return { name, email, authKey }
      })
  },

  register(userData) {
    return req.post('/console/devreg').send(userData)
  },

  suicide() {
    return req.delete('/console/developer-suicide').send()
  },

  checkForCaptchaRequirement() {
    return req.get('/console/devreg/captcha_required')
  },

  loginSocial(type) {
    return req.get(`/console/social/oauth/${type}/request_url`)
  },

  logout() {
    return req.delete('/console/home/logout').then(() => {
      context.setAuthKey(null)
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

  registerAndJoinTeam({ appId, ...userData }) {
    return req.post(`${urls.appConsole(appId)}/activatedev`, userData).then(authKey => {
      context.setAuthKey(authKey)

      return Promise.resolve(authKey)
    })
  },

  joinTeam({ appId, ...userData }) {
    return req.put(`${urls.appConsole(appId)}/devconfirmation/${userData.devId}`, userData)
  }
})
