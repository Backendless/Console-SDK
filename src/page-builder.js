import urls from './urls'

const routes = {
  init                    : 'page-builder/init',
  localComponents         : 'page-builder/library/components/local',
  remoteComponents        : 'page-builder/library/components/remote',
  importComponent         : 'page-builder/library/components/import',
  exportComponent         : 'page-builder/library/components/export',

  containers              : 'page-builder/containers',
  container               : 'page-builder/containers/:containerName',
  containerPages          : 'page-builder/containers/:containerName/pages',
  containerPage           : 'page-builder/containers/:containerName/pages/:pageName',
  containerPageUI         : 'page-builder/containers/:containerName/pages/:pageName/ui',
  containerPageLogic      : 'page-builder/containers/:containerName/pages/:pageName/logic/:componentUid/:eventName',
  containerPageUnusedLogic: 'page-builder/containers/:containerName/pages/:pageName/unused-logic',

  containerFunctions      : 'page-builder/containers/:containerName/functions',
  containerFunction       : 'page-builder/containers/:containerName/functions/:functionId',
  containerFunctionLogic  : 'page-builder/containers/:containerName/functions/:functionId/logic',
}

Object.keys(routes).forEach(key => {
  const tokens = routes[key].split('/')

  routes[key] = (appId, ...args) => {
    let lastArgIndex = 0

    const targetTokens = tokens.map(pathToken => {
      return pathToken.startsWith(':') ? args[lastArgIndex++] : pathToken
    })

    targetTokens.unshift(urls.appConsole(appId))

    const route = targetTokens.join('/')

    if (route.indexOf('/:') >= 0) {
      throw new Error(`Invalid path params in route [${key}], arguments: ${args}`)
    }

    return route
  }
})

export default req => ({
  init(appId) {
    return req.post(routes.init(appId))
  },

  //-- LIBRARY -----//

  getLocalComponents(appId) {
    return req.get(routes.localComponents(appId))
  },

  getRemoteComponents(appId) {
    return req.get(routes.remoteComponents(appId))
  },

  importComponent(appId, componentId) {
    return req.post(routes.importComponent(appId), { componentId })
  },

  //-- LIBRARY -----//

  createContainer(appId, container) {
    return req.post(routes.containers(appId), container)
  },

  getPages(appId, containerName) {
    return req.get(routes.containerPages(appId, containerName))
  },

  createPage(appId, containerName, data) {
    return req.post(routes.containerPages(appId, containerName), data)
  },

  renamePage(appId, containerName, pageName, newPageName) {
    return req.put(routes.containerPage(appId, containerName, pageName), { name: newPageName })
  },

  removePage(appId, containerName, pageName) {
    return req.delete(routes.containerPage(appId, containerName, pageName))
  },

  updatePageUI(appId, containerName, pageName, data) {
    return req.put(routes.containerPageUI(appId, containerName, pageName), data)
  },

  getPageUI(appId, containerName, pageName) {
    return req.get(routes.containerPageUI(appId, containerName, pageName))
  },

  getPageLogic(appId, containerName, pageName, componentUid, eventName) {
    return req.get(routes.containerPageLogic(appId, containerName, pageName, componentUid, eventName))
  },

  createPageLogic(appId, containerName, pageName, componentUid, eventName) {
    return req.post(routes.containerPageLogic(appId, containerName, pageName, componentUid, eventName))
  },

  updatePageLogic(appId, containerName, pageName, componentUid, data) {
    return req.put(routes.containerPageLogic(appId, containerName, pageName, componentUid), data)
  },

  deletePageLogic(appId, containerName, pageName, componentUid, eventName) {
    return req.delete(routes.containerPageLogic(appId, containerName, pageName, componentUid, eventName))
  },

  removeUnusedLogic(appId, containerName, pageName, componentUids) {
    return req.delete(routes.containerPageUnusedLogic(appId, containerName, pageName), { componentUids })
  },

  getSharedFunctions(appId, containerName) {
    return req.get(routes.containerFunctions(appId, containerName))
  },

  createSharedFunction(appId, containerName, name) {
    return req.post(routes.containerFunctions(appId, containerName), { name })
  },

  updateSharedFunction(appId, containerName, id, definition) {
    return req.put(routes.containerFunction(appId, containerName, id), definition)
  },

  getSharedFunctionLogic(appId, containerName, id) {
    return req.get(routes.containerFunctionLogic(appId, containerName, id))
  },

  updateSharedFunctionLogic(appId, containerName, id, data) {
    return req.put(routes.containerFunctionLogic(appId, containerName, id), data)
  },

  deleteSharedFunction(appId, containerName, id) {
    return req.delete(routes.containerFunction(appId, containerName, id))
  },

})
