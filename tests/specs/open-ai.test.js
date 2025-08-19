import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.openAI', () => {
  let apiClient
  let openAiAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    openAiAPI = apiClient.openAI
  })

  describe('createChatCompletion', () => {
    it('should make POST request to create chat completion', async () => {
      const completionResult = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-3.5-turbo',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you today?'
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 12,
          completion_tokens: 9,
          total_tokens: 21
        }
      }
      mockSuccessAPIRequest(completionResult)

      const featureName = 'chat-bot'
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: 'Hello'
        }],
        max_tokens: 150,
        temperature: 0.7
      }

      const result = await openAiAPI.createChatCompletion(appId, featureName, payload)

      expect(result).toEqual(completionResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/open-ai/chat-completion/${featureName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex chat completion with function calling', async () => {
      const completionResult = {
        id: 'chatcmpl-456',
        object: 'chat.completion',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: null,
            function_call: {
              name: 'get_weather',
              arguments: '{"location": "New York, NY"}'
            }
          },
          finish_reason: 'function_call'
        }],
        usage: {
          prompt_tokens: 45,
          completion_tokens: 12,
          total_tokens: 57
        }
      }
      mockSuccessAPIRequest(completionResult)

      const featureName = 'assistant'
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: 'What\'s the weather like in New York?'
        }],
        functions: [{
          name: 'get_weather',
          description: 'Get current weather in a location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state'
              }
            },
            required: ['location']
          }
        }],
        function_call: 'auto'
      }

      const result = await openAiAPI.createChatCompletion(appId, featureName, payload)

      expect(result).toEqual(completionResult)
    })

    it('should handle streaming chat completion', async () => {
      const streamResult = {
        stream: true,
        id: 'chatcmpl-789',
        object: 'chat.completion.chunk'
      }
      mockSuccessAPIRequest(streamResult)

      const featureName = 'stream-chat'
      const payload = {
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: 'Tell me a story'
        }],
        stream: true,
        max_tokens: 500
      }

      const result = await openAiAPI.createChatCompletion(appId, featureName, payload)

      expect(result).toEqual(streamResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/open-ai/chat-completion/${featureName}`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle system message and conversation context', async () => {
      const completionResult = {
        choices: [{
          message: {
            role: 'assistant',
            content: 'I understand. I will act as a helpful coding assistant.'
          }
        }]
      }
      mockSuccessAPIRequest(completionResult)

      const featureName = 'code-assistant'
      const payload = {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful coding assistant specialized in JavaScript and React.'
          },
          {
            role: 'user',
            content: 'How do I create a React component?'
          },
          {
            role: 'assistant',
            content: 'You can create a React component using function syntax...'
          },
          {
            role: 'user',
            content: 'Can you show me an example with hooks?'
          }
        ],
        temperature: 0.3,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }

      const result = await openAiAPI.createChatCompletion(appId, featureName, payload)

      expect(result).toEqual(completionResult)
    })

    it('fails when server responds with invalid API key error', async () => {
      mockFailedAPIRequest('Invalid API key provided', 401)

      const featureName = 'chat'
      const payload = { model: 'gpt-3.5-turbo', messages: [] }
      const error = await openAiAPI.createChatCompletion(appId, featureName, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid API key provided' },
        message: 'Invalid API key provided',
        status: 401
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('Rate limit exceeded', 429)

      const featureName = 'chat'
      const payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'Hello' }] }
      const error = await openAiAPI.createChatCompletion(appId, featureName, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Rate limit exceeded' },
        message: 'Rate limit exceeded',
        status: 429
      })
    })

    it('fails when server responds with model not found error', async () => {
      mockFailedAPIRequest('Model not found', 404)

      const featureName = 'chat'
      const payload = { model: 'invalid-model', messages: [{ role: 'user', content: 'test' }] }
      const error = await openAiAPI.createChatCompletion(appId, featureName, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Model not found' },
        message: 'Model not found',
        status: 404
      })
    })
  })

  describe('getUsageInfo', () => {
    it('should make GET request to get usage info', async () => {
      const usageResult = {
        feature: 'chat-bot',
        usage: {
          totalTokens: 15420,
          totalRequests: 324,
          currentMonthTokens: 2150,
          currentMonthRequests: 45
        },
        limits: {
          monthlyTokenLimit: 50000,
          dailyRequestLimit: 1000
        },
        costs: {
          totalCost: 15.42,
          currentMonthCost: 2.15,
          currency: 'USD'
        },
        lastUpdated: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(usageResult)

      const featureName = 'chat-bot'
      const result = await openAiAPI.getUsageInfo(appId, featureName)

      expect(result).toEqual(usageResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/open-ai/info/${featureName}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle detailed usage breakdown', async () => {
      const usageResult = {
        feature: 'assistant',
        usage: {
          models: {
            'gpt-3.5-turbo': {
              tokens: 8500,
              requests: 150,
              cost: 8.50
            },
            'gpt-4': {
              tokens: 3200,
              requests: 25,
              cost: 19.20
            }
          },
          timeBreakdown: {
            last24Hours: { tokens: 450, requests: 8 },
            last7Days: { tokens: 2100, requests: 35 },
            last30Days: { tokens: 11700, requests: 175 }
          },
          featureBreakdown: {
            chatCompletions: { tokens: 10200, requests: 160 },
            functionCalls: { tokens: 1500, requests: 15 }
          }
        },
        quotas: {
          remaining: {
            monthlyTokens: 38300,
            dailyRequests: 992
          },
          resetDates: {
            monthlyQuota: '2024-02-01T00:00:00Z',
            dailyQuota: '2024-01-16T00:00:00Z'
          }
        }
      }
      mockSuccessAPIRequest(usageResult)

      const featureName = 'assistant'
      const result = await openAiAPI.getUsageInfo(appId, featureName)

      expect(result).toEqual(usageResult)
    })

    it('should handle empty usage for new feature', async () => {
      const usageResult = {
        feature: 'new-feature',
        usage: {
          totalTokens: 0,
          totalRequests: 0,
          currentMonthTokens: 0,
          currentMonthRequests: 0
        },
        limits: {
          monthlyTokenLimit: 50000,
          dailyRequestLimit: 1000
        },
        firstUsed: null,
        isActive: false
      }
      mockSuccessAPIRequest(usageResult)

      const featureName = 'new-feature'
      const result = await openAiAPI.getUsageInfo(appId, featureName)

      expect(result).toEqual(usageResult)
    })

    it('fails when server responds with feature not found error', async () => {
      mockFailedAPIRequest('Feature not found', 404)

      const featureName = 'nonexistent-feature'
      const error = await openAiAPI.getUsageInfo(appId, featureName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Feature not found' },
        message: 'Feature not found',
        status: 404
      })
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to usage information', 403)

      const featureName = 'restricted-feature'
      const error = await openAiAPI.getUsageInfo(appId, featureName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to usage information' },
        message: 'Access denied to usage information',
        status: 403
      })
    })
  })

  describe('generateDashboardDataVisualizations', () => {
    it('should make POST request to generate dashboard data visualizations', async () => {
      const visualizationResult = {
        visualizations: [
          {
            type: 'line-chart',
            title: 'User Growth Over Time',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr'],
              datasets: [{
                label: 'Active Users',
                data: [1200, 1350, 1500, 1680]
              }]
            },
            config: {
              responsive: true,
              plugins: {
                legend: { display: true }
              }
            }
          },
          {
            type: 'bar-chart',
            title: 'Revenue by Product Category',
            data: {
              labels: ['Electronics', 'Clothing', 'Books'],
              datasets: [{
                label: 'Revenue ($)',
                data: [25000, 18000, 12000]
              }]
            }
          }
        ],
        summary: 'Generated 2 visualizations based on user growth and revenue data',
        generatedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(visualizationResult)

      const payload = {
        dataSource: 'analytics',
        metrics: ['user_growth', 'revenue_by_category'],
        timeRange: {
          start: '2024-01-01',
          end: '2024-01-15'
        },
        visualizationTypes: ['line-chart', 'bar-chart'],
        customPrompt: 'Focus on user engagement and revenue trends'
      }

      const result = await openAiAPI.generateDashboardDataVisualizations(appId, payload)

      expect(result).toEqual(visualizationResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/open-ai/dashboards/data-visualizations`,
        body: JSON.stringify(payload),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex visualization with multiple data sources', async () => {
      const visualizationResult = {
        visualizations: [
          {
            type: 'dashboard',
            title: 'Executive Dashboard',
            components: [
              {
                type: 'kpi-card',
                title: 'Total Revenue',
                value: '$125,430',
                change: '+12.5%'
              },
              {
                type: 'donut-chart',
                title: 'Traffic Sources',
                data: {
                  labels: ['Organic', 'Paid', 'Direct', 'Social'],
                  values: [45, 25, 20, 10]
                }
              }
            ]
          }
        ],
        insights: [
          'Revenue has increased by 12.5% compared to last month',
          'Organic traffic remains the primary source of visitors'
        ],
        recommendations: [
          'Consider increasing investment in organic content',
          'Monitor paid campaign performance closely'
        ]
      }
      mockSuccessAPIRequest(visualizationResult)

      const payload = {
        dataSources: ['sales', 'analytics', 'marketing'],
        dashboardType: 'executive',
        includeInsights: true,
        includeRecommendations: true,
        filters: {
          timeRange: 'last_30_days',
          region: 'global'
        }
      }

      const result = await openAiAPI.generateDashboardDataVisualizations(appId, payload)

      expect(result).toEqual(visualizationResult)
    })

    it('should handle minimal visualization request', async () => {
      const visualizationResult = {
        visualizations: [{
          type: 'simple-chart',
          title: 'Basic Data View',
          data: { values: [10, 20, 15, 25] }
        }]
      }
      mockSuccessAPIRequest(visualizationResult)

      const payload = {
        dataSource: 'default'
      }

      const result = await openAiAPI.generateDashboardDataVisualizations(appId, payload)

      expect(result).toEqual(visualizationResult)
    })

    it('fails when server responds with insufficient data error', async () => {
      mockFailedAPIRequest('Insufficient data for visualization generation', 422)

      const payload = { dataSource: 'empty_table' }
      const error = await openAiAPI.generateDashboardDataVisualizations(appId, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient data for visualization generation' },
        message: 'Insufficient data for visualization generation',
        status: 422
      })
    })

    it('fails when server responds with invalid data source error', async () => {
      mockFailedAPIRequest('Invalid data source specified', 400)

      const payload = { dataSource: 'nonexistent_source' }
      const error = await openAiAPI.generateDashboardDataVisualizations(appId, payload).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid data source specified' },
        message: 'Invalid data source specified',
        status: 400
      })
    })
  })

  describe('getDashboardDataVisualizationsPrompt', () => {
    it('should make GET request to get dashboard data visualizations prompt', async () => {
      const promptResult = {
        prompt: 'Generate insightful data visualizations based on the provided metrics and data sources. Focus on creating clear, actionable insights that help users understand their data trends and patterns.',
        availableDataSources: [
          'user_analytics',
          'sales_data',
          'marketing_metrics',
          'performance_data'
        ],
        supportedVisualizationTypes: [
          'line-chart',
          'bar-chart',
          'pie-chart',
          'scatter-plot',
          'heatmap',
          'dashboard'
        ],
        examples: [
          {
            input: { dataSource: 'sales_data', metrics: ['revenue', 'conversion_rate'] },
            output: 'Line chart showing revenue trends with conversion rate overlay'
          }
        ],
        guidelines: [
          'Always include meaningful titles and labels',
          'Use appropriate colors for data representation',
          'Provide context and insights where possible'
        ]
      }
      mockSuccessAPIRequest(promptResult)

      const result = await openAiAPI.getDashboardDataVisualizationsPrompt(appId)

      expect(result).toEqual(promptResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/open-ai/dashboards/data-visualizations`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle simple prompt response', async () => {
      const promptResult = {
        prompt: 'Create data visualizations from your app data.',
        version: '1.0'
      }
      mockSuccessAPIRequest(promptResult)

      const result = await openAiAPI.getDashboardDataVisualizationsPrompt(appId)

      expect(result).toEqual(promptResult)
    })

    it('should handle detailed prompt with configuration options', async () => {
      const promptResult = {
        basePrompt: 'Generate comprehensive data visualizations',
        customizationOptions: {
          style: ['modern', 'classic', 'minimal'],
          colorSchemes: ['blue', 'green', 'purple', 'rainbow'],
          complexity: ['simple', 'intermediate', 'advanced']
        },
        dataSourceSchemas: {
          user_analytics: {
            fields: ['user_id', 'session_duration', 'page_views', 'timestamp'],
            relationships: ['belongs_to_app', 'has_many_events']
          },
          sales_data: {
            fields: ['transaction_id', 'amount', 'product_category', 'date'],
            relationships: ['belongs_to_user', 'has_payment_method']
          }
        },
        aiInstructions: {
          context: 'You are generating visualizations for a Backendless application dashboard',
          constraints: ['Maximum 5 visualizations per request', 'Must be responsive design'],
          preferences: ['Prioritize actionable insights', 'Include trend analysis']
        }
      }
      mockSuccessAPIRequest(promptResult)

      const result = await openAiAPI.getDashboardDataVisualizationsPrompt(appId)

      expect(result).toEqual(promptResult)
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await openAiAPI.getDashboardDataVisualizationsPrompt('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })

    it('fails when server responds with feature not enabled error', async () => {
      mockFailedAPIRequest('OpenAI dashboard features not enabled for this application', 403)

      const error = await openAiAPI.getDashboardDataVisualizationsPrompt(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'OpenAI dashboard features not enabled for this application' },
        message: 'OpenAI dashboard features not enabled for this application',
        status: 403
      })
    })
  })
})