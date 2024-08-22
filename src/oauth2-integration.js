import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  connectionURL: '/:appId/console/integration/connection/oauth/url',
  integrationConnections: '/:appId/console/integration/connections/',
  integrationConnectionById: '/:appId/console/integration/connections/:connectionId',
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
