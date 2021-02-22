import urls, { dataViews, dataTable, dataTableGroup, dataTableGroupCount } from './urls'
import { viewRecordsReq, viewRecordsGroupReq, viewRecordsGroupCountReq } from './utils/views'
import totalRows from './utils/total-rows'

const dataTableFindUrl = (appId, tableName) => `${dataTable(appId, tableName)}/find`

export const recordsReq = (req, appId, view, query = {}, resetCache) => {
  return viewRecordsReq(req, dataTableFindUrl(appId, view.name), view, query, resetCache)
}
export const recordsCountReq = (req, appId, view, query = {}, resetCache) => {
  return viewRecordsReq(req, dataTable(appId, view.name), view, query, resetCache)
}

export const groupRecordsReq = (req, appId, view, query = {}) => {
  return viewRecordsGroupReq(req, dataTableGroup(appId, view.name), view.viewId, query)
}

export const groupRecordsCountReq = (req, appId, view, query = {}) => {
  return viewRecordsGroupCountReq(req, dataTableGroupCount(appId, view.name), query)
}

export default req => ({

  getViews(appId) {
    return req.get(dataViews(appId))
  },

  getViewRecords(appId, viewName) {
    return req.get(`${dataViews(appId)}/${viewName}`)
  },

  createView(appId, view) {
    return req.post(dataViews(appId), view)
  },

  updateView(appId, view) {
    return req.put(dataViews(appId, view.viewId), view)
  },

  renameView(appId, viewId, name) {
    return req.put(`${dataViews(appId, viewId)}/name`, { name })
  },

  deleteView(appId, viewId) {
    return req.delete(dataViews(appId, viewId))
  },

  loadRecords(appId, view, query) {
    return recordsReq(req, appId, view, query)
  },

  getRecordsCount(appId, view, query, resetCache) {
    return totalRows(req).getFor(recordsCountReq(req, appId, view, query, resetCache))
  },

  getRecordsCounts(appId, views, resetCache) {
    return req.post(`${urls.data(appId)}/tables-counters`, { tables: views, resetCache })
  },

  loadGroupRecords(appId, view, query) {
    return groupRecordsReq(req, appId, view, query)
  },

  getGroupRecordsCount(appId, view, query) {
    return groupRecordsCountReq(req, appId, view, query)
  }
})
