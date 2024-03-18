import { appConsole as appUrl, users, oauth1, oauth2, oauth0Config, oauth0Binding } from './urls'

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
    return req.get(`${oauth1(appId)}`)
  },

  getOAuth2Providers(appId) {
    return req.get(`${oauth2(appId)}`)
  },

  getOAuth1Provider(appId, providerId) {
    return req.get(`${oauth1(appId)}/${providerId}`)
  },

  getOAuth2Provider(appId, providerId) {
    return req.get(`${oauth2(appId)}/${providerId}`)
  },

  createOAuth2Provider(appId, provider) {
    return req.post(`${oauth2(appId)}`, provider)
  },

  updateOAuth1Provider(appId, provider) {
    return req.put(`${oauth1(appId)}/${provider.id}`, provider)
  },

  updateOAuth2Provider(appId, provider) {
    return req.put(`${oauth2(appId)}/${provider.id}`, provider)
  },

  createOAuth1ProviderFromTemplate(appId, data) {
    return req.post(`${oauth1(appId)}/create-from-template`, data)
  },

  createOAuth2ProviderFromTemplate(appId, data) {
    return req.post(`${oauth2(appId)}/create-from-template`, data)
  },

  removeOAuth1Provider(appId, providerId) {
    return req.delete(`${oauth1(appId)}/${providerId}`)
  },

  removeOAuth2Provider(appId, providerId) {
    return req.delete(`${oauth2(appId)}/${providerId}`)
  },

  getOAuth1CallbackUrls(appId, providerCode) {
    return req.get(`${oauth1(appId)}/${providerCode}/callback-url`)
  },

  getOAuth2CallbackUrls(appId, providerCode) {
    return req.get(`${oauth2(appId)}/${providerCode}/callback-url`)
  },

  getAuth0Configuration(appId) {
    return req.get(`${oauth0Config(appId)}`)
  },

  updateAuth0Configuration(appId, config) {
    return req.put(`${oauth0Config(appId)}`, config)
  },

  createAuth0ScopeBinding(appId, binding) {
    return req.post(`${oauth0Binding(appId)}`, binding)
  },

  updateAuth0ScopeBinding(appId, binding) {
    return req.put(`${oauth0Binding(appId)}/${binding.id}`, binding)
  },

  getAuth0ScopeBindings(appId) {
    return req.get(`${oauth0Binding(appId)}`)
  },

  deleteAuth0ScopeBinding(appId, bindingId) {
    return req.delete(`${oauth0Binding(appId)}/${bindingId}`, )
  }
})
