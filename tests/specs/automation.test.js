describe('apiClient.automation', () => {
  let apiClient
  let automationAPI

  const appId = 'test-app-id'
  const flowId = 'flow-123'
  const versionId = 'version-456'
  const executionId = 'exec-789'
  const elementId = 'element-101'
  const errorHandlerId = 'error-handler-202'
  const sessionId = 'session-303'
  const assistantId = 'assistant-404'
  const productId = 'product-505'
  const subFlowId = 'subflow-606'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    automationAPI = apiClient.automation
  })

  describe('getFlows', () => {
    it('should make GET request to get flows', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getFlows(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowsElements', () => {
    it('should make GET request with query params to get flow elements', async () => {
      mockSuccessAPIRequest(successResult)

      const elementType = 'trigger'
      const elementSubtype = 'timer'
      const result = await automationAPI.getFlowsElements(appId, elementType, elementSubtype)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flows/versions/elements?elementType=${elementType}&elementSubtype=${elementSubtype}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowsWithElements', () => {
    it('should make GET request to get flows with elements', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getFlowsWithElements(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/with-elements`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowsWithElementsDetails', () => {
    it('should make GET request to get flows with elements details', async () => {
      mockSuccessAPIRequest(successResult)

      const status = ['active', 'paused']
      const result = await automationAPI.getFlowsWithElementsDetails(appId, status)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/with-elements-details?status=active&status=paused`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlow', () => {
    it('should make GET request to get specific flow', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getFlow(appId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('createFlow', () => {
    it('should make POST request to create flow', async () => {
      mockSuccessAPIRequest(successResult)

      const flow = { name: 'New Flow', description: 'Test flow', elements: [] }
      const result = await automationAPI.createFlow(appId, flow)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version`,
          body: JSON.stringify(flow),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateFlow', () => {
    it('should make PUT request to update flow', async () => {
      mockSuccessAPIRequest(successResult)

      const flow = { id: versionId, name: 'Updated Flow', description: 'Updated' }
      const result = await automationAPI.updateFlow(appId, flow)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}`,
          body: JSON.stringify(flow),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteFlow', () => {
    it('should make DELETE request to delete flow', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.deleteFlow(appId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('enableFlow', () => {
    it('should make POST request to enable flow', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.enableFlow(appId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/enable`,
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('pauseFlow', () => {
    it('should make POST request to pause flow', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.pauseFlow(appId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/pause`,
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('terminateFlow', () => {
    it('should make POST request to terminate flow', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.terminateFlow(appId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/terminate`,
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('createNewVersion', () => {
    it('should make POST request to create new version', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.createNewVersion(appId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/new-version`,
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('editFlowsGroupName', () => {
    it('should make PUT request to edit flows group name', async () => {
      mockSuccessAPIRequest(successResult)

      const name = 'New Group Name'
      const result = await automationAPI.editFlowsGroupName(appId, flowId, name)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/name`,
          body: JSON.stringify({ name }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteFlowsGroup', () => {
    it('should make DELETE request to delete flows group', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.deleteFlowsGroup(appId, flowId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowVersionMetrics', () => {
    it('should make GET request with date query params', async () => {
      mockSuccessAPIRequest(successResult)

      const fromDate = '2024-01-01'
      const toDate = '2024-01-31'
      const result = await automationAPI.getFlowVersionMetrics(appId, flowId, versionId, fromDate, toDate)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/version-metrics?fromDate=${fromDate}&toDate=${toDate}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowStepsMetrics', () => {
    it('should make GET request to get flow steps metrics', async () => {
      mockSuccessAPIRequest(successResult)

      const fromDate = '2024-01-01'
      const toDate = '2024-01-31'
      const result = await automationAPI.getFlowStepsMetrics(appId, flowId, versionId, fromDate, toDate)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/step-metrics?fromDate=${fromDate}&toDate=${toDate}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowInstances', () => {
    it('should make POST request to get flow instances', async () => {
      mockSuccessAPIRequest(successResult)

      const body = { status: 'completed', limit: 100 }
      const result = await automationAPI.getFlowInstances(appId, flowId, versionId, body)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/instances/find`,
          body: JSON.stringify(body),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('countFlowInstances', () => {
    it('should make POST request to count flow instances', async () => {
      mockSuccessAPIRequest(successResult)

      const body = { status: 'failed' }
      const result = await automationAPI.countFlowInstances(appId, flowId, versionId, body)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/instances/count`,
          body: JSON.stringify(body),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getFlowInstanceAnalytics', () => {
    it('should make GET request to get flow instance analytics', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getFlowInstanceAnalytics(appId, flowId, versionId, executionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/instances/${executionId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('cleanFlowVersionAnalytics', () => {
    it('should make DELETE request to clean flow version analytics', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.cleanFlowVersionAnalytics(appId, flowId, versionId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getElementExecutionInfo', () => {
    it('should make GET request to get element execution info', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getElementExecutionInfo(appId, flowId, versionId, executionId, elementId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/instances/${executionId}/element/${elementId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('loadErrorHandlerAnalytics', () => {
    it('should make GET request with date query params', async () => {
      mockSuccessAPIRequest(successResult)

      const fromDate = '2024-01-01'
      const toDate = '2024-01-31'
      const result = await automationAPI.loadErrorHandlerAnalytics(appId, flowId, versionId, errorHandlerId, fromDate, toDate)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/analytics/error-handler/${errorHandlerId}/recorded-errors?fromDate=${fromDate}&toDate=${toDate}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getCustomElements', () => {
    it('should make GET request to get custom elements', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getCustomElements(appId)

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/api/node-server/manage/app/${appId}/flowrunner/custom-elements`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getAiAgentsProviders', () => {
    it('should make GET request to get AI agents providers', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await automationAPI.getAiAgentsProviders()

      expect(result).toEqual(successResult)
      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/api/node-server/manage/flowrunner/ai-agents/providers',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('Debug Session Methods', () => {
    describe('startDebugSession', () => {
      it('should make POST request to start debug session', async () => {
        mockSuccessAPIRequest(successResult)

        const forceStart = true
        const result = await automationAPI.startDebugSession(appId, flowId, versionId, forceStart)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/test-monitor/start-session?forceStart=${forceStart}`,
            body: undefined,
            method: 'POST',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('stopDebugSession', () => {
      it('should make DELETE request to stop debug session', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.stopDebugSession(appId, flowId, versionId, sessionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/test-monitor/stop-session?sessionId=${sessionId}`,
            body: undefined,
            method: 'DELETE',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('loadTestMonitorHistory', () => {
      it('should make GET request to load test monitor history', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.loadTestMonitorHistory(appId, flowId, versionId, sessionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/test-monitor/history?sessionId=${sessionId}`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('clearTestMonitorHistory', () => {
      it('should make DELETE request to clear test monitor history', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.clearTestMonitorHistory(appId, flowId, versionId, sessionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/test-monitor/history?sessionId=${sessionId}`,
            body: undefined,
            method: 'DELETE',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('loadDebugExecutionContext', () => {
      it('should make GET request to load debug execution context', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.loadDebugExecutionContext(appId, flowId, versionId, sessionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/test-monitor/execution-context?sessionId=${sessionId}`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateDebugExecutionContext', () => {
      it('should make PUT request to update debug execution context', async () => {
        mockSuccessAPIRequest(successResult)

        const context = { variables: { testVar: 'testValue' } }
        const result = await automationAPI.updateDebugExecutionContext(appId, flowId, versionId, context, sessionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/test-monitor/execution-context?sessionId=${sessionId}`,
            body: JSON.stringify(context),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('runElementInDebugMode', () => {
      it('should make POST request to run element in debug mode', async () => {
        mockSuccessAPIRequest(successResult)

        const body = { input: { value: 'test' }, context: {} }
        const result = await automationAPI.runElementInDebugMode(appId, flowId, versionId, elementId, body, sessionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/run/element/${elementId}?sessionId=${sessionId}`,
            body: JSON.stringify(body),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('SLA Methods', () => {
    describe('getFlowSLAGoals', () => {
      it('should make GET request to get flow SLA goals', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getFlowSLAGoals(appId, flowId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/sla/goals`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('createFlowSLAGoal', () => {
      it('should make POST request to create flow SLA goal', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { name: 'Response Time', target: 5000, unit: 'ms' }
        const result = await automationAPI.createFlowSLAGoal(appId, flowId, versionId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/sla/goals`,
            body: JSON.stringify(data),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateFlowSLAGoal', () => {
      it('should make PUT request to update flow SLA goal', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { name: 'Updated Response Time', target: 3000, unit: 'ms' }
        const id = 'sla-goal-123'
        const result = await automationAPI.updateFlowSLAGoal(appId, flowId, versionId, data, id)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/sla/goals/${id}`,
            body: JSON.stringify(data),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('deleteFlowSLAGoal', () => {
      it('should make DELETE request to delete flow SLA goal', async () => {
        mockSuccessAPIRequest(successResult)

        const id = 'sla-goal-123'
        const result = await automationAPI.deleteFlowSLAGoal(appId, flowId, versionId, id)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/sla/goals/${id}`,
            body: undefined,
            method: 'DELETE',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getSLACalendars', () => {
      it('should make GET request to get SLA calendars', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getSLACalendars(appId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/sla/calendar`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('createSLACalendar', () => {
      it('should make POST request to create SLA calendar', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { name: 'Business Hours', timezone: 'America/New_York' }
        const result = await automationAPI.createSLACalendar(appId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/sla/calendar`,
            body: JSON.stringify(data),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateSLACalendar', () => {
      it('should make PUT request to update SLA calendar', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { name: 'Updated Business Hours', timezone: 'Europe/London' }
        const id = 'calendar-123'
        const result = await automationAPI.updateSLACalendar(appId, data, id)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/sla/calendar/${id}`,
            body: JSON.stringify(data),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('deleteSLACalendar', () => {
      it('should make DELETE request to delete SLA calendar', async () => {
        mockSuccessAPIRequest(successResult)

        const id = 'calendar-123'
        const result = await automationAPI.deleteSLACalendar(appId, id)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/sla/calendar/${id}`,
            body: undefined,
            method: 'DELETE',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('AI Assistant Methods', () => {
    describe('getAllowedAIModels', () => {
      it('should make GET request to get allowed AI models', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getAllowedAIModels(appId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/ai/assistants/allowed-models`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('registerAIAssistant', () => {
      it('should make POST request to register AI assistant', async () => {
        mockSuccessAPIRequest(successResult)

        const openAiAssistantId = 'asst_abc123'
        const result = await automationAPI.registerAIAssistant(appId, openAiAssistantId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/ai/assistants/register`,
            body: JSON.stringify({ openAiAssistantId }),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('createAIAssistant', () => {
      it('should make POST request to create AI assistant', async () => {
        mockSuccessAPIRequest(successResult)

        const assistant = { name: 'Test Assistant', model: 'gpt-4', instructions: 'Help with automation' }
        const result = await automationAPI.createAIAssistant(appId, assistant)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/ai/assistants`,
            body: JSON.stringify(assistant),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateAIAssistant', () => {
      it('should make PUT request to update AI assistant', async () => {
        mockSuccessAPIRequest(successResult)

        const assistant = { id: assistantId, name: 'Updated Assistant', model: 'gpt-4', instructions: 'Updated instructions' }
        const result = await automationAPI.updateAIAssistant(appId, assistant)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/ai/assistants/${assistantId}`,
            body: JSON.stringify(assistant),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('deleteAIAssistant', () => {
      it('should make DELETE request to delete AI assistant', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.deleteAIAssistant(appId, assistantId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/ai/assistants/${assistantId}`,
            body: undefined,
            method: 'DELETE',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getAIAssistants', () => {
      it('should make GET request to get AI assistants', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getAIAssistants(appId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/ai/assistants`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('Flow Logs Methods', () => {
    describe('loadFlowLogs', () => {
      it('should make POST request to load flow logs', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { filters: { level: 'ERROR' }, pagination: { limit: 100 } }
        const result = await automationAPI.loadFlowLogs(appId, versionId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/logs/find`,
            body: JSON.stringify(data),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getFlowLogsLevel', () => {
      it('should make GET request to get flow logs level', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getFlowLogsLevel(appId, flowId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/${flowId}/logging/level`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateFlowLogsLevel', () => {
      it('should make PUT request to update flow logs level', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { level: 'DEBUG' }
        const result = await automationAPI.updateFlowLogsLevel(appId, flowId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/${flowId}/logging/level`,
            body: JSON.stringify(data),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('Flow Import/Export Methods', () => {
    describe('exportFlowVersion', () => {
      it('should make GET request to export flow version', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.exportFlowVersion(appId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/export`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('importFlowVersion', () => {
      it('should make POST request to import flow version', async () => {
        mockSuccessAPIRequest(successResult)

        const flow = { name: 'Imported Flow', elements: [] }
        const result = await automationAPI.importFlowVersion(appId, versionId, flow)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${versionId}/import`,
            body: JSON.stringify(flow),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('createFlowFromJSON', () => {
      it('should make POST request to create flow from JSON', async () => {
        mockSuccessAPIRequest(successResult)

        const flow = { name: 'New Flow from JSON', version: '1.0' }
        const result = await automationAPI.createFlowFromJSON(appId, flow)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/import`,
            body: JSON.stringify(flow),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('Learning Mode Methods', () => {
    describe('startLearningMode', () => {
      it('should make POST request to start learning mode', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.startLearningMode(appId, flowId, versionId, elementId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/element/${elementId}/learning/start`,
            body: undefined,
            method: 'POST',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('stopLearningMode', () => {
      it('should make POST request to stop learning mode', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.stopLearningMode(appId, flowId, versionId, elementId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/element/${elementId}/learning/stop`,
            body: undefined,
            method: 'POST',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getElementsResults', () => {
      it('should make GET request to get elements results', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getElementsResults(appId, flowId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/element/results`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getElementsLearningResults', () => {
      it('should make GET request to get elements learning results', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getElementsLearningResults(appId, flowId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/element/learning/all-results`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getElementLearningResult', () => {
      it('should make GET request to get element learning result', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getElementLearningResult(appId, flowId, versionId, elementId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/${flowId}/version/${versionId}/debug/element/${elementId}/learning/result`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('Marketplace Methods', () => {
    describe('installFlowFromMarketplace', () => {
      it('should make POST request to install flow from marketplace', async () => {
        mockSuccessAPIRequest(successResult)

        const version = '2.0.0'
        const data = { config: { autoStart: true } }
        const result = await automationAPI.installFlowFromMarketplace(appId, productId, version, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/marketplace/install/${productId}?version=${version}`,
            body: JSON.stringify(data),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('uninstallFlowProduct', () => {
      it('should make DELETE request to uninstall flow product', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { removeData: true }
        const result = await automationAPI.uninstallFlowProduct(appId, productId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/marketplace/uninstall/${productId}`,
            body: JSON.stringify(data),
            method: 'DELETE',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('SubFlow Methods', () => {
    describe('createSubFlow', () => {
      it('should make POST request to create subflow', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { name: 'Sub Flow', description: 'A subflow' }
        const result = await automationAPI.createSubFlow(appId, versionId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow`,
            body: JSON.stringify(data),
            method: 'POST',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getSubFlow', () => {
      it('should make GET request to get subflow', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getSubFlow(appId, versionId, subFlowId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow/${subFlowId}`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateSubFlow', () => {
      it('should make PUT request to update subflow', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { name: 'Updated SubFlow' }
        const result = await automationAPI.updateSubFlow(appId, versionId, subFlowId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow/${subFlowId}`,
            body: JSON.stringify(data),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateSubFlowName', () => {
      it('should make PUT request to update subflow name', async () => {
        mockSuccessAPIRequest(successResult)

        const name = 'Updated SubFlow Name'
        const result = await automationAPI.updateSubFlowName(appId, versionId, subFlowId, name)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow/${subFlowId}/name`,
            body: JSON.stringify({ name }),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('deleteSubFlow', () => {
      it('should make DELETE request to delete subflow', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.deleteSubFlow(appId, versionId, subFlowId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow/${subFlowId}`,
            body: undefined,
            method: 'DELETE',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getSubFlows', () => {
      it('should make GET request to get subflows', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getSubFlows(appId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getSubFlowsWithElements', () => {
      it('should make GET request to get subflows with elements', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getSubFlowsWithElements(appId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow/with-elements`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getSubFlowsWithElementsDetails', () => {
      it('should make GET request to get subflows with elements details', async () => {
        mockSuccessAPIRequest(successResult)

        const result = await automationAPI.getSubFlowsWithElementsDetails(appId, versionId)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/version/${versionId}/subflow/with-elements-details`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('Other Features Methods', () => {
    describe('updateFlowSchedule', () => {
      it('should make PUT request to update flow schedule', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { cron: '0 0 * * *', enabled: true }
        const result = await automationAPI.updateFlowSchedule(appId, versionId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/schedule`,
            body: JSON.stringify(data),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('getRealtimeTriggerCallbackUrl', () => {
      it('should make GET request with query parameters', async () => {
        mockSuccessAPIRequest(successResult)

        const scope = 'global'
        const hostType = 'cloud'
        const serviceName = 'webhook'
        const modelName = 'default'
        const lang = 'en'
        const result = await automationAPI.getRealtimeTriggerCallbackUrl(appId, scope, hostType, serviceName, modelName, lang)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/version/trigger/realtime/callback-url?scope=${scope}&hostType=${hostType}&serviceName=${serviceName}&modelName=${modelName}&lang=${lang}`,
            body: undefined,
            method: 'GET',
            encoding: 'utf8',
            headers: {},
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateSharedMemorySettings', () => {
      it('should make PUT request to update shared memory settings', async () => {
        mockSuccessAPIRequest(successResult)

        const data = { maxSize: 1024, ttl: 3600 }
        const result = await automationAPI.updateSharedMemorySettings(appId, versionId, data)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/shared-memory`,
            body: JSON.stringify(data),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })

    describe('updateFlowDescription', () => {
      it('should make PUT request to update flow description', async () => {
        mockSuccessAPIRequest(successResult)

        const description = 'Updated flow description'
        const result = await automationAPI.updateFlowDescription(appId, versionId, description)

        expect(result).toEqual(successResult)
        expect(apiRequestCalls()).toEqual([
          {
            path: `http://test-host:3000/api/app/${appId}/automation/flow/version/${versionId}/description`,
            body: JSON.stringify({ description }),
            method: 'PUT',
            encoding: 'utf8',
            headers: { 'Content-Type': 'application/json' },
            timeout: 0,
            withCredentials: false
          }
        ])
      })
    })
  })

  describe('Error Scenarios', () => {
    describe('Flow Management Errors', () => {
      it('createFlow fails with validation error', async () => {
        mockFailedAPIRequest('Invalid flow structure', 400)

        const flow = { name: '', elements: [] }
        const error = await automationAPI.createFlow(appId, flow).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect({ ...error }).toEqual({
          body: { message: 'Invalid flow structure' },
          message: 'Invalid flow structure',
          status: 400
        })
      })

      it('updateFlow fails with not found error', async () => {
        mockFailedAPIRequest('Flow version not found', 404)

        const flow = { id: 'nonexistent-id', name: 'Test' }
        const error = await automationAPI.updateFlow(appId, flow).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(404)
        expect(error.message).toBe('Flow version not found')
      })

      it('enableFlow fails with unauthorized error', async () => {
        mockFailedAPIRequest('Unauthorized', 401)

        const error = await automationAPI.enableFlow(appId, versionId).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(401)
        expect(error.message).toBe('Unauthorized')
      })
    })

    describe('Analytics Errors', () => {
      it('getFlowInstances fails with server error', async () => {
        mockFailedAPIRequest('Internal server error', 500)

        const body = { filters: {} }
        const error = await automationAPI.getFlowInstances(appId, flowId, versionId, body).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(500)
        expect(error.message).toBe('Internal server error')
      })
    })

    describe('Debug Session Errors', () => {
      it('startDebugSession fails with conflict error', async () => {
        mockFailedAPIRequest('Debug session already active', 409)

        const error = await automationAPI.startDebugSession(appId, flowId, versionId, false).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(409)
        expect(error.message).toBe('Debug session already active')
      })
    })

    describe('SLA Management Errors', () => {
      it('createFlowSLAGoal fails with validation error', async () => {
        mockFailedAPIRequest('Invalid SLA configuration', 400)

        const data = { name: '', threshold: -1 }
        const error = await automationAPI.createFlowSLAGoal(appId, flowId, versionId, data).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(400)
        expect(error.message).toBe('Invalid SLA configuration')
      })
    })

    describe('AI Integration Errors', () => {
      it('registerAIAssistant fails with invalid assistant ID', async () => {
        mockFailedAPIRequest('Invalid OpenAI assistant ID', 400)

        const error = await automationAPI.registerAIAssistant(appId, 'invalid-id').catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(400)
        expect(error.message).toBe('Invalid OpenAI assistant ID')
      })
    })

    describe('SubFlow Management Errors', () => {
      it('createSubFlow fails with permission error', async () => {
        mockFailedAPIRequest('Insufficient permissions', 403)

        const data = { name: 'Test SubFlow' }
        const error = await automationAPI.createSubFlow(appId, versionId, data).catch(e => e)

        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(403)
        expect(error.message).toBe('Insufficient permissions')
      })
    })
  })
})