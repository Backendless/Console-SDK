import urls from './urls'

export default req => ({

  loadApiServices(appId) {
    return req.get(urls.codelessApiServices(appId))
  },

  loadFunctions(appId) {
    return req.get(urls.codelessFunctions(appId))
  },

  createFunction(appId, fn) {
    return req.post(urls.codelessFunctions(appId), fn)
  },

  loadFunctionSource(appId, functionId) {
    return req.get(urls.codelessFunctionSource(appId, functionId))
  },

  updateFunctionSource(appId, functionId, xml, code, definition) {
    return req.put(urls.codelessFunctionSource(appId, functionId), { xml, code, definition })
  },

  removeFunctionSource(appId, functionId) {
    return req.delete(urls.codelessFunctionSource(appId, functionId))
  },

  deployCodelessModel(appId, model, items) {
    return req.post(urls.codelessDeployModel(appId, model), items)
  }
})
