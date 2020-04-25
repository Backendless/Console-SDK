export default req => force => {
  if (force || !req.context.statusRequest) {
    const statusRequest = req.context.statusRequest = req.get('/console/status')
      .catch(e => {
        if (statusRequest === req.context.statusRequest) {
          delete req.context.statusRequest

          throw e
        }
      })
  }

  return req.context.statusRequest
}
