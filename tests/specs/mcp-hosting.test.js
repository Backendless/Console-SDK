describe('apiClient.hostingMcpServices', () => {
  let apiClient
  let mcpHostingAPI

  const appId = 'test-app-id'

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    mcpHostingAPI = apiClient.hostingMcpServices
  })

  describe('getHostingMcpServers', () => {
    it('should make a GET request to retrieve a list of MCP hosting servers', async () => {
      const serversResult = [
        {
          podName: 'test-pod-name',
          deploymentName: 'test-deployment-name',
          namespace: 'test-namespace',
          appId: 'test-app-id',
          mcpServerName: 'test-mcp-server-name',
          envs: [
            {
              name: 'TEST_ENV_VAR_1',
              value: 'test-value-1'
            },
            {
              name: 'TEST_ENV_VAR_2',
              value: 'test-value-2'
            }
          ],
          dockerImage: 'test/docker-image:1.0.0',
          port: 3000
        }
      ]

      mockSuccessAPIRequest(serversResult)

      const result = await mcpHostingAPI.getHostingMcpServers(appId)

      expect(result).toEqual(serversResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle an empty servers list', async () => {
      const emptyResult = []
      mockSuccessAPIRequest(emptyResult)

      const result = await mcpHostingAPI.getHostingMcpServers(appId)

      expect(result).toEqual(emptyResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle multiple MCP hosting servers', async () => {
      const serversResult = [
        {
          podName: 'test-pod-name-1',
          deploymentName: 'test-deployment-1',
          namespace: 'test-namespace',
          appId: 'test-app-id',
          mcpServerName: 'test-mcp-server-1',
          envs: [
            {
              name: 'TEST_VAR',
              value: 'test-value-1'
            }
          ],
          dockerImage: 'test/docker-image:1.0.0',
          port: 3001
        },
        {
          podName: 'test-pod-name-2',
          deploymentName: 'test-deployment-2',
          namespace: 'test-namespace',
          appId: 'test-app-id',
          mcpServerName: 'test-mcp-server-2',
          envs: [
            {
              name: 'TEST_VAR',
              value: 'test-value-2'
            }
          ],
          dockerImage: 'test/docker-image:2.0.0',
          port: 3002
        }
      ]

      mockSuccessAPIRequest(serversResult)

      const result = await mcpHostingAPI.getHostingMcpServers(appId)

      expect(result).toEqual(serversResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with unauthorized error', async () => {
      const errorMessage = 'Unauthorized'
      mockFailedAPIRequest(errorMessage, 401)

      const error = await mcpHostingAPI.getHostingMcpServers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 401
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with app not found error', async () => {
      const errorMessage = 'Application not found'
      mockFailedAPIRequest(errorMessage, 404)

      const error = await mcpHostingAPI.getHostingMcpServers('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/api/node-server/manage/app/nonexistent-app/mcp/hosting',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails on server failure', async () => {
      const errorMessage = 'Internal server error'
      mockFailedAPIRequest(errorMessage, 500)

      const error = await mcpHostingAPI.getHostingMcpServers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getHostingMcpServerStatus', () => {
    it('should retrieve RUNNING status for healthy MCP hosting server', async () => {
      const statusResult = {
        state: 'RUNNING',
        message: 'Deployment is fully running and healthy'
      }

      mockSuccessAPIRequest(statusResult)

      const result = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'test-mcp-server-name')

      expect(result).toEqual(statusResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/test-mcp-server-name/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should retrieve STOPPED status when server is scaled to zero', async () => {
      const statusResult = {
        state: 'STOPPED',
        message: 'Deployment scaled to zero replicas'
      }

      mockSuccessAPIRequest(statusResult)

      const result = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'test-mcp-server-name')

      expect(result).toEqual(statusResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/test-mcp-server-name/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should retrieve FAILED status when replica failure detected', async () => {
      const statusResult = {
        state: 'FAILED',
        message: 'Replica failure detected'
      }

      mockSuccessAPIRequest(statusResult)

      const result = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'test-mcp-server-name')

      expect(result).toEqual(statusResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/test-mcp-server-name/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should retrieve SCALING status during rollout', async () => {
      const statusResult = {
        state: 'SCALING',
        message: 'Scaling in progress: desired=3, updated=2, ready=1'
      }

      mockSuccessAPIRequest(statusResult)

      const result = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'test-mcp-server-name')

      expect(result).toEqual(statusResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/test-mcp-server-name/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should retrieve UNHEALTHY status when deployment is not available', async () => {
      const statusResult = {
        state: 'UNHEALTHY',
        message: 'Deployment is not available'
      }

      mockSuccessAPIRequest(statusResult)

      const result = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'test-mcp-server-name')

      expect(result).toEqual(statusResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/test-mcp-server-name/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should retrieve UNKNOWN status when state cannot be determined', async () => {
      const statusResult = {
        state: 'UNKNOWN',
        message: 'Deployment state cannot be determined'
      }

      mockSuccessAPIRequest(statusResult)

      const result = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'test-mcp-server-name')

      expect(result).toEqual(statusResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/test-mcp-server-name/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server not found', async () => {
      const errorMessage = 'MCP hosting server not found'
      mockFailedAPIRequest(errorMessage, 404)

      const error = await mcpHostingAPI.getHostingMcpServerStatus(appId, 'nonexistent-server').catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/nonexistent-server/status`,
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('createHostingMcpServer', () => {
    it('should make a POST request to create MCP hosting server', async () => {
      const createResult = {
        podName: 'test-pod-name',
        deploymentName: 'test-deployment-name',
        namespace: 'test-namespace',
        appId: 'test-app-id',
        mcpServerName: 'test-mcp-server-name',
        envs: [
          {
            name: 'TEST_API_KEY',
            value: 'test-api-key-value'
          },
          {
            name: 'MCP_STDIO_COMMAND',
            value: 'test-command'
          },
          {
            name: 'MCP_STDIO_ARGS',
            value: 'test-args'
          },
          {
            name: 'MCP_AUTH_TOKEN',
            value: 'test-auth-token'
          }
        ],
        dockerImage: 'test/docker-image:1.0.0',
        port: 3000,
        authToken: 'test-auth-token'
      }

      mockSuccessAPIRequest(createResult)

      const createData = {
        mcpServerName: 'test-mcp-server-name',
        command: 'test-command',
        args: 'test-args',
        imageName: 'test/docker-image',
        imageVersion: '1.0.0',
        envs: [
          {
            name: 'TEST_API_KEY',
            value: 'test-api-key-value'
          }
        ]
      }

      const result = await mcpHostingAPI.createHostingMcpServer(appId, createData)

      expect(result).toEqual(createResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'POST',
        body: JSON.stringify(createData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should create MCP hosting server with multiple environment variables', async () => {
      const createResult = {
        podName: 'test-pod-name-2',
        deploymentName: 'test-deployment-name-2',
        namespace: 'test-namespace',
        appId: 'test-app-id',
        mcpServerName: 'test-mcp-server-name-2',
        envs: [
          {
            name: 'TEST_ENV_VAR_1',
            value: 'test-value-1'
          },
          {
            name: 'TEST_ENV_VAR_2',
            value: 'test-value-2'
          },
          {
            name: 'MCP_STDIO_COMMAND',
            value: 'test-command-2'
          },
          {
            name: 'MCP_STDIO_ARGS',
            value: 'test-args-2'
          },
          {
            name: 'MCP_AUTH_TOKEN',
            value: 'test-auth-token-2'
          }
        ],
        dockerImage: 'test/docker-image:2.0.0',
        port: 3000,
        authToken: 'test-auth-token-2'
      }

      mockSuccessAPIRequest(createResult)

      const createData = {
        mcpServerName: 'test-mcp-server-name-2',
        command: 'test-command-2',
        args: 'test-args-2',
        imageName: 'test/docker-image',
        imageVersion: '2.0.0',
        envs: [
          {
            name: 'TEST_ENV_VAR_1',
            value: 'test-value-1'
          },
          {
            name: 'TEST_ENV_VAR_2',
            value: 'test-value-2'
          }
        ]
      }

      const result = await mcpHostingAPI.createHostingMcpServer(appId, createData)

      expect(result).toEqual(createResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'POST',
        body: JSON.stringify(createData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server name already exists', async () => {
      const errorMessage = 'Hosting MCP server with this name already exists'
      mockFailedAPIRequest(errorMessage, 409)

      const createData = {
        mcpServerName: 'test-mcp-server-name',
        command: 'test-command',
        args: 'test-args',
        imageName: 'test/docker-image',
        imageVersion: '1.0.0'
      }

      const error = await mcpHostingAPI.createHostingMcpServer(appId, createData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 409
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'POST',
        body: JSON.stringify(createData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('redeployHostingMcpServer', () => {
    it('should make a PUT request to redeploy MCP hosting server', async () => {
      const redeployResult = {
        redeployResult: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            annotations: {
              'deployment.kubernetes.io/revision': '1',
              name: 'test-mcp-server---test-app-id'
            },
            creationTimestamp: '2024-01-13T11:40:47.000Z',
            generation: 2,
            name: 'test-mcp-server---test-app-id',
            namespace: 'test-namespace',
            resourceVersion: '123456',
            uid: 'test-uid-123'
          },
          spec: {
            progressDeadlineSeconds: 60,
            replicas: 1,
            revisionHistoryLimit: 10,
            selector: {
              matchLabels: {
                app: 'test-mcp-server---test-app-id',
                appId: 'test-app-id',
                mcpServerName: 'test-mcp-server-name',
                type: 'bl-mcp-server'
              }
            },
            strategy: {
              rollingUpdate: {
                maxSurge: 1,
                maxUnavailable: 0
              },
              type: 'RollingUpdate'
            },
            template: {
              metadata: {
                annotations: {
                  'kubectl.kubernetes.io/restartedAt': '2024-01-13T19:58:59.716Z'
                },
                labels: {
                  app: 'test-mcp-server---test-app-id',
                  appId: 'test-app-id',
                  mcpServerName: 'test-mcp-server-name',
                  type: 'bl-mcp-server'
                }
              },
              spec: {
                containers: [
                  {
                    env: [
                      {
                        name: 'TEST_ENV_VAR',
                        value: 'test-value'
                      }
                    ],
                    image: 'test/docker-image:1.0.0',
                    name: 'test-mcp-server---test-app-id',
                    ports: [
                      {
                        containerPort: 3000,
                        name: 'http',
                        protocol: 'TCP'
                      }
                    ],
                    resources: {
                      limits: {
                        cpu: '200m',
                        memory: '600Mi'
                      },
                      requests: {
                        cpu: '100m',
                        memory: '50Mi'
                      }
                    }
                  }
                ],
                restartPolicy: 'Always'
              }
            }
          },
          status: {
            availableReplicas: 1,
            conditions: [
              {
                type: 'Available',
                status: 'True',
                reason: 'MinimumReplicasAvailable'
              },
              {
                type: 'Progressing',
                status: 'True',
                reason: 'NewReplicaSetAvailable'
              }
            ],
            replicas: 1,
            updatedReplicas: 1
          }
        }
      }

      mockSuccessAPIRequest(redeployResult)

      const redeployData = {
        mcpServerName: 'test-mcp-server-name'
      }

      const result = await mcpHostingAPI.redeployHostingMcpServer(appId, redeployData)

      expect(result).toEqual(redeployResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'PUT',
        body: JSON.stringify(redeployData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server not found', async () => {
      const errorMessage = 'MCP hosting server not found'
      mockFailedAPIRequest(errorMessage, 404)

      const redeployData = { mcpServerName: 'nonexistent-server' }
      const error = await mcpHostingAPI.redeployHostingMcpServer(appId, redeployData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'PUT',
        body: JSON.stringify(redeployData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails with validation error', async () => {
      const errorMessage = 'Invalid server configuration'
      mockFailedAPIRequest(errorMessage, 400)

      const redeployData = { mcpServerName: '' }
      const error = await mcpHostingAPI.redeployHostingMcpServer(appId, redeployData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 400
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'PUT',
        body: JSON.stringify(redeployData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails on server error', async () => {
      const errorMessage = 'Internal server error'
      mockFailedAPIRequest(errorMessage, 500)

      const redeployData = { mcpServerName: 'test-server' }
      const error = await mcpHostingAPI.redeployHostingMcpServer(appId, redeployData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'PUT',
        body: JSON.stringify(redeployData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('changeHostingMcpServerState', () => {
    it('should make a PUT request to start MCP hosting server', async () => {
      const stateChangeResult = {
        changeStateResult: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: 'test-mcp-server---test-app-id',
            namespace: 'mcp-servers',
            resourceVersion: '123456',
            generation: 2
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'test-mcp-server---test-app-id',
                appId: 'test-app-id',
                mcpServerName: 'test-mcp-server',
                type: 'bl-mcp-server'
              }
            }
          },
          status: {
            replicas: 1,
            updatedReplicas: 1,
            readyReplicas: 0,
            availableReplicas: 0,
            conditions: [
              {
                type: 'Progressing',
                status: 'True',
                reason: 'NewReplicaSetCreated',
                message: 'Created new replica set'
              }
            ]
          }
        }
      }

      mockSuccessAPIRequest(stateChangeResult)

      const stateData = {
        mcpServerName: 'test-mcp-server-name',
      }

      const result = await mcpHostingAPI.changeHostingMcpServerState(appId, 'start', stateData)

      expect(result).toEqual(stateChangeResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/start`,
        method: 'PUT',
        body: JSON.stringify(stateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should make a PUT request to stop MCP hosting server', async () => {
      const stateChangeResult = {
        changeStateResult: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: 'test-mcp-server---test-app-id',
            namespace: 'mcp-servers',
            resourceVersion: '123457',
            generation: 3
          },
          spec: {
            replicas: 0,
            selector: {
              matchLabels: {
                app: 'test-mcp-server---test-app-id',
                appId: 'test-app-id',
                mcpServerName: 'test-mcp-server',
                type: 'bl-mcp-server'
              }
            }
          },
          status: {
            replicas: 1,
            updatedReplicas: 0,
            readyReplicas: 1,
            availableReplicas: 1,
            conditions: [
              {
                type: 'Progressing',
                status: 'True',
                reason: 'ReplicaSetUpdated',
                message: 'Scaling down replica set'
              }
            ]
          }
        }
      }

      mockSuccessAPIRequest(stateChangeResult)

      const stateData = {
        mcpServerName: 'test-mcp-server-name'
      }

      const result = await mcpHostingAPI.changeHostingMcpServerState(appId, 'stop', stateData)

      expect(result).toEqual(stateChangeResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/stop`,
        method: 'PUT',
        body: JSON.stringify(stateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server not found', async () => {
      const errorMessage = 'MCP hosting server not found'
      mockFailedAPIRequest(errorMessage, 404)

      const stateData = { mcpServerName: 'nonexistent-server-name' }
      const error = await mcpHostingAPI.changeHostingMcpServerState(appId, 'start', stateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/start`,
        method: 'PUT',
        body: JSON.stringify(stateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when invalid state transition', async () => {
      const errorMessage = 'Invalid state transition from stopped to paused'
      mockFailedAPIRequest(errorMessage, 422)

      const stateData = { mcpServerName: 'nonexistent-server-name' }
      const error = await mcpHostingAPI.changeHostingMcpServerState(appId, 'pause', stateData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 422
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting/pause`,
        method: 'PUT',
        body: JSON.stringify(stateData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('deleteHostingMcpServer', () => {
    it('should make a DELETE request to delete MCP hosting server', async () => {
      const deleteResult = {
        deleteDeploymentResult: {
          apiVersion: 'v1',
          kind: 'Status',
          status: 'Success',
          details: {
            name: 'test-mcp-server---test-app-id',
            group: 'apps',
            kind: 'deployments',
            uid: 'test-uid-123'
          },
          metadata: {}
        },
        deleteServiceResult: {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            name: 'test-mcp-server---test-app-id',
            namespace: 'mcp-servers',
            resourceVersion: '123456',
            uid: 'service-uid-123',
            creationTimestamp: '2024-01-13T11:40:47.000Z',
            labels: {
              app: 'test-mcp-server---test-app-id',
              appId: 'test-app-id',
              mcpServerName: 'test-mcp-server-name'
            }
          },
          spec: {
            type: 'ClusterIP',
            clusterIP: '10.43.163.200',
            clusterIPs: ['10.43.163.200'],
            ipFamilies: ['IPv4'],
            ipFamilyPolicy: 'SingleStack',
            internalTrafficPolicy: 'Cluster',
            sessionAffinity: 'None',
            ports: [
              {
                name: 'http',
                protocol: 'TCP',
                port: 3031,
                targetPort: 3031
              }
            ],
            selector: {
              app: 'test-mcp-server---test-app-id',
              appId: 'test-app-id',
              mcpServerName: 'test-mcp-server-name'
            }
          },
          status: {
            loadBalancer: {}
          }
        }
      }

      mockSuccessAPIRequest(deleteResult)

      const deleteData = {
        mcpServerName: 'test-mcp-server-name'
      }

      const result = await mcpHostingAPI.deleteHostingMcpServer(appId, deleteData)

      expect(result).toEqual(deleteResult)

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'DELETE',
        body: JSON.stringify(deleteData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server not found', async () => {
      const errorMessage = 'MCP hosting server not found'
      mockFailedAPIRequest(errorMessage, 404)

      const deleteData = { mcpServerName: 'nonexistent-server' }
      const error = await mcpHostingAPI.deleteHostingMcpServer(appId, deleteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 404
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'DELETE',
        body: JSON.stringify(deleteData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails on server failure', async () => {
      const errorMessage = 'Internal server error during deletion'
      mockFailedAPIRequest(errorMessage, 500)

      const deleteData = { mcpServerName: 'test-server' }
      const error = await mcpHostingAPI.deleteHostingMcpServer(appId, deleteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)

      expect({ ...error }).toEqual({
        body: { message: errorMessage },
        message: errorMessage,
        status: 500
      })

      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/node-server/manage/app/${appId}/mcp/hosting`,
        method: 'DELETE',
        body: JSON.stringify(deleteData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
