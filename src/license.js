import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  licence       : '/console/license',
  replaceCluster: '/console/license/cluster/replace',
})

export default req => ({
  get() {
    return req.get(routes.licence())
  },

  upload(file) {
    return req.post(routes.licence(), file)
  },

  replaceCluster(data) {
    return req.post(routes.replaceCluster(), data)
  },
})
