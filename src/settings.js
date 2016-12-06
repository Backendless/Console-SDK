import urls from './urls'

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

  addExternalHost(appId, hostNames) {
    return req.post(`${urls.appConsole(appId)}/externalhosts`, hostNames)
  },

  removeExternalHosts(appId, hostNames) {
    return req.delete(`${urls.appConsole(appId)}/externalhosts`, hostNames)
  },

  getDataValidators() {
    return req.get('/console/datavalidators')
  },


  getAppSettings(appId) {
    return req.get(`${urls.appConsole(appId)}/appsettings`)
  },

  regenerateApiKey(appId, keyName) {
    return req.post(`${urls.appConsole(appId)}/appsettings/${keyName}`)
  },

  getAppLogging(appId) {
    return req.get(`${urls.appConsole(appId)}/logging/config`)
  },

  setAppLogging(appId, logging) {
    return req.post(`${urls.appConsole(appId)}/logging/config`, logging)
  },

  clearLoggers(appId) {
    return req.delete(`${urls.appConsole(appId)}/logging/loggers`)
  },

  updateSocialParams(appId, param) {
    return req.post(`${urls.appConsole(appId)}/socialparams`, param)
  }

})
