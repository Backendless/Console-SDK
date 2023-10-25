import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  service      : '/:appId/console/cachecontrol/:service',
  serviceTarget: '/:appId/console/cachecontrol/:service/:target',
})

export default req => ({

  loadAllServiceItems(appId, service) {
    return req.get(routes.service(appId, service))
  },

  loadServiceItem(appId, service, target) {
    return req.get(routes.serviceTarget(appId, service, target))
  },

  createServiceItem(appId, service, target, data) {
    return req.post(routes.serviceTarget(appId, service, target), data)
  },

  updateServiceItem(appId, service, target, data) {
    return req.put(routes.serviceTarget(appId, service, target), data)
  },

  deleteServiceItem(appId, service, target) {
    return req.delete(routes.serviceTarget(appId, service, target))
  },

})
