import urls from './urls'

export default req => appId => req.get(`${urls.console(appId)}/warning`)
