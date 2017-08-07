import urls from './urls'

export default req => ({

  loadApiServices(appId) {
    return req.get(urls.codelessApiServices(appId))
  },

  loadFunctions(appId) {
    return req.get(urls.codelessFunctions(appId))
  },

  createFunctionSource(appId, xml, code, definition){
    return req.post(urls.codelessFunctions(appId), { xml, code, definition })
  },

  loadFunctionSource(appId, functionId){
    return req.get(urls.codelessFunctionSource(appId, functionId))
  },

  updateFunctionSource(appId, functionId, xml, code, definition){
    return req.put(urls.codelessFunctionSource(appId, functionId), { xml, code, definition })
  },

  removeFunctionSource(appId, functionId){
    return req.delete(urls.codelessFunctionSource(appId, functionId))
  }
})
