import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flows             : '/api/app/:appId/automation/flow/version',
  flowsTriggers     : '/api/app/:appId/automation/flow/all-versions-with-callback-triggers',
  flow              : '/api/app/:appId/automation/flow/version/:versionId',
  newFlowVersion    : '/api/app/:appId/automation/flow/version/:versionId/new-version',
  flowState         : '/api/app/:appId/automation/flow/version/:versionId/:state',
  flowGroupName     : '/api/app/:appId/automation/flow/:flowId/name',
  flowGroup         : '/api/app/:appId/automation/flow/:flowId',
  flowVersionMetrics: '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/version-metrics',
  stepsMetrics      : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/step-metrics',
  cloudCodeElements : '/api/app/:appId/automation/flow/cloud-code/elements',
})

export default req => ({

  getFlows(appId) {
    return req.automation.get(routes.flows(appId))
  },

  getFlowsTriggers(appId) {
    return req.automation.get(routes.flowsTriggers(appId))
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

  getFlowVersionMetrics(appId, flowId, versionId) {
    return req.automation.get(routes.flowVersionMetrics(appId, flowId, versionId))
  },

  getFlowStepsMetrics(appId, flowId, versionId) {
    return req.automation.get(routes.stepsMetrics(appId, flowId, versionId))
  },

  getCloudCodeElements(appId) {
    return req.automation.get(routes.cloudCodeElements(appId))
  },
})
