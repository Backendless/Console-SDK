import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  apps         : '/console/applications',
  appFromZip   : '/console/applications/from-zip',
  appFromZipURL: '/console/applications/from-zip-url',

  app          : '/:appId/console/application',
  appDevOptions: '/:appId/console/developer/options',

  appReset       : '/:appId/console/appreset',
  appClone       : '/:appId/console/cloneApp',
  appCloneProcess: '/:appId/console/cloneApp/:processId',
  appTransfer    : '/:appId/console/application/transfer',

  appsInfo   : '/console/apps-info',
  appInfo    : '/:appId/console/app-info',
  appInfoLogo: '/:appId/console/app-info/logos',

  suggestedGeneratedDomains: '/console/applications/suggested-generated-domains'
})

export default req => ({
  createApp(app, query) {
    return req.post(routes.apps(), app).query(query)
  },

  createAppFromZIP(app) {
    return req.post(routes.appFromZip(), app)
  },

  createAppFromZipUrl(data) {
    return req.post(routes.appFromZipURL(), data)
  },

  getApps(zone) {
    return req.get(routes.apps()).query({ zone })
  },

  resetApp(appId, resets) {
    return req.post(routes.appReset(appId), resets)
  },

  renameApp(appId, appName) {
    return req.put(routes.app(appId), { appName })
  },

  deleteApp(appId) {
    return req.delete(routes.app(appId))
  },

  cloneApp(appId, newApp) {
    return req.post(routes.appClone(appId), newApp)
  },

  generateAppZIP(appId) {
    return req.post(routes.appTransfer(appId))
  },

  getCloningAppStatus(appId, processId) {
    return req.get(routes.appCloneProcess(appId, processId))
  },

  loadAppsMenuItems() {
    return req.get('/console/applications/menu-items')
  },

  loadAppFavorites(appId, devId) {
    return req.get('/console/applications/app-favorites').query({ appId, devId })
  },

  loadAppsInfo(appsIds) {
    return req.get(routes.appsInfo()).query({ appsIds })
  },

  updateAppInfo(appId, info) {
    return req.post(routes.appInfo(appId), info)
  },

  updateAppLogo(appId, logo) {
    return req.post(routes.appInfoLogo(appId), logo)
  },

  generateSubdomains(zone) {
    return req.get(routes.suggestedGeneratedDomains()).query({ zone })
  },

  getAppDevOptions(appId) {
    return req.get(routes.appDevOptions(appId))
  },

  updateAppDevOptions(appId, options) {
    return req.put(routes.appDevOptions(appId), options)
  },

})
