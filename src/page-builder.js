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

  getPageLogic(appId, pageName, componentUid, eventName) {
    return req.get(urls.pageBuilderPageLogic(appId, pageName, componentUid, eventName))
  },

  createPageLogic(appId, pageName, componentUid, eventName) {
    return req.post(urls.pageBuilderPageLogic(appId, pageName, componentUid, eventName))
  },

  updatePageLogic(appId, pageName, componentUid, eventName, logic) {
    return req.put(urls.pageBuilderPageLogic(appId, pageName, componentUid, eventName), logic)
  },

  deletePageLogic(appId, pageName, componentUid, eventName) {
    return req.delete(urls.pageBuilderPageLogic(appId, pageName, componentUid, eventName))
  },

  removeUnusedLogic(appId, pageName, componentUids) {
    return req.delete(urls.pageBuilderPageUnusedLogic(appId, pageName), { componentUids })
  },

  getSharedFunctions(appId) {
    return req.get(urls.pageBuilderSharedFunctions(appId))
  },

  getSharedFunctionLogic(appId, id) {
    return req.get(urls.pageBuilderSharedFunctionLogic(appId, id))
  },

  updateSharedFunctionLogic(appId, id, data) {
    return req.put(urls.pageBuilderSharedFunctionLogic(appId, id), data)
  },

  createSharedFunction(appId, name) {
    return req.post(urls.pageBuilderSharedFunctions(appId), { name })
  },

  updateSharedFunction(appId, id, data) {
    return req.put(urls.pageBuilderSharedFunction(appId, id), data)
  },

  deleteSharedFunction(appId, id) {
    return req.delete(urls.pageBuilderSharedFunction(appId, id))
  },

})
