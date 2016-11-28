import urls from './urls'

const enrichApp = ({ appId, appName, ...app }) => ({
  ...app,
  id: appId,
  name: appName
})

export default req => ({
  createApp(appName) {
    return req.post('/console/applications', { appName }).then(enrichApp)
  },

  getApps() {
    return req.get('/console/applications').then(apps => apps.map(enrichApp))
  },

  resetApp(appId, resets) {
    return req.post(`${urls.appConsole(appId)}/appreset`, resets)
  },

  deleteApp(appId, payment = false) {
    return req.delete(`${urls.appConsole(appId)}/application`).query({ payment })
  },


})
