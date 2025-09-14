import { prepareRoutes } from './utils/routes'
import BaseService from './base/base-service'

const routes = prepareRoutes({
  export          : '/:appId/console/export',
  singleStepImport: '/:appId/console/import/:type',
  multiStepImport : '/:appId/console/import/data/:step',
  firebaseUsers   : '/:appId/console/import/firebase/users',
  airtableBases   : '/:appId/console/airtable/bases/:baseId',
  airtableImport  : '/:appId/console/airtable',
})

class Transfer extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'transfer'
  }

  getExportedData(appId) {
    return this.req.get(routes.export(appId))
  }

  startExport(appId, data) {
    return this.req.post(routes.export(appId), data)
  }

  startImport(appId, data, type, query) {
    return this.req.post(routes.singleStepImport(appId, type), data).query(query)
  }

  importDataServiceFiles(appId, data, step) {
    return this.req.post(routes.multiStepImport(appId, step), data)
  }

  importFirebaseUsers(appId, data) {
    return this.req.post(routes.firebaseUsers(appId), data)
  }

  getAirtableBasesList(appId, accessToken) {
    return this.req.get(routes.airtableBases(appId)).query({ accessToken })
  }

  getAirtableTablesList(appId, accessToken, baseId) {
    return this.req.get(routes.airtableBases(appId, baseId)).query({ accessToken })
  }

  startAirtableImport(appId, accessToken, baseId, tables) {
    return this.req.post(routes.airtableImport(appId, baseId), { accessToken, baseId, tables })
  }
}

export default req => Transfer.create(req)
