import urls from './urls'

const SYSTEM_API_KEYS = ['ANDROID', 'IOS', 'JS', 'REST', 'WP', 'AS', 'BL']

function normalizeAppSettings(result) {
  const systemAPIKeys = []
  const customAPIKeys = []

  result.apiKeysMap = {}

  result.apiKeys.forEach(apiKey => {
    result.apiKeysMap[apiKey.name] = apiKey.apiKey

    const systemAPIKeyIndex = SYSTEM_API_KEYS.indexOf(apiKey.deviceType)

    if (systemAPIKeyIndex >= 0) {
      systemAPIKeys[systemAPIKeyIndex] = apiKey
    } else {
      customAPIKeys.push(apiKey)
    }
  })

  result.apiKeys = []

  systemAPIKeys.forEach(apiKey => {
    if (apiKey) {
      result.apiKeys.push(apiKey)
    }
  })

  result.apiKeys.push(...customAPIKeys)

  return result
}

export default req => ({
  updateAndroidMobileSettings(appId, settings) {
    return req.put(`${urls.mobileSettings(appId)}/android`, settings)
  },

  createAppleMobileSettings(appId, settings, deviceType) {
    return req.post(`${urls.mobileSettings(appId)}/${deviceType}`, settings)
  },

  updateAppleMobileSettings(appId, settings, id, deviceType) {
    return req.put(`${urls.mobileSettings(appId)}/${deviceType}/${id}`, settings)
  },

  deleteAppleMobileCertificate(appId, id, deviceType) {
    return req.delete(`${urls.mobileSettings(appId)}/${deviceType}/${id}`)
  },

  updateDomainNames(appId, domainNames) {
    return req.put(`${urls.appConsole(appId)}/domaincontrolsettings`, domainNames.split(/\s+/))
  },

  updateCustomDomain(appId, domainName) {
    return req.put(`${urls.appConsole(appId)}/dnsmapping`, domainName)
  },

  updateGitSupport(appId, enable) {
    return req.put(`${urls.appConsole(appId)}/git`).query({ enable })
  },

  updateIOSCert(appId, data) {
    return req.post(`${urls.appConsole(appId)}/ioscert`, data)
  },

  getDataValidators() {
    return req.get('/console/datavalidators')
  },

  getAppSettings(appId) {
    return req.get(`${urls.appConsole(appId)}/appsettings`)
      .then(normalizeAppSettings)
  },

  regenerateAPIKey(appId, keyId) {
    return req.post(`${urls.appConsole(appId)}/apikey/${keyId}/regenerate`)
  },

  getAPIKey(appId, apiKeyId) {
    return req.get(`${urls.appConsole(appId)}/apikey/${apiKeyId}`)
  },

  createAPIKey(appId, apiKey) {
    return req.post(`${urls.appConsole(appId)}/apikey`, apiKey)
  },

  updateAPIKey(appId, apiKeyId, apiKey) {
    return req.put(`${urls.appConsole(appId)}/apikey/${apiKeyId}`, apiKey)
  },

  deleteAPIKey(appId, apiKeyId) {
    return req.delete(`${urls.appConsole(appId)}/apikey/${apiKeyId}`)
  },

  getAppLogging(appId) {
    return req.get(`${urls.appConsole(appId)}/logging/config`)
  },

  setAppLogging(appId, logging) {
    console.warn('"ApiClient.settings.setAppLogging" is deprecated method, will be removed when fixed BKNDLSS-18585')
    return this.setAppLoggingConfig(appId, logging)
  },

  setAppLoggingConfig(appId, config) {
    return req.post(`${urls.appConsole(appId)}/logging/config`, config)
  },

  setAppLoggingIntegration(appId, integration) {
    return req.post(`${urls.appConsole(appId)}/logging/integration`, integration)
  },

  clearLoggers(appId) {
    return req.delete(`${urls.appConsole(appId)}/logging/loggers`)
  },

  updateSocialParams(appId, param) {
    return req.post(`${urls.appConsole(appId)}/socialparams`, param)
  },

  getLandingPageData(appId) {
    return req.get(urls.landingPage(appId))
  },

  getLandingPageTemplates(appId) {
    return req.get(`${urls.landingPage(appId)}/templates`)
  },

  saveLandingPageData(appId, data) {
    return req.put(urls.landingPage(appId), data)
  },

  publishLandingPageData(appId, data) {
    return req.post(`${urls.landingPage(appId)}/publish`, data)
  },

  uploadLandingPageFile(appId, file, section, name) {
    return req.post(`${urls.landingPage(appId)}/file`)
      .query({ section, name })
      .form({ file })
  },
})
