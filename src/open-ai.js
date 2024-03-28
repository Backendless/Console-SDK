import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  chatCompletionCreate: '/:appId/console/open-ai/chat-completion/:featureName',
  info                : '/:appId/console/open-ai/info/:featureName',

  dashboardDataVisualizations: '/:appId/console/open-ai/dashboards/data-visualizations',
})

export default req => ({
  createChatCompletion(appId, featureName, payload) {
    return req.post(routes.chatCompletionCreate(appId, featureName), payload)
  },

  getUsageInfo(appId, featureName) {
    return req.get(routes.info(appId, featureName))
  },

  generateDashboardDataVisualizations(appId, payload) {
    return req.post(routes.dashboardDataVisualizations(appId), payload)
  },

  getDashboardDataVisualizationsPrompt(appId) {
    return req.get(routes.dashboardDataVisualizations(appId))
  }
})
