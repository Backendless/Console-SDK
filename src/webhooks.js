import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  webhooks  : '/:appId/console/webhook',
  operations: '/:appId/console/webhook/operations',
  webhook   : '/:appId/console/webhook/:webhookId',
})

export default req => ({
  getWebhooks(appId) {
    return req.get(routes.webhooks(appId))
  },

  getWebhookOperations(appId) {
    return req.get(routes.operations(appId))
  },

  saveWebhook(appId, configData) {
    return req.post(routes.webhooks(appId), configData)
  },

  updateWebhook(appId, webhookId, configData) {
    return req.put(routes.webhook(appId, webhookId), configData)
  },

  deleteWebhook(appId, webhookId) {
    return req.delete(routes.webhook(appId, webhookId))
  },
})
