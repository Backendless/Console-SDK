import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationConnections      : '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionsById  : '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
  integrationConnectionsUsages: '/api/node-server/manage/app/:appId/integration/connections/usages',
  integrationConnectionURL    : '/api/node-server/manage/app/:appId/integration/connection/oauth/url',
  integrationConnectionById   : '/api/node-server/manage/app/:appId/integration/connection/:connectionId',
})

export default req => ({
  getAllIntegrationConnections(appId) {
    return req.get(routes.integrationConnections(appId))
  },

  getIntegrationConnectionAccessToken(appId, connectionId) {
    return req.get(routes.integrationConnectionById(appId, connectionId))
  },

  deleteIntegrationConnectionById(appId, connectionId) {
    return req.delete(routes.integrationConnectionsById(appId, connectionId))
  },

  getConnectionsUsages(appId) {
    return req.get(routes.integrationConnectionsUsages(appId))
  },

  getConnectionURL({ appId, serviceName, integrationName, serviceId }) {
    return req.get(routes.integrationConnectionURL(appId))
      .query({ serviceName, integrationName, serviceId })
  },
})
