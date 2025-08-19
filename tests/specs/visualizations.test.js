describe('apiClient.visualizations', () => {
  let apiClient
  let visualizationsAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    visualizationsAPI = apiClient.visualizations
  })

  describe('getVisualizations', () => {
    it('should make GET request to get visualizations', async () => {
      const visualizationsResult = {
        visualizations: [
          {
            id: 'viz-123',
            name: 'Sales Dashboard',
            type: 'dashboard',
            description: 'Comprehensive sales analytics dashboard',
            status: 'active',
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            lastAccessed: '2024-01-15T11:45:00Z'
          },
          {
            id: 'viz-456',
            name: 'User Activity Chart',
            type: 'chart',
            description: 'Real-time user activity visualization',
            status: 'active',
            createdAt: '2024-01-12T14:30:00Z',
            updatedAt: '2024-01-14T16:20:00Z',
            lastAccessed: '2024-01-15T09:15:00Z'
          }
        ],
        totalCount: 2,
        activeCount: 2,
        inactiveCount: 0
      }
      mockSuccessAPIRequest(visualizationsResult)

      const result = await visualizationsAPI.getVisualizations(appId)

      expect(result).toEqual(visualizationsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty visualizations list', async () => {
      const visualizationsResult = {
        visualizations: [],
        totalCount: 0,
        message: 'No visualizations found for this application'
      }
      mockSuccessAPIRequest(visualizationsResult)

      const result = await visualizationsAPI.getVisualizations(appId)

      expect(result).toEqual(visualizationsResult)
    })

    it('should handle comprehensive visualizations with detailed metadata', async () => {
      const visualizationsResult = {
        visualizations: [
          {
            id: 'viz-comprehensive-789',
            name: 'Executive Analytics Suite',
            type: 'dashboard',
            description: 'Executive-level analytics with KPIs and trends',
            status: 'active',
            category: 'business-intelligence',
            tags: ['executive', 'kpi', 'trends', 'analytics'],
            configuration: {
              layout: 'grid',
              theme: 'corporate',
              refreshInterval: 300000,
              autoRefresh: true,
              responsive: true
            },
            dataSource: {
              type: 'multiple',
              sources: [
                { id: 'sales-data', table: 'sales', refreshRate: 'hourly' },
                { id: 'user-data', table: 'users', refreshRate: 'daily' },
                { id: 'analytics-data', external: true, api: 'google-analytics' }
              ]
            },
            components: [
              {
                id: 'revenue-chart',
                type: 'line-chart',
                title: 'Revenue Trend',
                position: { x: 0, y: 0, width: 6, height: 4 },
                config: {
                  xAxis: 'date',
                  yAxis: 'revenue',
                  aggregation: 'daily'
                }
              },
              {
                id: 'kpi-cards',
                type: 'kpi-grid',
                title: 'Key Metrics',
                position: { x: 6, y: 0, width: 6, height: 2 },
                metrics: [
                  { name: 'Total Revenue', value: '$125,430', change: '+12.5%' },
                  { name: 'Active Users', value: '15,420', change: '+8.2%' },
                  { name: 'Conversion Rate', value: '3.4%', change: '-0.3%' }
                ]
              }
            ],
            permissions: {
              canView: ['admin', 'manager', 'analyst'],
              canEdit: ['admin', 'manager'],
              canShare: ['admin'],
              isPublic: false
            },
            usage: {
              viewCount: 247,
              lastViewed: '2024-01-15T11:45:00Z',
              averageSessionDuration: '8m 32s',
              uniqueViewers: 23
            },
            performance: {
              loadTime: 1250,
              dataSize: '2.3MB',
              cacheHitRatio: 85,
              lastOptimized: '2024-01-14T03:00:00Z'
            },
            createdBy: 'admin@example.com',
            createdAt: '2024-01-08T10:00:00Z',
            updatedBy: 'analyst@example.com',
            updatedAt: '2024-01-15T09:30:00Z',
            version: '2.1',
            isTemplate: false,
            isFavorite: true
          }
        ],
        categories: ['business-intelligence', 'operational', 'marketing', 'finance'],
        statistics: {
          totalVisualizations: 1,
          mostUsedType: 'dashboard',
          averageLoadTime: 1250,
          totalViews: 247,
          activeUsers: 23
        },
        quotas: {
          maxVisualizations: 50,
          maxDataSources: 10,
          storageUsed: '45.2MB',
          storageLimit: '1GB'
        }
      }
      mockSuccessAPIRequest(visualizationsResult)

      const result = await visualizationsAPI.getVisualizations(appId)

      expect(result).toEqual(visualizationsResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await visualizationsAPI.getVisualizations(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await visualizationsAPI.getVisualizations('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('createVisualization', () => {
    it('should make POST request to create visualization', async () => {
      const createResult = {
        id: 'new-viz-123',
        name: 'Marketing Dashboard',
        type: 'dashboard',
        status: 'active',
        message: 'Visualization created successfully',
        createdAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(createResult)

      const visualization = {
        name: 'Marketing Dashboard',
        type: 'dashboard',
        description: 'Comprehensive marketing analytics dashboard',
        configuration: {
          layout: 'grid',
          theme: 'marketing',
          columns: 12,
          rows: 8,
          refreshInterval: 300000
        },
        components: [
          {
            type: 'chart',
            chartType: 'bar',
            title: 'Campaign Performance',
            dataSource: 'campaigns',
            position: { x: 0, y: 0, width: 6, height: 4 },
            config: {
              xAxis: 'campaign_name',
              yAxis: 'conversions',
              color: '#3b82f6'
            }
          },
          {
            type: 'metric',
            title: 'Total Leads',
            dataSource: 'leads',
            position: { x: 6, y: 0, width: 3, height: 2 },
            config: {
              aggregation: 'count',
              format: 'number',
              threshold: { warning: 1000, critical: 500 }
            }
          }
        ],
        dataSources: [
          {
            id: 'campaigns',
            type: 'table',
            table: 'marketing_campaigns',
            filters: { status: 'active' }
          },
          {
            id: 'leads',
            type: 'table',
            table: 'leads',
            filters: { created_at: { gte: '2024-01-01' } }
          }
        ]
      }

      const result = await visualizationsAPI.createVisualization(appId, visualization)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations`,
        body: JSON.stringify(visualization),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle simple chart creation', async () => {
      const createResult = {
        id: 'chart-456',
        name: 'Revenue Chart',
        type: 'chart',
        status: 'active'
      }
      mockSuccessAPIRequest(createResult)

      const visualization = {
        name: 'Revenue Chart',
        type: 'chart',
        chartType: 'line',
        dataSource: {
          table: 'sales',
          xColumn: 'date',
          yColumn: 'revenue'
        },
        styling: {
          color: '#059669',
          lineWidth: 2,
          showPoints: true
        }
      }

      const result = await visualizationsAPI.createVisualization(appId, visualization)

      expect(result).toEqual(createResult)
    })

    it('should handle complex visualization with advanced features', async () => {
      const createResult = {
        id: 'advanced-viz-789',
        name: 'Advanced Analytics Platform',
        status: 'active',
        features: ['real-time', 'interactive', 'drill-down']
      }
      mockSuccessAPIRequest(createResult)

      const visualization = {
        name: 'Advanced Analytics Platform',
        type: 'dashboard',
        description: 'Real-time analytics with interactive drill-down capabilities',
        configuration: {
          layout: 'fluid',
          theme: 'dark',
          interactivity: {
            enableDrillDown: true,
            enableFilters: true,
            enableExport: true,
            crossFiltering: true
          },
          realTime: {
            enabled: true,
            updateInterval: 30000,
            maxDataPoints: 10000,
            streaming: true
          },
          responsive: {
            breakpoints: {
              mobile: 768,
              tablet: 1024,
              desktop: 1440
            }
          }
        },
        components: [
          {
            id: 'realtime-metrics',
            type: 'metric-grid',
            title: 'Real-time KPIs',
            position: { x: 0, y: 0, width: 12, height: 2 },
            metrics: [
              {
                name: 'Active Users',
                query: 'SELECT COUNT(DISTINCT user_id) FROM sessions WHERE last_activity > NOW() - INTERVAL 5 MINUTE',
                format: 'number',
                threshold: { critical: 100, warning: 500 }
              },
              {
                name: 'Revenue Today',
                query: 'SELECT SUM(amount) FROM orders WHERE DATE(created_at) = CURDATE()',
                format: 'currency',
                currency: 'USD'
              }
            ]
          },
          {
            id: 'interactive-chart',
            type: 'combo-chart',
            title: 'Sales & Conversion Trends',
            position: { x: 0, y: 2, width: 8, height: 4 },
            config: {
              charts: [
                { type: 'bar', yAxis: 'left', data: 'sales', color: '#3b82f6' },
                { type: 'line', yAxis: 'right', data: 'conversion', color: '#ef4444' }
              ],
              interaction: {
                zoom: true,
                pan: true,
                brush: true,
                tooltip: {
                  enabled: true,
                  format: 'detailed'
                }
              }
            }
          },
          {
            id: 'geo-map',
            type: 'map',
            title: 'Geographic Distribution',
            position: { x: 8, y: 2, width: 4, height: 4 },
            config: {
              mapType: 'world',
              dataLayer: 'choropleth',
              colorScale: 'blue',
              interaction: {
                clickable: true,
                hoverable: true,
                drillDown: {
                  enabled: true,
                  levels: ['country', 'state', 'city']
                }
              }
            }
          }
        ],
        dataSources: [
          {
            id: 'sales-stream',
            type: 'stream',
            connection: 'kafka-cluster',
            topic: 'sales-events',
            schema: {
              timestamp: 'datetime',
              amount: 'decimal',
              location: 'string'
            }
          },
          {
            id: 'user-analytics',
            type: 'api',
            endpoint: 'https://analytics.example.com/api/users',
            authentication: {
              type: 'bearer',
              token: '${ANALYTICS_TOKEN}'
            },
            refresh: 60000
          }
        ],
        alerts: [
          {
            name: 'Low Active Users',
            condition: 'active_users < 100',
            severity: 'critical',
            notifications: ['email', 'slack']
          }
        ],
        permissions: {
          public: false,
          roles: {
            'admin': ['view', 'edit', 'share', 'export'],
            'analyst': ['view', 'export'],
            'viewer': ['view']
          }
        }
      }

      const result = await visualizationsAPI.createVisualization(appId, visualization)

      expect(result).toEqual(createResult)
    })

    it('should handle minimal visualization creation', async () => {
      const createResult = { id: 'simple-viz-101', status: 'active' }
      mockSuccessAPIRequest(createResult)

      const visualization = {
        name: 'Simple Table',
        type: 'table',
        dataSource: 'users'
      }

      const result = await visualizationsAPI.createVisualization(appId, visualization)

      expect(result).toEqual(createResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Visualization configuration is invalid', 400)

      const visualization = { name: 'Invalid Viz' } // Missing required fields
      const error = await visualizationsAPI.createVisualization(appId, visualization).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Visualization configuration is invalid' },
        message: 'Visualization configuration is invalid',
        status: 400
      })
    })

    it('fails when server responds with visualization name exists error', async () => {
      mockFailedAPIRequest('Visualization with this name already exists', 409)

      const visualization = { name: 'Existing Dashboard', type: 'dashboard' }
      const error = await visualizationsAPI.createVisualization(appId, visualization).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Visualization with this name already exists' },
        message: 'Visualization with this name already exists',
        status: 409
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('Visualization quota exceeded', 429)

      const visualization = { name: 'New Dashboard', type: 'dashboard' }
      const error = await visualizationsAPI.createVisualization(appId, visualization).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Visualization quota exceeded' },
        message: 'Visualization quota exceeded',
        status: 429
      })
    })
  })

  describe('updateVisualization', () => {
    it('should make PUT request to update visualization', async () => {
      const updateResult = {
        id: 'viz-123',
        name: 'Updated Sales Dashboard',
        message: 'Visualization updated successfully',
        updatedAt: '2024-01-15T12:00:00Z',
        version: '1.2'
      }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-123'
      const visualization = {
        name: 'Updated Sales Dashboard',
        description: 'Enhanced sales analytics with new metrics',
        configuration: {
          theme: 'professional',
          refreshInterval: 180000
        },
        components: [
          {
            id: 'sales-chart',
            type: 'line-chart',
            title: 'Monthly Sales Trend',
            config: {
              showTrendline: true,
              aggregation: 'monthly'
            }
          },
          {
            id: 'new-metric',
            type: 'metric',
            title: 'Average Order Value',
            config: {
              format: 'currency',
              currency: 'USD'
            }
          }
        ]
      }

      const result = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations/${visualizationId}`,
        body: JSON.stringify(visualization),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial visualization updates', async () => {
      const updateResult = { success: true, updated: ['name', 'description'] }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-456'
      const visualization = {
        name: 'Renamed Dashboard',
        description: 'Updated description'
      }

      const result = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization)

      expect(result).toEqual(updateResult)
    })

    it('should handle configuration updates', async () => {
      const updateResult = {
        id: 'viz-789',
        message: 'Configuration updated successfully',
        changes: ['theme', 'refreshInterval', 'components']
      }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-789'
      const visualization = {
        configuration: {
          theme: 'dark',
          refreshInterval: 60000,
          autoRefresh: true
        },
        components: [
          {
            id: 'chart-1',
            config: {
              color: '#dc2626',
              showLegend: false
            }
          }
        ]
      }

      const result = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization)

      expect(result).toEqual(updateResult)
    })

    it('should handle status updates', async () => {
      const updateResult = {
        id: 'viz-status-101',
        status: 'inactive',
        message: 'Visualization status updated'
      }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-status-101'
      const visualization = {
        status: 'inactive',
        reason: 'Temporarily disabled for maintenance'
      }

      const result = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization)

      expect(result).toEqual(updateResult)
    })

    it('fails when server responds with visualization not found error', async () => {
      mockFailedAPIRequest('Visualization not found', 404)

      const visualizationId = 'nonexistent-viz'
      const visualization = { name: 'Updated Name' }
      const error = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Visualization not found' },
        message: 'Visualization not found',
        status: 404
      })
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Visualization update validation failed', 422)

      const visualizationId = 'viz-123'
      const visualization = { configuration: { invalidField: 'value' } }
      const error = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Visualization update validation failed' },
        message: 'Visualization update validation failed',
        status: 422
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to update visualization', 403)

      const visualizationId = 'protected-viz'
      const visualization = { name: 'Unauthorized Update' }
      const error = await visualizationsAPI.updateVisualization(appId, visualizationId, visualization).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to update visualization' },
        message: 'Insufficient permissions to update visualization',
        status: 403
      })
    })
  })

  describe('deleteVisualizations', () => {
    it('should make DELETE request to delete visualizations', async () => {
      const deleteResult = {
        success: true,
        deletedCount: 2,
        deletedIds: ['viz-123', 'viz-456'],
        message: 'Visualizations deleted successfully'
      }
      mockSuccessAPIRequest(deleteResult)

      const visualizationIds = ['viz-123', 'viz-456']
      const result = await visualizationsAPI.deleteVisualizations(appId, visualizationIds)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations?visualizationIds=viz-123&visualizationIds=viz-456`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle single visualization deletion', async () => {
      const deleteResult = {
        success: true,
        deletedCount: 1,
        deletedIds: ['viz-789'],
        message: 'Visualization deleted successfully'
      }
      mockSuccessAPIRequest(deleteResult)

      const visualizationIds = ['viz-789']
      const result = await visualizationsAPI.deleteVisualizations(appId, visualizationIds)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations?visualizationIds=viz-789`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle deletion with cleanup details', async () => {
      const deleteResult = {
        success: true,
        deletedCount: 3,
        deletedIds: ['viz-1', 'viz-2', 'viz-3'],
        cleanup: {
          resourcesRemoved: 15,
          cacheCleared: true,
          dependenciesUpdated: 2,
          storageFreed: '12.5MB'
        },
        warnings: [
          'Dashboard "Sales Report" was used in 3 external reports',
          'Chart "Revenue Trend" had scheduled exports that were cancelled'
        ],
        affectedResources: [
          { type: 'report', id: 'rep-123', action: 'updated' },
          { type: 'export', id: 'exp-456', action: 'cancelled' }
        ]
      }
      mockSuccessAPIRequest(deleteResult)

      const visualizationIds = ['viz-1', 'viz-2', 'viz-3']
      const result = await visualizationsAPI.deleteVisualizations(appId, visualizationIds)

      expect(result).toEqual(deleteResult)
    })

    it('should handle partial deletion with errors', async () => {
      const deleteResult = {
        success: false,
        deletedCount: 1,
        deletedIds: ['viz-123'],
        failed: [
          { id: 'viz-456', error: 'Visualization is currently in use' },
          { id: 'viz-789', error: 'Insufficient permissions' }
        ],
        message: 'Partial deletion completed with errors'
      }
      mockSuccessAPIRequest(deleteResult)

      const visualizationIds = ['viz-123', 'viz-456', 'viz-789']
      const result = await visualizationsAPI.deleteVisualizations(appId, visualizationIds)

      expect(result).toEqual(deleteResult)
    })

    it('fails when server responds with no visualizations found error', async () => {
      mockFailedAPIRequest('No visualizations found with provided IDs', 404)

      const visualizationIds = ['nonexistent-viz-1', 'nonexistent-viz-2']
      const error = await visualizationsAPI.deleteVisualizations(appId, visualizationIds).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'No visualizations found with provided IDs' },
        message: 'No visualizations found with provided IDs',
        status: 404
      })
    })

    it('fails when server responds with deletion not allowed error', async () => {
      mockFailedAPIRequest('Cannot delete visualizations currently in use', 409)

      const visualizationIds = ['active-viz-1', 'active-viz-2']
      const error = await visualizationsAPI.deleteVisualizations(appId, visualizationIds).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete visualizations currently in use' },
        message: 'Cannot delete visualizations currently in use',
        status: 409
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to delete visualizations', 403)

      const visualizationIds = ['protected-viz-1']
      const error = await visualizationsAPI.deleteVisualizations(appId, visualizationIds).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to delete visualizations' },
        message: 'Insufficient permissions to delete visualizations',
        status: 403
      })
    })
  })

  describe('updateVisualizationResources', () => {
    it('should make PUT request to update visualization resources', async () => {
      const updateResult = {
        success: true,
        visualizationId: 'viz-123',
        resourcesUpdated: [
          'data-cache',
          'computed-metrics',
          'chart-thumbnails'
        ],
        message: 'Visualization resources updated successfully',
        updatedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-123'
      const result = await visualizationsAPI.updateVisualizationResources(appId, visualizationId)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations/${visualizationId}/resources`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle resource update with detailed information', async () => {
      const updateResult = {
        success: true,
        visualizationId: 'viz-456',
        updates: {
          dataCache: {
            status: 'refreshed',
            size: '2.3MB',
            records: 15420,
            lastUpdated: '2024-01-15T12:00:00Z'
          },
          computedMetrics: {
            status: 'recalculated',
            metricsCount: 8,
            calculationTime: '1.2s'
          },
          thumbnails: {
            status: 'regenerated',
            formats: ['png', 'svg'],
            sizes: ['small', 'medium', 'large']
          }
        },
        performance: {
          updateDuration: '3.4s',
          cacheHitImprovement: '+15%',
          loadTimeReduction: '-250ms'
        },
        nextScheduledUpdate: '2024-01-16T12:00:00Z'
      }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-456'
      const result = await visualizationsAPI.updateVisualizationResources(appId, visualizationId)

      expect(result).toEqual(updateResult)
    })

    it('should handle resource update with warnings', async () => {
      const updateResult = {
        success: true,
        visualizationId: 'viz-789',
        resourcesUpdated: ['data-cache'],
        warnings: [
          'Some data sources were unavailable during update',
          'Thumbnail generation failed for 2 components',
          'Cache size exceeds recommended limits'
        ],
        issues: [
          {
            type: 'data-source',
            severity: 'warning',
            message: 'External API rate limit reached',
            affectedComponents: ['external-chart-1']
          },
          {
            type: 'storage',
            severity: 'info',
            message: 'Cache optimization recommended',
            recommendation: 'Consider data archiving for older entries'
          }
        ],
        partialUpdate: true
      }
      mockSuccessAPIRequest(updateResult)

      const visualizationId = 'viz-789'
      const result = await visualizationsAPI.updateVisualizationResources(appId, visualizationId)

      expect(result).toEqual(updateResult)
    })

    it('fails when server responds with visualization not found error', async () => {
      mockFailedAPIRequest('Visualization not found for resource update', 404)

      const visualizationId = 'nonexistent-viz'
      const error = await visualizationsAPI.updateVisualizationResources(appId, visualizationId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Visualization not found for resource update' },
        message: 'Visualization not found for resource update',
        status: 404
      })
    })

    it('fails when server responds with resource update conflict error', async () => {
      mockFailedAPIRequest('Resource update already in progress', 409)

      const visualizationId = 'viz-updating'
      const error = await visualizationsAPI.updateVisualizationResources(appId, visualizationId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Resource update already in progress' },
        message: 'Resource update already in progress',
        status: 409
      })
    })

    it('fails when server responds with data source unavailable error', async () => {
      mockFailedAPIRequest('Required data sources are currently unavailable', 503)

      const visualizationId = 'viz-external-data'
      const error = await visualizationsAPI.updateVisualizationResources(appId, visualizationId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Required data sources are currently unavailable' },
        message: 'Required data sources are currently unavailable',
        status: 503
      })
    })
  })

  describe('loadPublishedUIBuilderContainers', () => {
    it('should make GET request to load published UI Builder containers', async () => {
      const containersResult = {
        containers: [
          {
            id: 'container-123',
            name: 'Sales Dashboard Container',
            description: 'Published container for sales analytics dashboard',
            type: 'dashboard',
            status: 'published',
            version: '1.2',
            publishedAt: '2024-01-10T09:00:00Z',
            publishedBy: 'admin@example.com'
          },
          {
            id: 'container-456',
            name: 'User Metrics Widget',
            description: 'Reusable widget for user activity metrics',
            type: 'widget',
            status: 'published',
            version: '2.0',
            publishedAt: '2024-01-12T14:30:00Z',
            publishedBy: 'developer@example.com'
          }
        ],
        totalCount: 2,
        categories: ['dashboard', 'widget', 'chart', 'table']
      }
      mockSuccessAPIRequest(containersResult)

      const result = await visualizationsAPI.loadPublishedUIBuilderContainers(appId)

      expect(result).toEqual(containersResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/visualizations/ui-builder/containers/published`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty containers list', async () => {
      const containersResult = {
        containers: [],
        totalCount: 0,
        message: 'No published UI Builder containers found'
      }
      mockSuccessAPIRequest(containersResult)

      const result = await visualizationsAPI.loadPublishedUIBuilderContainers(appId)

      expect(result).toEqual(containersResult)
    })

    it('should handle comprehensive container information', async () => {
      const containersResult = {
        containers: [
          {
            id: 'container-advanced-789',
            name: 'Advanced Analytics Suite',
            description: 'Comprehensive analytics container with multiple visualization types',
            type: 'suite',
            status: 'published',
            version: '3.1',
            category: 'business-intelligence',
            tags: ['analytics', 'bi', 'dashboard', 'real-time'],
            configuration: {
              responsive: true,
              theme: 'corporate',
              layout: 'flexible',
              components: 12,
              dataSources: 5
            },
            components: [
              {
                id: 'revenue-chart',
                type: 'line-chart',
                title: 'Revenue Trends',
                config: { realTime: true, aggregation: 'daily' }
              },
              {
                id: 'kpi-grid',
                type: 'metrics-grid',
                title: 'Key Performance Indicators',
                config: { layout: 'grid', columns: 4 }
              },
              {
                id: 'geo-map',
                type: 'geographic-map',
                title: 'Sales by Region',
                config: { mapType: 'world', dataLayer: 'choropleth' }
              }
            ],
            dependencies: [
              { name: 'chart.js', version: '^3.9.1' },
              { name: 'lodash', version: '^4.17.21' },
              { name: 'd3', version: '^7.6.1' }
            ],
            compatibility: {
              frameworks: ['React', 'Vue', 'Angular'],
              browsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+'],
              responsive: true,
              accessibility: 'WCAG 2.1 AA'
            },
            usage: {
              downloads: 247,
              implementations: 23,
              rating: 4.7,
              reviews: 15
            },
            author: {
              name: 'Analytics Team',
              email: 'analytics@example.com',
              organization: 'Example Corp'
            },
            license: 'MIT',
            documentation: {
              readme: 'https://docs.example.com/containers/advanced-analytics',
              examples: 'https://examples.example.com/analytics-suite',
              api: 'https://api-docs.example.com/analytics-container'
            },
            publishedAt: '2024-01-08T10:00:00Z',
            updatedAt: '2024-01-14T16:30:00Z',
            publishedBy: 'analytics-team@example.com',
            changelog: [
              {
                version: '3.1',
                date: '2024-01-14',
                changes: ['Added real-time data support', 'Improved mobile responsiveness']
              },
              {
                version: '3.0',
                date: '2024-01-01',
                changes: ['Major redesign', 'Added geographic mapping', 'Performance improvements']
              }
            ]
          }
        ],
        metadata: {
          totalContainers: 1,
          featuredContainers: 1,
          newestVersion: '3.1',
          lastPublished: '2024-01-14T16:30:00Z'
        },
        filters: {
          availableTypes: ['dashboard', 'widget', 'chart', 'table', 'suite'],
          availableCategories: ['business-intelligence', 'marketing', 'sales', 'operations'],
          availableTags: ['analytics', 'real-time', 'interactive', 'responsive']
        }
      }
      mockSuccessAPIRequest(containersResult)

      const result = await visualizationsAPI.loadPublishedUIBuilderContainers(appId)

      expect(result).toEqual(containersResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized to access UI Builder containers', 401)

      const error = await visualizationsAPI.loadPublishedUIBuilderContainers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized to access UI Builder containers' },
        message: 'Unauthorized to access UI Builder containers',
        status: 401
      })
    })

    it('fails when server responds with feature not available error', async () => {
      mockFailedAPIRequest('UI Builder feature not available for this application', 403)

      const error = await visualizationsAPI.loadPublishedUIBuilderContainers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'UI Builder feature not available for this application' },
        message: 'UI Builder feature not available for this application',
        status: 403
      })
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('UI Builder service temporarily unavailable', 503)

      const error = await visualizationsAPI.loadPublishedUIBuilderContainers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'UI Builder service temporarily unavailable' },
        message: 'UI Builder service temporarily unavailable',
        status: 503
      })
    })
  })
})