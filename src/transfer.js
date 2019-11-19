import urls from './urls'

export default req => ({
  getExportedData(appId) {
    return req.get(`${urls.appConsole(appId)}/export`)
  },

  startExport(appId, data) {
    return req.post(`${urls.appConsole(appId)}/export`, data)
  },

  startImport(appId, data, type, query) {
    return req.post(`${urls.appConsole(appId)}/import/${type}`, data).query(query)
  },

  importDataServiceFiles(appId, data, step) {
    return req.post(`${urls.appConsole(appId)}/import/data/${step}`, data)
  },

  importFirebaseUsers(appId, data) {
    return req.post(`${urls.appConsole(appId)}/import/firebase/users`, data)
  }
})
