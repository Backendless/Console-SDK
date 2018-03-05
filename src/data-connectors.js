import urls from './urls'

export default req => ({

  getTemplates(appId) {
    return req.get(urls.dataConnectorsTemplates(appId))
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

  getConnectorTables(appId, connectorId) {
    return req.get(urls.dataConnectorTables(appId, connectorId))
  },

  getConnectorTableEntries(appId, connectorId, tableName) {
    return req.get(urls.dataConnectorTableEntries(appId, connectorId, tableName))
  },

  getConnectorStoreProcedures(appId, connectorId) {
    return req.get(urls.dataConnectorStoredProcedures(appId, connectorId))
  },

  runConnectorStoreProcedure(appId, connectorId, procedureId) {
    return req.get(urls.dataConnectorStoredProcedure(appId, connectorId, procedureId))
  },

  getConnectorView(appId, connectorId, viewId) {
    return req.get(urls.dataConnectorView(appId, connectorId, viewId))
  },

})
