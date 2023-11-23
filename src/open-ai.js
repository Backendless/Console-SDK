import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  chatCompletionCreate: '/:appId/console/open-ai/chat-completion',
  info                : '/:appId/console/open-ai/info',
})

export default req => ({
  createChatCompletion(appId, payload) {
    return req.post(routes.chatCompletionCreate(appId), payload)
  },

  getUsageInfo(appId) {
    return req.get(routes.info(appId))
  }
})
