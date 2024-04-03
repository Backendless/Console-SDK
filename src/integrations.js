import urls from './urls'

export default req => ({
  loadOpenAIData(appId) {
    return req.get(urls.integrations(appId))
  },

  saveOpenAIData(appId, aiData) {
    return req.post(urls.integrations(appId), aiData)
  },

  deleteOpenAIData(appId) {
    return req.delete(urls.integrations(appId))
  },
})
