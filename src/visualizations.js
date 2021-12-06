import urls from './urls'

export default req => ({
  getVisualizations(appId) {
    return req.get(`${urls.appConsole(appId)}/visualizations`)
  },

  createVisualization(appId, visualizationId, visualization) {
    return req.post(`${urls.appConsole(appId)}/visualizations/${ visualizationId }`, visualization)
  },

  updateVisualization(appId, visualizationId, visualization) {
    return req.put(`${urls.appConsole(appId)}/visualizations/${ visualizationId }`, visualization)
  },

  deleteVisualizations(appId, visualizationIds) {
    return req.delete(`${urls.appConsole(appId)}/visualizations`).query({ visualizationIds })
  },
})
