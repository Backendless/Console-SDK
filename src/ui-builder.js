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

  containers: '/:appId/console/ui-builder/containers',
  container : '/:appId/console/ui-builder/containers/:containerName',

  containerSettings         : '/:appId/console/ui-builder/containers/:containerName/settings',
  containerCustomConfigs    : '/:appId/console/ui-builder/containers/:containerName/custom-configs',
  containerFavicon          : '/:appId/console/ui-builder/containers/:containerName/favicon',
  containerViewport         : '/:appId/console/ui-builder/containers/:containerName/viewport',
  containerMetaTags         : '/:appId/console/ui-builder/containers/:containerName/meta-tags',
  containerCustomHeadContent: '/:appId/console/ui-builder/containers/:containerName/custom-head-content',
  containerExternalLibraries: '/:appId/console/ui-builder/containers/:containerName/external-libraries',
  containerDefaultI18n      : '/:appId/console/ui-builder/containers/:containerName/i18n',

  removedContainers: '/:appId/console/ui-builder/removed-containers',
  removedContainer : '/:appId/console/ui-builder/removed-containers/:containerName',

  containerBackups: '/:appId/console/ui-builder/containers/:containerName/backups',

  containerI18ns        : '/:appId/console/ui-builder/containers/:containerName/i18n/dictionary',
  containerI18n         : '/:appId/console/ui-builder/containers/:containerName/i18n/dictionary/:dictionaryName',
  containerI18nKeys     : '/:appId/console/ui-builder/containers/:containerName/i18n/key',
  containerI18nKey      : '/:appId/console/ui-builder/containers/:containerName/i18n/key/:key',
  containerI18nKeyRename: '/:appId/console/ui-builder/containers/:containerName/i18n/key/:key/rename',

  containerAutomations: '/:appId/console/ui-builder/containers/:containerName/automations',

  containerAction: '/:appId/console/ui-builder/containers/:containerName/:action',

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
  containerReusableComponentUpgrade    : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/upgrade',
  containerReusableComponentUI         : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/ui',
  containerReusableComponentLogic      : '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/logic/:componentUid/:handlerName',
  containerReusableComponentUnusedLogic: '/:appId/console/ui-builder/containers/:containerName/components/reusable/:componentId/unused-logic',

  containerCustomComponents                : '/:appId/console/ui-builder/containers/:containerName/components/custom',
  containerCustomComponent                 : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId',
  containerCustomComponentPreview          : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/preview',
  containerCustomComponentClone            : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/clone',
  containerCustomComponentUpgrade          : '/:appId/console/ui-builder/containers/:containerName/components/custom/:componentId/upgrade',
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

  //-- BACKUPS -----//

  loadRemovedContainers(appId) {
    return req.get(routes.removedContainers(appId))
  },

  deleteRemovedContainer(appId, containerName) {
    return req.delete(routes.removedContainer(appId, containerName))
  },

  loadContainerBackups(appId, containerName) {
    return req.get(routes.containerBackups(appId, containerName))
  },

  createContainerBackup(appId, containerName, backup) {
    return req.post(routes.containerBackups(appId, containerName), backup)
  },

  deleteContainerBackups(appId, containerName, backupsIds) {
    return req.delete(routes.containerBackups(appId, containerName), backupsIds)
  },

  //-- BACKUPS -----//

  //-- SETTINGS -----//

  updateContainerSettings(appId, containerName, settings) {
    return req.put(routes.containerSettings(appId, containerName), settings)
  },

  updateContainerCustomConfigs(appId, containerName, customConfigs) {
    return req.put(routes.containerCustomConfigs(appId, containerName), customConfigs)
  },

  updateContainerDefaultI18n(appId, containerName, defaultI18n) {
    return req.put(routes.containerDefaultI18n(appId, containerName), { defaultI18n })
  },

  saveContainerI18n(appId, containerName, dictionaryName, dictionaryObject) {
    return req.put(routes.containerI18n(appId, containerName, dictionaryName), dictionaryObject)
  },

  deleteContainerI18n(appId, containerName, dictionaryName) {
    return req.delete(routes.containerI18n(appId, containerName, dictionaryName))
  },

  updateContainerI18nKey(appId, containerName, key, changes) {
    return req.put(routes.containerI18nKey(appId, containerName, key), changes)
  },

  renameContainerI18nKey(appId, containerName, oldKeyName, newKeyName) {
    return req.put(routes.containerI18nKeyRename(appId, containerName, oldKeyName)).query({ newKeyName })
  },

  deleteContainerI18nKeys(appId, containerName, keys) {
    return req.delete(routes.containerI18nKeys(appId, containerName), keys)
  },

  uploadContainerFavicon(appId, containerName, favicon) {
    return req.put(routes.containerFavicon(appId, containerName)).form({ favicon })
  },

  removeContainerFavicon(appId, containerName) {
    return req.delete(routes.containerFavicon(appId, containerName))
  },

  updateContainerViewport(appId, containerName, viewport) {
    return req.put(routes.containerViewport(appId, containerName), viewport)
  },

  updateContainerMetaTags(appId, containerName, metaTags) {
    return req.put(routes.containerMetaTags(appId, containerName), metaTags)
  },

  updateContainerCustomHeadContent(appId, containerName, data) {
    return req.put(routes.containerCustomHeadContent(appId, containerName), { data })
  },

  updateContainerExternalLibraries(appId, containerName, externalLibraries) {
    return req.put(routes.containerExternalLibraries(appId, containerName), externalLibraries)
  },

  //-- SETTINGS -----//

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

  upgradeReusableComponent(appId, containerName, id, data) {
    return req.post(routes.containerReusableComponentUpgrade(appId, containerName, id), data)
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

  upgradeCustomComponent(appId, containerName, id, data) {
    return req.post(routes.containerCustomComponentUpgrade(appId, containerName, id), data)
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

  createContainerFunction(appId, containerName, fn) {
    return req.post(routes.containerFunctions(appId, containerName), fn)
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
  },

  //-- FUNCTIONS -----//

  saveAutomationsTriggers(appId, containerName, triggers) {
    return req.put(routes.containerAutomations(appId, containerName), triggers)
  }
})
