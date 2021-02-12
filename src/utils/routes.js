import urls from '../urls'

export function prepareRoutes(routes) {
  const result = {}

  Object.keys(routes).forEach(key => {
    const tokens = routes[key].split('/')

    result[key] = (appId, ...args) => {
      let lastArgIndex = 0

      const targetTokens = tokens.map(pathToken => {
        return pathToken.startsWith(':') ? args[lastArgIndex++] : pathToken
      })

      targetTokens.unshift(urls.appConsole(appId))

      const route = targetTokens.join('/')

      if (route.indexOf('/:') >= 0) {
        throw new Error(`Invalid path params in route [${key}], arguments: ${args}`)
      }

      return route
    }
  })

  return result
}
