import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.system', () => {
  let apiClient
  let systemAPI

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    systemAPI = apiClient.system
  })

  describe('loadStatus', () => {
    it('should make GET request to load status', async () => {
      const statusResult = {
        status: 'operational',
        version: '2024.1.5',
        uptime: '15 days, 8 hours',
        services: {
          database: { status: 'healthy', responseTime: 45 },
          fileStorage: { status: 'healthy', responseTime: 120 },
          messaging: { status: 'healthy', responseTime: 35 },
          cloudCode: { status: 'healthy', responseTime: 180 }
        },
        resources: {
          cpu: { usage: 35, limit: 80 },
          memory: { usage: 2.1, limit: 4.0, unit: 'GB' },
          storage: { used: 15.2, total: 50.0, unit: 'GB' }
        },
        timestamp: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(statusResult)

      const result = await systemAPI.loadStatus()

      expect(result).toEqual(statusResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/status',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should cache status request by default', async () => {
      const statusResult = { status: 'operational', timestamp: '2024-01-15T12:00:00Z' }
      mockSuccessAPIRequest(statusResult)

      // First call
      const result1 = await systemAPI.loadStatus(true)

      // Second call should use cache
      const result2 = await systemAPI.loadStatus()

      // Should still return the cached result
      expect(result1).toEqual(statusResult)
      expect(result1).toBe(result2)
      // Should not make a new HTTP request
      expect(apiRequestCalls()).toEqual([
        {
          'encoding': 'utf8',
          'headers': {},
          'method': 'GET',
          'path': 'http://test-host:3000/console/status',
          'timeout': 0,
          'withCredentials': false
        }
      ])
    })

    it('should force reload status when force=true', async () => {
      const statusResult = { status: 'operational', timestamp: '2024-01-15T12:00:00Z' }
      mockSuccessAPIRequest(statusResult)
      mockSuccessAPIRequest(statusResult)

      // First call
      await systemAPI.loadStatus(true)

      // Second call with force=true should make new HTTP request
      const result = await systemAPI.loadStatus(true)

      expect(result).toEqual(statusResult)
      // Should make 2 HTTP requests total
      expect(apiRequestCalls().length).toBe(2)
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('System status service unavailable', 503)

      const error = await systemAPI.loadStatus(true).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'System status service unavailable' },
        message: 'System status service unavailable',
        status: 503
      })
    })

    it('fails when server responds with maintenance mode error', async () => {
      mockFailedAPIRequest('System is in maintenance mode', 503)

      const error = await systemAPI.loadStatus(true).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'System is in maintenance mode' },
        message: 'System is in maintenance mode',
        status: 503
      })
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized to access system status', 401)

      const error = await systemAPI.loadStatus(true).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized to access system status' },
        message: 'Unauthorized to access system status',
        status: 401
      })
    })
  })

  describe('loadMainMenu', () => {
    it('should make GET request to load main menu', async () => {
      const menuResult = {
        items: [
          {
            id: 'dashboard',
            name: 'Dashboard',
            icon: 'dashboard',
            url: '/console/dashboard',
            order: 1,
            visible: true
          },
          {
            id: 'data',
            name: 'Data',
            icon: 'database',
            url: '/console/data',
            order: 2,
            visible: true,
            children: [
              {
                id: 'tables',
                name: 'Tables',
                url: '/console/data/tables',
                order: 1
              },
              {
                id: 'data-views',
                name: 'Data Views',
                url: '/console/data/views',
                order: 2
              }
            ]
          },
          {
            id: 'users',
            name: 'Users',
            icon: 'users',
            url: '/console/users',
            order: 3,
            visible: true
          }
        ],
        permissions: {
          dashboard: ['view'],
          data: ['view', 'edit'],
          users: ['view', 'edit', 'create']
        },
        version: '2024.1.5'
      }
      mockSuccessAPIRequest(menuResult)

      const result = await systemAPI.loadMainMenu()

      expect(result).toEqual(menuResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/api/console/main-menu/items',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle comprehensive menu with user-specific customizations', async () => {
      const menuResult = {
        items: [
          {
            id: 'dashboard',
            name: 'Dashboard',
            icon: 'dashboard',
            url: '/console/dashboard',
            order: 1,
            visible: true,
            badge: {
              text: '3',
              color: 'red',
              tooltip: '3 alerts requiring attention'
            }
          },
          {
            id: 'data',
            name: 'Data Management',
            icon: 'database',
            url: '/console/data',
            order: 2,
            visible: true,
            expanded: true,
            children: [
              {
                id: 'tables',
                name: 'Tables',
                icon: 'table',
                url: '/console/data/tables',
                order: 1,
                visible: true,
                permissions: ['view', 'create', 'edit', 'delete']
              },
              {
                id: 'data-views',
                name: 'Data Views',
                icon: 'view',
                url: '/console/data/views',
                order: 2,
                visible: true,
                permissions: ['view', 'create', 'edit']
              },
              {
                id: 'api-services',
                name: 'API Services',
                icon: 'api',
                url: '/console/data/api',
                order: 3,
                visible: true,
                permissions: ['view', 'edit']
              }
            ]
          },
          {
            id: 'business-logic',
            name: 'Business Logic',
            icon: 'code',
            url: '/console/business-logic',
            order: 3,
            visible: true,
            children: [
              {
                id: 'cloud-code',
                name: 'Cloud Code',
                url: '/console/business-logic/cloud-code',
                order: 1,
                permissions: ['view', 'edit', 'deploy']
              },
              {
                id: 'timers',
                name: 'Timers',
                url: '/console/business-logic/timers',
                order: 2,
                permissions: ['view', 'create', 'edit']
              }
            ]
          },
          {
            id: 'users',
            name: 'User Management',
            icon: 'users',
            url: '/console/users',
            order: 4,
            visible: true,
            permissions: ['view', 'edit', 'create', 'delete'],
            children: [
              {
                id: 'user-roles',
                name: 'User Roles',
                url: '/console/users/roles',
                order: 1
              },
              {
                id: 'security',
                name: 'Security',
                url: '/console/users/security',
                order: 2
              }
            ]
          },
          {
            id: 'messaging',
            name: 'Messaging',
            icon: 'message',
            url: '/console/messaging',
            order: 5,
            visible: true,
            badge: {
              text: 'New',
              color: 'green',
              tooltip: 'New messaging features available'
            }
          },
          {
            id: 'files',
            name: 'Files',
            icon: 'folder',
            url: '/console/files',
            order: 6,
            visible: true
          },
          {
            id: 'analytics',
            name: 'Analytics',
            icon: 'chart',
            url: '/console/analytics',
            order: 7,
            visible: true,
            permissions: ['view']
          },
          {
            id: 'settings',
            name: 'Settings',
            icon: 'settings',
            url: '/console/settings',
            order: 8,
            visible: true,
            permissions: ['view', 'edit']
          }
        ],
        userPreferences: {
          collapsedMenus: ['business-logic'],
          pinnedItems: ['dashboard', 'data'],
          recentItems: [
            { id: 'tables', timestamp: '2024-01-15T11:30:00Z' },
            { id: 'cloud-code', timestamp: '2024-01-15T10:15:00Z' },
            { id: 'users', timestamp: '2024-01-15T09:45:00Z' }
          ]
        },
        notifications: {
          total: 3,
          unread: 2,
          items: [
            {
              id: 'alert-1',
              type: 'warning',
              message: 'Database usage approaching limit',
              timestamp: '2024-01-15T11:00:00Z',
              read: false
            },
            {
              id: 'alert-2',
              type: 'info',
              message: 'New feature: Advanced Analytics available',
              timestamp: '2024-01-15T08:30:00Z',
              read: false
            }
          ]
        },
        quickActions: [
          {
            id: 'create-table',
            name: 'Create Table',
            icon: 'plus',
            url: '/console/data/tables/create',
            permissions: ['data.create']
          },
          {
            id: 'deploy-code',
            name: 'Deploy Code',
            icon: 'deploy',
            url: '/console/business-logic/deploy',
            permissions: ['business-logic.deploy']
          }
        ],
        applicationInfo: {
          name: 'My Application',
          plan: 'Pro',
          region: 'US East',
          version: '2024.1.5'
        },
        metadata: {
          generatedAt: '2024-01-15T12:00:00Z',
          userId: 'user-123',
          permissions: ['admin'],
          theme: 'light'
        }
      }
      mockSuccessAPIRequest(menuResult)

      const result = await systemAPI.loadMainMenu()

      expect(result).toEqual(menuResult)
    })

    it('should handle simplified menu for limited permissions', async () => {
      const menuResult = {
        items: [
          {
            id: 'dashboard',
            name: 'Dashboard',
            icon: 'dashboard',
            url: '/console/dashboard',
            order: 1,
            visible: true,
            permissions: ['view']
          },
          {
            id: 'data',
            name: 'Data',
            icon: 'database',
            url: '/console/data',
            order: 2,
            visible: true,
            permissions: ['view'],
            children: [
              {
                id: 'tables',
                name: 'Tables',
                url: '/console/data/tables',
                order: 1,
                permissions: ['view']
              }
            ]
          }
        ],
        restrictions: [
          'Limited to read-only access',
          'Advanced features require upgrade'
        ],
        upgradePrompt: {
          visible: true,
          message: 'Upgrade to Pro for full access',
          url: '/console/billing/upgrade'
        }
      }
      mockSuccessAPIRequest(menuResult)

      const result = await systemAPI.loadMainMenu()

      expect(result).toEqual(menuResult)
    })

    it('should handle empty menu for unauthorized users', async () => {
      const menuResult = {
        items: [],
        message: 'No menu items available for current user permissions',
        permissions: []
      }
      mockSuccessAPIRequest(menuResult)

      const result = await systemAPI.loadMainMenu()

      expect(result).toEqual(menuResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized to access main menu', 401)

      const error = await systemAPI.loadMainMenu().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized to access main menu' },
        message: 'Unauthorized to access main menu',
        status: 401
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Main menu service temporarily unavailable', 503)

      const error = await systemAPI.loadMainMenu().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Main menu service temporarily unavailable' },
        message: 'Main menu service temporarily unavailable',
        status: 503
      })
    })

    it('fails when server responds with configuration error', async () => {
      mockFailedAPIRequest('Menu configuration error', 500)

      const error = await systemAPI.loadMainMenu().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Menu configuration error' },
        message: 'Menu configuration error',
        status: 500
      })
    })
  })
})
