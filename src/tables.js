/* eslint-disable max-len */

import { DataTypes } from './constants/data'
import urls from './urls'
import totalRows from './utils/total-rows'
import { TABLE_DATA } from './utils/cache-tags'
import { tableRecordsReq, tableRecordsCountReq, buildRecordsSearch } from './utils/table'
import { prepareRoutes } from './utils/routes'

const RELATION_URL_SUFFIX = 'relation'
const GEO_RELATION_URL_SUFFIX = 'georelation'

const COLUMNS_URL_SUFFIX = {
  [DataTypes.DATA_REF]: RELATION_URL_SUFFIX,
  [DataTypes.GEO_REF] : GEO_RELATION_URL_SUFFIX
}

const isRelType = dataType => dataType === DataTypes.DATA_REF || dataType === DataTypes.GEO_REF

const tableColumnsUrl = (appId, table) => urls.tableColumns(appId, table.name)
const tableUrl = (appId, table) => `${urls.dataTables(appId)}/${encodeURI(table.name)}`
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

const routes = prepareRoutes({
  tableOwnerPolicyDelayCheck: '/:appId/console/data/tables/:tableName/acl/owner-policy-delay-check',
})

class Tables {
  constructor(req) {
    this.req = req
    this.serviceName = 'tables'
  }

  /**
   * @typedef {Object} get__query
   * @paramDef {"type":"boolean","label":"Force Refresh","name":"forceRefresh","required":false,"description":"Force refresh of tables data from the server, bypassing cache"}
   */

  /**
   * @aiToolName Get Tables
   * @category Data
   * @description Get all tables for an application with optional cache refresh
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"get__query","name":"query","label":"Query Parameters","description":"Query parameters including force refresh option","required":false}
   * @sampleResult {"mode":"internal","tables":[{"tableId":"83C2C5B4-2249-48F2-816A-CA009958A64F","view":false,"name":"Users","dataConnector":false,"columns":[{"columnId":"4827244D-CE8D-4C31-8258-392E2100552A","name":"objectId","dataType":"STRING_ID","isPrimaryKey":true},{"columnId":"1D8C7FFF-19BB-4B79-9D5F-ECE91F4772AB","name":"name","dataType":"STRING","isPrimaryKey":false}],"relations":[],"system":true,"parentRelations":[],"geoRelations":[]}]}
   */
  get(appId, query) {
    return this.req.get(urls.dataTables(appId)).query(query)
      .then(resp => ({
        ...resp,
        tables: resp.tables.map(normalizeTable)
      }))
  }

  /**
   * @typedef {Object} create__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to create"}
   */

  /**
   * @aiToolName Create Table
   * @category Data
   * @description Create a new data table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"create__table","name":"table","label":"Table Data","description":"Object containing table name and configuration","required":true}
   * @sampleResult {"tableId":"table123","view":false,"name":"NewTable","dataConnector":false,"columns":[{"columnId":"col123","name":"objectId","dataType":"STRING_ID","isPrimaryKey":true}],"relations":[],"system":false,"parentRelations":null,"geoRelations":[]}
   */
  create(appId, table) {
    return this.req.post(urls.dataTables(appId), table).then(normalizeTable)
  }

  /**
   * @typedef {Object} update__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The current name of the table to update"}
   */

  /**
   * @typedef {Object} update__props
   * @paramDef {"type":"string","label":"New Name","name":"name","required":true,"description":"The new name for the table"}
   */

  /**
   * @aiToolName Update Table
   * @category Data
   * @description Update a data table name
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"update__table","name":"table","label":"Table Object","description":"Object containing current table name","required":true}
   * @paramDef {"type":"update__props","name":"props","label":"Update Properties","description":"Object containing the new table name","required":true}
   * @sampleResult {"name":"UpdatedTable","tableId":"table123","columns":[{"columnId":"col123","name":"objectId","dataType":"STRING_ID","isPrimaryKey":true}],"relations":[],"geoRelations":[]}
   */
  update(appId, table, props) {
    return this.req.put(tableUrl(appId, table), props).then(normalizeTable)
  }

  /**
   * @typedef {Object} remove__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to remove"}
   */

