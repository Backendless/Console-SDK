import urls, { dataViews, dataTable, dataTableGrouping, dataTableGroup } from './urls'
import { viewRecordsReq, viewRecordsGroupingReq, viewRecordsGroupReq } from './utils/views'
import totalRows from './utils/total-rows'

export const recordsReq = (req, appId, view, query = {}, resetCache) => {
  return viewRecordsReq(req, dataTable(appId, view.name), view, query, resetCache)
}

export const groupingRecordsReq = (req, appId, view, query = {}) => {
  return viewRecordsGroupingReq(req, dataTableGrouping(appId, view.name), view.viewId, query)
}

export const groupRecordsReq = (req, appId, view, query = {}) => {
  return viewRecordsGroupReq(req, dataTableGroup(appId, view.name), view.viewId, query)
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
    return req.put(dataViews(appId, viewId), { name })
  },

  deleteView(appId, viewId) {
    return req.delete(dataViews(appId, viewId))
  },

  loadRecords(appId, view, query) {
    return recordsReq(req, appId, view, query)
  },

  getRecordsCount(appId, view, query, resetCache) {
    return totalRows(req).getFor(recordsReq(req, appId, view, query, resetCache))
  },

  getRecordsCounts(appId, views, resetCache) {
    return req.post(`${urls.data(appId)}/tables-counters`, { tables: views, resetCache })
  },

  loadRecordsGrouping(appId, view, query) {
    return groupingRecordsReq(req, appId, view, query)
  },

  loadGroupRecords(appId, view, query) {
    return groupRecordsReq(req, appId, view, query)
  },
})
