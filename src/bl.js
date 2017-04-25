import _each from 'lodash/each'

import urls from './urls'

const hostedServices = appId => `${ urls.blBasePath(appId) }/generic`
const codelessServices = appId => `${ urls.blBasePath(appId) }/codeless`

const hostedServiceConfig = (appId, serviceId) => `${ hostedServices(appId) }/configure/${ serviceId }`

// TODO: remove this transformation when the format of config will be changed [CONSOLE-599]
const CONFIG_NAMES_MAP = {
  displayName: 'label'
}

// TODO: remove this transformation when the format of config will be changed [CONSOLE-599]
const normalizeService = service => {
  if (service.configuration) {
    service.configDescriptions = service.configuration.map(normalizeServiceConfigDescription)
    delete service.configuration
  }

  return service
}

// TODO: remove this transformation when the format of config will be changes [CONSOLE-599]
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

const parseServiceSpec = spec => {
  const { paths, ...summary } = spec
  const methods = {}

  _each(paths, (pathBody, path) => {
    _each(pathBody, (methodBody, type) => {
      const id = methodBody.operationId

      methods[id] = {
        ...methodBody,
        path,
        type,
        id
      }

    })
  })

  return { summary, methods }
}

export default req => ({
  getServices(appId) {
    return req.get(urls.blBasePath(appId))
      .then(services => services.map(normalizeService))
    // TODO: remove this transformation when the format of config will be changes [CONSOLE-599]
  },

  getServiceSpec(appId, serviceId) {
    return req.get(`${ urls.blBasePath(appId) }/${ serviceId }/api-docs`).then(parseServiceSpec)
  },

  getServiceMethods(appId, serviceId) {
    return req.get(`${ urls.blBasePath(appId) }/${ serviceId }/methods`)
  },

  importService(appId, { service, serviceURL, file }) {
    let data

    if (file) {
      data = new FormData()
      data.append('file', file)
    } else {
      data = service ? { appId, service } : { serviceURL }
    }

    return req.post(`${ urls.blBasePath(appId) }/import`, data)
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
    // TODO: remove this transformation when the format of config will be changed [CONSOLE-599]
  },

  createAWSLambdaService(appId, credentials) {
    return req.post(`${ urls.blBasePath(appId) }/aws-lambda`, { ...credentials, appId })
  },

  createCodelessService(appId, service) {
    return req.post(codelessServices(appId), service)
  },

  updateCodelessService(appId, serviceId, serviceName, updates) {
    return req.put(`${ codelessServices(appId) }/${ serviceId }`, updates).query({ serviceName })
  },

  deleteCodelessService(appId, serviceId, serviceName) {
    return req.delete(`${ codelessServices(appId) }/${ serviceId }`).query({ serviceName })
  },

  createCodelessMethod(appId, serviceId, serviceName, method) {
    return req.post(`${ codelessServices(appId) }/${ serviceId }/`, method).query({ serviceName })
  },

  deleteCodelessMethod(appId, serviceId, serviceName, methodId) {
    return req.delete(`${ codelessServices(appId) }/${ serviceId }/${ methodId }`).query({ serviceName })
  },

  getCodelessMethodLogic(appId, serviceId, serviceName, methodId) {
    return req.get(`${ codelessServices(appId) }/${ serviceId }/${ methodId }/logic`).query({ serviceName })
  },

  saveCodelessMethodLogic(appId, serviceId, serviceName, methodId, logic) {
    return req.put(`${ codelessServices(appId) }/${ serviceId }/${ methodId }/logic`, logic).query({ serviceName })
  },

  deleteService(appId, serviceId) {
    return req.delete(hostedServices(appId), [serviceId])
  },

  updateService(appId, serviceId, updates) {
    return req.put(`${ hostedServices(appId) }/${ serviceId }/update`, updates)
  },

  loadServiceConfig(appId, serviceId) {
    return req.get(hostedServiceConfig(appId, serviceId))
  },

  setServiceConfig(appId, serviceId, config) {
    return req.post(hostedServiceConfig(appId, serviceId), config)
  },

  testServiceConfig(appId, serviceId, config) {
    return req.post(hostedServiceConfig(appId, `test/${serviceId}`), config)
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
    return req.get(`${ urls.blDraft(appId, language) }/${ fileId }`)
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
