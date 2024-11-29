import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  integrations              : '/:appId/console/integrations',
  integration               : '/:appId/console/integrations/:name',
  integrationParamDictionary: '/api/node-server/manage/app/:appId/integration/block/:name/param-dictionary/:dictionary',
})

export default req => ({
  getIntegrations(appId) {
    return req.get(routes.integrations(appId))
  },

  saveIntegration(appId, configData) {
    return req.post(routes.integrations(appId), configData)
  },

  updateIntegration(appId, name, configData) {
    return req.put(routes.integration(appId, name), configData)
  },

  deleteIntegration(appId, name) {
    return req.delete(routes.integration(appId, name))
  },

  getParamDictionary(appId, name, dictionary, payload) {
    return req.post(routes.integrationParamDictionary(appId, name, dictionary), payload)
  },
})
