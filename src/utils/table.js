/* eslint-disable max-len */

import {
  DataTypes,
  PRIMITIVES,
  USERS_TABLE,
  NON_SEARCHABLE_COLUMNS,
  NON_SEARCHABLE_USERS_COLUMNS
} from '../constants/data'

import SQL from './sql-builder'
import { TABLE_DATA } from './cache-tags'

const sqlLike = part => `like '%${part}%'`

const DATETIME_PATTERN = /[\w]?/

const TIME_PATTERN = /^((([01]?[0-9]{1}|[2]{1}[0-3]{1})?)?(:([0-5]?[0-9])?)?(:([0-5]?[0-9])))?[ ]?(G|GM|GMT|GMT\+|GMT\+[0-9]+[ ]?)?$/

const BOOLEAN_SQL_VALUES = {
  'true' : '= true',
  'false': '= false',
  'null' : 'IS NULL'
}

export const composeRequestParams = (table, query) => {
  const { pageSize = 15, offset = 0, sqlSearch, where, sortField, sortDir, filterString } = query
  const { property, groupBy, having, distinct, loadRelations, sortBy, props } = query

  const params = { pageSize, offset }
  const search = buildRecordsSearch(table, sqlSearch, where, filterString)

  if (search) {
    params.where = search
  }

  if (sortBy) {
    params.sortBy = sortBy
  } else if (sortField && sortDir) {
    params.sortBy = `${sortField} ${sortDir}`
  }

  if (property) {
    params.property = property
  }

  if (props) {
    params.props = props
  }

  if (groupBy) {
    params.groupBy = groupBy
  }

  if (having) {
    params.having = having
  }

  if (distinct) {
    params.distinct = distinct
  }

  if (loadRelations) {
    params.loadRelations = loadRelations
  }

  return params
}

export const tableRecordsReq = (req, url, table, query = {}, resetCache) => {
  const params = composeRequestParams(table, query)

  return req.post(url, params)
    .cacheTags(TABLE_DATA(table.tableId))
    .resetCache(resetCache)
}

export const tableRecordsCountReq = (req, url, table, query = {}, resetCache) => {
  const params = composeRequestParams(table, query)

  return req.post(url, params)
    .cacheTags(TABLE_DATA(table.tableId))
    .resetCache(resetCache)
}

export const buildRecordsSearch = (table, sql, searchString, filterString) => {
  searchString = searchString ? searchString.trim() : ''

  const searchSQL = (sql || !searchString) ? searchString : searchStringToSQLFormat(table, searchString)

  return SQL.and(filterString, searchSQL)
}

const searchStringToSQLFormat = (table, searchValue) => {
  const ignoreColumns = table.name === USERS_TABLE ? NON_SEARCHABLE_USERS_COLUMNS : NON_SEARCHABLE_COLUMNS

  const sqlParts = []

  table.columns.forEach(column => {
    if (!ignoreColumns.includes(column.name)) {
      const sqlFragment = getSQLQueryForColumn(searchValue, column.dataType)

      if (sqlFragment) {
        sqlParts.push(`${wrapQueryColumnName(column.name)} ${sqlFragment}`)
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

function shouldWrap(path) {
  if (path && path.startsWith('`') && path.endsWith('`')) {
    return false
  }

  if (path.includes('[') && path.includes(']')) {
    return false
  }

  return true
}

export function wrapQueryColumnName(columnName) {
  return columnName.split('.')
    .map(path => shouldWrap(path) ? `\`${path}\`` : path)
    .join('.')
}
