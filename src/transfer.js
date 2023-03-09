import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  export          : '/:appId/console/export',
  singleStepImport: '/:appId/console/import/:type',
  multiStepImport : '/:appId/console/import/data/:step',
  firebaseUsers   : '/:appId/console/import/firebase/users',
  airtableBases   : '/:appId/console/airtable/bases/:baseId',
  airtableImport  : '/:appId/console/airtable',
})

export default req => ({
  getExportedData(appId) {
    return req.get(routes.export(appId))
  },

  startExport(appId, data) {
    return req.post(routes.export(appId), data)
  },

  startImport(appId, data, type, query) {
    return req.post(routes.singleStepImport(appId, type), data).query(query)
  },

  importDataServiceFiles(appId, data, step) {
    return req.post(routes.multiStepImport(appId, step), data)
  },

  importFirebaseUsers(appId, data) {
    return req.post(routes.firebaseUsers(appId), data)
  },

  getAirtableBasesList(appId, accessToken) {
    return req.get(routes.airtableBases(appId)).query({ accessToken })
  },

  getAirtableTablesList(appId, accessToken, baseId) {
    return req.get(routes.airtableBases(appId, baseId)).query({ accessToken })
  },

  startAirtableImport(appId, accessToken, baseId, tables) {
    return req.post(routes.airtableImport(appId, baseId), { accessToken, baseId, tables })
  }
})
