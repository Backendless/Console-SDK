/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  flowManagement: '/console/automation/management/flow/:id',
})

export default req => ({
  getFlows() {
    return req.automation.get(routes.flowManagement())
  },

  getFlow(id) {
    return req.automation.get(routes.flowManagement(id))
  },

  createFlow(flow) {
    return req.automation.post(routes.flowManagement(), flow)
  },

  updateFlow(flow) {
    return req.automation.put(routes.flowManagement(flow.id), flow)
  },

  deleteFlow(id) {
    return req.automation.delete(routes.flowManagement(id))
  },
})
