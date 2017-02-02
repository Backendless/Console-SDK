import urls from './urls'
import totalRows from './utils/total-rows'
import SQL from './utils/sql-builder'
import { GEO_CATEGORY } from './utils/cache-tags'
import { toQueryString } from './utils/path'

const toServerFence = ({ objectId, name, qualCriteria, type, nodes }) => ({
  name,
  objectId,
  qualCriteria,
  fence: {
    nodes,
    type
  }
})

const fromServerFence = ({ objectId, name, qualCriteria, fence, events, isActive }) => ({
  name,
  events,
  objectId,
  qualCriteria,
  isActive,
  ...fence
})

const categoriesUrl = appId => urls.geo(appId) + '/categories'
const pointsUrl = appId => urls.geo(appId) + '/points'
const rectUrl = appId => urls.geo(appId) + '/rect'
const categoryPointsUrl = (appId, category) => `${urls.geo(appId)}/${category}/points`
const fenceUrl = (appId, fenceId) => urls.geo(appId) + '/fence' + (fenceId ? `/${fenceId}` : '')

export default req => {

  const getCategories = appId => {
    return req.get(categoriesUrl(appId))
  }

  const addCategory = (appId, name) => {
    return req
      .post(categoriesUrl(appId) + '/' + name, { name })
      .cacheTags(GEO_CATEGORY(name))
  }

  const deleteCategory = (appId, name) => {
    return req
      .delete(categoriesUrl(appId) + '/' + name)
      .cacheTags(GEO_CATEGORY(name))
  }

  const renameCategory = (appId, category, name) => {
    const { objectId } = category

    return req.put(categoriesUrl(appId) + '/' + category.name, { name, objectId })
  }

  const calculateDegreesPerPixel = (bounds, zoomLevel, width) => {
    const lonDistance = (bounds.east - bounds.west) * Math.pow(2, zoomLevel)

    let degree = lonDistance * Math.pow(2, -zoomLevel)

    if (degree < 0) {
      degree += 360
    }

    return degree / width
  }

  const getFences = appId => {
    return req.get(urls.geo(appId) + '/fences').then(result => result.map(fromServerFence))
  }

  const saveFence = (appId, fence) => {
    const body = toServerFence(fence) //TODO: create server ticket

    if (fence.objectId) {
      return req.put(urls.geo(appId) + '/fence/' + fence.objectId, body).then(fromServerFence)
    }

    return req.post(fenceUrl(appId), body).then(fromServerFence)
  }

  const saveFenceAction = (appId, fenceId, event, action) => {
    return req.post(`${fenceUrl(appId, fenceId)}/${event.toLowerCase()}`, action || {})
  }

  const executeFenceEvent = (appId, fenceId, event) => {
    return req.post(`${fenceUrl(appId, fenceId)}/run/${event.toLowerCase()}`)
  }

  const deleteFence = (appId, fenceId) => {
    return req.delete(fenceUrl(appId, fenceId))
  }

  const activateFence = (appId, fenceId, applyOnStay = false) => {
    return req.put(`${fenceUrl(appId, fenceId)}/activate`, { applyOnStay })
  }

  const deactivateFence = (appId, fenceId) => {
    return req.put(`${fenceUrl(appId, fenceId)}/deactivate`)
  }

  const getPoints = (appId, category, params = {}) => {
    const { offset = 0, pageSize = 15, relationsParams } = params

    const pageParams = {
      offset,
      pagesize: pageSize
    }

    if (relationsParams) {
      return loadPointsAsRelations(appId, params, pageParams).then(({ totalRows, data }) => {
        const objectIds = data.map(point => point.objectId)

        return loadPoints(appId, category, params, pageParams, objectIds).then(points => {
          const sortedPoints = []

          points.forEach(point => {
            sortedPoints[objectIds.indexOf(point.objectId)] = point
          })

          return { totalRows, data: sortedPoints }
        })
      })
    }

    return totalRows(req).getWithData(loadPoints(appId, category, params, pageParams))
  }

  const loadPoints = (appId, category, params, pageParams, objectIds = []) => {
    const { where, includemetadata = true, filterString, relationsParams } = params
    const { mapBounds, mapDriven, mapZoom, mapWidth, clustering } = params
    const { radiusDriven, radiusCenter, radius, radiusUnits } = params

    const whereClauseParts = [where, filterString]

    if (objectIds.length) {
      delete pageParams.offset

      whereClauseParts.push(`(objectId IN ('${objectIds.join("', '")}'))`)
    }

    const queryParams = {
      ...pageParams,
      includemetadata,
      categories: category,
      where     : SQL.combine(...whereClauseParts)
    }

    if (mapDriven && !relationsParams) {
      if (radiusDriven) {
        queryParams.lat = radiusCenter.lat
        queryParams.lon = radiusCenter.lng
        queryParams.r = radius
        queryParams.units = radiusUnits.toUpperCase()
      } else {
        queryParams.nwlat = mapBounds.north
        queryParams.nwlon = mapBounds.west
        queryParams.selat = mapBounds.south
        queryParams.selon = mapBounds.east
      }

      if (clustering) {
        queryParams.dpp = calculateDegreesPerPixel(mapBounds, mapZoom, mapWidth)
      }
    }

    const nonRadiusMapDrivenSearch = mapDriven && !radiusDriven && !relationsParams
    const url = nonRadiusMapDrivenSearch ? rectUrl(appId) : pointsUrl(appId)

    return req.get(url)
      .query(queryParams)
      .cacheTags(GEO_CATEGORY(category))
  }

  const loadPointsAsRelations = (appId, params, pageParams) => {
    const { where, filterString, relationsParams } = params
    const { mapDriven, radiusDriven, radiusCenter, radius, radiusUnits } = params
    const { tableName, objectId, name, related } = relationsParams

    const whereClauseParts = [where, filterString]

    if (mapDriven && radiusDriven) {
      const DISTANCE_UNITS = {
        miles     : 'mi',
        yards     : 'yd',
        kilometers: 'km',
        meters    : 'km'
      }

      const { lat, lng } = radiusCenter
      const unit = DISTANCE_UNITS[radiusUnits]
      const r = radiusUnits === 'meters' ? radius * 1000 : radius

      whereClauseParts.push(
        `distance(${lat}, ${lng}, latitude, longitude) < ${unit}(${r})`
      )
    }

    const queryParams = {
      ...pageParams,
      where  : SQL.combine(...whereClauseParts),
      related
    }

    const dataReq = req.get(`${urls.dataRecord(appId, tableName, objectId)}/${name}`).query(queryParams)

    return totalRows(req).getWithData(dataReq)
  }

  const getFencePoints = (appId, fenceId) => {
    return req.get(`${fenceUrl(appId, fenceId)}/geopoints`)
      .then(data => ({ data: data, totalPoints: data.length }))
  }

  const deletePoints = (appId, category, pointsIds) => {
    return req
      .delete(categoryPointsUrl(appId, category), pointsIds)
      .cacheTags(GEO_CATEGORY(category))
  }

  const addPoint = (appId, lat, lon) => {
    return req.put(pointsUrl(appId) + '?' + toQueryString({ lat, lon }))
  }

  const copyPoints = (appId, pointsIds, targetCategory) => {
    return req.put(urls.geo(appId) + '/' + targetCategory, pointsIds)
      .cacheTags(GEO_CATEGORY(targetCategory))
  }

  const setPointMeta = (appId, pointId, meta) => {
    return req.put(`${urls.geo(appId)}/${pointId}/meta`, meta)
  }

  const addPointMetaRelations = (appId, pointId, meta) => {
    return req.patch(`${urls.geo(appId)}/${pointId}/meta`, meta)
  }

  const removePointMetaRelations = (appId, pointId, meta) => {
    return req.delete(`${urls.geo(appId)}/${pointId}/meta`, meta)
  }

  const reset = appId => {
    return req
      .delete(urls.geo(appId))
      .cacheTags(GEO_CATEGORY())
  }

  const sampleSetup = appId => {
    return req
      .post(urls.geo(appId) + '/samplesetup')
      .cacheTags(GEO_CATEGORY())
  }

  return {
    getCategories,
    addCategory,
    renameCategory,
    deleteCategory,
    getPoints,
    getFencePoints,
    getFences,
    saveFence,
    saveFenceAction,
    executeFenceEvent,
    deleteFence,
    activateFence,
    deactivateFence,
    addPoint,
    deletePoints,
    copyPoints,
    sampleSetup,
    setPointMeta,
    addPointMetaRelations,
    removePointMetaRelations,
    reset
  }
}
