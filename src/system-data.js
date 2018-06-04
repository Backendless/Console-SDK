import urls from './urls'
import totalRows from './utils/total-rows'
import { tableRecordsReq } from './utils/table'

const tableUrl = (appId, table) => `${urls.systemDataTables(appId)}/${table.tableId}`
const removeRecordsUrl = (appId, table, removeAll) => `${tableUrl(appId, table)}/${removeAll ? 'all' : 'records'}`

const recordsReq = (req, appId, table, query) => {
  return tableRecordsReq(req, urls.systemDataTable(appId, table.tableId), table, query)
}

export default req => ({
  loadRecords(appId, table) {
    return totalRows(req).getWithData(recordsReq(req, appId, table))
  },

  getRecordsCount(appId, table) {
    return totalRows(req).getFor(recordsReq(req, appId, table))
  },

  createRecord(appId, { tableId }, record) {
    return req.post(urls.systemDataTable(appId, tableId), record)
  },

  updateRecord(appId, table, record) {
    return req.put(urls.systemDataRecord(appId, table.tableId, record.objectId), record)
  },

  deleteRecords(appId, table, recordIds) {
    const url = removeRecordsUrl(appId, table, !recordIds)
    const removeItems = recordIds && recordIds.map(objectId => ({ objectId }))

    return req.delete(url, removeItems)
  }
})
