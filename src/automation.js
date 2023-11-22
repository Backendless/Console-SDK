import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flows         : '/api/app/:appId/automation/flow',
  flow          : '/api/app/:appId/automation/flow/:id',
  newFlowVersion: '/api/app/:appId/automation/flow/:id/new-version',
  flowState     : '/api/app/:appId/automation/flow/:id/:state',
  flowGroupName : '/api/app/:appId/automation/flow/versions/:groupId/name',
  flowGroup     : '/api/app/:appId/automation/flow/versions/:groupId',
})

export default req => ({

  getFlows(appId) {
    return req.automation.get(routes.flows(appId))
  },

  getFlow(appId, id) {
    return req.automation.get(routes.flow(appId, id))
  },

  createFlow(appId, flow) {
    return req.automation.post(routes.flows(appId), flow)
  },

  updateFlow(appId, flow) {
    return req.automation.put(routes.flow(appId, flow.id), flow)
  },

  deleteFlow(appId, id) {
    return req.automation.delete(routes.flow(appId, id))
  },

  enableFlow(appId, id) {
    return req.automation.post(routes.flowState(appId, id, 'enable'))
  },

  pauseFlow(appId, id) {
    return req.automation.post(routes.flowState(appId, id, 'pause'))
  },

  terminateFlow(appId, id) {
    return req.automation.post(routes.flowState(appId, id, 'terminate'))
  },

  createNewVersion(appId, id) {
    return req.automation.post(routes.newFlowVersion(appId, id))
  },

  editFlowsGroupName(appId, groupId, name) {
    return req.automation.put(routes.flowGroupName(appId, groupId), { name })
  },

  deleteFlowsGroup(appId, groupId) {
    return req.automation.delete(routes.flowGroup(appId, groupId))
  },
})
