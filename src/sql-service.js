import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  connections       : '/:appId/console/sql/connection/',
  connection        : '/:appId/console/sql/connection/:connectionId',
  connectionTables  : '/:appId/console/sql/connection/:connectionId/tables',
  connectionRoutines: '/:appId/console/sql/connection/:connectionId/routines',

  connectionQueries: '/:appId/console/sql/:connectionName/query',
  connectionQuery  : '/:appId/console/sql/:connectionName/query/:queryId',

  connectionDynamicSelect: '/:appId/console/sql/:connectionName/select',
  connectionNamedSelect  : '/:appId/console/sql/:connectionName/select/:queryName',
})

export const sqlService = req => ({

  //---- CONNECTION-CONTROLLER ----//

  getConnections(appId) {
    return req.sqlService.get(routes.connections(appId))
  },

  createConnection(appId, data) {
    return req.sqlService.post(routes.connections(appId), data)
  },

  updateConnection(appId, data) {
    return req.sqlService.put(routes.connection(appId, data.id), data)
  },

  getConnectionTables(appId, connectionId) {
    return req.sqlService.get(routes.connectionTables(appId, connectionId))
  },

  getConnectionRoutines(appId, connectionId) {
    return req.sqlService.get(routes.connectionRoutines(appId, connectionId))
  },

  //---- CONNECTION-CONTROLLER ----//

  //---- QUERY-CONTROLLER ----//

  getConnectionQueries(appId, connectionName) {
    return req.sqlService.get(routes.connectionQueries(appId, connectionName))
  },

  createConnectionQuery(appId, connectionName, data) {
    return req.sqlService.post(routes.connectionQueries(appId, connectionName), data)
  },

  updateConnectionQuery(appId, connectionName, queryId, data) {
    return req.sqlService.put(routes.connectionQuery(appId, connectionName, queryId), data)
  },

  //---- QUERY-CONTROLLER ----//

  //---- CONSOLE-EXECUTE-CONTROLLER ----//

  runConnectionDynamicSelect(appId, connectionName, data) {
    return req.sqlService.post(routes.connectionDynamicSelect(appId, connectionName), data)
  },

  runConnectionNamedSelect(appId, connectionName, queryName, data) {
    return req.sqlService.post(routes.connectionNamedSelect(appId, connectionName, queryName), data)
  },

  //---- CONSOLE-EXECUTE-CONTROLLER ----//

})
