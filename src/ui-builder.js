/* eslint-disable max-len */
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  init: '/:appId/console/ui-builder/init',

  sdkStyles    : '/:appId/console/ui-builder/library/sdk/styles',
  sdkComponents: '/:appId/console/ui-builder/library/sdk/components',

  pageTemplates           : '/:appId/console/ui-builder/library/page-templates',
  customComponentTemplates: '/:appId/console/ui-builder/library/custom-component-templates',

  themes     : '/:appId/console/ui-builder/library/themes',
  theme      : '/:appId/console/ui-builder/library/themes/:themeId',
  themeStyle : '/:appId/console/ui-builder/library/themes/:themeId/style',
  themeAction: '/:appId/console/ui-builder/library/themes/:themeId/:action',

  remoteThemes: '/:appId/console/ui-builder/library/remote/themes',
  remoteTheme : '/:appId/console/ui-builder/library/remote/themes/:themeId',

  containers                        : '/:appId/console/ui-builder/containers',
  container                         : '/:appId/console/ui-builder/containers/:containerName',
  containerSettings                 : '/:appId/console/ui-builder/containers/:containerName/settings',
  containerSettingsFavicon          : '/:appId/console/ui-builder/containers/:containerName/settings/favicon',
  containerSettingsViewport         : '/:appId/console/ui-builder/containers/:containerName/settings/viewport',
  containerSettingsMetaTags         : '/:appId/console/ui-builder/containers/:containerName/settings/meta-tags',
  containerSettingsExternalLibraries: '/:appId/console/ui-builder/containers/:containerName/settings/libraries/external',
  containerAction                   : '/:appId/console/ui-builder/containers/:containerName/:action',

  containerStyles: '/:appId/console/ui-builder/containers/:containerName/styles',
  containerStyle : '/:appId/console/ui-builder/containers/:containerName/styles/:name',

  containerFunctions                   : '/:appId/console/ui-builder/containers/:containerName/functions',
  containerFunction                    : '/:appId/console/ui-builder/containers/:containerName/functions/:functionId',
  containerFunctionLogic               : '/:appId/console/ui-builder/containers/:containerName/functions/:functionId/logic',
  installCustomFunctionsFromMarketplace: '/:appId/console/ui-builder/containers/:containerName/functions/install/:productId',

  containerPages          : '/:appId/console/ui-builder/containers/:containerName/pages',
  containerPage           : '/:appId/console/ui-builder/containers/:containerName/pages/:pageName',
  containerPageUI         : '/:appId/console/ui-builder/containers/:containerName/pages/:pageName/ui',
  containerPageLogic      : '/:appId/console/ui-builder/containers/:containerName/pages/:pageName/logic/:componentUid/:handlerName',
  containerPageUnusedLogic: '/:appId/console/ui-builder/containers/:containerName/pages/:pageName/unused-logic',

  containerComponentAddReference: '/:appId/console/ui-builder/containers/:containerName/components/add-reference',
  containerComponentInstall     : '/:appId/console/ui-builder/containers/:containerName/components/install/:productId',

  containerReusableComponents          : '/:appId/console/ui-builder/containers/:containerName/components/reusable',
  containerReusableComponent           : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId',
  containerReusableComponentClone      : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/clone',
  containerReusableComponentUI         : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/ui',
  containerReusableComponentLogic      : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/logic/:componentUid/:handlerName',
  containerReusableComponentUnusedLogic: '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/unused-logic',

  containerCustomComponents                : '/:appId/console/ui-builder/containers/:containerName/components/custom',
  containerCustomComponent                 : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId',
  containerCustomComponentPreview          : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/preview',
  containerCustomComponentClone            : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/clone',
  containerCustomComponentModel            : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/model',
  containerCustomComponentFiles            : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/files',
  containerCustomComponentFilesDownloadLink: '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/files/sign',
  containerCustomComponentFileContent      : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/content/:fileId',
})

