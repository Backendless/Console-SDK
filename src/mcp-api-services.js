import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  mcpApiServices   : '/:appId/console/localservices/generic/mcp/list',
  enableApiService : '/:appId/console/localservices/generic/:serviceVersionId/mcp/enable',
  disableApiService: '/:appId/console/localservices/generic/:serviceVersionId/mcp/disable',
})

export default req => ({
  getMcpApiServices(appId) {
    return req.get(routes.mcpApiServices(appId))
  },

  enableMcpApiService(appId, serviceVersionId) {
    return req.put(routes.enableApiService(appId, serviceVersionId))
  },

  disableMcpApiService(appId, serviceVersionId) {
    return req.put(routes.disableApiService(appId, serviceVersionId))
  },
})
