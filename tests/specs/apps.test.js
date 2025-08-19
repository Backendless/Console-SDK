import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.apps', () => {
  let apiClient
  let appsAPI

  const appId = 'test-app-id'
  const processId = 'process-123'
  const devId = 'dev-456'
  const successResult = { id: appId, name: 'Test App' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    appsAPI = apiClient.apps
  })

  describe('createApp', () => {
    it('should make POST request to create app with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const app = {
        name: 'Test App',
        subdomain: 'test-app',
        description: 'A test application'
      }
      const query = { zone: 'us-west-2' }

      const result = await appsAPI.createApp(app, query)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications?zone=us-west-2',
        method: 'POST',
        body: JSON.stringify(app),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should create app without query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const app = { name: 'Test App' }

      const result = await appsAPI.createApp(app)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications',
        method: 'POST',
        body: JSON.stringify(app),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('App name already exists', 409)

      const app = { name: 'Duplicate App' }

      const error = await appsAPI.createApp(app).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'App name already exists' },
        message: 'App name already exists',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications',
        method: 'POST',
        body: JSON.stringify(app),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createAppFromZIP', () => {
    it('should make POST request to create app from ZIP', async () => {
      mockSuccessAPIRequest(successResult)

      const zipData = { name: 'App from ZIP', file: 'zip-content' }

      const result = await appsAPI.createAppFromZIP(zipData)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications/from-zip',
        method: 'POST',
        body: JSON.stringify(zipData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when ZIP upload fails', async () => {
      mockFailedAPIRequest('Invalid ZIP file', 422)

      const zipData = { name: 'Invalid ZIP' }

      const error = await appsAPI.createAppFromZIP(zipData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Invalid ZIP file')
      expect(error.status).toBe(422)
    })
  })

  describe('createAppFromZipUrl', () => {
    it('should make POST request to create app from ZIP URL', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        url: 'https://example.com/app.zip',
        name: 'App from URL'
      }

      const result = await appsAPI.createAppFromZipUrl(data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications/from-zip-url',
        method: 'POST',
        body: JSON.stringify(data),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when ZIP URL is invalid', async () => {
      mockFailedAPIRequest('Invalid URL format', 400)

      const data = { url: 'invalid-url' }

      const error = await appsAPI.createAppFromZipUrl(data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Invalid URL format')
    })
  })

  describe('getApps', () => {
    it('should make GET request to fetch apps with zone parameter', async () => {
      const apps = [{ id: 'app1' }, { id: 'app2' }]
      mockSuccessAPIRequest(apps)

      const zone = 'us-east-1'

      const result = await appsAPI.getApps(zone)

      expect(result).toEqual(apps)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications?zone=us-east-1',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty zone parameter', async () => {
      const apps = []
      mockSuccessAPIRequest(apps)

      const result = await appsAPI.getApps()

      expect(result).toEqual(apps)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server error occurs', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const error = await appsAPI.getApps('us-west-2').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('resetApp', () => {
    it('should make POST request to reset app with correct parameters', async () => {
      mockSuccessAPIRequest({ success: true })

      const resets = {
        data: true,
        files: false,
        cloudCode: true
      }

      const result = await appsAPI.resetApp(appId, resets)

      expect(result).toEqual({ success: true })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/appreset`,
        method: 'POST',
        body: JSON.stringify(resets),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when reset operation fails', async () => {
      mockFailedAPIRequest('Reset operation failed', 500)

      const resets = { data: true }

      const error = await appsAPI.resetApp(appId, resets).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Reset operation failed')
    })
  })

  describe('renameApp', () => {
    it('should make PUT request to rename app', async () => {
      mockSuccessAPIRequest({ success: true })

      const newAppName = 'Renamed App'

      const result = await appsAPI.renameApp(appId, newAppName)

      expect(result).toEqual({ success: true })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/application`,
        method: 'PUT',
        body: JSON.stringify({ appName: newAppName }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when app name is invalid', async () => {
      mockFailedAPIRequest('Invalid app name', 400)

      const error = await appsAPI.renameApp(appId, '').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Invalid app name')
    })
  })

  describe('deleteApp', () => {
    it('should make DELETE request to remove app', async () => {
      mockSuccessAPIRequest({ success: true })

      const result = await appsAPI.deleteApp(appId)

      expect(result).toEqual({ success: true })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/application`,
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when app cannot be deleted', async () => {
      mockFailedAPIRequest('App has active subscriptions', 403)

      const error = await appsAPI.deleteApp(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
      expect(error.message).toBe('App has active subscriptions')
    })
  })

  describe('cloneApp', () => {
    it('should make POST request to clone app', async () => {
      mockSuccessAPIRequest({ cloneId: 'new-app-123' })

      const newApp = {
        name: 'Cloned App',
        subdomain: 'cloned-app'
      }

      const result = await appsAPI.cloneApp(appId, newApp)

      expect(result).toEqual({ cloneId: 'new-app-123' })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cloneApp`,
        method: 'POST',
        body: JSON.stringify(newApp),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when clone parameters are invalid', async () => {
      mockFailedAPIRequest('Clone name already exists', 409)

      const newApp = { name: 'Existing App' }

      const error = await appsAPI.cloneApp(appId, newApp).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
    })
  })

  describe('generateAppZIP', () => {
    it('should make POST request to generate app ZIP', async () => {
      mockSuccessAPIRequest({ downloadUrl: 'https://example.com/app.zip' })

      const result = await appsAPI.generateAppZIP(appId)

      expect(result).toEqual({ downloadUrl: 'https://example.com/app.zip' })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/application/transfer`,
        method: 'POST',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when ZIP generation fails', async () => {
      mockFailedAPIRequest('ZIP generation failed', 500)

      const error = await appsAPI.generateAppZIP(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('ZIP generation failed')
    })
  })

  describe('getCloningAppStatus', () => {
    it('should make GET request to check cloning status', async () => {
      mockSuccessAPIRequest({ status: 'in-progress', progress: 50 })

      const result = await appsAPI.getCloningAppStatus(appId, processId)

      expect(result).toEqual({ status: 'in-progress', progress: 50 })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/cloneApp/${processId}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when process ID is invalid', async () => {
      mockFailedAPIRequest('Process not found', 404)

      const error = await appsAPI.getCloningAppStatus(appId, 'invalid-process').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('loadAppsMenuItems', () => {
    it('should make GET request to load apps menu items', async () => {
      const menuItems = [{ id: 'item1', label: 'Menu Item 1' }]
      mockSuccessAPIRequest(menuItems)

      const result = await appsAPI.loadAppsMenuItems()

      expect(result).toEqual(menuItems)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications/menu-items',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when menu items cannot be loaded', async () => {
      mockFailedAPIRequest('Menu items not available', 503)

      const error = await appsAPI.loadAppsMenuItems().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(503)
    })
  })

  describe('loadAppFavorites', () => {
    it('should make GET request to load app favorites with correct query parameters', async () => {
      const favorites = ['table1', 'table2']
      mockSuccessAPIRequest(favorites)

      const result = await appsAPI.loadAppFavorites(appId, devId)

      expect(result).toEqual(favorites)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/applications/app-favorites?appId=${appId}&devId=${devId}`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when favorites cannot be loaded', async () => {
      mockFailedAPIRequest('Favorites not found', 404)

      const error = await appsAPI.loadAppFavorites(appId, devId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('loadAppsInfo', () => {
    it('should make GET request to load apps info with app IDs', async () => {
      const appsInfo = [{ id: 'app1', info: 'info1' }]
      mockSuccessAPIRequest(appsInfo)

      const appsIds = ['app1', 'app2', 'app3']

      const result = await appsAPI.loadAppsInfo(appsIds)

      expect(result).toEqual(appsInfo)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/apps-info?appsIds=app1&appsIds=app2&appsIds=app3',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle single app ID', async () => {
      mockSuccessAPIRequest([{ id: 'app1' }])

      const result = await appsAPI.loadAppsInfo('app1')

      expect(apiRequestCalls()[0].path).toContain('appsIds=app1')
    })

    it('fails when apps info cannot be loaded', async () => {
      mockFailedAPIRequest('Apps info not available', 500)

      const error = await appsAPI.loadAppsInfo(['app1']).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('updateAppInfo', () => {
    it('should make POST request to update app info', async () => {
      mockSuccessAPIRequest({ success: true })

      const info = {
        description: 'Updated description',
        category: 'Business',
        tags: ['tag1', 'tag2']
      }

      const result = await appsAPI.updateAppInfo(appId, info)

      expect(result).toEqual({ success: true })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/app-info`,
        method: 'POST',
        body: JSON.stringify(info),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when app info update fails', async () => {
      mockFailedAPIRequest('Invalid app info', 400)

      const info = { invalid: 'data' }

      const error = await appsAPI.updateAppInfo(appId, info).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Invalid app info')
    })
  })

  describe('updateAppLogo', () => {
    it('should make POST request to update app logo', async () => {
      mockSuccessAPIRequest({ logoUrl: 'https://example.com/logo.png' })

      const logo = { logoFile: 'logo-data', fileName: 'logo.png' }

      const result = await appsAPI.updateAppLogo(appId, logo)

      expect(result).toEqual({ logoUrl: 'https://example.com/logo.png' })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/app-info/logos`,
        method: 'POST',
        body: JSON.stringify(logo),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when logo upload fails', async () => {
      mockFailedAPIRequest('Invalid logo format', 422)

      const logo = { logoFile: 'invalid-logo' }

      const error = await appsAPI.updateAppLogo(appId, logo).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(422)
    })
  })

  describe('generateSubdomains', () => {
    it('should make GET request to generate subdomains with zone parameter', async () => {
      const subdomains = ['app-001', 'app-002']
      mockSuccessAPIRequest(subdomains)

      const zone = 'eu-west-1'

      const result = await appsAPI.generateSubdomains(zone)

      expect(result).toEqual(subdomains)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/applications/suggested-generated-domains?zone=eu-west-1',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty zone parameter', async () => {
      mockSuccessAPIRequest([])

      const result = await appsAPI.generateSubdomains()

      expect(apiRequestCalls()[0].path).toBe('http://test-host:3000/console/applications/suggested-generated-domains')
    })

    it('fails when subdomain generation fails', async () => {
      mockFailedAPIRequest('Zone not available', 400)

      const error = await appsAPI.generateSubdomains('invalid-zone').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Zone not available')
    })
  })

  describe('getAppDevOptions', () => {
    it('should make GET request to fetch app dev options', async () => {
      const options = { debugMode: true, logLevel: 'info' }
      mockSuccessAPIRequest(options)

      const result = await appsAPI.getAppDevOptions(appId)

      expect(result).toEqual(options)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/developer/options`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when dev options cannot be fetched', async () => {
      mockFailedAPIRequest('Dev options not found', 404)

      const error = await appsAPI.getAppDevOptions(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('updateAppDevOptions', () => {
    it('should make PUT request to update app dev options', async () => {
      mockSuccessAPIRequest({ success: true })

      const options = {
        debugMode: false,
        logLevel: 'error',
        maxConnections: 100
      }

      const result = await appsAPI.updateAppDevOptions(appId, options)

      expect(result).toEqual({ success: true })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/developer/options`,
        method: 'PUT',
        body: JSON.stringify(options),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when dev options update fails', async () => {
      mockFailedAPIRequest('Invalid options', 400)

      const options = { invalid: true }

      const error = await appsAPI.updateAppDevOptions(appId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Invalid options')
    })
  })
})