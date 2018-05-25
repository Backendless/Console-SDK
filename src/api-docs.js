import urls from './urls'

export default req => ({
  generateDataTableApi(appId, tableName, options) {
    return req.post(urls.apiDocsDataTable(appId, tableName), options)
  },
})
