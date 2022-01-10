/* eslint-disable max-len */

import { DataTypes } from './constants/data'
import urls from './urls'
import totalRows from './utils/total-rows'
import { TABLE_DATA } from './utils/cache-tags'
import { tableRecordsReq, tableRecordsCountReq, buildRecordsSearch } from './utils/table'

const RELATION_URL_SUFFIX = 'relation'
const GEO_RELATION_URL_SUFFIX = 'georelation'

const COLUMNS_URL_SUFFIX = {
  [DataTypes.DATA_REF]: RELATION_URL_SUFFIX,
  [DataTypes.GEO_REF] : GEO_RELATION_URL_SUFFIX
}

const isRelType = dataType => dataType === DataTypes.DATA_REF || dataType === DataTypes.GEO_REF

const tableColumnsUrl = (appId, table) => urls.tableColumns(appId, table.name)
const tableUrl = (appId, table) => `${urls.dataTables(appId)}/${table.name}`
const removeRecordsUrl = (appId, table, removeAll) => `${tableUrl(appId, table)}/${removeAll ? 'all' : 'records'}`
const assignedUserRoles = appId => `${urls.security(appId)}/assignedroles`

export const dataTableFindUrl = (appId, tableName) => `${urls.dataTable(appId, tableName)}/find`

const updateRelationsUrl = (appId, table, columnName, recordId) => {
  return `${urls.dataRecord(appId, table.name, recordId)}/${columnName}`
}

const removeRelationsUrl = (appId, table, columnName, recordId) => {
  return `${updateRelationsUrl(appId, table, columnName, recordId)}/relations`
}

const recordsReq = (req, appId, table, query, resetCache) => {
  return tableRecordsReq(req, dataTableFindUrl(appId, table.name), table, query, resetCache)
}

const recordsCountReq = (req, appId, table, query, resetCache) => {
  const newQuery = { ...query }

  delete newQuery.property

  return tableRecordsCountReq(req, urls.dataTable(appId, table.name), table, newQuery, resetCache)
}

const getRelationColumn = (table, columnName) => {
  return [...table.relations, ...table.geoRelations].find(r => r.name === columnName)
}

export default req => ({
  get(appId, query) {
    return req.get(urls.dataTables(appId)).query(query)
      .then(resp => ({
        ...resp,
        tables: resp.tables.map(normalizeTable)
      }))
  },

  create(appId, table) {
    return req.post(urls.dataTables(appId), table).then(normalizeTable)
  },

  update(appId, table, props) {
    return req.put(tableUrl(appId, table), props).then(normalizeTable)
  },

  remove(appId, table) {
    return req.delete(tableUrl(appId, table))
  },

  async loadRecords(appId, table, query, ignoreCounter) {
    const dataRequest = recordsReq(req, appId, table, query)

    if (ignoreCounter) {
      return dataRequest
    }

    const countRequest = totalRows(req).getViaPostFor(recordsCountReq(req, appId, table, query))

    const [total, data] = await Promise.all([countRequest, dataRequest])

    return {
      totalRows: total,
      data
    }
  },

  exportRecords(appId, connectorId, table, query) {
    const { sqlSearch, where, filterString, sortBy, props } = query

    const tableName = connectorId ? `${connectorId}.${table.name}` : table.name

    const search = buildRecordsSearch(table, sqlSearch, where, filterString)

    const params = {
      sortBy,
      props,
    }

    if (search) {
      params.where = search
    }

    if (Array.isArray(params.sortBy)) {
      params.sortBy = params.sortBy.join(',')
    }

    if (Array.isArray(params.props)) {
      params.props = params.props.join(',')
    }

    if (!params.sortBy) {
      delete params.sortBy
    }

    if (!params.props) {
      delete params.props
    }

    return req.post(`${urls.dataTable(appId, tableName)}/csv`, params)
  },

  getRecordsCount(appId, table, query, resetCache) {
    return totalRows(req).getViaPostFor(recordsCountReq(req, appId, table, query, resetCache))
  },

  getRecordsCountForTables(appId, tables, connectorId, resetCache) {
    return req.post(`${urls.data(appId)}/tables-counters`, { tables, connectorId, resetCache })
  },

  getCellData(appId, tableName, recordId, columnName) {
    return req.get(`${urls.dataCell(appId, tableName, recordId, columnName)}/retrieve-value`)
  },

  createRecord(appId, table, record) {
    return req.post(urls.dataTable(appId, table.name), record).cacheTags(TABLE_DATA(table.tableId))
  },

  updateRecord(appId, table, record) {
    return req.put(urls.dataRecord(appId, table.name, record.objectId), record)
  },

  deleteRecords(appId, table, recordIds) {
    const url = removeRecordsUrl(appId, table, !recordIds)
    const removeItems = recordIds && recordIds.map(objectId => ({ objectId }))

    return req.delete(url, removeItems).cacheTags(TABLE_DATA(table.tableId))
  },

  updateRelations(appId, table, columnName, recordId, relationIds) {
    const relationColumn = getRelationColumn(table, columnName)

    return req
      .put(updateRelationsUrl(appId, table, columnName, recordId), relationIds)
      .cacheTags(TABLE_DATA(relationColumn.toTableId))
  },

  removeRelations(appId, table, columnName, recordId, relationIds) {
    const relationColumn = getRelationColumn(table, columnName)

    return req
      .delete(removeRelationsUrl(appId, table, columnName, recordId), relationIds)
      .cacheTags(TABLE_DATA(relationColumn.toTableId))
  },

  createColumn(appId, table, column) {
    const url = tableColumnsUrl(appId, table)
    const urlSuffix = COLUMNS_URL_SUFFIX[column.dataType]

    return req.post(url + (urlSuffix ? `/${urlSuffix}` : ''), column).then(resp => {
      return { ...resp, dataType: column.dataType }
    })
  },

  deleteColumn(appId, table, column) {
    const path = tableColumnsUrl(appId, table)

    if (isRelType(column.dataType)) {
      return req.delete(`${path}/${RELATION_URL_SUFFIX}/${column.name}`)
    }

    return req.delete(`${path}/${column.name}`)
  },

  updateColumn(appId, table, prevColumn, column) {
    const urlSuffix = COLUMNS_URL_SUFFIX[prevColumn.dataType] || prevColumn.name
    const url = tableColumnsUrl(appId, table)

    return req.put(`${url}/${urlSuffix}`, column).then(resp => ({
      ...resp,
      dataType: resp.dataType || prevColumn.dataType
    }))
  },

  loadConfigs(appId) {
    return req.get(urls.dataConfigs(appId))
  },

  setConfigs(appId, configs) {
    return req.put(urls.dataConfigs(appId), configs)
  },

  loadAssignedUserRoles(appId, users) {
    return req.get(assignedUserRoles(appId)).query({ users: users.join(',') })
  },

  updateAssignedUserRoles(appId, roles, users) {
    return req.put(assignedUserRoles(appId), { roles, users })
  }
})

const normalizeTable = table => ({
  ...table,
  relations   : table.relations && table.relations.map(normalizeDataRelationTableColumn) || [],
  geoRelations: table.geoRelations && table.geoRelations.map(normalizeGEORelationTableColumn) || []
})

const normalizeDataRelationTableColumn = relation => {
  return { ...relation, dataType: DataTypes.DATA_REF }
}

const normalizeGEORelationTableColumn = relation => {
  return { ...relation, dataType: DataTypes.GEO_REF }
}