  /**
   * @aiToolName Remove Table
   * @category Data
   * @description Remove a data table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"remove__table","name":"table","label":"Table Object","description":"Object containing table name to remove","required":true}
   * @sampleResult true
   */
  remove(appId, table) {
    return this.req.delete(tableUrl(appId, table))
  }

  /**
   * @typedef {Object} loadRecords__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to load records from"}
   */

  /**
   * @typedef {Object} loadRecords__query
   * @paramDef {"type":"number","label":"Page Size","name":"pageSize","required":false,"description":"Number of records to retrieve (default: 15)"}
   * @paramDef {"type":"number","label":"Offset","name":"offset","required":false,"description":"Starting position for record retrieval (default: 0)"}
   * @paramDef {"type":"string","label":"Where Clause","name":"where","required":false,"description":"WHERE clause condition for filtering records (e.g., \"coll='value'\")"}
   * @paramDef {"type":"array","label":"Properties","name":"property","required":false,"description":"Array of specific properties to retrieve (e.g., [\"`created`\", \"`objectId`\"])"}
   * @paramDef {"type":"string","label":"Group By","name":"groupBy","required":false,"description":"Field to group results by (e.g., \"objectId\")"}
   */

  /**
   * @aiToolName Load Records
   * @category Data
   * @description Load records from a data table with flexible query options
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"loadRecords__table","name":"table","label":"Table Object","description":"Object containing table name","required":true}
   * @paramDef {"type":"loadRecords__query","name":"query","label":"Query Parameters","description":"Query options for filtering, sorting, and pagination","required":false}
   * @paramDef {"type":"boolean","name":"ignoreCounter","label":"Ignore Counter","description":"Whether to ignore the row counter for better performance","required":false}
   * @sampleResult {"totalRows":4,"data":[{"coll":null,"created":1757609268010,"___class":"testTable","ownerId":null,"updated":null,"objectId":"SAMPLE-ID-1"},{"coll":"sample_value","created":1757609221217,"___class":"testTable","ownerId":null,"updated":1757609259012,"objectId":"SAMPLE-ID-2"}]}
   */
  async loadRecords(appId, table, query, ignoreCounter) {
    const dataRequest = recordsReq(this.req, appId, table, query)

    if (ignoreCounter) {
      return dataRequest
    }

    const countRequest = totalRows(this.req).getViaPostFor(recordsCountReq(this.req, appId, table, query))

    const [total, data] = await Promise.all([countRequest, dataRequest])

    return {
      totalRows: total,
      data
    }
  }

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

