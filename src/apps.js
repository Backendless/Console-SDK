import urls from './urls'

export default req => ({
  createApp({ appName, refCode, blueprintId, zone }) {
    return req.post('/console/applications', { appName, refCode }).query({ blueprintId, zone })
  },

  getApps() {
    return req.get('/console/applications')
  },

  resetApp(appId, resets) {
    return req.post(`${urls.appConsole(appId)}/appreset`, resets)
  },

  renameApp(appId, appName) {
    return req.put(`${urls.appConsole(appId)}/application`, { appName })
  },

  deleteApp(appId) {
    return req.delete(`${urls.appConsole(appId)}/application`)
  },

  cloneApp(appId, newAppName) {
    return req.post(`${urls.appConsole(appId)}/cloneApp`).query({ newAppName })
  },

  getCloningAppStatus(appId, processId) {
    return req.get(`${urls.appConsole(appId)}/cloneApp/${processId}`)
  },

  updateAppInfo(appId, info) {
    return req.post(urls.appInfo(appId), info)
  },

  loadAppsInfo(appsIds) {
    return req.get('/console/apps-info').query({ appsIds })
  },

  updateAppLogo(appId, logo) {
    return req.post(`${urls.appInfo(appId)}/logos`, logo)
  },

  generateSubdomains() {
    return req.get('/console/applications/suggested-generated-domains')
  }
})
