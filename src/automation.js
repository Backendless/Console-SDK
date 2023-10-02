import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flows    : '/api/app/:appId/automation/management/flow',
  flow     : '/api/app/:appId/automation/management/flow/:id',
  flowState: '/api/app/:appId/automation/management/flow/:id/:state',
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
})
