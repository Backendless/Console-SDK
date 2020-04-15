import urls from './urls'

const routes = {
  init                    : 'ui-builder/init',
  localComponents         : 'ui-builder/library/components/local',
  remoteComponents        : 'ui-builder/library/components/remote',
  importComponent         : 'ui-builder/library/components/import',
  exportComponent         : 'ui-builder/library/components/export',

  customFunctions    : 'ui-builder/library/custom/functions',
  customFunction     : 'ui-builder/library/custom/functions/:functionId',
  customFunctionLogic: 'ui-builder/library/custom/functions/:functionId/logic',

  containers              : 'ui-builder/containers',
  container               : 'ui-builder/containers/:containerName',
  containerPages          : 'ui-builder/containers/:containerName/pages',
  containerPage           : 'ui-builder/containers/:containerName/pages/:pageName',
  containerPageUI         : 'ui-builder/containers/:containerName/pages/:pageName/ui',
  containerPageLogic      : 'ui-builder/containers/:containerName/pages/:pageName/logic/:componentUid/:handlerName',
  containerPageUnusedLogic: 'ui-builder/containers/:containerName/pages/:pageName/unused-logic',

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

  updateContainer(appId, containerName, container) {
    return req.put(routes.container(appId, containerName), container)
  },

  deleteContainer(appId, containerName) {
    return req.delete(routes.container(appId, containerName))
  },

  getContainer(appId, containerName) {
    return req.get(routes.container(appId, containerName))
  },

  createPage(appId, containerName, data) {
    return req.post(routes.containerPages(appId, containerName), data)
  },

  updatePage(appId, containerName, pageName, page) {
    return req.put(routes.containerPage(appId, containerName, pageName), page)
  },

  deletePage(appId, containerName, pageName) {
    return req.delete(routes.containerPage(appId, containerName, pageName))
  },

  getPageUI(appId, containerName, pageName) {
    return req.get(routes.containerPageUI(appId, containerName, pageName))
  },

  updatePageUI(appId, containerName, pageName, data) {
    return req.put(routes.containerPageUI(appId, containerName, pageName), data)
  },

  getPageLogic(appId, containerName, pageName, componentUid, handlerName) {
    return req.get(routes.containerPageLogic(appId, containerName, pageName, componentUid, handlerName))
  },

  createPageLogic(appId, containerName, pageName, componentUid, handlerName) {
    return req.post(routes.containerPageLogic(appId, containerName, pageName, componentUid, handlerName))
  },

  updatePageLogic(appId, containerName, pageName, componentUid, data) {
    return req.put(routes.containerPageLogic(appId, containerName, pageName, componentUid), data)
  },

  deletePageLogic(appId, containerName, pageName, componentUid, handlerName) {
    return req.delete(routes.containerPageLogic(appId, containerName, pageName, componentUid, handlerName))
  },

  deleteUnusedLogic(appId, containerName, pageName, componentUids) {
    return req.delete(routes.containerPageUnusedLogic(appId, containerName, pageName), { componentUids })
  },

  getCustomFunctions(appId) {
    return req.get(routes.customFunctions(appId))
  },

  createCustomFunction(appId, name) {
    return req.post(routes.customFunctions(appId), { name })
  },

  updateCustomFunction(appId, id, definition) {
    return req.put(routes.customFunction(appId, id), definition)
  },

  getCustomFunctionLogic(appId, id) {
    return req.get(routes.customFunctionLogic(appId, id))
  },

  updateCustomFunctionLogic(appId, id, data) {
    return req.put(routes.customFunctionLogic(appId, id), data)
  },

  deleteCustomFunction(appId, id) {
    return req.delete(routes.customFunction(appId, id))
  },

})
