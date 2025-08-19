import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.chartBuilder', () => {
  let apiClient
  let chartBuilderAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    chartBuilderAPI = apiClient.chartBuilder
  })

  describe('getCharts', () => {
    it('should make GET request to get charts', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await chartBuilderAPI.getCharts(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await chartBuilderAPI.getCharts(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await chartBuilderAPI.getCharts(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })
  })

  describe('createChart', () => {
    it('should make POST request to create chart', async () => {
      mockSuccessAPIRequest(successResult)

      const chartSource = {
        name: 'sales-chart',
        type: 'bar',
        table: 'sales_data',
        columns: ['month', 'revenue']
      }
      const chartTarget = {
        width: 800,
        height: 400,
        title: 'Monthly Sales Revenue'
      }

      const result = await chartBuilderAPI.createChart(appId, chartSource, chartTarget)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/chart`,
          body: JSON.stringify({ chartSource, chartTarget }),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle simple chart data', async () => {
      mockSuccessAPIRequest(successResult)

      const chartSource = { name: 'simple-chart', type: 'pie' }
      const chartTarget = { width: 400, height: 300 }

      const result = await chartBuilderAPI.createChart(appId, chartSource, chartTarget)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/chart`,
          body: JSON.stringify({ chartSource, chartTarget }),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with bad request error', async () => {
      mockFailedAPIRequest('Invalid chart configuration', 400)

      const chartSource = { name: 'invalid-chart' }
      const chartTarget = {}
      const error = await chartBuilderAPI.createChart(appId, chartSource, chartTarget).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid chart configuration' },
        message: 'Invalid chart configuration',
        status: 400
      })
    })
  })

  describe('updateChart', () => {
    it('should make PUT request to update chart', async () => {
      mockSuccessAPIRequest(successResult)

      const chartSource = {
        name: 'updated-chart',
        type: 'line',
        table: 'metrics',
        columns: ['date', 'value']
      }
      const chartTarget = {
        width: 900,
        height: 500,
        title: 'Updated Chart Title'
      }

      const result = await chartBuilderAPI.updateChart(appId, chartSource, chartTarget)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/chart/${chartSource.name}`,
          body: JSON.stringify({ chartSource, chartTarget }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle chart update with minimal data', async () => {
      mockSuccessAPIRequest(successResult)

      const chartSource = { name: 'minimal-chart' }
      const chartTarget = { title: 'Minimal Chart' }

      const result = await chartBuilderAPI.updateChart(appId, chartSource, chartTarget)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/chart/${chartSource.name}`,
          body: JSON.stringify({ chartSource, chartTarget }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('Chart not found', 404)

      const chartSource = { name: 'nonexistent-chart' }
      const chartTarget = {}
      const error = await chartBuilderAPI.updateChart(appId, chartSource, chartTarget).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Chart not found' },
        message: 'Chart not found',
        status: 404
      })
    })
  })

  describe('deleteChart', () => {
    it('should make DELETE request to delete chart', async () => {
      mockSuccessAPIRequest(successResult)

      const chartName = 'chart-to-delete'
      const result = await chartBuilderAPI.deleteChart(appId, chartName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/chart/${chartName}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle chart name with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const chartName = 'chart with spaces & symbols'
      const result = await chartBuilderAPI.deleteChart(appId, chartName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/chart-builder/chart/chart%20with%20spaces%20&%20symbols',
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with forbidden error', async () => {
      mockFailedAPIRequest('Access denied', 403)

      const chartName = 'protected-chart'
      const error = await chartBuilderAPI.deleteChart(appId, chartName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied' },
        message: 'Access denied',
        status: 403
      })
    })
  })

  describe('renameChart', () => {
    it('should make PUT request to rename chart', async () => {
      mockSuccessAPIRequest(successResult)

      const oldChartName = 'old-chart-name'
      const newChartName = 'new-chart-name'

      const result = await chartBuilderAPI.renameChart(appId, oldChartName, newChartName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/rename-chart`,
          body: JSON.stringify({ oldChartName, newChartName }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle chart names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const oldChartName = 'chart-with-symbols@123'
      const newChartName = 'renamed_chart_456'

      const result = await chartBuilderAPI.renameChart(appId, oldChartName, newChartName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/rename-chart`,
          body: JSON.stringify({ oldChartName, newChartName }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty chart names', async () => {
      mockSuccessAPIRequest(successResult)

      const oldChartName = ''
      const newChartName = 'new-chart'

      const result = await chartBuilderAPI.renameChart(appId, oldChartName, newChartName)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/chart-builder/rename-chart`,
          body: JSON.stringify({ oldChartName, newChartName }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with conflict error', async () => {
      mockFailedAPIRequest('Chart name already exists', 409)

      const oldChartName = 'chart1'
      const newChartName = 'existing-chart'
      const error = await chartBuilderAPI.renameChart(appId, oldChartName, newChartName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Chart name already exists' },
        message: 'Chart name already exists',
        status: 409
      })
    })
  })
})