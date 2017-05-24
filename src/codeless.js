import urls from './urls'

export default req => ({
  loadFunctions(appId) {
    return req.get(urls.codelessFunctions(appId))
  },

  loadFunctionSource(appId, name){
    return req.get(urls.codelessFunctionSource(appId, name))
  },

  updateFunctionSource(appId, name, xml, code, definition){
    return req.post(urls.codelessFunctionSource(appId, name), { xml, code, definition })
  },

  removeFunctionSource(appId, name){
    return req.delete(urls.codelessFunctionSource(appId, name))
  }
})
