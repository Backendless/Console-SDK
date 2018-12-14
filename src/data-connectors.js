import urls from './urls'
import totalRows from './utils/total-rows'
import { tableRecordsReq } from './utils/table'

const recordsReq = (req, appId, connectorId, table, query, resetCache) => {
  const url = urls.dataConnectorTableEntries(appId, connectorId, table.name)

  return tableRecordsReq(req, url, table, query, resetCache)
}

export default req => ({

  getTemplates(appId) {
    return req.get(urls.dataConnectorTemplates(appId))
  },

  getConnectors(appId) {
    return req.get(urls.dataConnectors(appId))
  },

  activateConnector(appId, connector) {
    return req.post(urls.dataConnectors(appId), connector)
  },

  deleteConnector(appId, connectorId) {
    return req.delete(urls.dataConnector(appId, connectorId))
  },

  updateConnector(appId, connector) {
    return req.put(urls.dataConnector(appId, connector.id), connector)
  },

  getConnectorTables(appId, connectorId, query) {
    return req.get(urls.dataConnectorTables(appId, connectorId)).query(query)
  },

  getConnectorTableEntries(appId, connectorId, table, query) {
    return totalRows(req).getWithData(recordsReq(req, appId, connectorId, table, query))
  },

  getConnectorTableEntriesCount(appId, connectorId, table, query, resetCache) {
    return totalRows(req).getFor(recordsReq(req, appId, connectorId, table, query, resetCache))
  },

  getConnectorStoredProcedures(appId, connectorId) {
    return req.get(urls.dataConnectorStoredProcedures(appId, connectorId))
  },

  executeConnectorStoredProcedure(appId, connectorId, procedureId, params) {
    return req.post(urls.dataConnectorStoredProcedureExecution(appId, connectorId, procedureId), params)
  },

})
