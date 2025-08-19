import { mockSuccessAPIRequest, mockFailedAPIRequest, apiRequestCalls } from '../setup/mock-request'

describe('apiClient.quickApps', () => {
  let apiClient
  let quickAppsAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    quickAppsAPI = apiClient.quickApps
  })

  describe('loadContainers', () => {
    it('should make GET request to load containers', async () => {
      const containersResult = {
        containers: [
          {
            id: 'container-123',
            name: 'web-app-container',
            status: 'running',
            image: 'node:18-alpine',
            port: 3000,
            createdAt: '2024-01-10T09:00:00Z',
            lastUpdated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'container-456',
            name: 'api-service-container',
            status: 'stopped',
            image: 'python:3.11-slim',
            port: 8000,
            createdAt: '2024-01-12T14:30:00Z',
            lastUpdated: '2024-01-14T16:45:00Z'
          }
        ],
        totalCount: 2,
        runningCount: 1,
        stoppedCount: 1
      }
      mockSuccessAPIRequest(containersResult)

      const result = await quickAppsAPI.loadContainers(appId)

      expect(result).toEqual(containersResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/quick-apps/containers`,
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
        message: 'No containers found for this application'
      }
      mockSuccessAPIRequest(containersResult)

      const result = await quickAppsAPI.loadContainers(appId)

      expect(result).toEqual(containersResult)
    })

    it('should handle comprehensive containers with detailed information', async () => {
      const containersResult = {
        containers: [
          {
            id: 'container-advanced-789',
            name: 'microservice-container',
            status: 'running',
            image: 'backendless/nodejs:latest',
            config: {
              port: 3000,
              env: {
                NODE_ENV: 'production',
                DATABASE_URL: 'postgresql://...',
                REDIS_URL: 'redis://...'
              },
              resources: {
                cpu: '0.5',
                memory: '512Mi',
                storage: '1Gi'
              },
              networking: {
                exposedPorts: [3000, 8080],
                internalPorts: [3000],
                loadBalancer: true
              }
            },
            health: {
              status: 'healthy',
              lastCheck: '2024-01-15T12:00:00Z',
              uptime: '7 days, 14 hours',
              responseTime: 85
            },
            metrics: {
              cpuUsage: '15%',
              memoryUsage: '320Mi',
              networkIO: {
                in: '2.3 GB',
                out: '1.8 GB'
              },
              requests: {
                total: 15420,
                last24h: 1250,
                averagePerMinute: 52
              }
            },
            deployment: {
              version: 'v2.1.0',
              replicas: 2,
              strategy: 'rolling-update',
              lastDeployed: '2024-01-14T08:30:00Z'
            },
            logs: {
              enabled: true,
              retention: '7 days',
              level: 'info'
            },
            createdAt: '2024-01-08T10:00:00Z',
            updatedAt: '2024-01-15T09:45:00Z'
          }
        ],
        statistics: {
          totalContainers: 1,
          runningContainers: 1,
          stoppedContainers: 0,
          totalMemoryUsage: '320Mi',
          totalCpuUsage: '15%',
          totalStorageUsage: '450Mi'
        },
        quotas: {
          maxContainers: 10,
          maxMemoryPerContainer: '1Gi',
          maxCpuPerContainer: '1.0'
        }
      }
      mockSuccessAPIRequest(containersResult)

      const result = await quickAppsAPI.loadContainers(appId)

      expect(result).toEqual(containersResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await quickAppsAPI.loadContainers(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await quickAppsAPI.loadContainers('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('loadContainer', () => {
    it('should make GET request to load specific container', async () => {
      const containerResult = {
        id: 'container-123',
        name: 'web-app-container',
        status: 'running',
        image: 'node:18-alpine',
        config: {
          port: 3000,
          env: {
            NODE_ENV: 'production',
            API_URL: 'https://api.example.com'
          },
          command: ['npm', 'start'],
          workingDir: '/app'
        },
        health: {
          status: 'healthy',
          checks: [
            { name: 'http', url: 'http://localhost:3000/health', status: 'passing' },
            { name: 'database', status: 'passing' }
          ]
        },
        logs: {
          recent: [
            '2024-01-15T12:00:00Z [INFO] Server started on port 3000',
            '2024-01-15T12:01:23Z [INFO] Database connection established',
            '2024-01-15T12:05:47Z [INFO] Processed 150 requests in last 5 minutes'
          ]
        },
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-15T11:30:00Z'
      }
      mockSuccessAPIRequest(containerResult)

      const containerId = 'container-123'
      const result = await quickAppsAPI.loadContainer(appId, containerId)

      expect(result).toEqual(containerResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/quick-apps/containers/${containerId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle container with complex configuration', async () => {
      const containerResult = {
        id: 'container-456',
        name: 'database-container',
        status: 'running',
        image: 'postgres:15-alpine',
        config: {
          port: 5432,
          env: {
            POSTGRES_DB: 'myapp',
            POSTGRES_USER: 'appuser',
            POSTGRES_PASSWORD: '****'
          },
          volumes: [
            {
              name: 'postgres-data',
              mountPath: '/var/lib/postgresql/data',
              size: '10Gi'
            }
          ],
          resources: {
            limits: {
              cpu: '1.0',
              memory: '2Gi'
            },
            requests: {
              cpu: '0.5',
              memory: '1Gi'
            }
          }
        },
        networking: {
          internalIp: '10.244.1.15',
          exposedPorts: [5432],
          serviceType: 'ClusterIP'
        },
        persistence: {
          enabled: true,
          storageClass: 'fast-ssd',
          accessModes: ['ReadWriteOnce']
        }
      }
      mockSuccessAPIRequest(containerResult)

      const containerId = 'container-456'
      const result = await quickAppsAPI.loadContainer(appId, containerId)

      expect(result).toEqual(containerResult)
    })

    it('should handle stopped container information', async () => {
      const containerResult = {
        id: 'container-789',
        name: 'stopped-service',
        status: 'stopped',
        image: 'nginx:alpine',
        exitCode: 0,
        stoppedAt: '2024-01-14T18:30:00Z',
        reason: 'Manual stop',
        restartCount: 2,
        lastLogs: [
          '2024-01-14T18:29:45Z [INFO] Shutting down gracefully...',
          '2024-01-14T18:30:00Z [INFO] Server stopped'
        ]
      }
      mockSuccessAPIRequest(containerResult)

      const containerId = 'container-789'
      const result = await quickAppsAPI.loadContainer(appId, containerId)

      expect(result).toEqual(containerResult)
    })

    it('fails when server responds with container not found error', async () => {
      mockFailedAPIRequest('Container not found', 404)

      const containerId = 'nonexistent-container'
      const error = await quickAppsAPI.loadContainer(appId, containerId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container not found' },
        message: 'Container not found',
        status: 404
      })
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to container details', 403)

      const containerId = 'restricted-container'
      const error = await quickAppsAPI.loadContainer(appId, containerId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to container details' },
        message: 'Access denied to container details',
        status: 403
      })
    })
  })

  describe('createContainer', () => {
    it('should make POST request to create container', async () => {
      const createResult = {
        id: 'new-container-123',
        name: 'web-service',
        status: 'creating',
        message: 'Container creation initiated',
        estimatedTime: '2-3 minutes',
        createdAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(createResult)

      const data = {
        name: 'web-service',
        image: 'node:18-alpine',
        port: 3000,
        env: {
          NODE_ENV: 'production',
          PORT: '3000'
        },
        resources: {
          cpu: '0.5',
          memory: '512Mi'
        }
      }

      const result = await quickAppsAPI.createContainer(appId, data)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/quick-apps/containers`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex container creation', async () => {
      const createResult = {
        id: 'complex-container-456',
        name: 'microservice-api',
        status: 'creating',
        deploymentId: 'deploy-789'
      }
      mockSuccessAPIRequest(createResult)

      const data = {
        name: 'microservice-api',
        image: 'myregistry/api-service:v2.1.0',
        config: {
          port: 8080,
          env: {
            NODE_ENV: 'production',
            DATABASE_URL: 'postgresql://user:pass@db:5432/myapp',
            REDIS_URL: 'redis://redis:6379',
            JWT_SECRET: 'secret-key-here',
            LOG_LEVEL: 'info'
          },
          command: ['node', 'server.js'],
          workingDir: '/app',
          user: '1001'
        },
        resources: {
          limits: {
            cpu: '1.0',
            memory: '1Gi',
            ephemeralStorage: '2Gi'
          },
          requests: {
            cpu: '0.2',
            memory: '256Mi'
          }
        },
        networking: {
          ports: [8080, 9090],
          serviceName: 'api-service',
          serviceType: 'LoadBalancer'
        },
        volumes: [
          {
            name: 'app-data',
            mountPath: '/app/data',
            size: '5Gi',
            storageClass: 'fast-ssd'
          },
          {
            name: 'logs',
            mountPath: '/app/logs',
            size: '1Gi'
          }
        ],
        health: {
          httpGet: {
            path: '/health',
            port: 8080
          },
          initialDelaySeconds: 30,
          periodSeconds: 10
        },
        deployment: {
          replicas: 3,
          strategy: 'RollingUpdate',
          maxUnavailable: 1,
          maxSurge: 1
        },
        autoscaling: {
          enabled: true,
          minReplicas: 2,
          maxReplicas: 10,
          targetCPU: 70
        },
        monitoring: {
          enabled: true,
          metrics: ['cpu', 'memory', 'requests']
        }
      }

      const result = await quickAppsAPI.createContainer(appId, data)

      expect(result).toEqual(createResult)
    })

    it('should handle minimal container creation', async () => {
      const createResult = { id: 'simple-container-789', status: 'creating' }
      mockSuccessAPIRequest(createResult)

      const data = {
        name: 'simple-app',
        image: 'nginx:alpine'
      }

      const result = await quickAppsAPI.createContainer(appId, data)

      expect(result).toEqual(createResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Container configuration is invalid', 400)

      const data = { name: 'invalid-container' } // Missing image
      const error = await quickAppsAPI.createContainer(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container configuration is invalid' },
        message: 'Container configuration is invalid',
        status: 400
      })
    })

    it('fails when server responds with container name exists error', async () => {
      mockFailedAPIRequest('Container with this name already exists', 409)

      const data = { name: 'existing-container', image: 'nginx' }
      const error = await quickAppsAPI.createContainer(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container with this name already exists' },
        message: 'Container with this name already exists',
        status: 409
      })
    })

    it('fails when server responds with quota exceeded error', async () => {
      mockFailedAPIRequest('Container quota exceeded', 429)

      const data = { name: 'new-container', image: 'app:latest' }
      const error = await quickAppsAPI.createContainer(appId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container quota exceeded' },
        message: 'Container quota exceeded',
        status: 429
      })
    })
  })

  describe('deleteContainer', () => {
    it('should make DELETE request to delete container', async () => {
      const deleteResult = {
        success: true,
        message: 'Container deletion initiated',
        containerId: 'container-123',
        estimatedTime: '1-2 minutes'
      }
      mockSuccessAPIRequest(deleteResult)

      const containerId = 'container-123'
      const result = await quickAppsAPI.deleteContainer(appId, containerId)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/quick-apps/containers/${containerId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle container deletion with cleanup details', async () => {
      const deleteResult = {
        success: true,
        message: 'Container deleted successfully',
        cleanup: {
          volumesRemoved: 2,
          networksRemoved: 1,
          secretsRemoved: 3,
          backupCreated: true,
          backupLocation: 'backups/containers/web-service_20240115.tar'
        },
        resourcesFreed: {
          cpu: '0.5',
          memory: '512Mi',
          storage: '2Gi'
        },
        warnings: [
          'Persistent volumes will be retained for 7 days',
          'Backup will be available for 30 days'
        ]
      }
      mockSuccessAPIRequest(deleteResult)

      const containerId = 'container-456'
      const result = await quickAppsAPI.deleteContainer(appId, containerId)

      expect(result).toEqual(deleteResult)
    })

    it('fails when server responds with container not found error', async () => {
      mockFailedAPIRequest('Container not found', 404)

      const containerId = 'nonexistent-container'
      const error = await quickAppsAPI.deleteContainer(appId, containerId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container not found' },
        message: 'Container not found',
        status: 404
      })
    })

    it('fails when server responds with container in use error', async () => {
      mockFailedAPIRequest('Cannot delete container currently serving traffic', 409)

      const containerId = 'active-container'
      const error = await quickAppsAPI.deleteContainer(appId, containerId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete container currently serving traffic' },
        message: 'Cannot delete container currently serving traffic',
        status: 409
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to delete container', 403)

      const containerId = 'protected-container'
      const error = await quickAppsAPI.deleteContainer(appId, containerId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to delete container' },
        message: 'Insufficient permissions to delete container',
        status: 403
      })
    })
  })

  describe('deployContainer', () => {
    it('should make POST request to deploy container', async () => {
      const deployResult = {
        deploymentId: 'deploy-123',
        status: 'in-progress',
        containerId: 'container-123',
        message: 'Container deployment initiated',
        steps: [
          { step: 'pulling-image', status: 'completed' },
          { step: 'creating-container', status: 'in-progress' },
          { step: 'starting-services', status: 'pending' },
          { step: 'health-check', status: 'pending' }
        ],
        estimatedTime: '3-5 minutes',
        startedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(deployResult)

      const containerId = 'container-123'
      const data = {
        version: 'v2.1.0',
        environment: 'production',
        config: {
          replicas: 3,
          strategy: 'rolling-update'
        }
      }

      const result = await quickAppsAPI.deployContainer(appId, containerId, data)

      expect(result).toEqual(deployResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/quick-apps/deploy/${containerId}`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex deployment configuration', async () => {
      const deployResult = {
        deploymentId: 'deploy-456',
        status: 'completed',
        duration: '4m 32s'
      }
      mockSuccessAPIRequest(deployResult)

      const containerId = 'container-456'
      const data = {
        version: 'v3.0.0',
        environment: 'staging',
        config: {
          replicas: 2,
          strategy: 'blue-green',
          maxUnavailable: 0,
          maxSurge: 2
        },
        resources: {
          limits: {
            cpu: '1.5',
            memory: '2Gi'
          },
          requests: {
            cpu: '0.5',
            memory: '1Gi'
          }
        },
        networking: {
          loadBalancer: {
            enabled: true,
            type: 'application',
            healthCheck: {
              path: '/health',
              interval: 30,
              timeout: 5
            }
          },
          ingress: {
            enabled: true,
            domain: 'api.example.com',
            tls: true
          }
        },
        autoscaling: {
          enabled: true,
          minReplicas: 2,
          maxReplicas: 8,
          metrics: [
            { type: 'cpu', target: 70 },
            { type: 'memory', target: 80 },
            { type: 'requests', target: 1000 }
          ]
        },
        monitoring: {
          enabled: true,
          alerting: {
            enabled: true,
            channels: ['slack', 'email'],
            thresholds: {
              errorRate: 5,
              responseTime: 2000
            }
          }
        },
        rollback: {
          enabled: true,
          autoRollback: true,
          healthCheckGracePeriod: 300
        }
      }

      const result = await quickAppsAPI.deployContainer(appId, containerId, data)

      expect(result).toEqual(deployResult)
    })

    it('should handle simple deployment', async () => {
      const deployResult = {
        deploymentId: 'deploy-789',
        status: 'completed',
        message: 'Container deployed successfully'
      }
      mockSuccessAPIRequest(deployResult)

      const containerId = 'container-789'
      const data = {
        environment: 'development'
      }

      const result = await quickAppsAPI.deployContainer(appId, containerId, data)

      expect(result).toEqual(deployResult)
    })

    it('should handle deployment with environment-specific configurations', async () => {
      const deployResult = {
        deploymentId: 'deploy-prod-101',
        status: 'in-progress',
        environment: 'production',
        validation: {
          passed: true,
          checks: [
            'configuration-valid',
            'resources-available',
            'dependencies-satisfied'
          ]
        }
      }
      mockSuccessAPIRequest(deployResult)

      const containerId = 'container-prod'
      const data = {
        environment: 'production',
        version: 'stable',
        config: {
          replicas: 5,
          strategy: 'canary',
          canary: {
            steps: [
              { percentage: 10, duration: '10m' },
              { percentage: 50, duration: '20m' },
              { percentage: 100, duration: '0m' }
            ]
          }
        },
        secrets: {
          databasePassword: 'prod-db-secret',
          apiKeys: 'prod-api-keys'
        }
      }

      const result = await quickAppsAPI.deployContainer(appId, containerId, data)

      expect(result).toEqual(deployResult)
    })

    it('fails when server responds with container not found error', async () => {
      mockFailedAPIRequest('Container not found for deployment', 404)

      const containerId = 'nonexistent-container'
      const data = { environment: 'production' }
      const error = await quickAppsAPI.deployContainer(appId, containerId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container not found for deployment' },
        message: 'Container not found for deployment',
        status: 404
      })
    })

    it('fails when server responds with deployment validation error', async () => {
      mockFailedAPIRequest('Deployment configuration is invalid', 400)

      const containerId = 'container-123'
      const data = { replicas: -1 } // Invalid configuration
      const error = await quickAppsAPI.deployContainer(appId, containerId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Deployment configuration is invalid' },
        message: 'Deployment configuration is invalid',
        status: 400
      })
    })

    it('fails when server responds with resource quota exceeded error', async () => {
      mockFailedAPIRequest('Deployment would exceed resource quotas', 429)

      const containerId = 'container-456'
      const data = { replicas: 100 } // Too many replicas
      const error = await quickAppsAPI.deployContainer(appId, containerId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Deployment would exceed resource quotas' },
        message: 'Deployment would exceed resource quotas',
        status: 429
      })
    })

    it('fails when server responds with deployment already in progress error', async () => {
      mockFailedAPIRequest('Deployment already in progress for this container', 409)

      const containerId = 'container-789'
      const data = { environment: 'staging' }
      const error = await quickAppsAPI.deployContainer(appId, containerId, data).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Deployment already in progress for this container' },
        message: 'Deployment already in progress for this container',
        status: 409
      })
    })
  })
})