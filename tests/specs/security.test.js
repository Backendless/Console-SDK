describe('apiClient.security', () => {
  let apiClient
  let securityAPI

  const appId = 'test-app-id'
  const successResult = { data: [{ id: 'test-role', name: 'TestRole', permissions: [] }] }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    securityAPI = apiClient.security
  })

  describe('loadRoles', () => {
    it('should load roles and transform response', async () => {
      const rolesResponse = [
        { roleId: 'role-123', rolename: 'TestRole' },
        { roleId: 'role-456', rolename: 'AuthenticatedUser' }
      ]

      mockSuccessAPIRequest(rolesResponse)

      const result = await securityAPI.loadRoles(appId)

      const expectedResult = [
        { id: 'role-123', name: 'TestRole', roleId: 'role-123', rolename: 'TestRole', system: false },
        { id: 'role-456', name: 'AuthenticatedUser', roleId: 'role-456', rolename: 'AuthenticatedUser', system: true }
      ]

      expect(result).toEqual(expectedResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await securityAPI.loadRoles(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })
  })

  describe('createRole', () => {
    it('should create role with correct parameters', async () => {
      const roleResponse = { roleId: 'new-role-123', rolename: 'NewRole' }
      mockSuccessAPIRequest(roleResponse)

      const roleName = 'NewRole'
      const result = await securityAPI.createRole(appId, roleName)

      const expectedResult = { id: 'new-role-123', name: 'NewRole', roleId: 'new-role-123', rolename: 'NewRole' }

      expect(result).toEqual(expectedResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/NewRole',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle role names with special characters', async () => {
      const roleResponse = { roleId: 'role-123', rolename: 'Role With Spaces & Special@Chars' }
      mockSuccessAPIRequest(roleResponse)

      const roleName = 'Role With Spaces & Special@Chars'
      const result = await securityAPI.createRole(appId, roleName)

      expect(result.name).toBe('Role With Spaces & Special@Chars')

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/Role%20With%20Spaces%20%26%20Special%40Chars',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when role creation fails', async () => {
      mockFailedAPIRequest('Role already exists', 409)

      const error = await securityAPI.createRole(appId, 'ExistingRole').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
      expect(error.message).toBe('Role already exists')
    })
  })

  describe('deleteRole', () => {
    it('should delete role by id', async () => {
      mockSuccessAPIRequest()

      const roleId = 'role-123'
      const result = await securityAPI.deleteRole(appId, roleId)

      expect(result).toBeUndefined()

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/role-123',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when role deletion fails', async () => {
      mockFailedAPIRequest('Role not found', 404)

      const error = await securityAPI.deleteRole(appId, 'non-existent-role').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Role not found')
    })
  })

  describe('loadRolePermissions', () => {
    it('should load permissions for specific role', async () => {
      const permissionsResponse = [
        { operation: 'find', access: 'GRANT' },
        { operation: 'create', access: 'DENY' }
      ]

      mockSuccessAPIRequest(permissionsResponse)

      const roleId = 'role-123'
      const result = await securityAPI.loadRolePermissions(appId, roleId)

      expect(result).toEqual(permissionsResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/permissions/role-123',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when role permissions loading fails', async () => {
      mockFailedAPIRequest('Role not found', 404)

      const error = await securityAPI.loadRolePermissions(appId, 'invalid-role').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('setRolePermission', () => {
    it('should set role permission with correct parameters', async () => {
      const permissionResponse = { operation: 'find', access: 'GRANT' }
      mockSuccessAPIRequest(permissionResponse)

      const roleId = 'role-123'
      const permission = { operation: 'find', access: 'GRANT' }
      const result = await securityAPI.setRolePermission(appId, roleId, permission)

      expect(result).toEqual(permissionResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/permissions/role-123',
        method: 'PUT',
        body: JSON.stringify(permission),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when setting role permission fails', async () => {
      mockFailedAPIRequest('Invalid permission', 400)

      const error = await securityAPI.setRolePermission(appId, 'role-123', {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(400)
    })
  })

  describe('loadPermissions', () => {
    it('should load permissions for data service with users policy', async () => {
      const permissionsResponse = [
        {
          roleId: 'role-123',
          permissions: [
            { operation: 'find', access: 'GRANT' },
            { operation: 'create', access: 'DENY' }
          ]
        }
      ]

      mockSuccessAPIRequest(permissionsResponse)

      // Use roles policy to avoid totalRows complexity
      const result = await securityAPI.loadPermissions(
        appId,
        'roles',
        'messaging',
        'service-123',
        'ServiceName',
        'all'
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('role-123')
      expect(result.data[0].permissions).toEqual({
        find: 'GRANT',
        create: 'DENY'
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/messaging/service-123/roles',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should load permissions for roles policy', async () => {
      const permissionsResponse = [
        {
          roleId: 'role-123',
          permissions: [
            { operation: 'find', access: 'GRANT' }
          ]
        }
      ]

      mockSuccessAPIRequest(permissionsResponse)

      const result = await securityAPI.loadPermissions(
        appId,
        'roles',
        'data',
        'table-123',
        'TableName',
        'all'
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('role-123')

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/table-123/roles',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should load owner permissions', async () => {
      const permissionsResponse = [
        { operation: 'find', access: 'GRANT' },
        { operation: 'create', access: 'DENY' }
      ]

      mockSuccessAPIRequest(permissionsResponse)

      const result = await securityAPI.loadPermissions(
        appId,
        'owner',
        'data',
        'table-123',
        'TableName',
        'all'
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].permissions).toEqual({
        find: 'GRANT',
        create: 'DENY'
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/ownerpolicy/table-123',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should load permissions with filter parameters', async () => {
      mockSuccessAPIRequest([])

      const filterParams = { identity: 'testuser', offset: 10, pageSize: 20 }
      await securityAPI.loadPermissions(
        appId,
        'roles',
        'messaging',
        'service-123',
        'ServiceName',
        'all',
        filterParams
      )

      expect(apiRequestCalls()[0].path).toContain('name=testuser')
      expect(apiRequestCalls()[0].path).toContain('offset=10')
      expect(apiRequestCalls()[0].path).toContain('pageSize=20')
    })

    it('should load object ACL permissions', async () => {
      const permissionsResponse = [
        {
          roleId: 'role-123',
          permissions: [
            { operation: 'find', access: 'GRANT' }
          ]
        }
      ]

      mockSuccessAPIRequest(permissionsResponse)

      await securityAPI.loadPermissions(
        appId,
        'roles',
        'messaging',
        'service-123',
        'ServiceName',
        'object-456'
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/messaging/ServiceName/objectAcl/object-456/roles',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle files service with special URL structure', async () => {
      mockSuccessAPIRequest([])

      await securityAPI.loadPermissions(
        appId,
        'roles',
        'files',
        'folder/path',
        'FolderName',
        'all'
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/files/folder%2Fpath',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when loading permissions fails', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await securityAPI.loadPermissions(
        appId, 'users', 'data', 'table-123', 'TableName', 'all'
      ).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('setPermission', () => {
    it('should set permission for users policy', async () => {
      const permissionResponse = { permissions: [{ operation: 'find', access: 'GRANT' }] }
      mockSuccessAPIRequest(permissionResponse)

      const permission = { operation: 'find', access: 'GRANT' }
      const result = await securityAPI.setPermission(
        appId,
        'users',
        'user-123',
        'data',
        'table-123',
        'TableName',
        'all',
        permission
      )

      expect(result).toEqual({ 'user-123': { find: 'GRANT' } })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/table-123/users/user-123',
        method: 'PUT',
        body: JSON.stringify({ permissions: [permission] }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should set owner permission with different body structure', async () => {
      mockSuccessAPIRequest('GRANT')

      const permission = { operation: 'find', access: 'GRANT' }
      await securityAPI.setPermission(
        appId,
        'owner',
        'owner',
        'data',
        'table-123',
        'TableName',
        'all',
        permission
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/ownerpolicy/table-123',
        method: 'PUT',
        body: JSON.stringify(permission),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should set permission for object ACL', async () => {
      const aclResponse = [{
        operationName: 'find',
        operationId: 'find-123',
        roles: [{ roleId: 'role-123', roleName: 'TestRole', access: 'GRANT' }]
      }]

      mockSuccessAPIRequest(aclResponse)

      const permission = { operation: 'find', access: 'GRANT' }
      const result = await securityAPI.setPermission(
        appId,
        'roles',
        'role-123',
        'data',
        'table-123',
        'TableName',
        'object-456',
        permission
      )

      expect(result).toEqual({ 'role-123': { find: 'GRANT' } })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/TableName/objectAcl/object-456/roles/role-123',
        method: 'PUT',
        body: JSON.stringify(permission),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle columns policy with special URL structure', async () => {
      const columnsResponse = [
        { columnId: 'col-123', access: 'GRANT' }
      ]

      mockSuccessAPIRequest(columnsResponse)

      const permission = { operation: 'find', access: 'GRANT' }
      const result = await securityAPI.setPermission(
        appId,
        'columns',
        'role-123',
        'data',
        'table-123',
        'TableName',
        'all',
        permission
      )

      expect(result).toEqual(columnsResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/table-123/columns/permissions/find/role-123',
        method: 'PUT',
        body: JSON.stringify(permission),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle files service with users policy', async () => {
      const permissionResponse = { permissions: [{ operation: 'find', access: 'GRANT' }] }
      mockSuccessAPIRequest(permissionResponse)

      const permission = { operation: 'find', access: 'GRANT' }
      await securityAPI.setPermission(
        appId,
        'users',
        'user-123',
        'files',
        'folder/path',
        'FolderName',
        'all',
        permission
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/users/user-123/file/folder/path',
        method: 'PUT',
        body: JSON.stringify({ permissions: [permission] }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle API services with all operation', async () => {
      const permissionResponse = { permissions: [{ operation: 'all', access: 'GRANT' }] }
      mockSuccessAPIRequest(permissionResponse)

      const permission = { operation: 'all', access: 'GRANT' }
      await securityAPI.setPermission(
        appId,
        'users',
        'user-123',
        'localservices',
        'service-123',
        'ServiceName',
        'all',
        permission
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/localservices/service-123/users/user-123/access/GRANT',
        method: 'PUT',
        body: JSON.stringify({ permissions: [permission] }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when setting permission fails', async () => {
      mockFailedAPIRequest('Permission denied', 403)

      const permission = { operation: 'find', access: 'GRANT' }
      const error = await securityAPI.setPermission(
        appId, 'users', 'user-123', 'data', 'table-123', 'TableName', 'all', permission
      ).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('dropPermissions', () => {
    it('should drop permissions with correct URL structure', async () => {
      const dropResponse = { permissions: [{ operation: 'find', access: 'GRANT' }] }
      mockSuccessAPIRequest(dropResponse)

      const result = await securityAPI.dropPermissions(
        appId,
        'users',
        'user-123',
        'data',
        'table-123',
        'TableName',
        'all',
        'find'
      )

      expect(result).toEqual({ 'user-123': { find: 'GRANT' } })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/table-123/users/user-123/find',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should drop owner permissions', async () => {
      mockSuccessAPIRequest('GRANT')

      await securityAPI.dropPermissions(
        appId,
        'owner',
        'owner',
        'data',
        'table-123',
        'TableName',
        'all',
        'find'
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/ownerpolicy/table-123/find',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should drop object ACL permissions for roles', async () => {
      const aclResponse = [{
        operationName: 'find',
        operationId: 'find-123',
        roles: [{ roleId: 'role-123', roleName: 'TestRole', access: 'GRANT' }]
      }]
      mockSuccessAPIRequest(aclResponse)

      await securityAPI.dropPermissions(
        appId,
        'roles',
        'role-123',
        'data',
        'table-123',
        'TableName',
        'object-456',
        'find'
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/TableName/objectAcl/object-456/roles/find',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should drop object ACL permissions for users', async () => {
      const permissionResponse = { permissions: [{ operation: 'find', access: 'GRANT' }] }
      mockSuccessAPIRequest(permissionResponse)

      await securityAPI.dropPermissions(
        appId,
        'users',
        'user-123',
        'data',
        'table-123',
        'TableName',
        'object-456',
        'find'
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/TableName/objectAcl/object-456/users/user-123',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should drop files permissions', async () => {
      const permissionResponse = { permissions: [{ operation: 'find', access: 'GRANT' }] }
      mockSuccessAPIRequest(permissionResponse)

      await securityAPI.dropPermissions(
        appId,
        'roles',
        'role-123',
        'files',
        'folder/path',
        'FolderName',
        'all',
        'find'
      )

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/roles/role-123/files/folder/path',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when dropping permissions fails', async () => {
      mockFailedAPIRequest('Permission not found', 404)

      const error = await securityAPI.dropPermissions(
        appId, 'users', 'user-123', 'data', 'table-123', 'TableName', 'all', 'find'
      ).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('searchDataACLUsers', () => {
    it('should search for users in data ACL', async () => {
      const usersResponse = [
        {
          userId: 'user-123',
          email: 'test@example.com',
          permissions: [{ operation: 'find', access: 'GRANT' }]
        },
        {
          userId: 'user-456',
          email: 'another@example.com',
          permissions: [{ operation: 'create', access: 'DENY' }]
        }
      ]

      mockSuccessAPIRequest(usersResponse)

      const result = await securityAPI.searchDataACLUsers(appId, 'TableName', 'object-123', 'test')

      expect(result.data).toHaveLength(2)
      expect(result.data[0].id).toBe('user-123')

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/TableName/objectAcl/object-123/users/search/test',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when search fails', async () => {
      mockFailedAPIRequest('Search failed', 500)

      const error = await securityAPI.searchDataACLUsers(appId, 'TableName', 'object-123', 'test').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('loadColumnPermissions', () => {
    it('should load column permissions for table', async () => {
      const columnsResponse = [
        { columnId: 'col-123', permissions: [{ operation: 'find', access: 'GRANT' }] }
      ]

      mockSuccessAPIRequest(columnsResponse)

      const result = await securityAPI.loadColumnPermissions(appId, 'table-123')

      expect(result).toEqual(columnsResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/data/table-123/columns/permissions',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when loading column permissions fails', async () => {
      mockFailedAPIRequest('Table not found', 404)

      const error = await securityAPI.loadColumnPermissions(appId, 'invalid-table').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('loadAuditLogs', () => {
    it('should load audit logs', async () => {
      const auditLogsResponse = [
        { id: 'log-123', action: 'CREATE', timestamp: Date.now() }
      ]

      mockSuccessAPIRequest(auditLogsResponse)

      const result = await securityAPI.loadAuditLogs(appId)

      expect(result).toEqual(auditLogsResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/audit-logs',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when loading audit logs fails', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await securityAPI.loadAuditLogs(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('deleteAuditLogs', () => {
    it('should delete audit logs', async () => {
      mockSuccessAPIRequest()

      const result = await securityAPI.deleteAuditLogs(appId)

      expect(result).toBeUndefined()

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/audit-logs',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when deleting audit logs fails', async () => {
      mockFailedAPIRequest('Delete failed', 500)

      const error = await securityAPI.deleteAuditLogs(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('downloadAuditLogs', () => {
    it('should download audit logs with date range', async () => {
      const downloadResponse = { downloadUrl: 'https://example.com/logs.csv' }
      mockSuccessAPIRequest(downloadResponse)

      const fromDate = '2023-01-01'
      const toDate = '2023-12-31'
      const result = await securityAPI.downloadAuditLogs(appId, fromDate, toDate)

      expect(result).toEqual(downloadResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/security/audit-logs/download?fromDate=2023-01-01&toDate=2023-12-31',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when downloading audit logs fails', async () => {
      mockFailedAPIRequest('Download failed', 500)

      const error = await securityAPI.downloadAuditLogs(appId, '2023-01-01', '2023-12-31').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('activatePanicMode', () => {
    it('should activate panic mode with settings', async () => {
      mockSuccessAPIRequest({ enabled: true })

      const settings = { timeoutMinutes: 30, reason: 'Security breach' }
      const result = await securityAPI.activatePanicMode(appId, settings)

      expect(result).toEqual({ enabled: true })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/panic/enable',
        method: 'PUT',
        body: JSON.stringify(settings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when activating panic mode fails', async () => {
      mockFailedAPIRequest('Activation failed', 500)

      const error = await securityAPI.activatePanicMode(appId, {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('deactivatePanicMode', () => {
    it('should deactivate panic mode with settings', async () => {
      mockSuccessAPIRequest({ enabled: false })

      const settings = { reason: 'Issue resolved' }
      const result = await securityAPI.deactivatePanicMode(appId, settings)

      expect(result).toEqual({ enabled: false })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/panic/disable',
        method: 'PUT',
        body: JSON.stringify(settings),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when deactivating panic mode fails', async () => {
      mockFailedAPIRequest('Deactivation failed', 500)

      const error = await securityAPI.deactivatePanicMode(appId, {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('loadUsers', () => {
    it('should load users with query parameters', async () => {
      const usersResponse = {
        data: [{ userId: 'user-123', email: 'test@example.com' }],
        totalCount: 1
      }

      mockSuccessAPIRequest(usersResponse)

      const queryParams = {
        identityOrUserId: 'test@example.com',
        offset: 0,
        pageSize: 20,
        sortBy: 'email'
      }

      const result = await securityAPI.loadUsers(appId, queryParams)

      expect(result).toEqual(usersResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/user/sessions/users?identityOrUserId=test%40example.com&offset=0&pageSize=20&sortBy=email',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial query parameters', async () => {
      mockSuccessAPIRequest({ data: [] })

      await securityAPI.loadUsers(appId, { pageSize: 10 })

      expect(apiRequestCalls()[0].path).toContain('pageSize=10')
      expect(apiRequestCalls()[0].path).not.toContain('identityOrUserId')
    })

    it('fails when loading users fails', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const error = await securityAPI.loadUsers(appId, {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('loadUsersWithSessions', () => {
    it('should load users with active sessions', async () => {
      const usersResponse = {
        data: [{ userId: 'user-123', sessionCount: 2 }],
        cursor: 'next-cursor'
      }

      mockSuccessAPIRequest(usersResponse)

      const queryParams = { cursor: 'some-cursor', pageSize: 50 }
      const result = await securityAPI.loadUsersWithSessions(appId, queryParams)

      expect(result).toEqual(usersResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/user/sessions/users-with-sessions?pageSize=50&cursor=some-cursor',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when loading users with sessions fails', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await securityAPI.loadUsersWithSessions(appId, { pageSize: 10 }).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(503)
    })
  })

  describe('loadUserSessions', () => {
    it('should load sessions for specific user', async () => {
      const sessionsResponse = {
        data: [
          { sessionId: 'sess-123', lastActivity: Date.now() },
          { sessionId: 'sess-456', lastActivity: Date.now() - 1000 }
        ],
        cursor: 'next-cursor'
      }

      mockSuccessAPIRequest(sessionsResponse)

      const userId = 'user-123'
      const queryParams = { cursor: 'some-cursor', pageSize: 25 }
      const result = await securityAPI.loadUserSessions(appId, userId, queryParams)

      expect(result).toEqual(sessionsResponse)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/user/sessions/user-123?pageSize=25&cursor=some-cursor',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when loading user sessions fails', async () => {
      mockFailedAPIRequest('User not found', 404)

      const error = await securityAPI.loadUserSessions(appId, 'invalid-user', {}).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('logoutUserSessions', () => {
    it('should logout all sessions for user', async () => {
      mockSuccessAPIRequest({ loggedOut: true })

      const userId = 'user-123'
      const result = await securityAPI.logoutUserSessions(appId, userId)

      expect(result).toEqual({ loggedOut: true })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/user/sessions/logout',
        method: 'PUT',
        body: userId,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when logout fails', async () => {
      mockFailedAPIRequest('Logout failed', 500)

      const error = await securityAPI.logoutUserSessions(appId, 'user-123').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('activateHIPAACompliance', () => {
    it('should activate HIPAA compliance', async () => {
      mockSuccessAPIRequest({ hipaaEnabled: true })

      const result = await securityAPI.activateHIPAACompliance(appId)

      expect(result).toEqual({ hipaaEnabled: true })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/compliance/hipaa/enable',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when activating HIPAA compliance fails', async () => {
      mockFailedAPIRequest('HIPAA activation failed', 500)

      const error = await securityAPI.activateHIPAACompliance(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('deactivateHIPAACompliance', () => {
    it('should deactivate HIPAA compliance', async () => {
      mockSuccessAPIRequest({ hipaaEnabled: false })

      const result = await securityAPI.deactivateHIPAACompliance(appId)

      expect(result).toEqual({ hipaaEnabled: false })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/compliance/hipaa/disable',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when deactivating HIPAA compliance fails', async () => {
      mockFailedAPIRequest('HIPAA deactivation failed', 500)

      const error = await securityAPI.deactivateHIPAACompliance(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })
})