    return this.req.post(`${urls.dataTable(appId, tableName)}/csv`, params)
  }

  /**
   * @typedef {Object} getRecordsCount__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to count records in"}
   * @paramDef {"type":"string","label":"Table ID","name":"tableId","required":true,"description":"The unique identifier of the table"}
   * @paramDef {"type":"array","label":"Relations","name":"relations","required":false,"description":"Array of relation objects (obtained from get tables method)"}
   * @paramDef {"type":"array","label":"Geo Relations","name":"geoRelations","required":false,"description":"Array of geo relation objects (obtained from get tables method)"}
   */

  /**
   * @aiToolName Get Records Count
   * @category Data
   * @description Get the count of records in a table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"getRecordsCount__table","name":"table","label":"Table Object","description":"Full table object (obtain from tables.get() method)","required":true}
   * @paramDef {"type":"object","name":"query","label":"Query","description":"The query parameters for filtering records","required":false}
   * @paramDef {"type":"boolean","name":"resetCache","label":"Reset Cache","description":"Whether to reset the cache","required":false}
   * @sampleResult 150
   */
  getRecordsCount(appId, table, query, resetCache) {
    return totalRows(this.req).getViaPostFor(recordsCountReq(this.req, appId, table, query, resetCache))
  }

  /**
   * @typedef {Object} getCount__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to count records in"}
   * @paramDef {"type":"string","label":"Table ID","name":"tableId","required":true,"description":"The unique identifier of the table"}
   * @paramDef {"type":"array","label":"Relations","name":"relations","required":false,"description":"Array of relation objects (obtained from get tables method)"}
   * @paramDef {"type":"array","label":"Geo Relations","name":"geoRelations","required":false,"description":"Array of geo relation objects (obtained from get tables method)"}
   */

  /**
   * @aiToolName Get Count
   * @category Data
   * @description Get the count of records matching a query
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"getCount__table","name":"table","label":"Table Object","description":"Full table object (obtain from tables.get() method)","required":true}
   * @paramDef {"type":"object","name":"query","label":"Query","description":"The query parameters for filtering records","required":false}
   * @sampleResult 75
   */
  getCount(appId, table, query) {
    return totalRows(this.req).getFor(recordsCountReq(this.req, appId, table, query))
  }

  /**
   * @aiToolName Get Records Count For Tables
   * @category Data
   * @description Get record counts for multiple tables
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"array","name":"tables","label":"Tables","description":"Array of table names","required":true}
   * @paramDef {"type":"string","name":"connectorId","label":"Connector ID","description":"The connector identifier","required":false}
   * @paramDef {"type":"boolean","name":"resetCache","label":"Reset Cache","description":"Whether to reset the cache","required":false}
   * @sampleResult {"Users":150,"Orders":75,"Products":300}
   */
  getRecordsCountForTables(appId, tables, connectorId, resetCache) {
    return this.req.post(`${urls.data(appId)}/tables-counters`, { tables, connectorId, resetCache })
  }

  /**
   * @aiToolName Get Cell Data
   * @category Data
   * @description Get data from a specific table cell
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"tableName","label":"Table Name","description":"The name of the table","required":true}
   * @paramDef {"type":"string","name":"recordId","label":"Record ID","description":"The identifier of the record","required":true}
   * @paramDef {"type":"string","name":"columnName","label":"Column Name","description":"The name of the column","required":true}
   * @sampleResult "John Doe"
   */
  getCellData(appId, tableName, recordId, columnName) {
    return this.req.get(`${urls.dataCell(appId, tableName, recordId, columnName)}/retrieve-value`)
  }

  /**
   * @typedef {Object} createRecord__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to create record in"}
   */

  /**
   * @aiToolName Create Record
   * @category Data
   * @description Create a new record in a data table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"createRecord__table","name":"table","label":"Table Object","description":"Object containing table name","required":true}
   * @paramDef {"type":"object","name":"record","label":"Record","description":"The record data to create","required":true}
   * @sampleResult {"coll":"test_value","created":1757611485750,"name":"Test User","___class":"testTable","ownerId":null,"updated":null,"email":"test@example.com","objectId":"SAMPLE-ID-123"}
   */
  createRecord(appId, table, record) {
    return this.req.post(urls.dataTable(appId, table.name), record).cacheTags(TABLE_DATA(table.tableId))
  }

  /**
   * @aiToolName Bulk Create Records
   * @category Data
   * @description Create multiple records at once
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"tableName","label":"Table Name","description":"The name of the table","required":true}
   * @paramDef {"type":"array","name":"records","label":"Records","description":"Array of record objects to create","required":true}
   * @sampleResult [{"objectId":"rec123","name":"John"},{"objectId":"rec124","name":"Jane"}]
   */
  bulkCreateRecords(appId, tableName, records) {
    return this.req.post(urls.dataTableBulkCreate(appId, tableName), records)
  }

  /**
   * @aiToolName Bulk Upsert Records
   * @category Data
   * @description Create or update multiple records at once
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"tableName","label":"Table Name","description":"The name of the table","required":true}
   * @paramDef {"type":"array","name":"records","label":"Records","description":"Array of record objects to upsert","required":true}
   * @sampleResult [{"objectId":"rec123","name":"Updated John"},{"objectId":"rec124","name":"New Jane"}]
   */
  bulkUpsertRecords(appId, tableName, records) {
    return this.req.put(urls.dataTableBulkUpsert(appId, tableName), records)
  }

  /**
   * @typedef {Object} updateRecord__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to update record in"}
   */

  /**
   * @aiToolName Update Record
   * @category Data
   * @description Update an existing record in a data table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"updateRecord__table","name":"table","label":"Table Object","description":"Object containing table name","required":true}
   * @paramDef {"type":"object","name":"record","label":"Record","description":"The record data to update (must include objectId)","required":true}
   * @sampleResult {"coll":"updated_value","created":1757611485750,"name":"Updated Test User","___class":"testTable","ownerId":null,"updated":1757663392976,"email":"updated@example.com","objectId":"SAMPLE-ID-456"}
   */
  updateRecord(appId, table, record) {
    return this.req.put(urls.dataRecord(appId, table.name, record.objectId), record)
  }

  updateImageTypeRecord(appId, table, record) {
    return this.req.put(`${urls.dataTable(appId, table.name)}/file/${ record.columnName }/${ record.objectId }`, record.value)
  }

  /**
   * @typedef {Object} deleteRecords__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table to delete records from"}
   * @paramDef {"type":"string","label":"Table ID","name":"tableId","required":true,"description":"The unique identifier of the table (needed for cache management)"}
   * @paramDef {"type":"array","label":"Relations","name":"relations","required":false,"description":"Array of relation objects (obtained from get tables method)"}
   * @paramDef {"type":"array","label":"Geo Relations","name":"geoRelations","required":false,"description":"Array of geo relation objects (obtained from get tables method)"}
   */

  /**
   * @aiToolName Delete Records
   * @category Data
   * @description Delete records from a data table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"deleteRecords__table","name":"table","label":"Table Object","description":"Full table object with tableId (obtain from tables.get() method)","required":true}
   * @paramDef {"type":"array","name":"recordIds","label":"Record IDs","description":"Array of record IDs to delete, or null to delete all","required":false}
   * @sampleResult true
   */
  deleteRecords(appId, table, recordIds) {
    const url = removeRecordsUrl(appId, table, !recordIds)
    const removeItems = recordIds && recordIds.map(objectId => ({ objectId }))

    return this.req.delete(url, removeItems).cacheTags(TABLE_DATA(table.tableId))
  }

  /**
   * @aiToolName Delete Image Type Record
   * @category Data
   * @description Delete an image type field from a record
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"tableName","label":"Table Name","description":"The name of the table","required":true}
   * @paramDef {"type":"string","name":"columnName","label":"Column Name","description":"The name of the image column","required":true}
   * @paramDef {"type":"string","name":"recordId","label":"Record ID","description":"The identifier of the record","required":true}
   * @sampleResult true
   */
  deleteImageTypeRecord(appId, tableName, columnName, recordId) {
    return this.req.delete(`${urls.dataTable(appId, tableName)}/file/${ columnName }/${ recordId }`)
  }

  /**
   * @typedef {Object} updateRelations__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table containing the relation column"}
   * @paramDef {"type":"string","label":"Table ID","name":"tableId","required":true,"description":"The unique identifier of the table"}
   * @paramDef {"type":"array","label":"Relations","name":"relations","required":true,"description":"Array of relation objects defining table relationships (obtained from get tables method)"}
   * @paramDef {"type":"array","label":"Geo Relations","name":"geoRelations","required":true,"description":"Array of geo relation objects (obtained from get tables method)"}
   */

  /**
   * @aiToolName Update Relations
   * @category Data
   * @description Update relations for a record
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"updateRelations__table","name":"table","label":"Table Object","description":"Full table object with relations array (obtain from tables.get() method)","required":true}
   * @paramDef {"type":"string","name":"columnName","label":"Column Name","description":"The name of the relation column","required":true}
   * @paramDef {"type":"string","name":"recordId","label":"Record ID","description":"The identifier of the record","required":true}
   * @paramDef {"type":"array","name":"relationIds","label":"Relation IDs","description":"Array of related record IDs","required":true}
   * @sampleResult ""
   */
  updateRelations(appId, table, columnName, recordId, relationIds) {
    const relationColumn = getRelationColumn(table, columnName)

    return this.req
      .put(updateRelationsUrl(appId, table, columnName, recordId), relationIds)
      .cacheTags(TABLE_DATA(relationColumn.toTableId))
  }

  /**
   * @typedef {Object} removeRelations__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table containing the relation column"}
   * @paramDef {"type":"string","label":"Table ID","name":"tableId","required":true,"description":"The unique identifier of the table"}
   * @paramDef {"type":"array","label":"Relations","name":"relations","required":true,"description":"Array of relation objects defining table relationships (obtained from get tables method)"}
   * @paramDef {"type":"array","label":"Geo Relations","name":"geoRelations","required":true,"description":"Array of geo relation objects (obtained from get tables method)"}
   */

  /**
   * @aiToolName Remove Relations
   * @category Data
   * @description Remove relations from a record
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"removeRelations__table","name":"table","label":"Table Object","description":"Full table object with relations array (obtain from tables.get() method)","required":true}
   * @paramDef {"type":"string","name":"columnName","label":"Column Name","description":"The name of the relation column","required":true}
   * @paramDef {"type":"string","name":"recordId","label":"Record ID","description":"The identifier of the record","required":true}
   * @paramDef {"type":"array","name":"relationIds","label":"Relation IDs","description":"Array of related record IDs to remove","required":true}
   * @sampleResult true
   */
  removeRelations(appId, table, columnName, recordId, relationIds) {
    const relationColumn = getRelationColumn(table, columnName)

    return this.req
      .delete(removeRelationsUrl(appId, table, columnName, recordId), relationIds)
      .cacheTags(TABLE_DATA(relationColumn.toTableId))
  }

  createColumn(appId, table, column) {
    const url = tableColumnsUrl(appId, table)
    const urlSuffix = COLUMNS_URL_SUFFIX[column.dataType]

    return this.req.post(url + (urlSuffix ? `/${urlSuffix}` : ''), column).then(resp => {
      return { ...resp, dataType: column.dataType }
    })
  }

  /**
   * @typedef {Object} deleteColumn__table
   * @paramDef {"type":"string","label":"Table Name","name":"name","required":true,"description":"The name of the table containing the column to delete"}
   */

  /**
   * @typedef {Object} deleteColumn__column
   * @paramDef {"type":"string","label":"Column Name","name":"name","required":true,"description":"The name of the column to delete"}
   */

  /**
   * @aiToolName Delete Column
   * @category Data
   * @description Delete a column from a data table
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"deleteColumn__table","name":"table","label":"Table Object","description":"Object containing table name","required":true}
   * @paramDef {"type":"deleteColumn__column","name":"column","label":"Column Object","description":"Object containing column name to delete","required":true}
   * @sampleResult ""
   */
  deleteColumn(appId, table, column) {
    const path = tableColumnsUrl(appId, table)
    const columnName = encodeURI(column.name)

    if (isRelType(column.dataType)) {
      return this.req.delete(`${path}/${RELATION_URL_SUFFIX}/${columnName}`)
    }

    return this.req.delete(`${path}/${columnName}`)
  }

  updateColumn(appId, table, prevColumn, column) {
    const urlSuffix = COLUMNS_URL_SUFFIX[prevColumn.dataType] || prevColumn.name
    const url = tableColumnsUrl(appId, table)

    return this.req.put(`${url}/${urlSuffix}`, column).then(resp => ({
      ...resp,
      dataType: resp.dataType || prevColumn.dataType
    }))
  }

  /**
   * @aiToolName Load Configs
   * @category Data
   * @description Load data configuration settings for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult {"dynamicSchema":true,"includeObjectIdByDefault":false}
   */
  loadConfigs(appId) {
    return this.req.get(urls.dataConfigs(appId))
  }

  /**
   * @typedef {Object} setConfigs__configs
   * @paramDef {"type":"boolean","label":"Dynamic Schema","name":"dynamicSchema","required":false,"description":"Enable or disable dynamic schema for tables"}
   * @paramDef {"type":"boolean","label":"Include Object ID By Default","name":"includeObjectIdByDefault","required":false,"description":"Whether to include objectId field in API responses by default"}
   */

  /**
   * @aiToolName Set Configs
   * @category Data
   * @description Set data configuration settings for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"setConfigs__configs","name":"configs","label":"Configurations","description":"The configuration settings to set","required":true}
   * @sampleResult {"dynamicSchema":false,"includeObjectIdByDefault":true}
   */
  setConfigs(appId, configs) {
    return this.req.put(urls.dataConfigs(appId), configs)
  }

  loadAssignedUserRoles(appId, users) {
    return this.req.get(assignedUserRoles(appId)).query({ users: users.join(',') })
  }

  updateAssignedUserRoles(appId, roles, users) {
    return this.req.put(assignedUserRoles(appId), { roles, users })
  }

  loadTableOwnerPolicyDelayCheck(appId, tableName) {
    return this.req.get(routes.tableOwnerPolicyDelayCheck(appId, tableName))
  }

  changeTableOwnerPolicyDelayCheck(appId, tableName, data) {
    return this.req.put(routes.tableOwnerPolicyDelayCheck(appId, tableName), data)
  }
}

export default req => new Tables(req)

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