export default req => ({

  init(appId) {
    return req.post(routes.init(appId))
  },

  //-- SDK -----//

  loadSDKStyles(appId) {
    return req.get(routes.sdkStyles(appId))
  },

  loadSDKComponents(appId) {
    return req.get(routes.sdkComponents(appId))
  },

  //-- SDK -----//

  //-- LIBRARY -----//

  loadPageTemplates(appId) {
    return req.get(routes.pageTemplates(appId))
  },

  loadCustomComponentTemplates(appId) {
    return req.get(routes.customComponentTemplates(appId))
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

  uploadContainerFavicon(appId, containerName, favicon) {
    return req.put(routes.containerSettingsFavicon(appId, containerName)).form({ favicon })
  },

  removeContainerFavicon(appId, containerName) {
    return req.delete(routes.containerSettingsFavicon(appId, containerName))
  },

  updateContainerViewport(appId, containerName, viewport) {
    return req.put(routes.containerSettingsViewport(appId, containerName), viewport)
  },

  updateContainerMetaTags(appId, containerName, metaTags) {
    return req.put(routes.containerSettingsMetaTags(appId, containerName), metaTags)
  },

  updateContainerExternalLibraries(appId, containerName, externalLibraries) {
    return req.put(routes.containerSettingsExternalLibraries(appId, containerName), externalLibraries)
  },

  publishContainer(appId, containerName, options) {
    return req.post(routes.containerAction(appId, containerName, 'publish'), options)
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

  deletePageUnusedLogic(appId, containerName, pageName, componentUids) {
    return req.delete(routes.containerPageUnusedLogic(appId, containerName, pageName), { componentUids })
  },

  //-- PAGE -----//

  addReferenceToMarketplaceProduct(appId, containerName, data) {
    return req.post(routes.containerComponentAddReference(appId, containerName), data)
  },

  installComponentFromMarketplace(appId, containerName, productId, data) {
    return req.post(routes.containerComponentInstall(appId, containerName, productId), data)
  },

  //-- REUSABLE COMPONENTS -----//

  createReusableComponent(appId, containerName, data) {
    return req.post(routes.containerReusableComponents(appId, containerName), data)
  },

  cloneReusableComponent(appId, containerName, id, data) {
    return req.post(routes.containerReusableComponentClone(appId, containerName, id), data)
  },

  loadReusableComponent(appId, containerName, id) {
    return req.get(routes.containerReusableComponent(appId, containerName, id))
  },

  updateReusableComponent(appId, containerName, data) {
    return req.put(routes.containerReusableComponent(appId, containerName, data.id), data)
  },

  deleteReusableComponent(appId, containerName, id) {
    return req.delete(routes.containerReusableComponent(appId, containerName, id))
  },

  updateReusableComponentUI(appId, containerName, id, data) {
    return req.put(routes.containerReusableComponentUI(appId, containerName, id), data)
  },

  getReusableComponentLogic(appId, containerName, id, componentUid, handlerName) {
    return req.get(routes.containerReusableComponentLogic(appId, containerName, id, componentUid, handlerName))
  },

  updateReusableComponentLogic(appId, containerName, id, componentUid, data) {
    return req.put(routes.containerReusableComponentLogic(appId, containerName, id, componentUid), data)
  },

  createReusableComponentLogic(appId, containerName, id, componentUid, handlerName) {
    return req.post(routes.containerReusableComponentLogic(appId, containerName, id, componentUid, handlerName))
  },

  deleteReusableComponentLogic(appId, containerName, id, componentUid, handlerName) {
    return req.delete(routes.containerReusableComponentLogic(appId, containerName, id, componentUid, handlerName))
  },

  deleteReusableComponentUnusedLogic(appId, containerName, id, componentUids) {
    return req.delete(routes.containerReusableComponentUnusedLogic(appId, containerName, id), { componentUids })
  },

  //-- REUSABLE COMPONENTS -----//

  //-- CUSTOM COMPONENTS -----//

  createCustomComponent(appId, containerName, data) {
    return req.post(routes.containerCustomComponents(appId, containerName), data)
  },

  cloneCustomComponent(appId, containerName, id, data) {
    return req.post(routes.containerCustomComponentClone(appId, containerName, id), data)
  },

  loadCustomComponent(appId, containerName, id) {
    return req.get(routes.containerCustomComponent(appId, containerName, id))
  },

  deleteCustomComponent(appId, containerName, id) {
    return req.delete(routes.containerCustomComponent(appId, containerName, id))
  },

  updateCustomComponent(appId, containerName, data) {
    return req.put(routes.containerCustomComponent(appId, containerName, data.id), data)
  },

  updateCustomComponentPreview(appId, containerName, id, data) {
    return req.put(routes.containerCustomComponentPreview(appId, containerName, id), data)
  },

  loadComponentFileContent(appId, containerName, id, fileId) {
    return req.get(routes.containerCustomComponentFileContent(appId, containerName, id, fileId))
  },

  updateCustomComponentFiles(appId, containerName, id, files) {
    return req.put(routes.containerCustomComponentFileContent(appId, containerName, id), { files })
  },

  uploadCustomComponentFiles(appId, containerName, id, data) {
    return req.post(routes.containerCustomComponentFiles(appId, containerName, id), data)
  },

  getCustomComponentFileDownloadLink(appId, containerName, id, fileId) {
    return req.get(routes.containerCustomComponentFilesDownloadLink(appId, containerName, id))
      .query({ fileId })
  },

  //-- CUSTOM COMPONENTS -----//

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

  installCustomFunctionsFromMarketplace(appId, containerName, productId) {
    return req.post(routes.installCustomFunctionsFromMarketplace(appId, containerName, productId))
  }

  //-- FUNCTIONS -----//

})
