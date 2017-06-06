export default apiMethods => reqPromise => {
  return Object.keys(apiMethods).reduce((memo, methodName) => {
    memo[methodName] = (...args) => reqPromise.then(req => {
      const apiMethod = apiMethods[methodName](req)

      return apiMethod.apply(null, args)
    })

    return memo
  }, {})
}
