import { VIEW_DATA, VIEW_GROUP_DATA } from './cache-tags'

const GroupRequestProperties = [
  'where', 'distinct', 'props', 'excludeProps', 'property', 'loadRelations',
  'groupDepth', 'relationsPageSize', 'sortBy', 'groupPath', 'groupBy'
]
const GroupCountRequestProperties = ['where', 'distinct']

const assignPropertiesIfDefined = (target, source, properties) => properties.reduce((acc, property) => {
  if (source.hasOwnProperty(property) && source[property]) {
    acc[property] = source[property]

    return acc
  }

  return acc
}, target)

export const viewRecordsReq = (req, url, view, query, resetCache) => {
  const { pageSize = 15, offset = 0 } = query

  return req.post(url, { pageSize, offset })
    .cacheTags(VIEW_DATA(view.viewId))
    .resetCache(resetCache)
}

export const viewRecordsGroupReq = (req, url, viewId, query) => {
  const { offset = 0, pageSize = 15, groupPageSize = 5, recordsPageSize = 5 } = query

  const params = { offset, pageSize, groupPageSize, recordsPageSize }

  assignPropertiesIfDefined(params, query, GroupRequestProperties)

  return req.post(url, params).cacheTags(VIEW_GROUP_DATA(viewId))
}

export const viewRecordsGroupCountReq = (req, url, query) => {
  const { groupPath } = query

  const params = { groupPath }

  assignPropertiesIfDefined(params, query, GroupCountRequestProperties)

  return req.post(url, params)
}
