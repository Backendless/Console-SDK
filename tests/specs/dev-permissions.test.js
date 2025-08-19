import { DevPermissions } from '../../src/dev-permissions'

describe('apiClient.devPermissions', () => {
  let apiClient
  let devPermissionsAPI

  const appId = 'test-app-id'
  const successResult = { access: 'GRANT', operation: 'CREATE_MODIFY_DELETE_TABLE' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    devPermissionsAPI = apiClient.devPermissions
  })

  describe('DevPermissions constants', () => {
    describe('AccessTypes', () => {
      it('should export correct access types', () => {
        expect(DevPermissions.AccessTypes).toEqual({
          GRANT: 'GRANT',
          DENY: 'DENY'
        })
      })
    })

    describe('OperationsTypes', () => {
      it('should transform numeric/string operation IDs to operation names', () => {
        // Test that all operations now use their key names as values
        expect(DevPermissions.OperationsTypes.INVITE_OR_REMOVE_TEAM_MEMBER).toBe('INVITE_OR_REMOVE_TEAM_MEMBER')
        expect(DevPermissions.OperationsTypes.APP_RESET).toBe('APP_RESET')
        expect(DevPermissions.OperationsTypes.BILLING_SECTION).toBe('BILLING_SECTION')
        expect(DevPermissions.OperationsTypes.MODIFY_BL).toBe('MODIFY_BL')
        expect(DevPermissions.OperationsTypes.CREATE_MODIFY_DELETE_TABLE).toBe('CREATE_MODIFY_DELETE_TABLE')
      })

      it('should contain all expected operation categories', () => {
        const operations = DevPermissions.OperationsTypes

        // App Access Security operations
        expect(operations.INVITE_OR_REMOVE_TEAM_MEMBER).toBe('INVITE_OR_REMOVE_TEAM_MEMBER')
        expect(operations.ASSIGN_TEAM_MEMBER_PERMISSION).toBe('ASSIGN_TEAM_MEMBER_PERMISSION')
        expect(operations.DELETE_AUDIT_LOGS).toBe('DELETE_AUDIT_LOGS')
        expect(operations.ACTIVATE_HIPAA_COMPLIANCE).toBe('ACTIVATE_HIPAA_COMPLIANCE')
        expect(operations.ENABLE_PANIC_MODE).toBe('ENABLE_PANIC_MODE')

        // App Settings operations
        expect(operations.APP_RESET).toBe('APP_RESET')
        expect(operations.MODIFY_CORS_DOMAIN_CONTROL).toBe('MODIFY_CORS_DOMAIN_CONTROL')
        expect(operations.DELETE_APPLICATION).toBe('DELETE_APPLICATION')
        expect(operations.RENAME_APP).toBe('RENAME_APP')

        // Billing operations
        expect(operations.BILLING_SECTION).toBe('BILLING_SECTION')
        expect(operations.ADD_UPDATE_CREDIT_CARD).toBe('ADD_UPDATE_CREDIT_CARD')
        expect(operations.MODIFY_BILLING_PLAN).toBe('MODIFY_BILLING_PLAN')
        expect(operations.MARKETPLACE_PURCHASE).toBe('MARKETPLACE_PURCHASE')

        // Cache Control operations
        expect(operations.CACHE_CONTROL_SECTION).toBe('CACHE_CONTROL_SECTION')
        expect(operations.MODIFY_CACHE_CONTROL_RULES).toBe('MODIFY_CACHE_CONTROL_RULES')

        // Automation operations
        expect(operations.AUTOMATION_SECTION).toBe('AUTOMATION_SECTION')
        expect(operations.CREATE_MODIFY_DELETE_FLOWS).toBe('CREATE_MODIFY_DELETE_FLOWS')

        // Cloud Code operations
        expect(operations.CLOUD_CODE_SECTION).toBe('CLOUD_CODE_SECTION')
        expect(operations.MODIFY_BL).toBe('MODIFY_BL')
        expect(operations.PUBLISH_TO_MARKETPLACE).toBe('PUBLISH_TO_MARKETPLACE')
        expect(operations.RUN_TIMER).toBe('RUN_TIMER')

        // Data Service operations
        expect(operations.DATA_SERVICE_SECTION).toBe('DATA_SERVICE_SECTION')
        expect(operations.CREATE_MODIFY_DELETE_TABLE).toBe('CREATE_MODIFY_DELETE_TABLE')
        expect(operations.CREATE_MODIFY_DELETE_COLUMN).toBe('CREATE_MODIFY_DELETE_COLUMN')
        expect(operations.CREATE_DELETE_UPDATE_OBJECTS).toBe('CREATE_DELETE_UPDATE_OBJECTS')

        // Data Connector operations
        expect(operations.DATA_CONNECTOR_SECTION).toBe('DATA_CONNECTOR_SECTION')
        expect(operations.CREATE_MODIFY_DELETE_DATA_CONNECTOR).toBe('CREATE_MODIFY_DELETE_DATA_CONNECTOR')
        expect(operations.STORED_PROCEDURE).toBe('STORED_PROCEDURE')

        // Email Templates operations
        expect(operations.EMAIL_TEMPLATES_SECTION).toBe('EMAIL_TEMPLATES_SECTION')
        expect(operations.CREATE_MODIFY_DELETE_TEMPLATE).toBe('CREATE_MODIFY_DELETE_TEMPLATE')

        // File Service operations
        expect(operations.FILES_SECTION).toBe('FILES_SECTION')
        expect(operations.MANAGE_DIRECTORIES_AND_FILES).toBe('MANAGE_DIRECTORIES_AND_FILES')
        expect(operations.MODIFY_FILE_PERMISSIONS).toBe('MODIFY_FILE_PERMISSIONS')

        // Geolocation operations
        expect(operations.GEOLOCATION_SECTION).toBe('GEOLOCATION_SECTION')
        expect(operations.CREATE_MODIFY_DELETE_GEO_CATEGORY).toBe('CREATE_MODIFY_DELETE_GEO_CATEGORY')
        expect(operations.CREATE_MODIFY_DELETE_GEOFENCE).toBe('CREATE_MODIFY_DELETE_GEOFENCE')

        // Import/Export operations
        expect(operations.IMPORT_EXPORT_SECTION).toBe('IMPORT_EXPORT_SECTION')
        expect(operations.CLONE_APP).toBe('CLONE_APP')
        expect(operations.EXPORT_APP).toBe('EXPORT_APP')
        expect(operations.IMPORT).toBe('IMPORT')

        // Landing Page operations
        expect(operations.LANDING_PAGE_SECTION).toBe('LANDING_PAGE_SECTION')
        expect(operations.MODIFY_LANDING_PAGE).toBe('MODIFY_LANDING_PAGE')
        expect(operations.PUBLISH_LANDING_PAGE).toBe('PUBLISH_LANDING_PAGE')

        // Log Management operations
        expect(operations.LOG_MANAGEMENT_SECTION).toBe('LOG_MANAGEMENT_SECTION')
        expect(operations.MODIFY_LOG_CONFIG).toBe('MODIFY_LOG_CONFIG')
        expect(operations.DELETE_LOGGERS).toBe('DELETE_LOGGERS')

        // Messaging operations
        expect(operations.MESSAGING_SECTION).toBe('MESSAGING_SECTION')
        expect(operations.CREATE_MODIFY_DELETE_CHANEL).toBe('CREATE_MODIFY_DELETE_CHANEL')
        expect(operations.SEND_MESSAGE_TO_CHANNEL).toBe('SEND_MESSAGE_TO_CHANNEL')
        expect(operations.SEND_PUSH_BY_TEMPLATE).toBe('SEND_PUSH_BY_TEMPLATE')

        // Security Roles operations
        expect(operations.SECURITY_ROLES_SECTION).toBe('SECURITY_ROLES_SECTION')
        expect(operations.ADD_MODIFY_ASSIGN_ROLE).toBe('ADD_MODIFY_ASSIGN_ROLE')
        expect(operations.ASSIGN_ROLE_PERMISSIONS).toBe('ASSIGN_ROLE_PERMISSIONS')

        // User Management operations
        expect(operations.USERS_SECTION).toBe('USERS_SECTION')
        expect(operations.MODIFY_LOGIN_PROPS).toBe('MODIFY_LOGIN_PROPS')
        expect(operations.MODIFY_USER_REGISTRATION_PROPS).toBe('MODIFY_USER_REGISTRATION_PROPS')
        expect(operations.LOGOUT_ALL_USERS).toBe('LOGOUT_ALL_USERS')

        // UI Builder operations
        expect(operations.ACCESS_UI_BUILDER).toBe('ACCESS_UI_BUILDER')
        expect(operations.PUBLISH_UI_CONTAINERS).toBe('PUBLISH_UI_CONTAINERS')

        // FlowRunner operations
        expect(operations.FLOWRUNNER_SECTION).toBe('FLOWRUNNER_SECTION')
        expect(operations.EDIT_FLOW_VERSION).toBe('EDIT_FLOW_VERSION')
        expect(operations.ACCESS_FLOW_PERMISSIONS).toBe('ACCESS_FLOW_PERMISSIONS')
        expect(operations.LAUNCH_FLOW_VERSION).toBe('LAUNCH_FLOW_VERSION')
        expect(operations.ACCESS_VERSION_ADMIN).toBe('ACCESS_VERSION_ADMIN')
      })

      it('should have all expected operation types transformed', () => {
        const operationKeys = Object.keys(DevPermissions.OperationsTypes)
        
        // Verify we have a significant number of operations (around 70+)
        expect(operationKeys.length).toBeGreaterThan(70)
        
        // Verify each key maps to itself (transformation applied)
        operationKeys.forEach(key => {
          expect(DevPermissions.OperationsTypes[key]).toBe(key)
        })
      })
    })

    describe('OperationsLabels', () => {
      it('should preserve original operation values', () => {
        // Test that OperationsLabels contains the original numeric/string values
        expect(DevPermissions.OperationsLabels.INVITE_OR_REMOVE_TEAM_MEMBER).toBe(1)
        expect(DevPermissions.OperationsLabels.APP_RESET).toBe(13)
        expect(DevPermissions.OperationsLabels.BILLING_SECTION).toBe('Billing section')
        expect(DevPermissions.OperationsLabels.MODIFY_BL).toBe(93)
        expect(DevPermissions.OperationsLabels.CREATE_MODIFY_DELETE_TABLE).toBe(40)
        expect(DevPermissions.OperationsLabels.CLOUD_CODE_SECTION).toBe('Cloud Code section')
        expect(DevPermissions.OperationsLabels.ACCESS_UI_BUILDER).toBe('Access UI Builder')
      })

      it('should contain all operations with their original values', () => {
        const operationKeys = Object.keys(DevPermissions.OperationsTypes)
        const labelKeys = Object.keys(DevPermissions.OperationsLabels)
        
        // Should have same keys as OperationsTypes
        expect(labelKeys.sort()).toEqual(operationKeys.sort())
        
        // Verify some specific original values are preserved
        expect(DevPermissions.OperationsLabels.ASSIGN_TEAM_MEMBER_PERMISSION).toBe(3)
        expect(DevPermissions.OperationsLabels.DATA_SERVICE_SECTION).toBe('Data Service section')
        expect(DevPermissions.OperationsLabels.MODIFY_CACHE_CONTROL_RULES).toBe(116)
        expect(DevPermissions.OperationsLabels.FLOWRUNNER_SECTION).toBe('FlowRunner')
      })
    })
  })

  describe('get', () => {
    it('should make GET request with correct URL structure', async () => {
      mockSuccessAPIRequest(successResult)

      const operation = 'CREATE_MODIFY_DELETE_TABLE'
      const result = await devPermissionsAPI.get(appId, operation)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should work with numeric operation IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const operation = 'MODIFY_BL'
      const result = await devPermissionsAPI.get(appId, operation)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should work with string section operations', async () => {
      mockSuccessAPIRequest(successResult)

      const operation = 'BILLING_SECTION'
      const result = await devPermissionsAPI.get(appId, operation)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle operations from different categories', async () => {
      const testCases = [
        { operation: 'INVITE_OR_REMOVE_TEAM_MEMBER', category: 'App Access Security' },
        { operation: 'APP_RESET', category: 'App Settings' },
        { operation: 'ADD_UPDATE_CREDIT_CARD', category: 'Billing' },
        { operation: 'MODIFY_CACHE_CONTROL_RULES', category: 'Cache Control' },
        { operation: 'CREATE_MODIFY_DELETE_FLOWS', category: 'Automation' },
        { operation: 'PUBLISH_TO_MARKETPLACE', category: 'Cloud Code' },
        { operation: 'CREATE_DELETE_UPDATE_OBJECTS', category: 'Data Service' },
        { operation: 'STORED_PROCEDURE', category: 'Data Connector' },
        { operation: 'CREATE_MODIFY_DELETE_TEMPLATE', category: 'Email Templates' },
        { operation: 'UPLOAD_CREATE_FILES', category: 'Files' },
        { operation: 'CREATE_MODIFY_DELETE_GEOFENCE', category: 'Geolocation' },
        { operation: 'CLONE_APP', category: 'Import/Export' },
        { operation: 'PUBLISH_LANDING_PAGE', category: 'Landing Page' },
        { operation: 'MODIFY_LOG_INTEGRATIONS', category: 'Log Management' },
        { operation: 'SEND_PUSH_BY_TEMPLATE', category: 'Messaging' },
        { operation: 'ADD_MODIFY_ASSIGN_ROLE', category: 'Security Roles' },
        { operation: 'LOGOUT_ALL_USERS', category: 'Users' },
        { operation: 'ACCESS_UI_BUILDER', category: 'UI Builder' },
        { operation: 'LAUNCH_FLOW_VERSION', category: 'FlowRunner' }
      ]

      for (const testCase of testCases) {
        mockSuccessAPIRequest({ ...successResult, operation: testCase.operation })

        const result = await devPermissionsAPI.get(appId, testCase.operation)

        expect(result.operation).toBe(testCase.operation)
        const lastCall = apiRequestCalls().pop()
        expect(lastCall.path).toBe(`http://test-host:3000/${appId}/console/security/${testCase.operation}`)
        expect(lastCall).toMatchObject({
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        })
      }
    })

    it('should handle custom operation names', async () => {
      mockSuccessAPIRequest(successResult)

      const customOperation = 'CUSTOM_PERMISSION_CHECK'
      const result = await devPermissionsAPI.get(appId, customOperation)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${customOperation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle special characters in operation names', async () => {
      mockSuccessAPIRequest(successResult)

      const operation = 'CREATE_MODIFY_DELETE_COLUMNS_VISIBILITY_PERMISSIONS'
      const result = await devPermissionsAPI.get(appId, operation)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Permission denied', 403)

      const operation = 'CREATE_MODIFY_DELETE_TABLE'
      const error = await devPermissionsAPI.get(appId, operation).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Permission denied' },
        message: 'Permission denied',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails with 401 unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized access', 401)

      const operation = 'MODIFY_BL'
      const error = await devPermissionsAPI.get(appId, operation).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized access' },
        message: 'Unauthorized access',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails with 404 not found error', async () => {
      mockFailedAPIRequest('Operation not found', 404)

      const operation = 'NON_EXISTENT_OPERATION'
      const error = await devPermissionsAPI.get(appId, operation).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Operation not found' },
        message: 'Operation not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails with 500 internal server error', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const operation = 'APP_RESET'
      const error = await devPermissionsAPI.get(appId, operation).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Internal server error' },
        message: 'Internal server error',
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/security/${operation}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should work with different appId formats', async () => {
      const testAppIds = [
        'simple-app',
        'app_with_underscores',
        'app-with-123-numbers',
        'UPPERCASE-APP',
        '12345-numeric-start',
        'app.with.dots'
      ]

      for (const testAppId of testAppIds) {
        mockSuccessAPIRequest({ ...successResult, appId: testAppId })

        const operation = 'CREATE_MODIFY_DELETE_TABLE'
        const result = await devPermissionsAPI.get(testAppId, operation)

        expect(result.appId).toBe(testAppId)
        const lastCall = apiRequestCalls().pop()
        expect(lastCall.path).toBe(`http://test-host:3000/${testAppId}/console/security/${operation}`)
        expect(lastCall).toMatchObject({
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        })
      }
    })
  })
})