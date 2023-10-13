import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  chatCompletionCreate: '/:appId/console/open-ai/',
})

export default req => ({
  createChatCompletion(appId, payload) {
    return req.post(routes.chatCompletionCreate(appId), payload)
  },
})
