import _isObject from 'lodash/isObject'

import urls from './urls'
import files from './files'

const GENERATORS_PATH = '/codegen/generators'
const JSON_PATTERN = '*.json'
const PAGE_SIZE = 100

export const CACHE_PATH = '/codegen/cache.json/'

// TODO: remove this transformation when the format of options will be changed
const OPTION_NAMES_MAP = {
  'selections': 'options',
  'default'   : 'defaultValue',
  'tooltip'   : 'hint'
}
// TODO: remove this transformation when the format of options will be changed
const normalizeOptions = options => {
  return options && options.map(normalizeOption)
}
// TODO: remove this transformation when the format of options will be changed
const normalizeOption = option => {
  for (const key in option) {
    const normalizeName = OPTION_NAMES_MAP[key]

    if (normalizeName) {
      option[normalizeName] = option[key]
      delete option[key]
    }
  }

  return option
}

export default req => {
  const getCodegenCache = (appId, apiKey, path) => {
    return req.get(`/${urls.files(appId, apiKey)}${path}`)
  }

  const loadCodegenItem = (appId, apiKey, endpoint) => {
    return req.get(`/${urls.files(appId, apiKey)}/${endpoint}`)
  }

  const getGenerators = (appId, apiKey) => {
    const getFeatureFile = file => loadCodegenItem(appId, apiKey, file.url)
      .then(feature => {
        if (_isObject(feature) && !Array.isArray(feature)) {
          if (feature.icon) {
            feature.icon = `//${document.location.host}/${urls.files(appId, apiKey)}/${feature.icon}`
          } else {
            feature.icon = feature.icon = '//placehold.it/205'
          }
          // TODO: remove this transformation when the format of options will be changes
          feature.options = normalizeOptions(feature.options)

          return feature
        } else {
          return { error: file.name }
        }
      })

    return listCodegenGenerators(appId, apiKey).then(({ data }) => Promise.all(data.map(getFeatureFile)))
  }

  const getCache = (appId, apiKey) => getCodegenCache(appId, apiKey, CACHE_PATH)

  const listCodegenGenerators = appId => {
    return files(req).loadDirectory(appId, GENERATORS_PATH, JSON_PATTERN, false, PAGE_SIZE)
  }

  const getGeneratedProject = (appId, codegenData) => {
    return req.post(`${urls.appConsole(appId)}/codegen`, codegenData)
  }

  return {
    getGeneratedProject,
    getGenerators,
    getCache
  }
}
