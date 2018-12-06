import _isObject from 'lodash/isObject'

import urls from './urls'
import decorateRequest from './utils/decorate-request'

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

export default decorateRequest({
  getGeneratedProject: req => (appId, codegenData) => {
    return req.post(`${urls.appConsole(appId)}/codegen`, codegenData)
  },

  getGenerators: req => (appId, authKey) => {
    const listGenerators = (appId, authKey) => {
      return req.api.files.loadDirectory(appId, authKey, GENERATORS_PATH, {
        pattern : JSON_PATTERN,
        sub     : false,
        pageSize: PAGE_SIZE
      })
    }

    const getFeatureFile = file => {
      return req.get(`${urls.fileView(appId, authKey, file.url, { host: req.fileDownloadURL })}`)
        .then(feature => {
          if (_isObject(feature) && !Array.isArray(feature)) {
            if (feature.icon) {
              const host = req.fileDownloadURL || ('//' + document.location.host)

              feature.icon = urls.fileView(appId, authKey, feature.icon, { host })
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
    }

    return listGenerators(appId, authKey).then(({ data }) => Promise.all(data.map(getFeatureFile)))
  },

  getCache: req => (appId, authKey) => {
    return req.get(urls.fileView(appId, authKey, CACHE_PATH, { host: req.fileDownloadURL }))
  },
})
