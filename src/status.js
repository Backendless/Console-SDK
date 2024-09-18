export default req => force => {
  console.warn('apiClient.status(force) is deprecated, use apiClient.system.loadStatus(force)')

  return req.api.system.loadStatus(force)
}
