import _each from 'lodash/each'

import urls from './urls'

import { BL_MODELS, BL_CHAIN } from './utils/cache-tags'
import { encodePath } from './utils/path'

const hostedServices = appId => `${ urls.blBasePath(appId) }/generic`
const codelessServices = appId => `${ urls.blBasePath(appId) }/codeless`
const jsServices = appId => `${ urls.blBasePath(appId) }/js`
const marketplaceServices = appId => `${ urls.blBasePath(appId) }/marketplace`

const hostedServiceConfig = (appId, serviceId) => `${ hostedServices(appId) }/configure/${ serviceId }`
const marketplaceServiceConfig = (appId, serviceName, modelName) =>
  `${ marketplaceServices(appId) }/configure/${modelName}/${ serviceName }`

const MODES = {
  MARKETPLACE: 'MARKETPLACE',
  PROD       : 'PRODUCTION',
  DEBUG      : 'DEBUG',
  DRAFT      : 'DRAFT'
}

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

const normalizeHandler = handler => {
  if (handler.mode === MODES.MARKETPLACE) {
    handler.mode = MODES.PROD
    handler.fromMarketplace = true
  }

  return handler
}

const normalizeHandlers = handlers => handlers.map(normalizeHandler)

export default req => ({
  getServices(appId) {
    return req.get(urls.blBasePath(appId))
      .then(services => services.map(normalizeService))
    // TODO: remove this transformation when the format of config will be changes [CONSOLE-599]
  },

  getServiceSpec(appId, serviceId, transformSpec = true) {
    const result = req.get(`${ urls.blBasePath(appId) }/${ serviceId }/api-docs`)

    if (transformSpec) {
      return result.then(parseServiceSpec)
    }

    return result
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
      formData.append('model', data.model)
    }

    return req.post(`${ urls.blBasePath(appId) }/generic`, formData)
      .then(services => services.map(normalizeService))
    // TODO: remove this transformation when the format of config will be changed [CONSOLE-599]
  },

  createAWSLambdaService(appId, credentials) {
    return req.post(`${ urls.blBasePath(appId) }/aws-lambda`, { ...credentials, appId })
  },

  createCodelessService(appId, service) {
    return req
      .post(codelessServices(appId), service)
      .cacheTags(BL_MODELS(appId, 'CODELESS'))
  },

  createJsService(appId, service) {
    return req
      .post(jsServices(appId), service)
      .cacheTags(BL_MODELS(appId, 'JS'))
  },

  updateCodelessService(appId, serviceId, updates) {
    return req.put(`${ codelessServices(appId) }/${ serviceId }`, updates)
  },

  deleteCodelessService(appId, serviceId) {
    return req.delete(`${ codelessServices(appId) }/${ serviceId }`)
  },

  createCodelessMethod(appId, serviceId, method) {
    return req.post(`${ codelessServices(appId) }/${ serviceId }/`, method)
  },

  updateCodelessMethod(appId, serviceId, methodId, method) {
    return req.put(`${ codelessServices(appId) }/${ serviceId }/${ methodId }`, method)
  },

  deleteCodelessMethod(appId, serviceId, methodId) {
    return req.delete(`${ codelessServices(appId) }/${ serviceId }/${ methodId }`)
  },

  getCodelessMethodLogic(appId, serviceId, methodId) {
    return req.get(`${ codelessServices(appId) }/${ serviceId }/${ methodId }/logic`)
  },

  deployCodelessMethodLogic(appId, serviceId, methodId, logic, params) {
    return req.put(`${ codelessServices(appId) }/${ serviceId }/${ methodId }/logic`, logic).query(params)
  },

  deleteService(appId, serviceId) {
    return req.delete(hostedServices(appId), [serviceId])
  },

  updateService(appId, serviceId, updates) {
    return req.put(`${ hostedServices(appId) }/${ serviceId }/update`, updates)
  },

  updateServiceDefaultModel(appId, updates) {
    return req.put(`${urls.blBasePath(appId)}/default-model`, updates)
  },

  loadServiceConfig(appId, serviceId) {
    return req.get(hostedServiceConfig(appId, serviceId))
  },

  setServiceConfig(appId, serviceId, config) {
    return req.post(hostedServiceConfig(appId, serviceId), config)
  },

  setMarketplaceServiceConfig(appId, serviceName, modelName, config) {
    return req.post(marketplaceServiceConfig(appId, serviceName, modelName), config)
  },

  testServiceConfig(appId, serviceId, config) {
    return req.post(hostedServiceConfig(appId, `test/${serviceId}`), config)
  },

  getDraftFiles(appId, language, model) {
    return req.get(urls.blDraft(appId, language, model))
  },

  saveDraftFiles(appId, language, model, files, sync = true) {
    const encodedFiles = files.map(({ id, ...rest }) => ({ id: encodePath(id), ...rest }))

    return req.put(urls.blDraft(appId, language, model), encodedFiles).query({ sync })
  },

  deployDraftFiles(appId, language, model, files, sync = true) {
    return req.put(urls.blProd(appId, language, model), files).query({ sync })
  },

  getDraftFileContent(appId, language, model, fileId) {
    return req.get(`${ urls.blDraft(appId, language, model) }/${ encodePath(fileId) }`)
  },

  getLanguages() {
    return req.get(`${ urls.console() }/servercode/languages`)
  },

  getModels(appId, language) {
    return req
      .get(`${ urls.serverCode(appId) }/models/${ language }`)
      .cacheTags(BL_MODELS(appId, language))
  },

  getAllModels(appId) {
    return req.get(`${ urls.serverCode(appId) }/models`)
  },

  createModel(appId, language, model) {
    const data = { appId, language, model }

    return req.post(`${ urls.serverCode(appId) }/models/create`, data)
  },

  createEventHandler(appId, handler) {
    const { category, mode, ...data } = handler

    return req
      .post(urls.blHandlersCategory(appId, mode, category), data)
      .cacheTags(BL_MODELS(appId, handler.language))
  },

  updateEventHandler(appId, handler) {
    const { id, category, fromMarketplace } = handler

    if (fromMarketplace)  {
      handler.mode = MODES.MARKETPLACE
    }

    const url = `${ urls.blHandlersCategory(appId, handler.mode, category) }/${ id }`

    return req.put(url, handler).then(normalizeHandler)
  },

  getEventHandlers(appId, modes = []) {
    return req.get(urls.serverCode(appId)).query({ mode: modes }).then(normalizeHandlers)
  },

  deleteEventHandler(appId, handler) {
    const { id, mode, category } = handler

    const url = `${ urls.blHandlersCategory(appId, mode, category) }/${ id }`

    return req.delete(url)
  },

  getHandlerInvocationChain(appId, eventId, context) {
    return req.get(urls.blHandlersChain(appId, eventId, context))
      .cacheTags(BL_CHAIN(appId, eventId, context))
  },

  updateHandlerInvocationChain(appId, eventId, context, updates) {
    return req.put(urls.blHandlersChain(appId, eventId, context), updates)
      .cacheTags(BL_CHAIN(appId, eventId, context))
  },

  invokeTimer(appId, timer) {
    const { timername, mode, category } = timer

    //POST /:applicationId/console/servercode/:mode/timers/:timerName/run
    return req.post(`${ urls.blHandlersCategory(appId, mode, category) }/${ timername }/run`)
  },

  changeHandlerState(appId, mode, category, timerId, enabled) {
    return req.put(`${urls.blHandlersCategory(appId, mode, category)}/${ timerId }/state`, { enabled })
  },

  getCategories(appId) {
    return req.get(`${ urls.serverCode(appId) }/categories`)
  },

  getEvents(appId) {
    return req.get(`${ urls.serverCode(appId) }/events`)
  },

  getTimerLogs(appId, query) {
    return req.get(`${urls.serverCode(appId)}/timers/logs`)
      .query(query)
  }
})
