import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flowManagement: '/console/automation/management/:workspaceId/flow/:id',
  flowState     : '/console/automation/management/:workspaceId/flow/:id/:state',
  workspace     : '/console/automation/management/workspace/:id',
})

export default req => ({
  getWorkspaces() {
    return req.automation.get(routes.workspace())
  },

  getWorkspace(id) {
    return req.automation.get(routes.workspace(id))
  },

  createWorkspace(name) {
    return req.automation.post(routes.workspace(), { name })
  },

  updateWorkspace(id, name) {
    return req.automation.put(routes.workspace(id), { name })
  },

  deleteWorkspace(id) {
    return req.automation.delete(routes.workspace(id))
  },

  getFlows(workspaceId) {
    return req.automation.get(routes.flowManagement(workspaceId))
  },

  getFlow(workspaceId, id) {
    return req.automation.get(routes.flowManagement(workspaceId, id))
  },

  createFlow(workspaceId, flow) {
    return req.automation.post(routes.flowManagement(workspaceId), flow)
  },

  updateFlow(workspaceId, flow) {
    return req.automation.put(routes.flowManagement(workspaceId, flow.id), flow)
  },

  deleteFlow(workspaceId, id) {
    return req.automation.delete(routes.flowManagement(workspaceId, id))
  },

  enableFlow(workspaceId, id) {
    return req.automation.post(routes.flowState(workspaceId, id, 'enable'))
  },
})
