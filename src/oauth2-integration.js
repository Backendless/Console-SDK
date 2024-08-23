import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  connectionURL: '/api/node-server/manage/app/:appId/integration/connection/oauth/url',
  integrationConnections: '/api/node-server/manage/app/:appId/integration/connections',
  integrationConnectionById: '/api/node-server/manage/app/:appId/integration/connections/:connectionId',
})

export default req => ({
  getAllIntegrationConnections(appId) {
    return req.get(routes.integrationConnections(appId))
  },

  deleteIntegrationConnectionById(appId, connectionId) {
    return req.delete(routes.integrationConnectionById(appId, connectionId))
  },

  getConnectionURL(appId, serviceName, integrationName) {
    return req.get(routes.connectionURL(appId))
      .query({ serviceName, integrationName })
  },

})
