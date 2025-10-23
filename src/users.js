/* eslint-disable max-len */

import { appConsole as appUrl, users, oauth1, oauth2, oauth0Config, oauth0Binding } from './urls'
import BaseService from './base/base-service'

class Users extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'users'
  }
  /**
   * @aiToolName Get Users Regs
   * @category Users
   * @description Get user registration settings
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult {"enabled":true,"emailConfirmation":true,"roles":["default"]}
   */
  getUsersRegs(appId) {
    return this.req.get(`${appUrl(appId)}/userregistration`)
  }

  updateUsersRegs(appId, data) {
    return this.req.put(`${appUrl(appId)}/userregistration`, data)
  }

  /**
   * @aiToolName Get Users Login
   * @category Users
   * @description Get user login settings
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult {"sessionTimeout":3600,"maxFailedAttempts":5,"lockoutDuration":300}
   */
  getUsersLogin(appId) {
    return this.req.get(`${appUrl(appId)}/userlogin`)
  }

  /**
   * @aiToolName Logout All Users
   * @category Users
   * @description Logout all users from the application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult {"loggedOut":150,"success":true}
   */
  logoutAllUsers(appId) {
    return this.req.post(`${appUrl(appId)}/userlogin/logout/all`)
  }

  /**
   * @aiToolName Get User Social Login
   * @category Users
   * @description Get social login URL for a provider
   * @paramDef {"type":"string","name":"provider","label":"Provider","description":"The social provider name","required":true}
   * @sampleResult {"url":"https://accounts.google.com/oauth/authorize?..."}
   */
  getUserSocialLogin(provider) {
    return this.req.get(`/console/social/oauth/${provider}/request_url`)
  }

  updateUsersLogin(appId, data) {
    return this.req.post(`${appUrl(appId)}/userlogin`, data)
  }

  getUsersProps(appId) {
    return this.req.get(`${appUrl(appId)}/userproperties`)
  }

  updateUsersProps(appId, data) {
    return this.req.put(`${appUrl(appId)}/userproperties/${data.name}`, data)
  }

  updateSocialParams(appId, param) {
    return this.req.post(`${appUrl(appId)}/socialparams`, param)
  }

  getOAuth1ProviderTemplates(appId) {
    return this.req.get(`${users(appId)}/oauth1-templates`)
  }

  getOAuth2ProviderTemplates(appId) {
    return this.req.get(`${users(appId)}/oauth2-templates`)
  }

  /**
   * @aiToolName Get OAuth1 Providers
   * @category Users
   * @description Get all OAuth1 providers
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"id":"provider1","name":"Twitter","enabled":true}]
   */
  getOAuth1Providers(appId) {
    return this.req.get(`${oauth1(appId)}`)
  }

  /**
   * @aiToolName Get OAuth2 Providers
   * @category Users
   * @description Get all OAuth2 providers
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"id":"provider2","name":"Google","enabled":true}]
   */
  getOAuth2Providers(appId) {
    return this.req.get(`${oauth2(appId)}`)
  }

  /**
   * @aiToolName Get OAuth1 Provider
   * @category Users
   * @description Get a specific OAuth1 provider
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"providerId","label":"Provider ID","description":"The identifier of the OAuth1 provider","required":true}
   * @sampleResult {"id":"provider1","name":"Twitter","consumerKey":"key123","enabled":true}
   */
  getOAuth1Provider(appId, providerId) {
    return this.req.get(`${oauth1(appId)}/${providerId}`)
  }

  /**
   * @aiToolName Get OAuth2 Provider
   * @category Users
   * @description Get a specific OAuth2 provider
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"providerId","label":"Provider ID","description":"The identifier of the OAuth2 provider","required":true}
   * @sampleResult {"id":"provider2","name":"Google","clientId":"client123","enabled":true}
   */
  getOAuth2Provider(appId, providerId) {
    return this.req.get(`${oauth2(appId)}/${providerId}`)
  }

  createOAuth2Provider(appId, provider) {
    return this.req.post(`${oauth2(appId)}`, provider)
  }

  updateOAuth1Provider(appId, provider) {
    return this.req.put(`${oauth1(appId)}/${provider.id}`, provider)
  }

  updateOAuth2Provider(appId, provider) {
    return this.req.put(`${oauth2(appId)}/${provider.id}`, provider)
  }

  createOAuth1ProviderFromTemplate(appId, data) {
    return this.req.post(`${oauth1(appId)}/create-from-template`, data)
  }

  createOAuth2ProviderFromTemplate(appId, data) {
    return this.req.post(`${oauth2(appId)}/create-from-template`, data)
  }

  removeOAuth1Provider(appId, providerId) {
    return this.req.delete(`${oauth1(appId)}/${providerId}`)
  }

  removeOAuth2Provider(appId, providerId) {
    return this.req.delete(`${oauth2(appId)}/${providerId}`)
  }

  getOAuth1CallbackUrls(appId, providerCode) {
    return this.req.get(`${oauth1(appId)}/${providerCode}/callback-url`)
  }

  getOAuth2CallbackUrls(appId, providerCode) {
    return this.req.get(`${oauth2(appId)}/${providerCode}/callback-url`)
  }

  getAuth0Configuration(appId) {
    return this.req.get(`${oauth0Config(appId)}`)
  }

  updateAuth0Configuration(appId, config) {
    return this.req.put(`${oauth0Config(appId)}`, config)
  }

  createAuth0ScopeBinding(appId, binding) {
    return this.req.post(`${oauth0Binding(appId)}`, binding)
  }

  updateAuth0ScopeBinding(appId, binding) {
    return this.req.put(`${oauth0Binding(appId)}/${binding.id}`, binding)
  }

  getAuth0ScopeBindings(appId) {
    return this.req.get(`${oauth0Binding(appId)}`)
  }

  deleteAuth0ScopeBinding(appId, bindingId) {
    return this.req.delete(`${oauth0Binding(appId)}/${bindingId}`)
  }
}

export default req => Users.create(req)
