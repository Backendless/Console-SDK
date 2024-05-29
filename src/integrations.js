import urls from './urls'

export default req => ({
  loadOpenAIData(appId, dataId) {
    return req.get(urls.integrations(appId, dataId))
  },

  saveOpenAIData(appId, aiData) {
    return req.post(urls.integrations(appId), aiData)
  },

  updateOpenAIData(appId, dataId, configData) {
    return req.put(urls.integrations(appId, dataId), configData)
  },

  deleteOpenAIData(appId, dataId) {
    return req.delete(urls.integrations(appId, dataId))
  },
})
