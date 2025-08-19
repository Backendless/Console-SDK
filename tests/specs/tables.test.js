import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.tables', () => {
  let apiClient
  let tablesAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  const mockTable = {
    tableId: 'table-123',
    name: 'TestTable',
    columns: [
      { name: 'objectId', dataType: 'STRING_ID' },
      { name: 'name', dataType: 'STRING' },
      { name: 'age', dataType: 'INT' }
    ],
    relations: [
      { name: 'relatedTable', toTableId: 'related-table-id', dataType: 'DATA_REF' }
    ],
    geoRelations: [
      { name: 'geoRelation', toTableId: 'geo-table-id', dataType: 'GEO_REF' }
    ]
  }

  const mockRecord = {
    objectId: 'record-123',
    name: 'Test Record',
    columnName: 'testColumn',
    value: 'testValue'
  }

  const mockColumn = {
    name: 'testColumn',
    dataType: 'STRING',
    required: false
  }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    tablesAPI = apiClient.tables
  })

  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('should get tables list with correct parameters', async () => {
      const mockResponse = {
        tables: [
          { name: 'Table1', relations: [], geoRelations: [] },
          { name: 'Table2', relations: [], geoRelations: [] }
        ]
      }
      const expectedNormalizedResponse = {
        tables: [
          { name: 'Table1', relations: [], geoRelations: [] },
          { name: 'Table2', relations: [], geoRelations: [] }
        ]
      }

      mockSuccessAPIRequest(mockResponse)

      const query = { limit: 10, offset: 0 }
      const result = await tablesAPI.get(appId, query)

      expect(result).toEqual(expectedNormalizedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables?limit=10&offset=0`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should normalize table relations correctly', async () => {
      const mockResponse = {
        tables: [{
          name: 'TestTable',
          relations: [{ name: 'rel1' }],
          geoRelations: [{ name: 'geoRel1' }]
        }]
      }

      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.get(appId)

      expect(result.tables[0].relations).toEqual([{ name: 'rel1', dataType: 'DATA_REF' }])
      expect(result.tables[0].geoRelations).toEqual([{ name: 'geoRel1', dataType: 'GEO_REF' }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest()

      const error = await tablesAPI.get(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('create', () => {
    it('should create table with correct parameters', async () => {
      const normalizedTable = { ...mockTable, relations: [], geoRelations: [] }
      mockSuccessAPIRequest(normalizedTable)

      const tableData = {
        name: 'NewTable',
        columns: [{ name: 'id', dataType: 'STRING' }]
      }

      const result = await tablesAPI.create(appId, tableData)

      expect(result).toEqual(normalizedTable)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables`,
        method: 'POST',
        body: JSON.stringify(tableData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Table already exists')

      const tableData = { name: 'ExistingTable' }
      const error = await tablesAPI.create(appId, tableData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Table already exists')
    })
  })

  describe('update', () => {
    it('should update table with correct parameters', async () => {
      const normalizedTable = { ...mockTable, relations: [], geoRelations: [] }
      mockSuccessAPIRequest(normalizedTable)

      const updateProps = { description: 'Updated description' }

      const result = await tablesAPI.update(appId, mockTable, updateProps)

      expect(result).toEqual(normalizedTable)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}`,
        method: 'PUT',
        body: JSON.stringify(updateProps),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Table not found')

      const updateProps = { name: 'NewName' }
      const error = await tablesAPI.update(appId, mockTable, updateProps).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Table not found')
    })
  })

  describe('remove', () => {
    it('should remove table with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await tablesAPI.remove(appId, mockTable)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Cannot delete table')

      const error = await tablesAPI.remove(appId, mockTable).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Cannot delete table')
    })
  })

  describe('loadRecords', () => {
    it('should load records with total count', async () => {
      const mockRecords = [{ objectId: '1', name: 'Record 1' }]
      const mockTotalCount = 42

      mockSuccessAPIRequest(mockTotalCount) // count request
      mockSuccessAPIRequest(mockRecords)    // data request

      const query = { pageSize: 10, offset: 0 }
      const result = await tablesAPI.loadRecords(appId, mockTable, query)

      expect(result).toEqual({
        totalRows: mockTotalCount,
        data: mockRecords
      })

      expect(apiRequestCalls()).toHaveLength(2)
      expect(apiRequestCalls()[0].path).toBe(`http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/count`)
      expect(apiRequestCalls()[0].method).toBe('POST')
      expect(apiRequestCalls()[1].path).toBe(`http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/find`)
      expect(apiRequestCalls()[1].method).toBe('POST')
    })

    it('should load records without count when ignoreCounter is true', async () => {
      const mockRecords = [{ objectId: '1', name: 'Record 1' }]
      mockSuccessAPIRequest(mockRecords)

      const query = { pageSize: 10 }
      const result = await tablesAPI.loadRecords(appId, mockTable, query, true)

      expect(result).toEqual(mockRecords)
      expect(apiRequestCalls()).toHaveLength(1)
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Invalid query')
      mockFailedAPIRequest('Invalid query')

      const query = { invalid: true }
      const error = await tablesAPI.loadRecords(appId, mockTable, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Invalid query')
    })
  })

  describe('exportRecords', () => {
    it('should export records with all query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const query = {
        sqlSearch: 'age > 18',
        where: 'name LIKE "John%"',
        filterString: 'active = true',
        sortBy: ['name', 'created'],
        props: ['name', 'email', 'age']
      }

      const result = await tablesAPI.exportRecords(appId, null, mockTable, query)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/csv`,
        method: 'POST',
        body: expect.stringMatching(/sortBy.*props.*where/),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should export records with connector ID', async () => {
      mockSuccessAPIRequest(successResult)

      const connectorId = 'mysql-connector'
      const query = { props: ['name'] }

      await tablesAPI.exportRecords(appId, connectorId, mockTable, query)

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/data/${connectorId}.${encodeURI(mockTable.name)}/csv`
      )
    })

    it('should handle empty sortBy and props', async () => {
      mockSuccessAPIRequest(successResult)

      const query = { sortBy: null, props: null }

      await tablesAPI.exportRecords(appId, null, mockTable, query)

      const requestBody = JSON.parse(apiRequestCalls()[0].body)
      expect(requestBody.sortBy).toBeUndefined()
      expect(requestBody.props).toBeUndefined()
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Export failed')

      const query = {}
      const error = await tablesAPI.exportRecords(appId, null, mockTable, query).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Export failed')
    })
  })

  describe('getRecordsCount', () => {
    it('should get records count with reset cache', async () => {
      const mockCount = 25
      mockSuccessAPIRequest(mockCount)

      const query = { where: 'active = true' }
      const resetCache = true

      const result = await tablesAPI.getRecordsCount(appId, mockTable, query, resetCache)

      expect(result).toEqual(mockCount)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/count`,
        method: 'POST',
        body: expect.any(String), // query gets processed by buildRecordsSearch
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Count failed')

      const error = await tablesAPI.getRecordsCount(appId, mockTable, {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Count failed')
    })
  })

  describe('getCount', () => {
    it('should get count without POST method', async () => {
      const mockCount = 15
      mockSuccessAPIRequest(mockCount)

      const query = { where: 'status = "active"' }
      const result = await tablesAPI.getCount(appId, mockTable, query)

      expect(result).toEqual(mockCount)
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Count failed')

      const error = await tablesAPI.getCount(appId, mockTable, {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Count failed')
    })
  })

  describe('getRecordsCountForTables', () => {
    it('should get counts for multiple tables', async () => {
      const mockCountsResult = { table1: 10, table2: 25 }
      mockSuccessAPIRequest(mockCountsResult)

      const tables = ['table1', 'table2']
      const connectorId = 'postgres-connector'
      const resetCache = true

      const result = await tablesAPI.getRecordsCountForTables(appId, tables, connectorId, resetCache)

      expect(result).toEqual(mockCountsResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables-counters`,
        method: 'POST',
        body: JSON.stringify({ tables, connectorId, resetCache }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Tables counters failed')

      const tables = ['table1']
      const error = await tablesAPI.getRecordsCountForTables(appId, tables).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Tables counters failed')
    })
  })

  describe('getCellData', () => {
    it('should get cell data with correct parameters', async () => {
      const mockCellData = { value: 'cell content' }
      mockSuccessAPIRequest(mockCellData)

      const tableName = 'TestTable'
      const recordId = 'record-123'
      const columnName = 'testColumn'

      const result = await tablesAPI.getCellData(appId, tableName, recordId, columnName)

      expect(result).toEqual(mockCellData)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(tableName)}/${recordId}/${columnName}/retrieve-value`,
        method: 'GET',
        headers: {},
        encoding: 'utf8',
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Cell not found')

      const error = await tablesAPI.getCellData(appId, 'table', 'record', 'column').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Cell not found')
    })
  })

  describe('createRecord', () => {
    it('should create record with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const recordData = { name: 'New Record', age: 25 }

      const result = await tablesAPI.createRecord(appId, mockTable, recordData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}`,
        method: 'POST',
        body: JSON.stringify(recordData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Validation failed')

      const recordData = { invalid: true }
      const error = await tablesAPI.createRecord(appId, mockTable, recordData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Validation failed')
    })
  })

  describe('bulkCreateRecords', () => {
    it('should bulk create records with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'TestTable'
      const records = [
        { name: 'Record 1', age: 25 },
        { name: 'Record 2', age: 30 }
      ]

      const result = await tablesAPI.bulkCreateRecords(appId, tableName, records)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/bulk/${encodeURI(tableName)}`,
        method: 'POST',
        body: JSON.stringify(records),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Bulk create failed')

      const records = [{}]
      const error = await tablesAPI.bulkCreateRecords(appId, 'table', records).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Bulk create failed')
    })
  })

  describe('bulkUpsertRecords', () => {
    it('should bulk upsert records with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'TestTable'
      const records = [
        { objectId: 'existing-1', name: 'Updated Record 1' },
        { name: 'New Record 2' }
      ]

      const result = await tablesAPI.bulkUpsertRecords(appId, tableName, records)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/bulkupsert/${encodeURI(tableName)}`,
        method: 'PUT',
        body: JSON.stringify(records),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Bulk upsert failed')

      const records = [{}]
      const error = await tablesAPI.bulkUpsertRecords(appId, 'table', records).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Bulk upsert failed')
    })
  })

  describe('updateRecord', () => {
    it('should update record with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await tablesAPI.updateRecord(appId, mockTable, mockRecord)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/${mockRecord.objectId}`,
        method: 'PUT',
        body: JSON.stringify(mockRecord),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Record not found')

      const error = await tablesAPI.updateRecord(appId, mockTable, mockRecord).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Record not found')
    })
  })

  describe('updateImageTypeRecord', () => {
    it('should update image type record with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const imageRecord = {
        objectId: 'record-123',
        columnName: 'profileImage',
        value: 'base64-image-data'
      }

      const result = await tablesAPI.updateImageTypeRecord(appId, mockTable, imageRecord)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/file/${imageRecord.columnName}/${imageRecord.objectId}`,
        method: 'PUT',
        body: imageRecord.value,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Image update failed')

      const imageRecord = { objectId: '1', columnName: 'image', value: 'data' }
      const error = await tablesAPI.updateImageTypeRecord(appId, mockTable, imageRecord).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Image update failed')
    })
  })

  describe('deleteRecords', () => {
    it('should delete specific records with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const recordIds = ['record-1', 'record-2']

      const result = await tablesAPI.deleteRecords(appId, mockTable, recordIds)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/records`,
        method: 'DELETE',
        body: JSON.stringify([
          { objectId: 'record-1' },
          { objectId: 'record-2' }
        ]),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should delete all records when recordIds is null', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await tablesAPI.deleteRecords(appId, mockTable, null)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/all`,
        method: 'DELETE',
        body: null,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Delete failed')

      const error = await tablesAPI.deleteRecords(appId, mockTable, ['id1']).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Delete failed')
    })
  })

  describe('deleteImageTypeRecord', () => {
    it('should delete image type record with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'TestTable'
      const columnName = 'profileImage'
      const recordId = 'record-123'

      const result = await tablesAPI.deleteImageTypeRecord(appId, tableName, columnName, recordId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(tableName)}/file/${columnName}/${recordId}`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Image delete failed')

      const error = await tablesAPI.deleteImageTypeRecord(appId, 'table', 'column', 'record').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Image delete failed')
    })
  })

  describe('updateRelations', () => {
    it('should update relations with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const columnName = 'relatedTable'
      const recordId = 'record-123'
      const relationIds = ['rel-1', 'rel-2']

      const result = await tablesAPI.updateRelations(appId, mockTable, columnName, recordId, relationIds)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/${recordId}/${columnName}`,
        method: 'PUT',
        body: JSON.stringify(relationIds),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Relation update failed')

      const error = await tablesAPI.updateRelations(appId, mockTable, 'relatedTable', 'record', []).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Relation update failed')
    })
  })

  describe('removeRelations', () => {
    it('should remove relations with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const columnName = 'relatedTable'
      const recordId = 'record-123'
      const relationIds = ['rel-1', 'rel-2']

      const result = await tablesAPI.removeRelations(appId, mockTable, columnName, recordId, relationIds)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/${encodeURI(mockTable.name)}/${recordId}/${columnName}/relations`,
        method: 'DELETE',
        body: JSON.stringify(relationIds),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Remove relations failed')

      const error = await tablesAPI.removeRelations(appId, mockTable, 'relatedTable', 'record', []).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Remove relations failed')
    })
  })

  describe('createColumn', () => {
    it('should create regular column with correct parameters', async () => {
      const mockResponse = { columnId: 'col-123' }
      const expectedResponse = { columnId: 'col-123', dataType: 'STRING' }
      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.createColumn(appId, mockTable, mockColumn)

      expect(result).toEqual(expectedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns`,
        method: 'POST',
        body: JSON.stringify(mockColumn),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should create relation column with correct URL suffix', async () => {
      const relationColumn = { ...mockColumn, dataType: 'DATA_REF' }
      const mockResponse = { columnId: 'rel-col-123' }
      const expectedResponse = { columnId: 'rel-col-123', dataType: 'DATA_REF' }
      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.createColumn(appId, mockTable, relationColumn)

      expect(result).toEqual(expectedResponse)

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/relation`
      )
    })

    it('should create geo relation column with correct URL suffix', async () => {
      const geoRelationColumn = { ...mockColumn, dataType: 'GEO_REF' }
      const mockResponse = { columnId: 'geo-col-123' }
      const expectedResponse = { columnId: 'geo-col-123', dataType: 'GEO_REF' }
      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.createColumn(appId, mockTable, geoRelationColumn)

      expect(result).toEqual(expectedResponse)

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/georelation`
      )
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Column creation failed')

      const error = await tablesAPI.createColumn(appId, mockTable, mockColumn).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Column creation failed')
    })
  })

  describe('deleteColumn', () => {
    it('should delete regular column with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await tablesAPI.deleteColumn(appId, mockTable, mockColumn)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/${encodeURI(mockColumn.name)}`,
        method: 'DELETE',
        headers: {},
        encoding: 'utf8',
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should delete relation column with correct URL', async () => {
      const relationColumn = { ...mockColumn, dataType: 'DATA_REF' }
      mockSuccessAPIRequest(successResult)

      await tablesAPI.deleteColumn(appId, mockTable, relationColumn)

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/relation/${encodeURI(relationColumn.name)}`
      )
    })

    it('should delete geo relation column with correct URL', async () => {
      const geoRelationColumn = { ...mockColumn, dataType: 'GEO_REF' }
      mockSuccessAPIRequest(successResult)

      await tablesAPI.deleteColumn(appId, mockTable, geoRelationColumn)

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/relation/${encodeURI(geoRelationColumn.name)}`
      )
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Column deletion failed')

      const error = await tablesAPI.deleteColumn(appId, mockTable, mockColumn).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Column deletion failed')
    })
  })

  describe('updateColumn', () => {
    it('should update column with correct parameters', async () => {
      const updatedColumn = { ...mockColumn, required: true }
      const mockResponse = { columnId: 'col-123' }
      const expectedResponse = { columnId: 'col-123', dataType: 'STRING' }
      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.updateColumn(appId, mockTable, mockColumn, updatedColumn)

      expect(result).toEqual(expectedResponse)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/${mockColumn.name}`,
        method: 'PUT',
        body: JSON.stringify(updatedColumn),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should update relation column with correct URL suffix', async () => {
      const prevRelationColumn = { ...mockColumn, dataType: 'DATA_REF' }
      const updatedColumn = { ...prevRelationColumn, required: true }
      const mockResponse = { columnId: 'rel-col-123', dataType: 'DATA_REF' }
      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.updateColumn(appId, mockTable, prevRelationColumn, updatedColumn)

      expect(result.dataType).toBe('DATA_REF')

      expect(apiRequestCalls()[0].path).toBe(
        `http://test-host:3000/${appId}/console/data/tables/${encodeURI(mockTable.name)}/columns/relation`
      )
    })

    it('should preserve dataType when not returned by server', async () => {
      const mockResponse = { columnId: 'col-123' } // no dataType in response
      const expectedResponse = { columnId: 'col-123', dataType: 'STRING' }
      mockSuccessAPIRequest(mockResponse)

      const result = await tablesAPI.updateColumn(appId, mockTable, mockColumn, mockColumn)

      expect(result).toEqual(expectedResponse)
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Column update failed')

      const error = await tablesAPI.updateColumn(appId, mockTable, mockColumn, mockColumn).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Column update failed')
    })
  })

  describe('loadConfigs', () => {
    it('should load configs with correct parameters', async () => {
      const mockConfigs = { setting1: 'value1', setting2: true }
      mockSuccessAPIRequest(mockConfigs)

      const result = await tablesAPI.loadConfigs(appId)

      expect(result).toEqual(mockConfigs)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/config`,
        method: 'GET',
        headers: {},
        encoding: 'utf8',
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Config load failed')

      const error = await tablesAPI.loadConfigs(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Config load failed')
    })
  })

  describe('setConfigs', () => {
    it('should set configs with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const configs = { setting1: 'newValue', setting2: false }

      const result = await tablesAPI.setConfigs(appId, configs)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/config`,
        method: 'PUT',
        body: JSON.stringify(configs),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Config update failed')

      const configs = { invalid: 'config' }
      const error = await tablesAPI.setConfigs(appId, configs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Config update failed')
    })
  })

  describe('loadAssignedUserRoles', () => {
    it('should load assigned user roles with correct parameters', async () => {
      const mockRoles = { user1: ['admin'], user2: ['user'] }
      mockSuccessAPIRequest(mockRoles)

      const users = ['user1', 'user2', 'user3']

      const result = await tablesAPI.loadAssignedUserRoles(appId, users)

      expect(result).toEqual(mockRoles)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/assignedroles?users=user1%2Cuser2%2Cuser3`,
        method: 'GET',
        headers: {},
        encoding: 'utf8',
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('User roles load failed')

      const users = ['user1']
      const error = await tablesAPI.loadAssignedUserRoles(appId, users).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('User roles load failed')
    })
  })

  describe('updateAssignedUserRoles', () => {
    it('should update assigned user roles with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const roles = ['admin', 'user']
      const users = ['user1', 'user2']

      const result = await tablesAPI.updateAssignedUserRoles(appId, roles, users)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/assignedroles`,
        method: 'PUT',
        body: JSON.stringify({ roles, users }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('User roles update failed')

      const error = await tablesAPI.updateAssignedUserRoles(appId, [], []).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('User roles update failed')
    })
  })

  describe('loadTableOwnerPolicyDelayCheck', () => {
    it('should load table owner policy delay check with correct parameters', async () => {
      const mockDelayCheck = { enabled: true, delay: 5000 }
      mockSuccessAPIRequest(mockDelayCheck)

      const tableName = 'TestTable'

      const result = await tablesAPI.loadTableOwnerPolicyDelayCheck(appId, tableName)

      expect(result).toEqual(mockDelayCheck)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(tableName)}/acl/owner-policy-delay-check`,
        method: 'GET',
        headers: {},
        encoding: 'utf8',
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Policy delay check load failed')

      const error = await tablesAPI.loadTableOwnerPolicyDelayCheck(appId, 'table').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Policy delay check load failed')
    })
  })

  describe('changeTableOwnerPolicyDelayCheck', () => {
    it('should change table owner policy delay check with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const tableName = 'TestTable'
      const data = { enabled: false, delay: 3000 }

      const result = await tablesAPI.changeTableOwnerPolicyDelayCheck(appId, tableName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data/tables/${encodeURI(tableName)}/acl/owner-policy-delay-check`,
        method: 'PUT',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Policy delay check change failed')

      const data = { enabled: true }
      const error = await tablesAPI.changeTableOwnerPolicyDelayCheck(appId, 'table', data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
      expect(error.message).toBe('Policy delay check change failed')
    })
  })
})
