/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationMcpClient        : '/api/node-server/manage/app/:appId/integration/mcp/clients',
  integrationMcpClientValidate: '/api/node-server/manage/app/:appId/integration/mcp/clients/validate',
})

export default req => ({
  getMcpClients(appId) {
    return req.nodeAPI.get(routes.integrationMcpClient(appId))
  },

  createMcpClient(appId, data) {
    return req.nodeAPI.post(routes.integrationMcpClient(appId), data)
  },

  deleteMcpClient(appId, data) {
    return req.nodeAPI.delete(routes.integrationMcpClient(appId), data)
  },

  updateMcpClient(appId, clientId, data) {
    return req.nodeAPI.put(routes.integrationMcpClient(appId, clientId), data)
  },

  validateMcpConnection(appId, data) {
    return req.nodeAPI.post(routes.integrationMcpClientValidate(appId), data)
  }
})
