/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  containers: '/api/app/:appId/quick-apps/containers',
  container : '/api/app/:appId/quick-apps/containers/:containerId',
  deploy    : '/api/app/:appId/quick-apps/deploy/:containerId',
})

export default req => ({

  loadContainers(appId) {
    return req.get(routes.containers(appId))
  },

  loadContainer(appId, containerId) {
    return req.get(routes.container(appId, containerId))
  },

  createContainer(appId, data) {
    return req.post(routes.containers(appId), data)
  },

  deleteContainer(appId, containerId) {
    return req.delete(routes.containers(appId, containerId))
  },

  deployContainer(appId, containerId, data) {
    return req.post(routes.deploy(appId, containerId), data)
  },

})
