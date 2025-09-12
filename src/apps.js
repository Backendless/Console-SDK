/* eslint-disable max-len */

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

class Apps {
  constructor(req) {
    this.req = req
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

  /**
   * @aiToolName Get Applications
   * @category Apps Management
   * @description Retrieves a list of applications for the specified zone.
   * @paramDef {"type":"string","name":"zone","label":"Zone","description":"The deployment zone. Valid values: 'US' or 'EU'","required":true}
   * @sampleResult [{"version":"6.0.0","created":1700000000000,"subscriptionId":null,"originDomains":"*","customDomains":[],"showKitApiKey":null,"dbVersion":165,"lastDayOfUse":1700000001000,"ownerDeveloperId":"DEV-ID-123","zoneId":1,"oldGeoServiceEnabled":false,"type":"general","metaInfo":{"source":null,"enabledPanicModes":[],"compliance":{"hipaa":null},"mongoDbVersion":10,"useOldTableRelationsFormat":false},"id":"APP-ID-123","name":"MyApp"},{"version":"6.0.0","created":1700000002000,"subscriptionId":"SUB-456","originDomains":"*","customDomains":[],"showKitApiKey":null,"dbVersion":165,"lastDayOfUse":1700000003000,"ownerDeveloperId":"DEV-ID-123","zoneId":1,"oldGeoServiceEnabled":false,"type":"general","metaInfo":{"source":null,"enabledPanicModes":[],"compliance":{"hipaa":null},"mongoDbVersion":10,"useOldTableRelationsFormat":false},"id":"APP-ID-456","name":"TestApp"}]
   */
  getApps(zone) {
    return this.req.get(routes.apps()).query({ zone })
  }

  resetApp(appId, resets) {
    return this.req.post(routes.appReset(appId), resets)
  }

  /**
   * @aiToolName Rename Application
   * @category Apps Management
   * @description Changes the name of an existing application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application to rename","required":true}
   * @paramDef {"type":"string","name":"appName","label":"New App Name","description":"The new name for the application","required":true}
   * @sampleResult {"appName":"RenamedApp","appId":"APP-ID-123","version":"6.0.0","created":1700000000000,"subscriptionId":"SUB-456","originDomains":"*","customDomains":[],"showKitApiKey":null,"dbVersion":165,"lastDayOfUse":1700000001000,"ownerDeveloperId":"DEV-ID-123","zoneId":1,"oldGeoServiceEnabled":false,"type":"general","metaInfo":{"source":null,"enabledPanicModes":[],"compliance":{"hipaa":null},"mongoDbVersion":10,"useOldTableRelationsFormat":false}}
   */
  renameApp(appId, appName) {
    return this.req.put(routes.app(appId), { appName })
  }

  /**
   * @aiToolName Delete Application
   * @category Apps Management
   * @description Permanently deletes an application and all its data.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application to delete","required":true}
   * @sampleResult {"success":true}
   */
  deleteApp(appId) {
    return this.req.delete(routes.app(appId))
  }

  cloneApp(appId, newApp) {
    return this.req.post(routes.appClone(appId), newApp)
  }

  /**
   * @aiToolName Generate App ZIP
   * @category Apps Management
   * @description Generates a ZIP archive of the application for backup or transfer.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application to archive","required":true}
   * @sampleResult "Application transfer started. At the end, you will receive an email with the link to download zip file."
   */
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

  /**
   * @aiToolName Load Apps Info
   * @category Apps Management
   * @description Retrieves detailed information for multiple applications.
   * @paramDef {"type":"array","name":"appsIds","label":"App IDs","description":"List of application identifiers","required":true}
   * @sampleResult [{"id":"APP-ID-123","name":"MyApp","version":"6.0.0","created":1700000000000},{"id":"APP-ID-456","name":"TestApp","version":"6.0.0","created":1700000001000}]
   */
  loadAppsInfo(appsIds) {
    return this.req.get(routes.appsInfo()).query({ appsIds })
  }

  /**
   * @typedef {Object} updateAppInfo__info
   * @property {string} appName - The new name for the application
   * @property {string} devEmail - Developer email address
   */

  /**
   * @aiToolName Update App Info
   * @category Apps Management
   * @description Updates the information and metadata of an application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"updateAppInfo__info","name":"info","label":"App Information","description":"Object containing updated application information","required":true}
   * @sampleResult {"appId":"APP-ID-123","devEmail":"developer@example.com","appName":"UpdatedAppName"}
   */
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

export default req => new Apps(req)
