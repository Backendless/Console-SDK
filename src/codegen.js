import _isObject from 'lodash/isObject'

import urls from './urls'

const GENERATORS_PATH = 'codegen/features/generators'
const JSON_PATTERN = '*.json'
const PAGE_SIZE = 100

export const CACHE_PATH = 'codegen/cache.json'

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

export default req => ({
  getGeneratedProject(appId, codegenData) {
    return req.post(`${urls.appConsole(appId)}/codegen`, codegenData)
  },

  getGenerators(appId) {
    const listGenerators = appId => {
      return req.api.files.loadDirectory(appId, GENERATORS_PATH, {
        pattern : JSON_PATTERN,
        sub     : false,
        pageSize: PAGE_SIZE
      })
    }

    const getFeatureFile = file => {
      return req.get(urls.fileView(appId, file.url))
        .then(feature => {
          if (_isObject(feature) && !Array.isArray(feature)) {
            // TODO: remove this transformation when the format of options will be changes
            feature.options = normalizeOptions(feature.options)

            return feature
          } else {
            return { error: file.name }
          }
        })
        .catch(() => undefined)
    }

    return listGenerators(appId).then(({ data }) => Promise.all(data.map(getFeatureFile)))
      .then(features => features.filter(feature => !!feature))
  },

  getCache(appId) {
    return req.get(urls.fileView(appId, CACHE_PATH))
  },
})
