import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  visualizations: '/:appId/console/visualizations',
  visualization: '/:appId/console/visualizations/:visualizationId'
})

export default req => ({
  getVisualizations(appId) {
    return req.get(routes.visualizations(appId))
  },

  createVisualization(appId, visualizationId, visualization) {
    return req.post(routes.visualization(appId, visualizationId), visualization)
  },

  updateVisualization(appId, visualizationId, visualization) {
    return req.put(routes.visualization(appId, visualizationId), visualization)
  },

  deleteVisualizations(appId, visualizationIds) {
    return req.delete(routes.visualizations(appId)).query({ visualizationIds })
  },
})
