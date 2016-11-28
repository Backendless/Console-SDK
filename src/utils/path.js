import _pickBy from 'lodash/pickBy'
import _castArray from 'lodash/castArray'

const defined = value => value !== undefined

/**
 * Produces a URL query string from a given obj by iterating through the object's "own properties".
 * @param {Object} obj
 * @returns {string}
 */
export const toQueryString = obj => {
  const tokens = []

  Object.keys(_pickBy(obj, defined)).forEach(key => {
    _castArray(obj[key]).forEach(value => {
      tokens.push(`${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`)
    })
  })

  return tokens.join('&')
}

export const trimQueryParams = (path, paramsToTrim) => {
  const pathTokens = path.split('?')
  const url = pathTokens[0]
  const params = pathTokens[1] || ''
  const paramsTokens = params.split('&')

  const filteredParams = paramsToTrim && paramsToTrim.length
    ? paramsTokens.filter(param => paramsToTrim.indexOf(param.split('=')[0]) === -1)
    : []

  const filteredQuery = filteredParams.join('&')

  return filteredQuery ? `${url}?${filteredQuery}` : url
}
