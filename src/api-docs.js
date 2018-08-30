import urls from './urls'

export default req => ({
  generateDataTableApi(appId, tableName, options) {
    return req.post(urls.apiDocsDataTable(appId, tableName), options)
  },

  generateMessagingChannelApi(appId, channelName, options) {
    return req.post(urls.apiDocsMessagingChannel(appId, channelName), options)
  },

  generateFilesApi(appId, options) {
    return req.post(urls.apiDocsFiles(appId), options)
  },

  generateServiceApi(appId, serviceId, options) {
    return req.post(urls.apiDocsService(appId, serviceId), options)
  },
})
