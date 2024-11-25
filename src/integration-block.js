import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  // eslint-disable-next-line max-len
  cloudCodeMethodParamDictionary: '/api/node-server/manage/app/:appId/integration/block/:serviceName/:methodName/param-dictionary',
})

export default req => ({
  getCloudCodeMethodParamDictionary(appId, serviceName, methodName, payload) {
    return req.post(routes.cloudCodeMethodParamDictionary(appId, serviceName, methodName), payload)
  },
})
