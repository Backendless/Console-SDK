import urls, { dataViews, dataTable } from './urls'
import { viewRecordsReq } from './utils/views'
import totalRows from './utils/total-rows'

export const recordsReq = (req, appId, view, query = {}, resetCache) => {
  return viewRecordsReq(req, dataTable(appId, view.name), view, query, resetCache)
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

  getRecordsCountForViews(appId, views, resetCache) {
    return req.post(`${urls.data(appId)}/tables-counters`, { tables: views, resetCache })
  },
})
