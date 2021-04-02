export function prepareRoutes(routes) {
  const result = {}

  Object.keys(routes).forEach(key => {
    const tokens = routes[key].split('/')

    result[key] = (...args) => {
      let lastArgIndex = 0

      const targetTokens = tokens.map(pathToken => {
        return pathToken.startsWith(':') ? args[lastArgIndex++] : pathToken
      })

      const route = targetTokens.join('/')

      if (route.indexOf('/:') >= 0) {
        throw new Error(`Invalid path params in route [${key}], arguments: ${args}`)
      }

      return route
    }
  })

  return result
}
