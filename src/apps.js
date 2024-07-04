import urls from './urls'

export default req => ({
  createApp(app, query) {
    return req.post('/console/applications', app).query(query)
  },

  createAppFromZIP(app) {
    return req.post('/console/applications/from-zip', app)
  },

  createAppFromZipUrl(data) {
    return req.post('/console/applications/from-zip-url', data)
  },

  getApps(zone) {
    return req.get('/console/applications').query({ zone })
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

  cloneApp(appId, newApp) {
    return req.post(`${urls.appConsole(appId)}/cloneApp`, newApp)
  },

  generateAppZIP(appId) {
    return req.post(`${urls.appConsole(appId)}/application/transfer`)
  },

  getCloningAppStatus(appId, processId) {
    return req.get(`${urls.appConsole(appId)}/cloneApp/${processId}`)
  },

  updateAppInfo(appId, info) {
    return req.post(urls.appInfo(appId), info)
  },

  loadAppsMenuItems() {
    return req.get('/console/applications/menu-items')
  },

  loadAppFavorites(appId, devId) {
    return req.get('/console/applications/app-favorites').query({ appId, devId })
  },

  loadAppsInfo(appsIds) {
    return req.get('/console/apps-info').query({ appsIds })
  },

  updateAppLogo(appId, logo) {
    return req.post(`${urls.appInfo(appId)}/logos`, logo)
  },

  generateSubdomains(zone) {
    return req.get('/console/applications/suggested-generated-domains').query({ zone })
  }
})
