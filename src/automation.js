/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flows                   : '/api/app/:appId/automation/flow/version',
  flowsWithElements       : '/api/app/:appId/automation/flow/version/with-elements',
  flowsWithElementsDetails: '/api/app/:appId/automation/flow/version/with-elements-details',
  flowsElements           : '/api/app/:appId/automation/flows/versions/elements',
  flow                    : '/api/app/:appId/automation/flow/version/:versionId',
  flowSchedule            : '/api/app/:appId/automation/flow/version/:versionId/schedule',
  newFlowVersion          : '/api/app/:appId/automation/flow/version/:versionId/new-version',
  flowState               : '/api/app/:appId/automation/flow/version/:versionId/:state',
  sharedMemory            : '/api/app/:appId/automation/flow/version/:versionId/shared-memory',
  flowGroupName           : '/api/app/:appId/automation/flow/:flowId/name',
  flowDescription         : '/api/app/:appId/automation/flow/version/:versionId/description',
  flowGroup               : '/api/app/:appId/automation/flow/:flowId',
  flowVersionAnalytics    : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics',
  flowVersionMetrics      : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/version-metrics',
  stepsMetrics            : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/step-metrics',
  flowInstances           : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/instances/find',
  countInstances          : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/instances/count',
  flowInstance            : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/instances/:executionId',
  flowInstanceInitialData : '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/instances/:executionId/initial-and-static-data',
  stopInstanceExecution   : '/api/app/:appId/automation/flow/:flowId/version/:versionId/instances/:executionId/stop',
  runDebugInstance        : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/instance/run-new',

  elementExecutionInfo: '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/instances/:executionId/element/:elementId',
  flowSlA             : '/api/app/:appId/automation/flow/:flowId/version/:versionId/sla/goals',
  flowSlAGoal         : '/api/app/:appId/automation/flow/:flowId/version/:versionId/sla/goals/:id',
  SLACalendars        : '/api/app/:appId/automation/flow/sla/calendar',
  SLACalendar         : '/api/app/:appId/automation/flow/sla/calendar/:id',

  errorHandlerAnalytics: '/api/app/:appId/automation/flow/:flowId/version/:versionId/analytics/error-handler/:errorHandlerId/recorded-errors',
  customElements       : '/api/node-server/manage/app/:appId/flowrunner/custom-elements',

  flowrunnerAiAgentsProviders: '/api/node-server/manage/flowrunner/ai-agents/providers',

  startDebugSession    : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/start-session',
  stopDebugSession     : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/stop-session',
  testMonitorHistory   : '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/history',
  debugExecutionContext: '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/test-monitor/execution-context',
  runElementInDebugMode: '/api/app/:appId/automation/flow/:flowId/version/:versionId/debug/run/element/:elementId',

  registerAIAssistant: '/api/app/:appId/automation/ai/assistants/register',
  aiAssistants       : '/api/app/:appId/automation/ai/assistants',
  aiAssistant        : '/api/app/:appId/automation/ai/assistants/:id',

  flowLogs          : '/api/app/:appId/automation/flow/version/:id/logs/find',
  flowLogsLevel     : '/api/app/:appId/automation/:flowId/logging/level',
  exportFlowVersion : '/api/app/:appId/automation/flow/version/:id/export',
  importFlowVersion : '/api/app/:appId/automation/flow/:flowId/import',
  createFlowFromJSON: '/api/app/:appId/automation/flow/import',

  realtimeTriggerCallbackUrl: '/api/app/:appId/automation/flow/version/trigger/realtime/callback-url',

  startLearningMode         : '/api/app/:appId/automation/flow/:flowId/version/:id/debug/element/:elementId/learning/start',
  stopLearningMode          : '/api/app/:appId/automation/flow/:flowId/version/:id/debug/element/:elementId/learning/stop',
  getElementsResults        : '/api/app/:appId/automation/flow/:flowId/version/:id/debug/element/results',
  getElementsLearningResults: '/api/app/:appId/automation/flow/:flowId/version/:id/debug/element/learning/all-results',
  getElementLearningResult  : '/api/app/:appId/automation/flow/:flowId/version/:id/debug/element/:elementId/learning/result',

  installFlowProduct  : '/api/app/:appId/automation/flow/marketplace/install/:productId',
  uninstallFlowProduct: '/api/app/:appId/automation/flow/marketplace/uninstall/:productId',

  createSubFlow : '/api/app/:appId/automation/version/:versionId/subflow',
  getSubFlowByID: '/api/app/:appId/automation/version/:versionId/subflow/:subFlowId',

  updateSubFlowName             : '/api/app/:appId/automation/version/:versionId/subflow/:subFlowId/name',
  updateSubFlowByID             : '/api/app/:appId/automation/version/:versionId/subflow/:subFlowId',
  deleteSubFlowByID             : '/api/app/:appId/automation/version/:versionId/subflow/:subFlowId',
  getSubFlows                   : '/api/app/:appId/automation/version/:versionId/subflow',
  getSubFlowsWithElements       : '/api/app/:appId/automation/version/:versionId/subflow/with-elements',
  getSubFlowsWithElementsDetails: '/api/app/:appId/automation/version/:versionId/subflow/with-elements-details',
})

