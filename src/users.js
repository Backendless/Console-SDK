import { appConsole as appUrl, users } from './urls'

export default req => ({
  getUsersRegs(appId) {
    return req.get(`${appUrl(appId)}/userregistration`)
  },

  updateUsersRegs(appId, data) {
    return req.put(`${appUrl(appId)}/userregistration`, data)
  },

  getUsersLogin(appId) {
    return req.get(`${appUrl(appId)}/userlogin`)
  },

  logoutAllUsers(appId) {
    return req.post(`${appUrl(appId)}/userlogin/logout/all`)
  },

  getUserSocialLogin(provider) {
    return req.get(`/console/social/oauth/${provider}/request_url`)
  },

  updateUsersLogin(appId, data) {
    return req.post(`${appUrl(appId)}/userlogin`, data)
  },

  getUsersProps(appId) {
    return req.get(`${appUrl(appId)}/userproperties`)
  },

  updateUsersProps(appId, data) {
    return req.put(`${appUrl(appId)}/userproperties/${data.name}`, data)
  },

  updateSocialParams(appId, param) {
    return req.post(`${appUrl(appId)}/socialparams`, param)
  },

  getOAuth1ProviderTemplates(appId) {
    return req.get(`${users(appId)}/oauth1-templates`)
  },

  getOAuth2ProviderTemplates(appId) {
    return req.get(`${users(appId)}/oauth2-templates`)
  },

  getOAuth1Providers(appId) {
    return req.get(`${users(appId)}/oauth1`)
  },

  getOAuth2Providers(appId) {
    return req.get(`${users(appId)}/oauth2`)
  },

  getOAuth1Provider(appId, providerId) {
    return req.get(`${users(appId)}/oauth1/${providerId}`)
  },

  getOAuth2Provider(appId, providerId) {
    return req.get(`${users(appId)}/oauth2/${providerId}`)
  },

  createOAuth2Provider(appId, provider) {
    return req.post(`${users(appId)}/oauth2`, provider)
  },

  updateOAuth1Provider(appId, provider) {
    const providerId = provider.id
    const data = Object.assign({}, provider)

    delete data.id
    delete data.code
    delete data.callbackUrl

    return req.put(`${users(appId)}/oauth1/${providerId}`, data)
  },

  updateOAuth2Provider(appId, provider) {
    const providerId = provider.id
    const data = Object.assign({}, provider)

    delete data.id
    delete data.code
    delete data.callbackUrl

    return req.put(`${users(appId)}/oauth2/${providerId}`, data)
  },

  createOAuth1ProviderFromTemplate(appId, data) {
    return req.post(`${users(appId)}/oauth1/create-from-template`, data)
  },

  createOAuth2ProviderFromTemplate(appId, data) {
    return req.post(`${users(appId)}/oauth2/create-from-template`, data)
  },

  removeOAuth1Provider(appId, providerId) {
    return req.delete(`${users(appId)}/oauth1/${providerId}`)
  },

  removeOAuth2Provider(appId, providerId) {
    return req.delete(`${users(appId)}/oauth2/${providerId}`)
  },

  getOAuth1CallbackUrl(appId, providerCode) {
    return req.get(`${users(appId)}/oauth1/${providerCode}/callback-url`)
  },

  getOAuth2CallbackUrl(appId, providerCode) {
    return req.get(`${users(appId)}/oauth2/${providerCode}/callback-url`)
  }
})
