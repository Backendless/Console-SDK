import { dataViews } from './urls'

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
  }
})
