import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  status  : '/console/status',
  mainMenu: '/api/console/main-menu/items',
})

export const systemAPI = req => ({
  loadStatus(force) {
    if (force || !req.context.statusRequest) {
      const statusRequest = req.context.statusRequest = req.get('/console/status')
        .catch(e => {
          if (statusRequest === req.context.statusRequest) {
            delete req.context.statusRequest

            throw e
          }
        })
    }

    return req.context.statusRequest
  },

  loadMainMenu() {
    return req.get(routes.mainMenu())
  },
})
