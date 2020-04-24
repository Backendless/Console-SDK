export default req => force => {
  if (force || !req.context.statusRequest) {
    const statusRequest = req.context.statusRequest = req.get('/console/status')
      .then(apiStatus => {
        if (statusRequest === req.context.statusRequest) {
          req.context.apiStatus = apiStatus

          if (req.context.options.useFileDownloadURL) {
            req.context.fileDownloadURL = apiStatus.fileDownloadURL
          }

          return apiStatus
        }
      })
      .catch(e => {
        if (statusRequest === req.context.statusRequest) {
          delete req.context.statusRequest

          throw e
        }
      })
  }

  return req.context.statusRequest
}
