import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  installDM  : '/:appId/console/cloud-code/deployment-models/marketplace/install/:productId',
  uninstallDM: '/:appId/console/cloud-code/deployment-models/marketplace/uninstall/:productId',
})

export default req => ({

  installMarketplaceDeploymentModel(appId, productId, version) {
    return req.post(routes.installDM(appId, productId)).query({ version })
  },

  uninstallMarketplaceDeploymentModel(appId, productId) {
    return req.post(routes.uninstallDM(appId, productId))
  },

})
