import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flows             : '/api/app/:appId/automation/flow/version',
  flowsElements     : '/api/app/:appId/automation/flows/versions/elements',
  flow              : '/api/app/:appId/automation/flow/version/:versionId',
  newFlowVersion    : '/api/app/:appId/automation/flow/version/:versionId/new-version',
  flowState         : '/api/app/:appId/automation/flow/version/:versionId/:state',
  flowGroupName     : '/api/app/:appId/automation/flow/:flowId/name',
  flowDescription   : '/api/app/:appId/automation/flow/version/:versionId/description',
  flowGroup         : '/api/app/:appId/automation/flow/:flowId',
  flowVersionMetrics: '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/version-metrics',
  stepsMetrics      : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/step-metrics',
  flowSlA           : '/api/app/:appId/automation/flow/:flowId/version/:versionId/sla/goals',
  flowSlAGoal       : '/api/app/:appId/automation/flow/:flowId/version/:versionId/sla/goals/:id',
  SLACalendars      : '/api/app/:appId/automation/flow/sla/calendar',
  SLACalendar       : '/api/app/:appId/automation/flow/sla/calendar/:id',
  // eslint-disable-next-line max-len
  errorHandlerAnalytics: '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/error-handler/:errorHandlerId/recorded-errors',
  cloudCodeElements    : '/api/app/:appId/automation/flow/cloud-code/elements',
  startDebugSession    : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/start-session',
  stopDebugSession     : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/stop-session',
  testMonitorHistory   : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/history',
  // eslint-disable-next-line max-len
  debugExecutionContext: '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/execution-context',
  runElementInDebugMode: '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/run/element/:elementId',

  registerAIAssistant: '/api/app/:appId/automation/ai/assistants/register',
  aiAssistants       : '/api/app/:appId/automation/ai/assistants',
  aiAssistant        : '/api/app/:appId/automation/ai/assistants/:id',

  flowLogs: '/api/app/:appId/automation/flow/version/:id/logs',
})

export default req => ({

  getFlows(appId) {
    return req.automation.get(routes.flows(appId))
  },

  getFlowsElements(appId, elementType, elementSubtype) {
    return req.automation.get(routes.flowsElements(appId)).query({ elementType, elementSubtype })
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

  updateFlowDescription(appId, versionId, description) {
    return req.put(routes.flowDescription(appId, versionId, description), { description })
  },

  getFlowVersionMetrics(appId, flowId, versionId, fromDate, toDate) {
    return req.automation.get(routes.flowVersionMetrics(appId, flowId, versionId))
      .query({ fromDate, toDate })
  },

  getFlowStepsMetrics(appId, flowId, versionId, fromDate, toDate) {
    return req.automation.get(routes.stepsMetrics(appId, flowId, versionId))
      .query({ fromDate, toDate })
  },

  loadErrorHandlerAnalytics(appId, flowId, versionId, errorHandlerId, fromDate, toDate) {
    return req.automation.get(routes.errorHandlerAnalytics(appId, flowId, versionId, errorHandlerId))
      .query({ fromDate, toDate })
  },

  getCloudCodeElements(appId) {
    return req.automation.get(routes.cloudCodeElements(appId))
  },

  startDebugSession(appId, flowId, versionId, forceStart) {
    return req.automation.post(routes.startDebugSession(appId, flowId, versionId))
      .query({ forceStart })
  },

  stopDebugSession(appId, flowId, versionId, sessionId) {
    return req.automation.delete(routes.stopDebugSession(appId, flowId, versionId))
      .query({ sessionId })
  },

  loadTestMonitorHistory(appId, flowId, versionId, sessionId) {
    return req.automation.get(routes.testMonitorHistory(appId, flowId, versionId))
      .query({ sessionId })
  },

  clearTestMonitorHistory(appId, flowId, versionId, sessionId) {
    return req.automation.delete(routes.testMonitorHistory(appId, flowId, versionId))
      .query({ sessionId })
  },

  loadDebugExecutionContext(appId, flowId, versionId, sessionId) {
    return req.automation.get(routes.debugExecutionContext(appId, flowId, versionId))
      .query({ sessionId })
  },

  updateDebugExecutionContext(appId, flowId, versionId, context, sessionId) {
    return req.automation.put(routes.debugExecutionContext(appId, flowId, versionId), context)
      .query({ sessionId })
  },

  runElementInDebugMode(appId, flowId, versionId, elementId, body, sessionId) {
    return req.automation.post(routes.runElementInDebugMode(appId, flowId, versionId, elementId), body, sessionId)
      .query({ sessionId })
  },

  getFlowSLAGoals(appId, flowId, versionId) {
    return req.automation.get(routes.flowSlA(appId, flowId, versionId))
  },

  createFlowSLAGoal(appId, flowId, versionId, data) {
    return req.automation.post(routes.flowSlA(appId, flowId, versionId), data)
  },

  updateFlowSLAGoal(appId, flowId, versionId, data, id) {
    return req.automation.put(routes.flowSlAGoal(appId, flowId, versionId, id), data)
  },

  deleteFlowSLAGoal(appId, flowId, versionId, id) {
    return req.automation.delete(routes.flowSlAGoal(appId, flowId, versionId, id))
  },

  getSLACalendars(appId) {
    return req.automation.get(routes.SLACalendars(appId))
  },

  createSLACalendar(appId, data) {
    return req.automation.post(routes.SLACalendars(appId), data)
  },

  updateSLACalendar(appId, data, id) {
    return req.automation.put(routes.SLACalendar(appId, id), data)
  },

  deleteSLACalendar(appId, id) {
    return req.automation.delete(routes.SLACalendar(appId, id))
  },

  registerAIAssistant(appId, openAiAssistantId) {
    return req.automation.post(routes.registerAIAssistant(appId), { openAiAssistantId })
  },

  createAIAssistant(appId, assistant) {
    return req.automation.post(routes.aiAssistants(appId), assistant)
  },

  updateAIAssistant(appId, assistant) {
    return req.automation.put(routes.aiAssistant(appId, assistant.id), assistant)
  },

  deleteAIAssistant(appId, assistantId) {
    return req.automation.delete(routes.aiAssistant(appId, assistantId))
  },

  getAIAssistants(appId) {
    return req.automation.get(routes.aiAssistants(appId))
  },

  loadFlowLogs(appId, versionId, data) {
    return req.automation.post(routes.flowLogs(appId, versionId), data)
  }
})
