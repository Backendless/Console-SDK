import urls from './urls'

export default req => ({
  init(appId) {
    return req.post(urls.pageBuilderInit(appId))
  },

  getPages(appId) {
    return req.get(urls.pageBuilderPages(appId))
  },

  createPage(appId, pageName, page) {
    return req.post(urls.pageBuilderPage(appId, pageName), page)
  },

  updatePageUI(appId, pageName, ui) {
    return req.put(urls.pageBuilderPage(appId, pageName), ui)
  },

  getPageUI(appId, pageName) {
    return req.get(urls.pageBuilderPage(appId, pageName))
  },

  getPageLogicFiles(appId, pageName) {
    return req.get(urls.pageBuilderPage(appId, pageName))
  },

  getPageLogic(appId, pageName, logicKey) {
    return req.get(urls.pageBuilderPageLogic(appId, pageName, logicKey))
  },

  createPageLogic(appId, pageName, logicKey) {
    return req.post(urls.pageBuilderPageLogic(appId, pageName, logicKey))
  },

  updatePageLogic(appId, pageName, logicKey, xml, code) {
    return req.put(urls.pageBuilderPageLogic(appId, pageName, logicKey), { xml, code })
  },

  deletePageLogic(appId, pageName, logicKey) {
    return req.delete(urls.pageBuilderPageLogic(appId, pageName, logicKey))
  },

  removeUnusedLogic(appId, pageName, componentIds) {
    return req.delete(urls.pageBuilderPageUnusedLogic(appId, pageName), { componentIds })
  },

})
