import { VIEW_DATA } from './cache-tags'

export const viewRecordsReq = (req, url, view, query, resetCache) => {
  const { pageSize = 15, offset = 0 } = query

  return req.get(url)
    .query({ pageSize, offset })
    .cacheTags(VIEW_DATA(view.viewId))
    .resetCache(resetCache)
}
