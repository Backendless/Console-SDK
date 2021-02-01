import { VIEW_DATA, VIEW_GROUPING_DATA, VIEW_GROUP_DATA } from './cache-tags'

const PropertiesToMap = [
  'whereClause', 'distinct', 'sortBy',
  'relatedProps', 'relationsPageSize', 'groupBy',
  'props', 'excludeProps', 'property'
]

const assignPropertiesIfDefined = (target, source, properties = []) => {
  properties.forEach(property => {
    if (source.hasOwnProperty(property) && source[property]) {
      target[property] = source[property]
    }
  })
}

export const viewRecordsReq = (req, url, view, query, resetCache) => {
  const { pageSize = 15, offset = 0 } = query

  return req.get(url)
    .query({ pageSize, offset })
    .cacheTags(VIEW_DATA(view.viewId))
    .resetCache(resetCache)
}

const composeGroupReqParams = query => {
  const { offset = 0, pageSize = 15, groupPageSize = 5, recordsPageSize = 5 } = query

  const params = { offset, pageSize, groupPageSize, recordsPageSize }

  assignPropertiesIfDefined(params, query, PropertiesToMap)

  return params
}

export const viewRecordsGroupingReq = (req, url, viewId, query) => {
  const params = composeGroupReqParams(query)

  return req.get(url)
    .query(params)
    .cacheTags(VIEW_GROUPING_DATA(viewId))
}

export const viewRecordsGroupReq = (req, url, viewId, query) => {
  const params = composeGroupReqParams(query)

  if (query.groupPath) {
    params.groupPath = query.groupPath
  }

  return req.post(url, params).cacheTags(VIEW_GROUP_DATA(viewId))
}
