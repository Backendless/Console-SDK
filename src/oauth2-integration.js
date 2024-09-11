import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  connectionURL            : '/api/node-server/api/app/:appId/integration/connection/oauth/url',
  connectionsUsages        : '/api/node-server/manage/app/:appId/integration/connections/usages',
  integrationConnections   : '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionById: '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
})

export default req => ({
  getAllIntegrationConnections(appId) {
    return req.get(routes.integrationConnections(appId))
  },

  deleteIntegrationConnectionById(appId, connectionId) {
    return req.delete(routes.integrationConnectionById(appId, connectionId))
  },

  getConnectionURL({ appId, serviceName, integrationName, serviceId }) {
    return req.get(routes.connectionURL(appId))
      .query({ serviceName, integrationName, serviceId })
  },

  getConnectionsUsages(appId) {
    return req.get(routes.connectionsUsages(appId))
  }
})
