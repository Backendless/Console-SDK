import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  visualizations              : '/:appId/console/visualizations',
  visualization               : '/:appId/console/visualizations/:visualizationId',
  visualizationResources      : '/:appId/console/visualizations/:visualizationId/resources',
  publishedUIBuilderContainers: '/:appId/console/visualizations/ui-builder/containers/published',
})

export default req => ({
  getVisualizations(appId) {
    return req.get(routes.visualizations(appId))
  },

  createVisualization(appId, visualization) {
    return req.post(routes.visualizations(appId), visualization)
  },

  updateVisualization(appId, visualizationId, visualization) {
    return req.put(routes.visualization(appId, visualizationId), visualization)
  },

  deleteVisualizations(appId, visualizationIds) {
    return req.delete(routes.visualizations(appId)).query({ visualizationIds })
  },

  updateVisualizationResources(appId, visualizationId) {
    return req.put(routes.visualizationResources(appId, visualizationId))
  },

  loadPublishedUIBuilderContainers(appId) {
    return req.get(routes.publishedUIBuilderContainers(appId))
  }
})
