/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  init: '/:appId/console/ui-builder/init',

  sdkStyles    : '/:appId/console/ui-builder/library/sdk/styles',
  sdkComponents: '/:appId/console/ui-builder/library/sdk/components',

  pageTemplates: '/:appId/console/ui-builder/library/page-templates',

  themes     : '/:appId/console/ui-builder/library/themes',
  theme      : '/:appId/console/ui-builder/library/themes/:themeId',
  themeStyle : '/:appId/console/ui-builder/library/themes/:themeId/style',
  themeAction: '/:appId/console/ui-builder/library/themes/:themeId/:action',

  remoteThemes: '/:appId/console/ui-builder/library/remote/themes',
  remoteTheme : '/:appId/console/ui-builder/library/remote/themes/:themeId',

  containers     : '/:appId/console/ui-builder/containers',
  container      : '/:appId/console/ui-builder/containers/:containerName',
  containerAction: '/:appId/console/ui-builder/containers/:containerName/:action',

  containerStyles: '/:appId/console/ui-builder/containers/:containerName/styles',
  containerStyle : '/:appId/console/ui-builder/containers/:containerName/styles/:name',

  containerFunctions    : '/:appId/console/ui-builder/containers/:containerName/functions',
  containerFunction     : '/:appId/console/ui-builder/containers/:containerName/functions/:functionId',
  containerFunctionLogic: '/:appId/console/ui-builder/containers/:containerName/functions/:functionId/logic',

  containerPages          : '/:appId/console/ui-builder/containers/:containerName/pages',
  containerPage           : '/:appId/console/ui-builder/containers/:containerName/pages/:pageName',
  containerPageUI         : '/:appId/console/ui-builder/containers/:containerName/pages/:pageName/ui',
  containerPageLogic      : '/:appId/console/ui-builder/containers/:containerName/pages/:pageName/logic/:componentUid/:handlerName',
  containerPageUnusedLogic: '/:appId/console/ui-builder/containers/:containerName/pages/:pageName/unused-logic',

  containerComponentUnusedLogic: '/:appId/console/ui-builder/containers/:containerName/components/unused-logic',
  containerReusableUI          : '/:appId/console/ui-builder/containers/:containerName/components/:componentUid/ui',
  containerComponentLogic      : '/:appId/console/ui-builder/containers/:containerName/components/:componentUid/logic/:subcomponentUid/:handlerName',

  containerReusableComponent: '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentUid',

  containerCustomComponents          : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentUid',
  containerCustomComponentModel      : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentUid/model',
  containerCustomComponentFiles      : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentUid/files',
  containerCustomComponentFileContent: '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentUid/content/:fileId',
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

  //-- PAGE TEMPLATES -----//

  loadPageTemplates(appId) {
    return req.get(routes.pageTemplates(appId))
  },

  //-- PAGE TEMPLATES -----//

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

  deleteUnusedReusableComponentsLogic(appId, containerName, componentUids) {
    return req.delete(routes.containerComponentUnusedLogic(appId, containerName), { componentUids })
  },

  //-- PAGE -----//

  //-- COMPONENTS -----//

  getReusableComponentLogic(appId, containerName, componentUid, subcomponentUid, handlerName) {
    return req.get(routes.containerComponentLogic(appId, containerName, componentUid, subcomponentUid, handlerName))
  },

  updateReusableComponentLogic(appId, containerName, componentUid, subcomponentUid, data) {
    return req.put(routes.containerComponentLogic(appId, containerName, componentUid, subcomponentUid), data)
  },

  createReusableComponentLogic(appId, containerName, componentUid, subcomponentUid, handlerName) {
    return req.post(routes.containerComponentLogic(appId, containerName, componentUid, subcomponentUid, handlerName))
  },

  deleteReusableComponentLogic(appId, containerName, componentUid, subcomponentUid, handlerName) {
    return req.delete(routes.containerComponentLogic(appId, containerName, componentUid, subcomponentUid, handlerName))
  },

  updateReusableUI(appId, containerName, componentUid, data) {
    return req.put(routes.containerReusableUI(appId, containerName, componentUid), data)
  },

  createReusableComponent(appId, containerName, data) {
    return req.post(routes.containerReusableComponent(appId, containerName), data)
  },

  loadComponentFileContent(appId, containerName, componentUid, fileId) {
    return req.get(routes.containerCustomComponentFileContent(appId, containerName, componentUid, fileId))
  },

  updateUIBuilderCustomComponentModel(appId, containerName, componentUid, model) {
    return req.put(routes.containerCustomComponentModel(appId, containerName, componentUid), { model })
  },

  updateUIBuilderCustomComponentFiles(appId, containerName, componentUid, files) {
    return req.put(routes.containerCustomComponentFileContent(appId, containerName, componentUid), { files })
  },

  deleteCustomComponent(appId, containerName, componentUid) {
    return req.delete(routes.containerCustomComponents(appId, containerName, componentUid))
  },

  deleteReusableComponent(appId, containerName, componentUid) {
    return req.delete(routes.containerReusableComponent(appId, containerName, componentUid))
  },

  createCustomComponent(appId, containerName, componentUid, componentName) {
    return req.post(routes.containerCustomComponents(appId, containerName, componentUid), { componentName })
  },

  uploadCustomComponentFiles(appId, containerName, componentUid, data) {
    return req.post(routes.containerCustomComponentFiles(appId, containerName, componentUid), data)
  },

  //-- COMPONENTS -----//

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