export default req => ({

  getFlows(appId) {
    return req.automation.get(routes.flows(appId))
  },

  getFlowsElements(appId, elementType, elementSubtype) {
    return req.automation.get(routes.flowsElements(appId)).query({ elementType, elementSubtype })
  },

  getFlowsWithElements(appId) {
    return req.automation.get(routes.flowsWithElements(appId))
  },

  getFlowsWithElementsDetails(appId, status) {
    return req.automation.get(routes.flowsWithElementsDetails(appId))
      .query({ status })
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

  getFlowInstances(appId, flowId, versionId, body) {
    return req.automation.post(routes.flowInstances(appId, flowId, versionId), body)
  },

  getFlowInstanceInitialData(appId, flowId, versionId, executionId) {
    return req.automation.get(routes.flowInstanceInitialData(appId, flowId, versionId, executionId))
  },

  runDebugInstance(appId, flowId, versionId, body) {
    return req.automation.post(routes.runDebugInstance(appId, flowId, versionId), body)
  },

  countFlowInstances(appId, flowId, versionId, body) {
    return req.automation.post(routes.countInstances(appId, flowId, versionId), body)
  },

  getFlowInstanceAnalytics(appId, flowId, versionId, executionId) {
    return req.automation.get(routes.flowInstance(appId, flowId, versionId, executionId))
  },

  stopFlowInstanceExecution(appId, flowId, versionId, executionId) {
    return req.automation.post(routes.stopInstanceExecution(appId, flowId, versionId, executionId))
  },

  cleanFlowVersionAnalytics(appId, flowId, versionId) {
    return req.automation.delete(routes.flowVersionAnalytics(appId, flowId, versionId))
  },

  getElementExecutionInfo(appId, flowId, versionId, executionId, elementId) {
    return req.automation.get(routes.elementExecutionInfo(appId, flowId, versionId, executionId, elementId))
  },

  loadErrorHandlerAnalytics(appId, flowId, versionId, errorHandlerId, fromDate, toDate) {
    return req.automation.get(routes.errorHandlerAnalytics(appId, flowId, versionId, errorHandlerId))
      .query({ fromDate, toDate })
  },

  getCustomElements(appId) {
    return req.automation.get(routes.customElements(appId))
  },

  getAiAgentsProviders() {
    return req.nodeAPI.get(routes.flowrunnerAiAgentsProviders())
  },

  getRealtimeTriggerCallbackUrl(appId, scope, hostType, serviceName, modelName, lang) {
    return req.automation.get(routes.realtimeTriggerCallbackUrl(appId))
      .query({ scope, hostType, serviceName, modelName, lang })
  },

  startDebugSession(appId, flowId, versionId, forceStart, fromSubFlowElementId) {
    return req.automation.post(routes.startDebugSession(appId, flowId, versionId))
      .query({ forceStart, fromSubFlowElementId })
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
  },

  getFlowLogsLevel(appId, flowId) {
    return req.automation.get(routes.flowLogsLevel(appId, flowId))
  },

  updateFlowLogsLevel(appId, flowId, data) {
    return req.automation.put(routes.flowLogsLevel(appId, flowId), data)
  },

  exportFlowVersion(appId, versionId) {
    return req.automation.get(routes.exportFlowVersion(appId, versionId))
  },

  importFlowVersion(appId, versionId, flow) {
    return req.automation.post(routes.importFlowVersion(appId, versionId), flow)
  },

  createFlowFromJSON(appId, flow) {
    return req.automation.post(routes.createFlowFromJSON(appId), flow)
  },

  updateFlowSchedule(appId, versionId, data) {
    return req.automation.put(routes.flowSchedule(appId, versionId), data)
  },

  startLearningMode(appId, flowId, versionId, elementId) {
    return req.automation.post(routes.startLearningMode(appId, flowId, versionId, elementId))
  },

  stopLearningMode(appId, flowId, versionId, elementId) {
    return req.automation.post(routes.stopLearningMode(appId, flowId, versionId, elementId))
  },

  getElementsResults(appId, flowId, versionId) {
    return req.automation.get(routes.getElementsResults(appId, flowId, versionId))
  },

  getElementsLearningResults(appId, flowId, versionId) {
    return req.automation.get(routes.getElementsLearningResults(appId, flowId, versionId))
  },

  getElementLearningResult(appId, flowId, versionId, elementId) {
    return req.automation.get(routes.getElementLearningResult(appId, flowId, versionId, elementId))
  },

  installFlowFromMarketplace(appId, productId, version, data) {
    return req.automation.post(routes.installFlowProduct(appId, productId), data).query({ version })
  },

  uninstallFlowProduct(appId, productId, data) {
    return req.automation.delete(routes.uninstallFlowProduct(appId, productId), data)
  },

  updateSharedMemorySettings(appId, versionId, data) {
    return req.automation.put(routes.sharedMemory(appId, versionId), data)
  },

  createSubFlow(appId, versionId, data) {
    return req.automation.post(routes.createSubFlow(appId, versionId), data)
  },

  getSubFlow(appId, versionId, subFlowVersionId) {
    return req.automation.get(routes.getSubFlowByID(appId, versionId, subFlowVersionId))
  },

  updateSubFlow(appId, versionId, subFlowVersionId, data) {
    return req.automation.put(routes.updateSubFlowByID(appId, versionId, subFlowVersionId), data)
  },

  updateSubFlowName(appId, versionId, subFlowId, name) {
    return req.automation.put(routes.updateSubFlowName(appId, versionId, subFlowId), { name })
  },

  deleteSubFlow(appId, versionId, subFlowId) {
    return req.automation.delete(routes.deleteSubFlowByID(appId, versionId, subFlowId))
  },

  getSubFlows(appId, versionId) {
    return req.automation.get(routes.getSubFlows(appId, versionId))
  },

  getSubFlowsWithElements(appId, versionId) {
    return req.automation.get(routes.getSubFlowsWithElements(appId, versionId))
  },

  getSubFlowsWithElementsDetails(appId, versionId) {
    return req.automation.get(routes.getSubFlowsWithElementsDetails(appId, versionId))
  },
})

