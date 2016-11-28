import urls from './urls'

export default req => ({
  getExportedData(appId) {
    return req.get(`${urls.appConsole(appId)}/export`)
  },

  startExport(appId, data) {
    return req.post(`${urls.appConsole(appId)}/export`, data)
  },

  startImport(appId, data, type) {
    return req.post(`${urls.appConsole(appId)}/import/${type}`, data)
  },

  importDataServiceFiles(appId, data, step) {
    return req.post(`${urls.appConsole(appId)}/import/data/${step}`, data)
  }
})
