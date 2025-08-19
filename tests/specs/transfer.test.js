describe('apiClient.transfer', () => {
  let apiClient
  let transferAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    transferAPI = apiClient.transfer
  })

  describe('getExportedData', () => {
    it('should make GET request to get exported data', async () => {
      const exportResult = {
        exports: [
          {
            id: 'export-123',
            type: 'full-backup',
            status: 'completed',
            fileUrl: 'https://storage.example.com/exports/app-backup-123.zip',
            fileSize: 25600000,
            createdAt: '2024-01-10T09:00:00Z',
            completedAt: '2024-01-10T09:15:00Z',
            expiresAt: '2024-01-17T09:15:00Z'
          },
          {
            id: 'export-456',
            type: 'data-only',
            status: 'in-progress',
            progress: 65,
            estimatedCompletion: '2024-01-15T12:30:00Z',
            createdAt: '2024-01-15T12:00:00Z'
          }
        ],
        totalCount: 2,
        activeExports: 1,
        completedExports: 1
      }
      mockSuccessAPIRequest(exportResult)

      const result = await transferAPI.getExportedData(appId)

      expect(result).toEqual(exportResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/export`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty exports list', async () => {
      const exportResult = {
        exports: [],
        totalCount: 0,
        message: 'No exports found for this application'
      }
      mockSuccessAPIRequest(exportResult)

      const result = await transferAPI.getExportedData(appId)

      expect(result).toEqual(exportResult)
    })

    it('should handle comprehensive export information', async () => {
      const exportResult = {
        exports: [
          {
            id: 'export-comprehensive-789',
            type: 'selective-backup',
            status: 'completed',
            configuration: {
              includeTables: ['users', 'orders', 'products'],
              includeFiles: true,
              includeCloudCode: true,
              includeSchema: true,
              compression: 'gzip'
            },
            statistics: {
              tablesExported: 3,
              recordsExported: 15420,
              filesExported: 247,
              cloudCodeExported: 12,
              totalSize: 45600000,
              compressedSize: 12800000
            },
            performance: {
              startedAt: '2024-01-12T14:00:00Z',
              completedAt: '2024-01-12T14:18:00Z',
              duration: '18m 32s',
              averageSpeed: '2.5 MB/s'
            },
            fileDetails: {
              fileName: 'myapp-selective-backup-20240112.zip',
              fileUrl: 'https://backups.backendless.com/exports/myapp-selective-backup-20240112.zip',
              checksums: {
                md5: 'a1b2c3d4e5f6...',
                sha256: '1a2b3c4d5e6f...'
              }
            },
            notifications: {
              emailSent: true,
              webhookCalled: true,
              slackNotified: false
            },
            metadata: {
              exportedBy: 'user@example.com',
              exportReason: 'Regular backup',
              retentionPolicy: '30 days'
            },
            createdAt: '2024-01-12T14:00:00Z',
            updatedAt: '2024-01-12T14:18:00Z',
            expiresAt: '2024-02-11T14:18:00Z'
          }
        ],
        summary: {
          totalExports: 1,
          storageUsed: '12.8 MB',
          oldestExport: '2024-01-12T14:00:00Z',
          newestExport: '2024-01-12T14:00:00Z'
        },
        quotas: {
          maxExportsPerMonth: 10,
          exportsThisMonth: 3,
          maxStorageSize: '1 GB',
          currentStorageUsed: '45.2 MB'
        }
      }
      mockSuccessAPIRequest(exportResult)

      const result = await transferAPI.getExportedData(appId)

      expect(result).toEqual(exportResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await transferAPI.getExportedData(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await transferAPI.getExportedData('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('startExport', () => {
    it('should make POST request to start export', async () => {
      const exportResult = {
        exportId: 'export-new-123',
        status: 'initiated',
        type: 'full-backup',
        estimatedDuration: '15-20 minutes',
        estimatedSize: '50-75 MB',
        startedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(exportResult)

      const data = {
        type: 'full-backup',
        options: {
          includeTables: true,
          includeFiles: true,
          includeCloudCode: true,
          compression: 'gzip'
        },
        notifications: {
          email: true,
          webhook: false
        }
      }

      const result = await transferAPI.startExport(appId, data)

      expect(result).toEqual(exportResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/export`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle selective export configuration', async () => {
      const exportResult = {
        exportId: 'export-selective-456',
        status: 'initiated',
        type: 'selective-backup',
        configuration: {
          tables: ['users', 'orders'],
          includeSchema: true,
          includeFiles: false
        }
      }
      mockSuccessAPIRequest(exportResult)

      const data = {
        type: 'selective-backup',
        configuration: {
          tables: ['users', 'orders'],
          includeSchema: true,
          includeFiles: false,
          dateRange: {
            start: '2024-01-01',
            end: '2024-01-15'
          },
          filters: {
            users: 'active = 1',
            orders: 'status = "completed"'
          }
        },
        schedule: {
          type: 'immediate'
        },
        output: {
          format: 'json',
          compression: 'zip',
          encryption: {
            enabled: true,
            algorithm: 'AES-256'
          }
        },
        metadata: {
          description: 'Export active users and completed orders for analysis',
          tags: ['analytics', 'monthly-report']
        }
      }

      const result = await transferAPI.startExport(appId, data)

      expect(result).toEqual(exportResult)
    })

    it('should handle scheduled export', async () => {
      const exportResult = {
        exportId: 'export-scheduled-789',
        status: 'scheduled',
        type: 'incremental-backup',
        scheduledFor: '2024-01-16T02:00:00Z',
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 'sunday',
          time: '02:00'
        }
      }
      mockSuccessAPIRequest(exportResult)

      const data = {
        type: 'incremental-backup',
        schedule: {
          type: 'recurring',
          frequency: 'weekly',
          dayOfWeek: 'sunday',
          time: '02:00',
          timezone: 'UTC'
        },
        retention: {
          keepForDays: 90,
          maxVersions: 12
        }
      }

      const result = await transferAPI.startExport(appId, data)

      expect(result).toEqual(exportResult)
    })

    it('should handle minimal export configuration', async () => {
      const exportResult = { exportId: 'export-simple-101', status: 'initiated' }
      mockSuccessAPIRequest(exportResult)

      const data = {
        type: 'data-only'
      }

      const result = await transferAPI.startExport(appId, data)

      expect(result).toEqual(exportResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Export configuration is invalid', 400)

      const data = { type: 'invalid-type' }
      const error = await transferAPI.startExport(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Export configuration is invalid' },
        message: 'Export configuration is invalid',
        status: 400
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('Monthly export quota exceeded', 429)

      const data = { type: 'full-backup' }
      const error = await transferAPI.startExport(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Monthly export quota exceeded' },
        message: 'Monthly export quota exceeded',
        status: 429
      })
    })

    it('fails when server responds with export already in progress error', async () => {
      mockFailedAPIRequest('Export already in progress for this application', 409)

      const data = { type: 'full-backup' }
      const error = await transferAPI.startExport(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Export already in progress for this application' },
        message: 'Export already in progress for this application',
        status: 409
      })
    })
  })

  describe('startImport', () => {
    it('should make POST request to start import', async () => {
      const importResult = {
        importId: 'import-123',
        status: 'initiated',
        type: 'json',
        estimatedDuration: '5-10 minutes',
        startedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        sourceFile: 'https://storage.example.com/imports/data.json',
        options: {
          createTables: true,
          replaceExisting: false,
          batchSize: 1000
        }
      }
      const type = 'json'
      const query = {
        validate: true,
        dryRun: false
      }

      const result = await transferAPI.startImport(appId, data, type, query)

      expect(result).toEqual(importResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/import/${type}?validate=true&dryRun=false`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle CSV import with mapping', async () => {
      const importResult = {
        importId: 'import-csv-456',
        status: 'initiated',
        type: 'csv',
        configuration: {
          table: 'users',
          mapping: {
            'Full Name': 'name',
            'Email Address': 'email',
            'Registration Date': 'created_at'
          }
        }
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        sourceFile: 'https://storage.example.com/imports/users.csv',
        targetTable: 'users',
        mapping: {
          'Full Name': 'name',
          'Email Address': 'email',
          'Registration Date': 'created_at'
        },
        options: {
          hasHeader: true,
          delimiter: ',',
          encoding: 'utf-8',
          skipEmptyLines: true,
          createTable: false,
          replaceExisting: false,
          batchSize: 500
        },
        validation: {
          validateEmails: true,
          requireUniqueEmails: true,
          dateFormat: 'YYYY-MM-DD'
        }
      }
      const type = 'csv'
      const query = {
        preview: false,
        validateOnly: false
      }

      const result = await transferAPI.startImport(appId, data, type, query)

      expect(result).toEqual(importResult)
    })

    it('should handle XML import', async () => {
      const importResult = {
        importId: 'import-xml-789',
        status: 'initiated',
        type: 'xml'
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        sourceFile: 'https://storage.example.com/imports/products.xml',
        rootElement: 'products',
        itemElement: 'product',
        targetTable: 'products',
        transformation: {
          'product/@id': 'product_id',
          'product/name/text()': 'name',
          'product/price/text()': 'price',
          'product/category/@name': 'category'
        }
      }
      const type = 'xml'
      const query = { validate: true }

      const result = await transferAPI.startImport(appId, data, type, query)

      expect(result).toEqual(importResult)
    })

    it('should handle import without query parameters', async () => {
      const importResult = { importId: 'import-simple-101', status: 'initiated' }
      mockSuccessAPIRequest(importResult)

      const data = {
        sourceFile: 'https://storage.example.com/imports/simple.json'
      }
      const type = 'json'

      const result = await transferAPI.startImport(appId, data, type)

      expect(result).toEqual(importResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/import/${type}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with invalid file format error', async () => {
      mockFailedAPIRequest('Unsupported file format', 422)

      const data = { sourceFile: 'https://example.com/file.pdf' }
      const type = 'pdf'
      const error = await transferAPI.startImport(appId, data, type).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unsupported file format' },
        message: 'Unsupported file format',
        status: 422
      })
    })

    it('fails when server responds with file access error', async () => {
      mockFailedAPIRequest('Cannot access source file', 400)

      const data = { sourceFile: 'https://private.example.com/restricted.json' }
      const type = 'json'
      const error = await transferAPI.startImport(appId, data, type).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot access source file' },
        message: 'Cannot access source file',
        status: 400
      })
    })
  })

  describe('importDataServiceFiles', () => {
    it('should make POST request to import data service files', async () => {
      const importResult = {
        importId: 'import-step-123',
        step: 'validation',
        status: 'completed',
        nextStep: 'preview',
        validationResults: {
          totalRecords: 1500,
          validRecords: 1485,
          invalidRecords: 15,
          errors: [
            { line: 47, error: 'Invalid email format' },
            { line: 123, error: 'Missing required field: name' }
          ]
        }
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        fileId: 'uploaded-file-123',
        configuration: {
          table: 'customers',
          mapping: {
            'customer_id': 'id',
            'customer_name': 'name',
            'email_address': 'email'
          },
          options: {
            createTable: false,
            skipInvalid: true
          }
        }
      }
      const step = 'validation'

      const result = await transferAPI.importDataServiceFiles(appId, data, step)

      expect(result).toEqual(importResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/import/data/${step}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle preview step', async () => {
      const importResult = {
        importId: 'import-step-456',
        step: 'preview',
        status: 'completed',
        preview: {
          sampleRecords: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
          ],
          totalRecords: 1485,
          estimatedImportTime: '3-4 minutes'
        },
        nextStep: 'execute'
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        importId: 'import-step-456',
        confirmed: true
      }
      const step = 'preview'

      const result = await transferAPI.importDataServiceFiles(appId, data, step)

      expect(result).toEqual(importResult)
    })

    it('should handle execution step', async () => {
      const importResult = {
        importId: 'import-step-789',
        step: 'execute',
        status: 'in-progress',
        progress: {
          processedRecords: 750,
          totalRecords: 1485,
          percentage: 50,
          currentBatch: 8,
          totalBatches: 15
        },
        statistics: {
          inserted: 720,
          updated: 25,
          skipped: 5,
          errors: 0
        },
        estimatedCompletion: '2024-01-15T12:05:00Z'
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        importId: 'import-step-789',
        execute: true,
        options: {
          batchSize: 100,
          continueOnError: true,
          logLevel: 'info'
        }
      }
      const step = 'execute'

      const result = await transferAPI.importDataServiceFiles(appId, data, step)

      expect(result).toEqual(importResult)
    })

    it('should handle completion step', async () => {
      const importResult = {
        importId: 'import-step-complete-101',
        step: 'complete',
        status: 'completed',
        finalStatistics: {
          totalProcessed: 1485,
          successful: 1480,
          failed: 5,
          duration: '3m 42s',
          throughput: '6.7 records/second'
        },
        errors: [
          { record: 47, error: 'Duplicate primary key', data: { id: 123 } },
          { record: 89, error: 'Foreign key constraint violation', data: { user_id: 999 } }
        ],
        summary: {
          tablesAffected: ['customers'],
          recordsInserted: 1475,
          recordsUpdated: 5,
          recordsSkipped: 0,
          recordsFailed: 5
        },
        completedAt: '2024-01-15T12:03:42Z'
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        importId: 'import-step-complete-101'
      }
      const step = 'complete'

      const result = await transferAPI.importDataServiceFiles(appId, data, step)

      expect(result).toEqual(importResult)
    })

    it('fails when server responds with invalid step error', async () => {
      mockFailedAPIRequest('Invalid import step', 400)

      const data = { importId: 'test-import' }
      const step = 'invalid-step'
      const error = await transferAPI.importDataServiceFiles(appId, data, step).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid import step' },
        message: 'Invalid import step',
        status: 400
      })
    })

    it('fails when server responds with import not found error', async () => {
      mockFailedAPIRequest('Import session not found', 404)

      const data = { importId: 'nonexistent-import' }
      const step = 'preview'
      const error = await transferAPI.importDataServiceFiles(appId, data, step).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Import session not found' },
        message: 'Import session not found',
        status: 404
      })
    })
  })

  describe('importFirebaseUsers', () => {
    it('should make POST request to import Firebase users', async () => {
      const importResult = {
        importId: 'firebase-import-123',
        status: 'initiated',
        estimatedUsers: 2500,
        estimatedDuration: '8-12 minutes',
        startedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        firebaseProjectId: 'my-firebase-project',
        serviceAccountKey: {
          type: 'service_account',
          project_id: 'my-firebase-project',
          private_key_id: 'key-id-123',
          private_key: '-----BEGIN PRIVATE KEY-----...',
          client_email: 'firebase-adminsdk@my-firebase-project.iam.gserviceaccount.com'
        },
        options: {
          importCustomClaims: true,
          importDisabledUsers: false,
          batchSize: 100,
          createBackendlessUsers: true,
          mapCustomProperties: {
            'displayName': 'name',
            'phoneNumber': 'phone'
          }
        }
      }

      const result = await transferAPI.importFirebaseUsers(appId, data)

      expect(result).toEqual(importResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/import/firebase/users`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle Firebase import with filtering', async () => {
      const importResult = {
        importId: 'firebase-import-selective-456',
        status: 'initiated',
        filters: {
          onlyVerifiedEmails: true,
          excludeProviders: ['anonymous'],
          dateRange: {
            createdAfter: '2023-01-01'
          }
        }
      }
      mockSuccessAPIRequest(importResult)

      const data = {
        firebaseProjectId: 'enterprise-firebase-project',
        serviceAccountKey: {
          type: 'service_account',
          project_id: 'enterprise-firebase-project'
        },
        filters: {
          onlyVerifiedEmails: true,
          excludeProviders: ['anonymous', 'guest'],
          includeProviders: ['google.com', 'password'],
          dateRange: {
            createdAfter: '2023-01-01T00:00:00Z',
            createdBefore: '2024-01-01T00:00:00Z'
          },
          customClaims: {
            role: ['admin', 'moderator']
          }
        },
        options: {
          importCustomClaims: true,
          importUserMetadata: true,
          validateEmails: true,
          generatePasswords: true,
          passwordLength: 12,
          sendWelcomeEmails: false
        },
        mapping: {
          firebaseUID: 'firebase_uid',
          displayName: 'full_name',
          email: 'email_address',
          phoneNumber: 'phone_number',
          photoURL: 'profile_image_url',
          'customClaims.role': 'user_role',
          'customClaims.department': 'department'
        }
      }

      const result = await transferAPI.importFirebaseUsers(appId, data)

      expect(result).toEqual(importResult)
    })

    it('should handle simple Firebase import', async () => {
      const importResult = { importId: 'firebase-import-simple-789', status: 'initiated' }
      mockSuccessAPIRequest(importResult)

      const data = {
        firebaseProjectId: 'simple-project',
        serviceAccountKey: {
          type: 'service_account',
          project_id: 'simple-project'
        }
      }

      const result = await transferAPI.importFirebaseUsers(appId, data)

      expect(result).toEqual(importResult)
    })

    it('fails when server responds with invalid service account error', async () => {
      mockFailedAPIRequest('Invalid Firebase service account credentials', 401)

      const data = {
        firebaseProjectId: 'test-project',
        serviceAccountKey: { invalid: 'credentials' }
      }
      const error = await transferAPI.importFirebaseUsers(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid Firebase service account credentials' },
        message: 'Invalid Firebase service account credentials',
        status: 401
      })
    })

    it('fails when server responds with Firebase project access error', async () => {
      mockFailedAPIRequest('Cannot access Firebase project', 403)

      const data = {
        firebaseProjectId: 'restricted-project',
        serviceAccountKey: { type: 'service_account' }
      }
      const error = await transferAPI.importFirebaseUsers(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot access Firebase project' },
        message: 'Cannot access Firebase project',
        status: 403
      })
    })
  })

  describe('getAirtableBasesList', () => {
    it('should make GET request to get Airtable bases list', async () => {
      const basesResult = {
        bases: [
          {
            id: 'appABC123',
            name: 'Customer Database',
            permissionLevel: 'create',
            createdTime: '2024-01-10T09:00:00Z'
          },
          {
            id: 'appDEF456',
            name: 'Inventory Management',
            permissionLevel: 'edit',
            createdTime: '2024-01-08T14:30:00Z'
          }
        ],
        totalCount: 2
      }
      mockSuccessAPIRequest(basesResult)

      const accessToken = 'patABC123DEF456'
      const result = await transferAPI.getAirtableBasesList(appId, accessToken)

      expect(result).toEqual(basesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/airtable/bases/?accessToken=${accessToken}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty bases list', async () => {
      const basesResult = {
        bases: [],
        totalCount: 0,
        message: 'No Airtable bases accessible with this token'
      }
      mockSuccessAPIRequest(basesResult)

      const accessToken = 'patEMPTY123'
      const result = await transferAPI.getAirtableBasesList(appId, accessToken)

      expect(result).toEqual(basesResult)
    })

    it('fails when server responds with invalid token error', async () => {
      mockFailedAPIRequest('Invalid Airtable access token', 401)

      const accessToken = 'invalid-token'
      const error = await transferAPI.getAirtableBasesList(appId, accessToken).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid Airtable access token' },
        message: 'Invalid Airtable access token',
        status: 401
      })
    })
  })

  describe('getAirtableTablesList', () => {
    it('should make GET request to get Airtable tables list', async () => {
      const tablesResult = {
        tables: [
          {
            id: 'tblABC123',
            name: 'Customers',
            primaryFieldId: 'fldPrimary123',
            fields: [
              { id: 'fldName123', name: 'Name', type: 'singleLineText' },
              { id: 'fldEmail123', name: 'Email', type: 'email' },
              { id: 'fldPhone123', name: 'Phone', type: 'phoneNumber' }
            ],
            views: [
              { id: 'viwAll123', name: 'All Customers', type: 'grid' },
              { id: 'viwActive123', name: 'Active Only', type: 'grid' }
            ]
          },
          {
            id: 'tblDEF456',
            name: 'Orders',
            primaryFieldId: 'fldOrderId456',
            fields: [
              { id: 'fldOrderId456', name: 'Order ID', type: 'autoNumber' },
              { id: 'fldCustomer456', name: 'Customer', type: 'multipleRecordLinks' },
              { id: 'fldAmount456', name: 'Amount', type: 'currency' }
            ],
            views: [
              { id: 'viwAllOrders456', name: 'All Orders', type: 'grid' }
            ]
          }
        ],
        totalCount: 2
      }
      mockSuccessAPIRequest(tablesResult)

      const accessToken = 'patABC123DEF456'
      const baseId = 'appABC123'
      const result = await transferAPI.getAirtableTablesList(appId, accessToken, baseId)

      expect(result).toEqual(tablesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/airtable/bases/${baseId}?accessToken=${accessToken}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle base with comprehensive table information', async () => {
      const tablesResult = {
        base: {
          id: 'appComplex789',
          name: 'Enterprise CRM',
          permissionLevel: 'create'
        },
        tables: [
          {
            id: 'tblContacts789',
            name: 'Contacts',
            description: 'Customer and prospect contact information',
            primaryFieldId: 'fldContactName789',
            recordCount: 15420,
            fields: [
              {
                id: 'fldContactName789',
                name: 'Contact Name',
                type: 'singleLineText',
                options: { required: true }
              },
              {
                id: 'fldCompany789',
                name: 'Company',
                type: 'multipleRecordLinks',
                options: {
                  linkedTableId: 'tblCompanies789',
                  isReversed: false
                }
              },
              {
                id: 'fldStatus789',
                name: 'Status',
                type: 'singleSelect',
                options: {
                  choices: [
                    { id: 'selLead', name: 'Lead', color: 'blueLight2' },
                    { id: 'selProspect', name: 'Prospect', color: 'yellowLight2' },
                    { id: 'selCustomer', name: 'Customer', color: 'greenLight2' }
                  ]
                }
              }
            ],
            views: [
              {
                id: 'viwAllContacts789',
                name: 'All Contacts',
                type: 'grid',
                fieldOrder: ['fldContactName789', 'fldCompany789', 'fldStatus789']
              },
              {
                id: 'viwActiveLeads789',
                name: 'Active Leads',
                type: 'grid',
                filters: [
                  {
                    field: 'fldStatus789',
                    operator: 'is',
                    value: 'selLead'
                  }
                ]
              }
            ]
          }
        ],
        metadata: {
          lastModified: '2024-01-15T10:30:00Z',
          timezone: 'America/New_York'
        }
      }
      mockSuccessAPIRequest(tablesResult)

      const accessToken = 'patComplex789'
      const baseId = 'appComplex789'
      const result = await transferAPI.getAirtableTablesList(appId, accessToken, baseId)

      expect(result).toEqual(tablesResult)
    })

    it('fails when server responds with base not found error', async () => {
      mockFailedAPIRequest('Airtable base not found or not accessible', 404)

      const accessToken = 'patValid123'
      const baseId = 'appNonExistent'
      const error = await transferAPI.getAirtableTablesList(appId, accessToken, baseId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Airtable base not found or not accessible' },
        message: 'Airtable base not found or not accessible',
        status: 404
      })
    })
  })

  describe('startAirtableImport', () => {
    it('should make POST request to start Airtable import', async () => {
      const importResult = {
        importId: 'airtable-import-123',
        status: 'initiated',
        baseId: 'appABC123',
        estimatedRecords: 2500,
        estimatedDuration: '10-15 minutes',
        startedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(importResult)

      const accessToken = 'patABC123DEF456'
      const baseId = 'appABC123'
      const tables = [
        {
          airtableTableId: 'tblCustomers123',
          backendlessTableName: 'customers',
          fieldMapping: {
            'fldName123': 'name',
            'fldEmail123': 'email',
            'fldPhone123': 'phone'
          }
        },
        {
          airtableTableId: 'tblOrders456',
          backendlessTableName: 'orders',
          fieldMapping: {
            'fldOrderId456': 'order_id',
            'fldAmount456': 'amount',
            'fldCustomer456': 'customer_id'
          }
        }
      ]

      const result = await transferAPI.startAirtableImport(appId, accessToken, baseId, tables)

      expect(result).toEqual(importResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/airtable`,
        body: JSON.stringify({ accessToken, baseId, tables }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex Airtable import configuration', async () => {
      const importResult = {
        importId: 'airtable-import-complex-456',
        status: 'initiated',
        configuration: {
          tables: 3,
          totalFields: 45,
          relationships: 8
        }
      }
      mockSuccessAPIRequest(importResult)

      const accessToken = 'patComplex456'
      const baseId = 'appComplex456'
      const tables = [
        {
          airtableTableId: 'tblContacts456',
          backendlessTableName: 'contacts',
          fieldMapping: {
            'fldContactName456': 'name',
            'fldEmail456': 'email',
            'fldCompany456': 'company_id'
          },
          options: {
            createTable: true,
            includeAttachments: true,
            viewFilter: 'viwActiveContacts456',
            batchSize: 100
          },
          transformations: [
            {
              field: 'fldEmail456',
              type: 'lowercase'
            },
            {
              field: 'fldPhone456',
              type: 'format',
              pattern: 'international'
            }
          ]
        },
        {
          airtableTableId: 'tblCompanies456',
          backendlessTableName: 'companies',
          fieldMapping: {
            'fldCompanyName456': 'name',
            'fldIndustry456': 'industry',
            'fldWebsite456': 'website'
          },
          relationships: [
            {
              type: 'oneToMany',
              relatedTable: 'contacts',
              foreignKey: 'company_id',
              airtableLinkedField: 'fldContacts456'
            }
          ]
        }
      ]

      const result = await transferAPI.startAirtableImport(appId, accessToken, baseId, tables)

      expect(result).toEqual(importResult)
    })

    it('should handle minimal Airtable import', async () => {
      const importResult = { importId: 'airtable-import-simple-789', status: 'initiated' }
      mockSuccessAPIRequest(importResult)

      const accessToken = 'patSimple789'
      const baseId = 'appSimple789'
      const tables = [
        {
          airtableTableId: 'tblData789',
          backendlessTableName: 'imported_data'
        }
      ]

      const result = await transferAPI.startAirtableImport(appId, accessToken, baseId, tables)

      expect(result).toEqual(importResult)
    })

    it('fails when server responds with access token validation error', async () => {
      mockFailedAPIRequest('Airtable access token is invalid or expired', 401)

      const accessToken = 'patExpired123'
      const baseId = 'appTest123'
      const tables = []
      const error = await transferAPI.startAirtableImport(appId, accessToken, baseId, tables).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Airtable access token is invalid or expired' },
        message: 'Airtable access token is invalid or expired',
        status: 401
      })
    })

    it('fails when server responds with configuration validation error', async () => {
      mockFailedAPIRequest('Invalid table configuration provided', 422)

      const accessToken = 'patValid123'
      const baseId = 'appValid123'
      const tables = [{ invalid: 'configuration' }]
      const error = await transferAPI.startAirtableImport(appId, accessToken, baseId, tables).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid table configuration provided' },
        message: 'Invalid table configuration provided',
        status: 422
      })
    })

    it('fails when server responds with import quota exceeded error', async () => {
      mockFailedAPIRequest('Import quota exceeded for this billing period', 429)

      const accessToken = 'patQuota123'
      const baseId = 'appQuota123'
      const tables = []
      const error = await transferAPI.startAirtableImport(appId, accessToken, baseId, tables).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Import quota exceeded for this billing period' },
        message: 'Import quota exceeded for this billing period',
        status: 429
      })
    })
  })
})
