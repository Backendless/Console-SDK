import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationConnections      : '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionsById  : '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
  integrationConnectionName   : '/api/node-server/manage/app/:appId/integration/connections/:connectionId/name',
  integrationConnectionsUsages: '/api/node-server/manage/app/:appId/integration/connections/usages',
  integrationConnectionURL    : '/api/node-server/manage/app/:appId/integration/connection/oauth/url',
  integrationConnectionToken  : '/api/node-server/manage/app/:appId/integration/connection/:connectionId/token',

  sharedServices: '/api/node-server/manage/app/:appId/shared-extension',

  integrationParamDictionary: '/api/node-server/manage/app/:appId/integration/block/:name/param-dictionary/:dictionary',

  integrationSharedProductStatus : '/api/node-server/manage/integration/shared/:productId/status',
  integrationSharedProductInstall: '/api/node-server/manage/integration/shared/:productId/install'
})

export default req => ({
  getAllIntegrationConnections(appId) {
    return req.get(routes.integrationConnections(appId))
  },

  getIntegrationConnectionAccessToken(appId, connectionId) {
    return req.get(routes.integrationConnectionToken(appId, connectionId))
  },

  deleteIntegrationConnectionById(appId, connectionId) {
    return req.delete(routes.integrationConnectionsById(appId, connectionId))
  },

  updateIntegrationConnectionName(appId, connectionId, updatedName) {
    return req.put(routes.integrationConnectionName(appId, connectionId), { updatedName })
  },

  getConnectionsUsages(appId) {
    return req.get(routes.integrationConnectionsUsages(appId))
  },

  getConnectionURL({ appId, serviceName, integrationName, serviceId, serviceType }) {
    return req.get(routes.integrationConnectionURL(appId))
      .query({ serviceName, integrationName, serviceId, serviceType })
  },

  getSharedServices(appId) {
    return req.automation.get(routes.sharedServices(appId))
  },

  getParamDictionary(appId, name, dictionary, payload) {
    return req.post(routes.integrationParamDictionary(appId, name, dictionary), payload)
  },

  getProductSharedStatus(productId) {
    return req.get(routes.integrationSharedProductStatus(productId))
  },

  installProductAsSharedService({ productId, versionId, configs }) {
    return req.post(routes.integrationSharedProductInstall(productId), { versionId, configs })
  }
})
