import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationConnections      : '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionsById  : '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
  integrationConnectionName   : '/api/node-server/manage/app/:appId/integration/connections/:connectionId/name',
  integrationConnectionsUsages: '/api/node-server/manage/app/:appId/integration/connections/usages',
  integrationConnectionURL    : '/api/node-server/manage/app/:appId/integration/connection/oauth/url',
  integrationConnectionToken  : '/api/node-server/manage/app/:appId/integration/connection/:connectionId/token',
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
})
