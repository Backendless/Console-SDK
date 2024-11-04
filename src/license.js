import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  license       : '/console/license',
  replaceCluster: '/console/license/cluster/replace',
})

export default req => ({
  get() {
    return req.get(routes.license())
  },

  upload(file) {
    return req.post(routes.license(), file)
  },

  replaceCluster(data) {
    return req.post(routes.replaceCluster(), data)
  },
})
