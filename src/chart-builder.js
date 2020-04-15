import urls from './urls'

export default req => ({

  getCharts(appId) {
    return req.get(`${urls.appConsole(appId)}/chart-builder`)
  },

  createChart(appId, chartSource, chartTarget) {
    return req.post(`${urls.appConsole(appId)}/chart-builder/chart`, {
      chartSource,
      chartTarget
    })
  },

  updateChart(appId, chartSource, chartTarget) {
    return req.put(`${urls.appConsole(appId)}/chart-builder/chart/${chartSource.name}`, {
      chartSource,
      chartTarget
    })
  },

  deleteChart(appId, chartName) {
    return req.delete(`${urls.appConsole(appId)}/chart-builder/chart/${chartName}`)
  },

  renameChart(appId, oldChartName, newChartName) {
    return req.put(`${urls.appConsole(appId)}/chart-builder/rename-chart`, {
      oldChartName,
      newChartName
    })
  },

})
