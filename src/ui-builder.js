import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  init: 'ui-builder/init',

  sdkStyles    : 'ui-builder/library/sdk/styles',
  sdkComponents: 'ui-builder/library/sdk/components',

  themes     : 'ui-builder/library/themes',
  theme      : 'ui-builder/library/themes/:themeId',
  themeStyle : 'ui-builder/library/themes/:themeId/style',
  themeAction: 'ui-builder/library/themes/:themeId/:action',

  remoteThemes: 'ui-builder/library/remote/themes',
  remoteTheme : 'ui-builder/library/remote/themes/:themeId',

  containers     : 'ui-builder/containers',
  container      : 'ui-builder/containers/:containerName',
  containerAction: 'ui-builder/containers/:containerName/:action',

  containerStyles: 'ui-builder/containers/:containerName/styles',
  containerStyle : 'ui-builder/containers/:containerName/styles/:name',

  containerFunctions    : 'ui-builder/containers/:containerName/functions',
  containerFunction     : 'ui-builder/containers/:containerName/functions/:functionId',
  containerFunctionLogic: 'ui-builder/containers/:containerName/functions/:functionId/logic',

  containerPages          : 'ui-builder/containers/:containerName/pages',
  containerPage           : 'ui-builder/containers/:containerName/pages/:pageName',
  containerPageUI         : 'ui-builder/containers/:containerName/pages/:pageName/ui',
  containerPageLogic      : 'ui-builder/containers/:containerName/pages/:pageName/logic/:componentUid/:handlerName',
  containerPageUnusedLogic: 'ui-builder/containers/:containerName/pages/:pageName/unused-logic',
})

export default req => ({

  init(appId) {
    return req.post(routes.init(appId))
  },

  //-- SDK -----//

  loadSDKStyles(appId) {
    return req.get(routes.sdkStyles(appId))
  },

  //-- SDK -----//

  //-- LIBRARY -----//

  getLocalComponents(appId) {
    return req.get(routes.sdkComponents(appId))
  },

  //-- LIBRARY -----//

  //-- CONTAINER -----//

  createContainer(appId, container) {
    return req.post(routes.containers(appId), container)
  },

  updateContainer(appId, containerName, container) {
    return req.put(routes.container(appId, containerName), container)
  },

  deleteContainer(appId, containerName) {
    return req.delete(routes.container(appId, containerName))
  },

  loadContainer(appId, containerName) {
    return req.get(routes.container(appId, containerName))
  },

  publishContainer(appId, containerName, targetPath) {
    return req.post(routes.containerAction(appId, containerName, 'publish'), { targetPath })
  },

  applyContainerTheme(appId, containerName, theme) {
    return req.post(routes.containerAction(appId, containerName, 'apply-theme'), theme)
  },

  loadContainerStyles(appId, containerName) {
    return req.get(routes.containerStyles(appId, containerName))
  },

  loadContainerStyle(appId, containerName, name) {
    return req.get(routes.containerStyle(appId, containerName, name))
  },

  updateContainerStyle(appId, containerName, name, style) {
    return req.put(routes.containerStyle(appId, containerName, name), style)
  },

  deleteContainerStyle(appId, containerName, name) {
    return req.delete(routes.containerStyle(appId, containerName, name))
  },

  //-- CONTAINER -----//

  //-- THEMES -----//

  searchThemes(appId) {
    return req.get(routes.remoteThemes(appId))
  },

  loadThemes(appId) {
    return req.get(routes.themes(appId))
  },

  createTheme(appId, theme) {
    return req.post(routes.themes(appId), theme)
  },

  updateTheme(appId, themeId, theme) {
    return req.put(routes.theme(appId, themeId), theme)
  },

  deleteTheme(appId, themeId) {
    return req.delete(routes.theme(appId, themeId))
  },

  publishTheme(appId, themeId, data) {
    return req.post(routes.themeAction(appId, themeId, 'publish'), data)
  },

  loadThemeStyle(appId, themeId) {
    return req.get(routes.themeStyle(appId, themeId))
  },

  updateThemeStyle(appId, themeId, content) {
    return req.put(routes.themeStyle(appId, themeId), { content })
  },

  //-- THEMES -----//

  //-- PAGE -----//

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

  //-- PAGE -----//

  //-- FUNCTIONS -----//

  loadContainerFunctions(appId, containerName) {
    return req.get(routes.containerFunctions(appId, containerName))
  },

  createContainerFunction(appId, containerName, name) {
    return req.post(routes.containerFunctions(appId, containerName), { name })
  },

  updateContainerFunction(appId, containerName, id, definition) {
    return req.put(routes.containerFunction(appId, containerName, id), definition)
  },

  deleteContainerFunction(appId, containerName, id) {
    return req.delete(routes.containerFunction(appId, containerName, id))
  },

  loadContainerFunctionLogic(appId, containerName, id) {
    return req.get(routes.containerFunctionLogic(appId, containerName, id))
  },

  updateContainerFunctionLogic(appId, containerName, id, data) {
    return req.put(routes.containerFunctionLogic(appId, containerName, id), data)
  },

  //-- FUNCTIONS -----//

})
