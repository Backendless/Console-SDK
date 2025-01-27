/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationConnections      : '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionsById  : '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
  integrationConnectionName   : '/api/node-server/manage/app/:appId/integration/connections/:connectionId/name',
  integrationConnectionsUsages: '/api/node-server/manage/app/:appId/integration/connections/usages',
  integrationConnectionURL    : '/api/node-server/manage/app/:appId/integration/connection/oauth/url',
  integrationConnectionToken  : '/api/node-server/manage/app/:appId/integration/connection/:connectionId/token',

  elementParamDictionary: '/api/node-server/manage/app/:appId/integration/block/:serviceName/param-dictionary/:dictionaryName',

  sharedElements : '/api/node-server/manage/integration/shared/elements',

  sharedProductStatus : '/api/node-server/manage/integration/shared/product/:productId/status',
  sharedProductInstall: '/api/node-server/manage/integration/shared/product/:productId/install'
})

export default req => ({
  getAllIntegrationConnections(appId) {
    return req.nodeAPI.get(routes.integrationConnections(appId))
  },

  getIntegrationConnectionAccessToken(appId, connectionId) {
    return req.nodeAPI.get(routes.integrationConnectionToken(appId, connectionId))
  },

  deleteIntegrationConnectionById(appId, connectionId) {
    return req.nodeAPI.delete(routes.integrationConnectionsById(appId, connectionId))
  },

  updateIntegrationConnectionName(appId, connectionId, updatedName) {
    return req.nodeAPI.put(routes.integrationConnectionName(appId, connectionId), { updatedName })
  },

  getConnectionsUsages(appId) {
    return req.nodeAPI.get(routes.integrationConnectionsUsages(appId))
  },

  getConnectionURL({ appId, serviceName, serviceId }) {
    return req.nodeAPI.get(routes.integrationConnectionURL(appId))
      .query({ serviceName, serviceId })
  },

  getSharedElements() {
    return req.nodeAPI.get(routes.sharedElements())
  },

  getElementParamDictionary(appId, serviceName, dictionaryName, payload) {
    return req.nodeAPI.post(routes.elementParamDictionary(appId, serviceName, dictionaryName), payload)
  },

  getSharedProductStatus(productId) {
    return req.nodeAPI.get(routes.sharedProductStatus(productId))
  },

  installSharedProduct({ productId, versionId, configs }) {
    return req.nodeAPI.post(routes.sharedProductInstall(productId), { versionId, configs })
  }
})
