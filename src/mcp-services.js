/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrationMcpClient          : '/api/node-server/manage/app/:appId/integration/mcp/clients',
  integrationMcpClientValidate  : '/api/node-server/manage/app/:appId/integration/mcp/clients/validate',
  integrationMcpClientCheckOAuth: '/api/node-server/manage/app/:appId/integration/mcp/clients/check-oauth',
  pingMcpClient                 : '/api/node-server/public/app/:appId/mcp/:mcpServerName',
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

  updateMcpClient(appId, data) {
    return req.nodeAPI.put(routes.integrationMcpClient(appId), data)
  },

  validateMcpConnection(appId, data) {
    return req.nodeAPI.post(routes.integrationMcpClientValidate(appId), data)
  },

  checkOAuthForMCPClient(appId, data) {
    return req.nodeAPI.post(routes.integrationMcpClientCheckOAuth(appId), data)
  },

  pingMcpClient(appId, mcpClient, data) {
    return req.nodeAPI.post(routes.pingMcpClient(appId, mcpClient), data)
  }
})
