import urls from './urls'

export default req => ({
  createVisualization(appId, settings) {
    return req.post(`${urls.appConsole(appId)}/visualizations`, settings)
  }
})
