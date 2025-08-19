describe('apiClient.dataToVisualize', () => {
  let apiClient
  let dataToVisualizeAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    dataToVisualizeAPI = apiClient.dataToVisualize
  })

  describe('getDashboards', () => {
    it('should make GET request to get dashboards', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await dataToVisualizeAPI.getDashboards(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false,
        query: undefined
      }])
    })

    it('should make GET request with query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const query = { filter: 'active', limit: 20, offset: 0 }
      const result = await dataToVisualizeAPI.getDashboards(appId, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards?filter=active&limit=20&offset=0`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle search and pagination', async () => {
      mockSuccessAPIRequest(successResult)

      const query = { search: 'analytics', pageSize: 50, sortBy: 'created' }
      const result = await dataToVisualizeAPI.getDashboards(appId, query)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards?search=analytics&pageSize=50&sortBy=created`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await dataToVisualizeAPI.getDashboards(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })
  })

  describe('createDashboard', () => {
    it('should make POST request to create dashboard', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboard = {
        name: 'Sales Analytics',
        description: 'Dashboard for sales team metrics',
        layout: 'grid',
        isPublic: false
      }

      const result = await dataToVisualizeAPI.createDashboard(appId, dashboard)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards`,
        body: JSON.stringify(dashboard),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal dashboard creation', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboard = { name: 'Simple Dashboard' }

      const result = await dataToVisualizeAPI.createDashboard(appId, dashboard)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards`,
        body: JSON.stringify(dashboard),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Dashboard name is required', 400)

      const dashboard = { description: 'Dashboard without name' }
      const error = await dataToVisualizeAPI.createDashboard(appId, dashboard).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Dashboard name is required' },
        message: 'Dashboard name is required',
        status: 400
      })
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Dashboard name already exists', 409)

      const dashboard = { name: 'Existing Dashboard' }
      const error = await dataToVisualizeAPI.createDashboard(appId, dashboard).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Dashboard name already exists' },
        message: 'Dashboard name already exists',
        status: 409
      })
    })
  })

  describe('cloneDashboard', () => {
    it('should make POST request to clone dashboard', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const result = await dataToVisualizeAPI.cloneDashboard(appId, dashboardId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/clone`,
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID dashboard IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await dataToVisualizeAPI.cloneDashboard(appId, dashboardId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/clone`,
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Dashboard not found', 404)

      const dashboardId = 'nonexistent-dashboard'
      const error = await dataToVisualizeAPI.cloneDashboard(appId, dashboardId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Dashboard not found' },
        message: 'Dashboard not found',
        status: 404
      })
    })
  })

  describe('updateDashboard', () => {
    it('should make PUT request to update dashboard', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-456'
      const changes = {
        name: 'Updated Sales Dashboard',
        description: 'Updated description',
        isPublic: true
      }

      const result = await dataToVisualizeAPI.updateDashboard(appId, dashboardId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial updates', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const changes = { isPublic: false }

      const result = await dataToVisualizeAPI.updateDashboard(appId, dashboardId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid dashboard layout', 422)

      const dashboardId = 'dashboard-123'
      const changes = { layout: 'invalid-layout' }
      const error = await dataToVisualizeAPI.updateDashboard(appId, dashboardId, changes).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid dashboard layout' },
        message: 'Invalid dashboard layout',
        status: 422
      })
    })
  })

  describe('updateDashboards', () => {
    it('should make PUT request to update multiple dashboards', async () => {
      mockSuccessAPIRequest(successResult)

      const changes = {
        dashboards: [
          { id: 'dashboard-1', name: 'Updated Dashboard 1' },
          { id: 'dashboard-2', name: 'Updated Dashboard 2' }
        ]
      }

      const result = await dataToVisualizeAPI.updateDashboards(appId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle bulk operations', async () => {
      mockSuccessAPIRequest(successResult)

      const changes = { operation: 'archive', dashboardIds: ['dash-1', 'dash-2', 'dash-3'] }

      const result = await dataToVisualizeAPI.updateDashboards(appId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateDashboardSettings', () => {
    it('should make PUT request to update dashboard settings', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-settings-123'
      const settings = {
        refreshInterval: 30000,
        autoRefresh: true,
        theme: 'dark',
        gridSize: 12
      }

      const result = await dataToVisualizeAPI.updateDashboardSettings(appId, dashboardId, settings)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/settings`,
        body: JSON.stringify(settings),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle minimal settings update', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-456'
      const settings = { autoRefresh: false }

      const result = await dataToVisualizeAPI.updateDashboardSettings(appId, dashboardId, settings)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/settings`,
        body: JSON.stringify(settings),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteDashboard', () => {
    it('should make DELETE request to delete dashboard', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'temp-dashboard'
      const result = await dataToVisualizeAPI.deleteDashboard(appId, name)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${name}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle dashboard deletion by ID', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-to-delete-789'
      const result = await dataToVisualizeAPI.deleteDashboard(appId, dashboardId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Dashboard not found', 404)

      const name = 'nonexistent-dashboard'
      const error = await dataToVisualizeAPI.deleteDashboard(appId, name).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Dashboard not found' },
        message: 'Dashboard not found',
        status: 404
      })
    })
  })

  describe('addDashboardDashlet', () => {
    it('should make POST request to add dashboard dashlet', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const dashletComponent = {
        type: 'chart',
        componentId: 'bar-chart-component',
        title: 'Sales Chart',
        position: { x: 0, y: 0, width: 6, height: 4 }
      }

      const result = await dataToVisualizeAPI.addDashboardDashlet(appId, dashboardId, dashletComponent)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets`,
        body: JSON.stringify(dashletComponent),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different dashlet types', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'analytics-dashboard'
      const dashletComponent = {
        type: 'metric',
        componentId: 'kpi-metric',
        title: 'Total Revenue',
        config: { aggregation: 'sum', field: 'revenue' }
      }

      const result = await dataToVisualizeAPI.addDashboardDashlet(appId, dashboardId, dashletComponent)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets`,
        body: JSON.stringify(dashletComponent),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createDashboardDashlets', () => {
    it('should make POST request to create multiple dashlets', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'multi-dashlet-dashboard'
      const dashlets = [
        { type: 'chart', componentId: 'line-chart', title: 'Trends' },
        { type: 'table', componentId: 'data-table', title: 'Raw Data' },
        { type: 'metric', componentId: 'counter', title: 'Total Count' }
      ]

      const result = await dataToVisualizeAPI.createDashboardDashlets(appId, dashboardId, dashlets)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets/create`,
        body: JSON.stringify(dashlets),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty dashlets array', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'empty-dashboard'
      const dashlets = []

      const result = await dataToVisualizeAPI.createDashboardDashlets(appId, dashboardId, dashlets)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets/create`,
        body: JSON.stringify(dashlets),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteDashboardDashlet', () => {
    it('should make DELETE request to delete dashboard dashlet', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const dashletId = 'dashlet-456'
      const result = await dataToVisualizeAPI.deleteDashboardDashlet(appId, dashboardId, dashletId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets/${dashletId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID dashlet IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-uuid'
      const dashletId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await dataToVisualizeAPI.deleteDashboardDashlet(appId, dashboardId, dashletId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets/${dashletId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Dashlet not found', 404)

      const dashboardId = 'dashboard-123'
      const dashletId = 'nonexistent-dashlet'
      const error = await dataToVisualizeAPI.deleteDashboardDashlet(appId, dashboardId, dashletId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Dashlet not found' },
        message: 'Dashlet not found',
        status: 404
      })
    })
  })

  describe('updateDashboardDashlet', () => {
    it('should make PUT request to update dashboard dashlet', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const dashletId = 'dashlet-456'
      const changes = {
        title: 'Updated Chart Title',
        position: { x: 6, y: 0, width: 6, height: 4 },
        config: { chartType: 'pie' }
      }

      const result = await dataToVisualizeAPI.updateDashboardDashlet(appId, dashboardId, dashletId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets/${dashletId}`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial dashlet updates', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const dashletId = 'dashlet-101'
      const changes = { title: 'New Title' }

      const result = await dataToVisualizeAPI.updateDashboardDashlet(appId, dashboardId, dashletId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlets/${dashletId}`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadDashletComponents', () => {
    it('should make GET request to load dashlet components', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const result = await dataToVisualizeAPI.loadDashletComponents(appId, dashboardId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different dashboard types', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'analytics-dashboard-456'
      const result = await dataToVisualizeAPI.loadDashletComponents(appId, dashboardId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('installDashletComponent', () => {
    it('should make POST request to install dashlet component', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const product = {
        productId: 'chart-component-v2',
        version: '2.1.0',
        name: 'Advanced Chart Component'
      }

      const result = await dataToVisualizeAPI.installDashletComponent(appId, dashboardId, product)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/install`,
        body: JSON.stringify(product),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle marketplace component installation', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'analytics-dashboard'
      const product = {
        productId: 'marketplace-table-widget',
        version: 'latest'
      }

      const result = await dataToVisualizeAPI.installDashletComponent(appId, dashboardId, product)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/install`,
        body: JSON.stringify(product),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('upgradeDashletComponent', () => {
    it('should make POST request to upgrade dashlet component', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-456'
      const product = { productId: 'chart-component-v2' }
      const versionId = '2.2.0'

      const result = await dataToVisualizeAPI.upgradeDashletComponent(appId, dashboardId, product, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/upgrade`,
        body: JSON.stringify({ product, versionId }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle component upgrade to latest version', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'prod-dashboard'
      const product = { productId: 'advanced-metrics', name: 'Advanced Metrics Widget' }
      const versionId = 'latest'

      const result = await dataToVisualizeAPI.upgradeDashletComponent(appId, dashboardId, product, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/upgrade`,
        body: JSON.stringify({ product, versionId }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createDashletComponent', () => {
    it('should make POST request to create dashlet component', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'custom-dashboard'
      const dashlet = {
        name: 'Custom Chart Widget',
        type: 'chart',
        template: 'basic-chart',
        config: { dataSource: 'api', refreshRate: 5000 }
      }

      const result = await dataToVisualizeAPI.createDashletComponent(appId, dashboardId, dashlet)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/create`,
        body: JSON.stringify(dashlet),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle simple dashlet component creation', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'test-dashboard'
      const dashlet = { name: 'Simple Metric', type: 'metric' }

      const result = await dataToVisualizeAPI.createDashletComponent(appId, dashboardId, dashlet)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/create`,
        body: JSON.stringify(dashlet),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteDashletComponent', () => {
    it('should make DELETE request to delete dashlet component', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'
      const result = await dataToVisualizeAPI.deleteDashletComponent(appId, dashboardId, componentId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle UUID component IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-uuid'
      const componentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = await dataToVisualizeAPI.deleteDashletComponent(appId, dashboardId, componentId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateDashletComponent', () => {
    it('should make PUT request to update dashlet component', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'
      const changes = {
        name: 'Updated Chart Component',
        config: { chartType: 'line', animation: true }
      }

      const result = await dataToVisualizeAPI.updateDashletComponent(appId, dashboardId, componentId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial component updates', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const componentId = 'component-101'
      const changes = { name: 'Renamed Component' }

      const result = await dataToVisualizeAPI.updateDashletComponent(appId, dashboardId, componentId, changes)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/`,
        body: JSON.stringify(changes),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getDashletComponentFileDownloadLink', () => {
    it('should make GET request to get dashlet component file download link', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'
      const fileId = 'chart.js'

      const result = await dataToVisualizeAPI.getDashletComponentFileDownloadLink(appId, dashboardId, componentId, fileId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files/sign?fileId=${fileId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different file types', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const componentId = 'component-101'
      const fileId = 'styles.css'

      const result = await dataToVisualizeAPI.getDashletComponentFileDownloadLink(appId, dashboardId, componentId, fileId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files/sign?fileId=${fileId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadDashletComponentFilesList', () => {
    it('should make GET request to load dashlet component files list', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'

      const result = await dataToVisualizeAPI.loadDashletComponentFilesList(appId, dashboardId, componentId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('loadDashletComponentFileContent', () => {
    it('should make GET request to load dashlet component file content', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'
      const fileName = 'component.js'

      const result = await dataToVisualizeAPI.loadDashletComponentFileContent(appId, dashboardId, componentId, fileName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files/${fileName}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle different file extensions', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const componentId = 'component-101'
      const fileName = 'template.html'

      const result = await dataToVisualizeAPI.loadDashletComponentFileContent(appId, dashboardId, componentId, fileName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files/${fileName}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('uploadDashletComponentFiles', () => {
    it('should make POST request to upload dashlet component files', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'
      const files = expect.any(Object)

      const result = await dataToVisualizeAPI.uploadDashletComponentFiles(appId, dashboardId, componentId, files)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files`,
        body: JSON.stringify(files),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle multiple file uploads', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const componentId = 'component-101'
      const files = { 'component.js': 'file content', 'styles.css': 'css content' }

      const result = await dataToVisualizeAPI.uploadDashletComponentFiles(appId, dashboardId, componentId, files)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files`,
        body: JSON.stringify(files),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('updateDashletComponentFiles', () => {
    it('should make PUT request to update dashlet component files', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-123'
      const componentId = 'component-456'
      const files = { 'component.js': 'updated content' }

      const result = await dataToVisualizeAPI.updateDashletComponentFiles(appId, dashboardId, componentId, files)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files`,
        body: JSON.stringify(files),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle batch file updates', async () => {
      mockSuccessAPIRequest(successResult)

      const dashboardId = 'dashboard-789'
      const componentId = 'component-101'
      const files = {
        'main.js': 'updated main script',
        'styles.css': 'updated styles',
        'template.html': 'updated template'
      }

      const result = await dataToVisualizeAPI.updateDashletComponentFiles(appId, dashboardId, componentId, files)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/data-to-visualize/dashboards/${dashboardId}/dashlet-components/${componentId}/files`,
        body: JSON.stringify(files),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
