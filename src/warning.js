import urls from './urls'

export default req => appId => req.get(`${urls.appConsole(appId)}/warning`)
