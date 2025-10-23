/* eslint-disable max-len */

import { prepareRoutes } from './utils/routes'
import BaseService from './base/base-service'

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

class Apps extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'apps'
  }

  createApp(app, query) {
    return this.req.post(routes.apps(), app).query(query)
  }

  createAppFromZIP(app) {
    return this.req.post(routes.appFromZip(), app)
  }

  createAppFromZipUrl(data) {
    return this.req.post(routes.appFromZipURL(), data)
  }

  getApps(zone) {
    return this.req.get(routes.apps()).query({ zone })
  }

  resetApp(appId, resets) {
    return this.req.post(routes.appReset(appId), resets)
  }

  renameApp(appId, appName) {
    return this.req.put(routes.app(appId), { appName })
  }

  deleteApp(appId) {
    return this.req.delete(routes.app(appId))
  }

  cloneApp(appId, newApp) {
    return this.req.post(routes.appClone(appId), newApp)
  }

  generateAppZIP(appId) {
    return this.req.post(routes.appTransfer(appId))
  }

  getCloningAppStatus(appId, processId) {
    return this.req.get(routes.appCloneProcess(appId, processId))
  }

  loadAppsMenuItems() {
    return this.req.get('/console/applications/menu-items')
  }

  loadAppFavorites(appId, devId) {
    return this.req.get('/console/applications/app-favorites').query({ appId, devId })
  }

  loadAppsInfo(appsIds) {
    return this.req.get(routes.appsInfo()).query({ appsIds })
  }

  updateAppInfo(appId, info) {
    return this.req.post(routes.appInfo(appId), info)
  }

  updateAppLogo(appId, logo) {
    return this.req.post(routes.appInfoLogo(appId), logo)
  }

  generateSubdomains(zone) {
    return this.req.get(routes.suggestedGeneratedDomains()).query({ zone })
  }

  getAppDevOptions(appId) {
    return this.req.get(routes.appDevOptions(appId))
  }

  updateAppDevOptions(appId, options) {
    return this.req.put(routes.appDevOptions(appId), options)
  }
}

export default req => Apps.create(req)
