/**
 *
 * @param req
 * @param {Context} context
 */
export default (req, context) => ({
  getAccountInfo() {
    return req.get('/console/home/myaccount').send()
  },

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
  }
})
