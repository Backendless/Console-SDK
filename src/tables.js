/* eslint-disable max-len */

import {
  DataTypes,
  PRIMITIVES,
  USERS_TABLE,
  NON_SEARCHABLE_COLUMNS,
  NON_SEARCHABLE_USERS_COLUMNS
} from './constants/data'

import urls from './urls'
import totalRows from './utils/total-rows'
import SQL from './utils/sql-builder'
import { TABLE_DATA } from './utils/cache-tags'

const sqlLike = part => `like '%${part}%'`

const DATETIME_PATTERN = /[\w]?/

const TIME_PATTERN = /^((([01]?[0-9]{1}|[2]{1}[0-3]{1})?)?(:([0-5]?[0-9])?)?(:([0-5]?[0-9])))?[ ]?(G|GM|GMT|GMT\+|GMT\+[0-9]+[ ]?)?$/

const BOOLEAN_SQL_VALUES = {
  'true' : '%3D 1',
  'false': '%3D 0',
  'null' : 'IS NULL'
}

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

const updateRelationsUrl = (appId, table, columnName, recordId) => {
  return `${urls.dataRecord(appId, table.name, recordId)}/${columnName}`
}

const removeRelationsUrl = (appId, table, columnName, recordId) => {
  return `${updateRelationsUrl(appId, table, columnName, recordId)}/relations`
}

const recordsReq = (req, appId, table, query = {}) => {
  const { pageSize = 15, offset = 0, sqlSearch, where, sortField, sortDir, filterString } = query

  const params = { pageSize, offset }
  const search = buildRecordsSearch(table, sqlSearch, where, filterString)

  if (search) {
    params.where = search
  }

  if (sortField && sortDir) {
    params.sortBy = `${sortField} ${sortDir}`
  }

  return req.get(urls.dataTable(appId, table.name))
    .query(params)
    .cacheTags(TABLE_DATA(table.tableId))
}

const getRelationColumn = (table, columnName) => {
  return [...table.relations, ...table.geoRelations].find(r => r.name === columnName)
}

export default req => ({
  get(appId) {
    return req.get(urls.dataTables(appId)).then(resp => ({ ...resp, tables: resp.tables.map(normalizeTable) }))
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

  loadRecords(appId, table, query) {
    return totalRows(req).getWithData(recordsReq(req, appId, table, query))
  },

  getRecordsCount(appId, table, query){
    return totalRows(req).getFor(recordsReq(req, appId, table, query))
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

    if (isRelType(column.dataType)) {
      column.columnName = column.name
    }

    return req.post(url + (urlSuffix ? `/${urlSuffix}` : ''), column).then(resp => {
      return { ...resp, name: resp.columnName || resp.name, dataType: column.dataType }
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

    if (isRelType(column.dataType)) {
      column.columnName = column.name
    }

    return req.put(`${url}/${urlSuffix}`, column).then(resp => ({
      ...resp,
      name    : resp.columnName || resp.name,
      dataType: resp.dataType || prevColumn.dataType
    }))
  },

  loadConfigs(appId) {
    return req.get(urls.dataConfigs(appId))
  },

  setConfigs(appId, configs) {
    return req.put(urls.dataConfigs(appId), configs)
  },

  loadAssignedUserRoles(appId, users){
    return req.get(assignedUserRoles(appId)).query({ users: users.join(',') })
  },

  updateAssignedUserRoles(appId, roles, users){
    return req.put(assignedUserRoles(appId), { roles, users })
  }
})

const normalizeTable = table => ({
  ...table,
  relations   : table.relations && table.relations.map(normalizeDataRelationTableColumn) || [],
  geoRelations: table.geoRelations && table.geoRelations.map(normalizeGEORelationTableColumn) || []
})

const normalizeDataRelationTableColumn = ({ columnName, ...relation }) => {
  return { ...relation, name: columnName, dataType: DataTypes.DATA_REF }
}

const normalizeGEORelationTableColumn = ({ columnName, ...relation }) => {
  return { ...relation, name: columnName, dataType: DataTypes.GEO_REF }
}

const buildRecordsSearch = (table, sql, searchString, filterString) => {
  searchString = searchString ? searchString.trim() : ''

  const searchSQL = (sql || !searchString) ? searchString : searchStringToSQLFormat(table, searchString)

  return SQL.combine(filterString, searchSQL)
}

const searchStringToSQLFormat = (table, searchValue) => {
  const ignoreColumns = table.name === USERS_TABLE ? NON_SEARCHABLE_USERS_COLUMNS : NON_SEARCHABLE_COLUMNS

  const sqlParts = []

  table.columns.forEach(column => {
    if (!ignoreColumns.includes(column.name)) {
      const sqlFragment = getSQLQueryForColumn(searchValue, column.dataType)

      if (sqlFragment) {
        sqlParts.push(`${column.name} ${sqlFragment}`)
      }
    }
  })

  return sqlParts.join(' or ')
}

const getSQLQueryForColumn = (searchString, columnType) => {
  if (PRIMITIVES.includes(columnType)) {
    return sqlLike(searchString)
  }

  if (DataTypes.BOOLEAN === columnType) {
    return BOOLEAN_SQL_VALUES[searchString.toLowerCase()]
  }

  if (DataTypes.DATETIME === columnType) {
    if (TIME_PATTERN.test(searchString)) {
      const timeQuery = searchString.replace(/^(\d{1,2}):(\d{1,2})(:(\d{1,4}))?/, (match, hh, mm, ssW, ss) => {
        const hours = hh.length === 1 ? '0' + hh : hh
        const minutes = mm.length === 1 ? '0' + mm : mm
        const seconds = ss && ss.length === 1 ? '0' + ss : ss

        //with seconds => 14:47:29
        //without seconds => 14:47
        return `${hours}:${minutes}${seconds ? (':' + seconds) : ''}`
      })

      return sqlLike(timeQuery)
    }

    if (DATETIME_PATTERN.test(searchString)) {
      const dateTimeQuery = searchString.replace(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{1,4})/, (match, m, d, year) => {
        const month = m.length === 1 ? '0' + m : m
        const day = d.length === 1 ? '0' + d : d

        //1990-04-28
        return `${year}-${month}-${day}`
      })

      return sqlLike(dateTimeQuery)
    }
  }
}
