import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  previewInitToken: '/:applicationId/console/preview/preview-init-token'
})

export default req => ({
  getPreviewInitToken(appId) {
    return req.get(routes.previewInitToken(appId))
  },
})
