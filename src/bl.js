import _map from 'lodash/map'

import urls from './urls'

const hostedServices = appId => `${ urls.blBasePath(appId) }/generic`

const hostedServiceConfig = (appId, serviceId) => `${ hostedServices(appId) }/configure/${ serviceId }`

// TODO: remove this transformation when the format of config will be changed
const CONFIG_NAMES_MAP = {
  displayName: 'label'
}

// TODO: remove this transformation when the format of config will be changed
const normalizeService = service => {
  if (service.configuration) {
    service.configDescriptions = service.configuration.map(normalizeServiceConfigDescription)
    delete service.configuration
  }

  return service
}

// TODO: remove this transformation when the format of config will be changed
const toServerServiceConfig = config => _map(config, (value, name) => ({ name, value }))

// TODO: remove this transformation when the format of config will be changed
const fromServerServiceConfig = config => {
  return config.reduce((memo, config) => {
    memo[config.name] = config.value

    return memo
  }, {})
}

// TODO: remove this transformation when the format of config will be changes
const normalizeServiceConfigDescription = configDescription => {
  for (const key in configDescription) {
    const normalizeName = CONFIG_NAMES_MAP[key]

    if (normalizeName) {
      configDescription[normalizeName] = configDescription[key]
      delete configDescription[key]
    }
  }

  return configDescription
}

export default req => ({
  getServices(appId) {
    return req.get(urls.blBasePath(appId))
      .then(services => services.map(normalizeService))
    // TODO: remove this transformation when the format of config will be changes
  },

  getServiceSpec(appId, serviceId) {
    return req.get(`${ urls.blBasePath(appId) }/${ serviceId }/api-docs`)
  },

  importService(appId, data) {
    return req.post(`${ urls.blBasePath(appId) }/imported`, data)
  },

  createService(appId, data) {
    let formData = data

    if (!data.createFromSample) {
      formData = new FormData()
      formData.append('files', data.file)
      formData.append('createFromSample', false)
    }

    return req.post(`${ urls.blBasePath(appId) }/generic`, formData)
      .then(services => services.map(normalizeService))
    // TODO: remove this transformation when the format of config will be changed
  },

  deleteService(appId, serviceId) {
    return req.delete(hostedServices(appId), [serviceId])
  },

  loadServiceConfig(appId, serviceId) {
    // TODO: remove this transformation when the format of config will be changed
    return req.get(hostedServiceConfig(appId, serviceId))
      .then(fromServerServiceConfig)
  },

  setServiceConfig(appId, serviceId, config) {
    // TODO: remove this transformation when the format of config will be changed
    return req.post(hostedServiceConfig(appId, serviceId), toServerServiceConfig(config))
  },

  testServiceConfig(appId, serviceId, config) {
    // TODO: remove this transformation when the format of config will be changed
    return req.post(hostedServiceConfig(appId, `test/${serviceId}`), toServerServiceConfig(config))
  },

  getDraftFiles(appId, language) {
    return req.get(urls.blDraft(appId, language))
  },

  saveDraftFiles(appId, language, files) {
    return req.put(urls.blDraft(appId, language), files)
  },

  deployDraftFiles(appId, language, files) {
    return req.put(urls.blProd(appId, language), files)
  },

  getDraftFileContent(appId, fileId, language) {
    return req.get(`${ urls.blDraft(appId, language) }/${ encodeURIComponent(fileId) }`)
  },

  getLanguages() {
    return req.get(`${ urls.console() }/servercode/languages`)
  },

  createEventHandler(appId, handler) {
    const { category, mode, ...data } = handler

    return req.post(urls.blHandlersCategory(appId, mode, category), data)
  },

  updateEventHandler(appId, handler) {
    const { id, category, mode } = handler
    const url = `${ urls.blHandlersCategory(appId, mode, category) }/${ id }`

    return req.put(url, handler)
      .then(handler => ({ ...handler }))
  },

  getEventHandlers(appId, modes = []) {
    return req.get(urls.serverCode(appId)).query({ mode: modes })
  },

  deleteEventHandler(appId, handler) {
    const { id, mode, category } = handler

    const url = `${ urls.blHandlersCategory(appId, mode, category) }/${ id }`

    return req.delete(url)
  },

  invokeTimer(appId, timer) {
    const { timername, mode, category } = timer

    //POST /:applicationId/console/servercode/:mode/timers/:timerName/run
    return req.post(`${ urls.blHandlersCategory(appId, mode, category) }/${ timername }/run`)
  },

  getCategories(appId) {
    return req.get(`${ urls.appConsole(appId) }/servercode/categories`)
  },

  getEvents(appId) {
    return req.get(`${urls.appConsole(appId)}/servercode/events`)
  }
})
