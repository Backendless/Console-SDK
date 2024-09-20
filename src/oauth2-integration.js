import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationConnections      : '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionById   : '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
  integrationConnectionName   : '/api/node-server/manage/app/:appId/integration/connections/:connectionId/name',
  integrationConnectionsUsages: '/api/node-server/manage/app/:appId/integration/connections/usages',
  integrationConnectionURL    : '/api/node-server/manage/app/:appId/integration/connection/oauth/url',
})

export default req => ({
  getAllIntegrationConnections(appId) {
    return req.get(routes.integrationConnections(appId))
  },

  deleteIntegrationConnectionById(appId, connectionId) {
    return req.delete(routes.integrationConnectionById(appId, connectionId))
  },

  updateIntegrationConnectionName(appId, connectionId, updatedName) {
    return req.put(routes.integrationConnectionName(appId, connectionId), { updatedName })
  },

  getConnectionsUsages(appId) {
    return req.get(routes.integrationConnectionsUsages(appId))
  },

  getConnectionURL({ appId, serviceName, integrationName, serviceId }) {
    return req.get(routes.integrationConnectionURL(appId))
      .query({ serviceName, integrationName, serviceId })
  },
})
