import urls from './urls'

export default req => ({
  createApp({ appName, refCode, blueprintId, region }, domain) {
    let url = '/console/applications'

    if (domain) {
      url = `${window.location.protocol}//${domain}${url}`
    }

    return req.post(url, { appName, refCode, region }).query({ blueprintId })
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

  updateAppInfo(appId, info) {
    return req.post(urls.appInfo(appId), info)
  },

  loadAppInfo(appId) {
    return req.get(urls.appInfo(appId))
  },

  updateAppLogo(appId, logo) {
    return req.post(`${urls.appInfo(appId)}/logos`, logo)
  }
})
