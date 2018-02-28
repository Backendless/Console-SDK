export default apiMethods => middleware => {
  return Object.keys(apiMethods).reduce((memo, methodName) => {
    memo[methodName] = (...args) => {
      return middleware().then(req => {
        return apiMethods[methodName](req).apply(null, args)
      })
    }

    return memo
  }, {})
}
