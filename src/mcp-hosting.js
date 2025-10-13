import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  hostingMcpServers     : '/api/node-server/manage/app/:appId/mcp/hosting',
  hostingMcpServerState : '/api/node-server/manage/app/:appId/mcp/hosting/:state',
  hostingMcpServerStatus: '/api/node-server/manage/app/:appId/mcp/hosting/:mcpServerName/status',
})

export default req => ({
  getHostingMcpServers(appId) {
    return req.nodeAPI.get(routes.hostingMcpServers(appId))
  },

  getHostingMcpServerStatus(appId, mcpServerName) {
    return req.nodeAPI.get(routes.hostingMcpServerStatus(appId, mcpServerName))
  },

  createHostingMcpServer(appId, data) {
    return req.nodeAPI.post(routes.hostingMcpServers(appId), data)
  },

  redeployHostingMcpServer(appId, data) {
    return req.nodeAPI.put(routes.hostingMcpServers(appId), data)
  },

  changeHostingMcpServerState(appId, state, data) {
    return req.nodeAPI.put(routes.hostingMcpServerState(appId, state), data)
  },

  deleteHostingMcpServer(appId, data) {
    return req.nodeAPI.delete(routes.hostingMcpServers(appId), data)
  },
})
