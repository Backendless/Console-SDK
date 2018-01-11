import urls from './urls'

const enrichApp = ({ appId, appName, ...app }) => ({
  ...app,
  id  : appId,
  name: appName
})

export default req => ({
  createApp({ appName, refCode }) {
    return req.post('/console/applications', { appName, refCode }).then(enrichApp)
  },

  getApps() {
    return req.get('/console/applications')
  },

  resetApp(appId, resets) {
    return req.post(`${urls.appConsole(appId)}/appreset`, resets)
  },

  deleteApp(appId, payment = false) {
    return req.delete(`${urls.appConsole(appId)}/application`).query({ payment })
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
