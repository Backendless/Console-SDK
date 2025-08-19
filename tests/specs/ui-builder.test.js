describe('apiClient.uiBuilder', () => {
  let apiClient
  let uiBuilderAPI

  const appId = 'test-app-id'
  const containerName = 'test-container'
  const themeId = 'theme-123'
  const pageName = 'home'
  const layoutId = 'layout-789'
  const componentId = 'component-456'
  const functionId = 'function-123'
  const componentUid = 'comp-uid-456'
  const handlerName = 'onClick'
  const backupId = 'backup-789'
  const productId = 'product-123'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    uiBuilderAPI = apiClient.uiBuilder
  })

  describe('init', () => {
    it('should make POST request to initialize UI builder', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.init(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/init`,
          body: undefined,
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Initialization failed', 500)

      const error = await uiBuilderAPI.init(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Initialization failed' },
        message: 'Initialization failed',
        status: 500
      })
    })
  })

  describe('loadSDKStyles', () => {
    it('should make GET request to load SDK styles', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadSDKStyles(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/sdk/styles`,
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
      mockFailedAPIRequest('SDK styles not found', 404)

      const error = await uiBuilderAPI.loadSDKStyles(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'SDK styles not found' },
        message: 'SDK styles not found',
        status: 404
      })
    })
  })

  describe('loadSDKComponents', () => {
    it('should make GET request to load SDK components', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadSDKComponents(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/sdk/components`,
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

  describe('createContainer', () => {
    it('should make POST request with container data', async () => {
      mockSuccessAPIRequest(successResult)

      const container = {
        name: 'my-container',
        type: 'web',
        settings: {
          theme: 'default',
          responsive: true
        }
      }

      const result = await uiBuilderAPI.createContainer(appId, container)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers`,
          body: JSON.stringify(container),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty container object', async () => {
      mockSuccessAPIRequest(successResult)

      const container = {}
      const result = await uiBuilderAPI.createContainer(appId, container)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers`,
          body: JSON.stringify(container),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Container creation failed', 400)

      const container = { name: 'invalid' }
      const error = await uiBuilderAPI.createContainer(appId, container).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container creation failed' },
        message: 'Container creation failed',
        status: 400
      })
    })
  })

  describe('loadContainer', () => {
    it('should make GET request to load specific container', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadContainer(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}`,
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
      mockFailedAPIRequest('Container not found', 404)

      const error = await uiBuilderAPI.loadContainer(appId, containerName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Container not found' },
        message: 'Container not found',
        status: 404
      })
    })
  })

  describe('updateContainer', () => {
    it('should make PUT request with container updates', async () => {
      mockSuccessAPIRequest(successResult)

      const container = {
        name: 'updated-container',
        description: 'Updated container description',
        settings: {
          theme: 'dark',
          responsive: false
        }
      }

      const result = await uiBuilderAPI.updateContainer(appId, containerName, container)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}`,
          body: JSON.stringify(container),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteContainer', () => {
    it('should make DELETE request to remove container', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteContainer(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Cannot delete container', 403)

      const error = await uiBuilderAPI.deleteContainer(appId, containerName).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete container' },
        message: 'Cannot delete container',
        status: 403
      })
    })
  })

  describe('createTheme', () => {
    it('should make POST request with theme data', async () => {
      mockSuccessAPIRequest(successResult)

      const theme = {
        name: 'My Custom Theme',
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          background: '#ffffff'
        },
        fonts: {
          body: 'Arial, sans-serif',
          heading: 'Georgia, serif'
        }
      }

      const result = await uiBuilderAPI.createTheme(appId, theme)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes`,
          body: JSON.stringify(theme),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateTheme', () => {
    it('should make PUT request with theme updates', async () => {
      mockSuccessAPIRequest(successResult)

      const theme = {
        name: 'Updated Theme',
        colors: { primary: '#28a745' }
      }

      const result = await uiBuilderAPI.updateTheme(appId, themeId, theme)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes/${themeId}`,
          body: JSON.stringify(theme),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('createPage', () => {
    it('should make POST request with page data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'about',
        title: 'About Us',
        path: '/about',
        layout: 'default'
      }

      const result = await uiBuilderAPI.createPage(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages`,
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

  describe('deletePage', () => {
    it('should make DELETE request to remove page', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deletePage(appId, containerName, pageName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}`,
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

  describe('getPageUI', () => {
    it('should make GET request to load page UI', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.getPageUI(appId, containerName, pageName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/ui`,
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

  describe('createCustomComponent', () => {
    it('should make POST request with component data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'MyCustomButton',
        category: 'form',
        props: {
          text: { type: 'string', default: 'Click me' },
          color: { type: 'string', default: 'primary' }
        }
      }

      const result = await uiBuilderAPI.createCustomComponent(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom`,
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

  describe('deleteCustomComponent', () => {
    it('should make DELETE request to remove custom component', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteCustomComponent(appId, containerName, componentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}`,
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

  describe('updateContainerSettings', () => {
    it('should make PUT request with settings data', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = {
        name: 'Updated Container Name',
        description: 'Updated description',
        version: '2.0.0',
        isPublic: true
      }

      const result = await uiBuilderAPI.updateContainerSettings(appId, containerName, settings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/settings`,
          body: JSON.stringify(settings),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('saveAutomationsTriggers', () => {
    it('should make PUT request with triggers data', async () => {
      mockSuccessAPIRequest(successResult)

      const triggers = [
        {
          id: 'trigger-1',
          type: 'onClick',
          target: 'button-submit',
          actions: ['validate', 'submit']
        },
        {
          id: 'trigger-2',
          type: 'onLoad',
          target: 'page',
          actions: ['fetchData']
        }
      ]

      const result = await uiBuilderAPI.saveAutomationsTriggers(appId, containerName, triggers)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/automations`,
          body: JSON.stringify(triggers),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty triggers array', async () => {
      mockSuccessAPIRequest(successResult)

      const triggers = []
      const result = await uiBuilderAPI.saveAutomationsTriggers(appId, containerName, triggers)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/automations`,
          body: JSON.stringify(triggers),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid triggers', 400)

      const triggers = [{ invalid: 'trigger' }]
      const error = await uiBuilderAPI.saveAutomationsTriggers(appId, containerName, triggers).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid triggers' },
        message: 'Invalid triggers',
        status: 400
      })
    })
  })

  //-- LIBRARY -----//

  describe('loadLayoutTemplates', () => {
    it('should make GET request to load layout templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadLayoutTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/layout-templates`,
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
      mockFailedAPIRequest('Templates not found', 404)

      const error = await uiBuilderAPI.loadLayoutTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Templates not found' },
        message: 'Templates not found',
        status: 404
      })
    })
  })

  describe('loadPageTemplates', () => {
    it('should make GET request to load page templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadPageTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/page-templates`,
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

  describe('loadCustomComponentTemplates', () => {
    it('should make GET request to load custom component templates', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadCustomComponentTemplates(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/custom-component-templates`,
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

  //-- THEMES -----//

  describe('searchThemes', () => {
    it('should make GET request to search remote themes', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.searchThemes(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/remote/themes`,
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

  describe('loadThemes', () => {
    it('should make GET request to load themes', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadThemes(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes`,
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

  describe('deleteTheme', () => {
    it('should make DELETE request to remove theme', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteTheme(appId, themeId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes/${themeId}`,
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

  describe('publishTheme', () => {
    it('should make POST request to publish theme', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        version: '1.0.0',
        description: 'Published theme'
      }

      const result = await uiBuilderAPI.publishTheme(appId, themeId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes/${themeId}/publish`,
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

  describe('loadThemeStyle', () => {
    it('should make GET request to load theme style', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadThemeStyle(appId, themeId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes/${themeId}/style`,
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

  describe('updateThemeStyle', () => {
    it('should make PUT request with style content', async () => {
      mockSuccessAPIRequest(successResult)

      const content = '.button { background: #007bff; color: white; }'

      const result = await uiBuilderAPI.updateThemeStyle(appId, themeId, content)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/library/themes/${themeId}/style`,
          body: JSON.stringify({ content }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  //-- CONTAINER ACTIONS -----//

  describe('publishContainer', () => {
    it('should make POST request to publish container', async () => {
      mockSuccessAPIRequest(successResult)

      const options = {
        version: '2.1.0',
        changelog: 'Bug fixes and improvements'
      }

      const result = await uiBuilderAPI.publishContainer(appId, containerName, options)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/publish`,
          body: JSON.stringify(options),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('applyContainerTheme', () => {
    it('should make POST request to apply theme to container', async () => {
      mockSuccessAPIRequest(successResult)

      const theme = {
        themeId: 'dark-theme',
        overrides: {
          primaryColor: '#333333'
        }
      }

      const result = await uiBuilderAPI.applyContainerTheme(appId, containerName, theme)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/apply-theme`,
          body: JSON.stringify(theme),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  //-- STYLES -----//

  describe('loadContainerStyles', () => {
    it('should make GET request to load container styles', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadContainerStyles(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/styles`,
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

  describe('loadContainerStyle', () => {
    it('should make GET request to load specific container style', async () => {
      mockSuccessAPIRequest(successResult)

      const styleName = 'main.css'
      const result = await uiBuilderAPI.loadContainerStyle(appId, containerName, styleName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/styles/${styleName}`,
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

  describe('updateContainerStyle', () => {
    it('should make PUT request with style data', async () => {
      mockSuccessAPIRequest(successResult)

      const styleName = 'custom.css'
      const style = {
        content: '.custom-class { color: red; }',
        minified: false
      }

      const result = await uiBuilderAPI.updateContainerStyle(appId, containerName, styleName, style)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/styles/${styleName}`,
          body: JSON.stringify(style),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteContainerStyle', () => {
    it('should make DELETE request to remove container style', async () => {
      mockSuccessAPIRequest(successResult)

      const styleName = 'old-style.css'
      const result = await uiBuilderAPI.deleteContainerStyle(appId, containerName, styleName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/styles/${styleName}`,
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

  //-- BACKUPS -----//

  describe('loadRemovedContainers', () => {
    it('should make GET request to load removed containers', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadRemovedContainers(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/removed-containers`,
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

  describe('deleteRemovedContainer', () => {
    it('should make DELETE request to permanently remove container', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteRemovedContainer(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/removed-containers/${containerName}`,
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

  describe('loadContainerBackups', () => {
    it('should make GET request to load container backups', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadContainerBackups(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/backups`,
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

  describe('createContainerBackup', () => {
    it('should make POST request to create backup', async () => {
      mockSuccessAPIRequest(successResult)

      const backup = {
        name: 'backup-2023-12-01',
        description: 'Before major update'
      }

      const result = await uiBuilderAPI.createContainerBackup(appId, containerName, backup)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/backups`,
          body: JSON.stringify(backup),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteContainerBackups', () => {
    it('should make DELETE request with backup IDs', async () => {
      mockSuccessAPIRequest(successResult)

      const backupsIds = ['backup-1', 'backup-2', 'backup-3']

      const result = await uiBuilderAPI.deleteContainerBackups(appId, containerName, backupsIds)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/backups`,
          body: JSON.stringify(backupsIds),
          method: 'DELETE',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getBackupDownloadLink', () => {
    it('should make GET request to get backup download link', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.getBackupDownloadLink(appId, containerName, backupId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/backups/download/sign/${backupId}`,
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

  //-- PAGES -----//

  describe('updatePage', () => {
    it('should make PUT request with page updates', async () => {
      mockSuccessAPIRequest(successResult)

      const page = {
        title: 'Updated Page Title',
        path: '/updated-path',
        metadata: {
          description: 'Updated page description'
        }
      }

      const result = await uiBuilderAPI.updatePage(appId, containerName, pageName, page)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}`,
          body: JSON.stringify(page),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updatePageUI', () => {
    it('should make PUT request with UI data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        components: [
          { type: 'button', props: { text: 'Click me' } },
          { type: 'text', props: { content: 'Hello world' } }
        ],
        layout: 'flex-column'
      }

      const result = await uiBuilderAPI.updatePageUI(appId, containerName, pageName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/ui`,
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

  describe('getPageLogic', () => {
    it('should make GET request to load page logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.getPageLogic(appId, containerName, pageName, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/logic/${componentUid}/${handlerName}`,
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

  describe('createPageLogic', () => {
    it('should make POST request to create page logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.createPageLogic(appId, containerName, pageName, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/logic/${componentUid}/${handlerName}`,
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

  //-- LAYOUTS -----//

  describe('createLayout', () => {
    it('should make POST request with layout data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'sidebar-layout',
        type: 'responsive',
        structure: {
          header: true,
          sidebar: true,
          footer: false
        }
      }

      const result = await uiBuilderAPI.createLayout(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts`,
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

  describe('updateLayout', () => {
    it('should make PUT request with layout updates', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'updated-layout',
        structure: {
          columns: 3,
          responsive: true
        }
      }

      const result = await uiBuilderAPI.updateLayout(appId, containerName, layoutId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}`,
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

  describe('deleteLayout', () => {
    it('should make DELETE request to remove layout', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteLayout(appId, containerName, layoutId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}`,
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

  describe('getLayoutUI', () => {
    it('should make GET request to load layout UI', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.getLayoutUI(appId, containerName, layoutId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/ui`,
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

  //-- FUNCTIONS -----//

  describe('loadContainerFunctions', () => {
    it('should make GET request to load container functions', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadContainerFunctions(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions`,
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

  describe('createContainerFunction', () => {
    it('should make POST request with function data', async () => {
      mockSuccessAPIRequest(successResult)

      const fn = {
        name: 'validateForm',
        parameters: ['formData'],
        body: 'return formData.email && formData.password;',
        returnType: 'boolean'
      }

      const result = await uiBuilderAPI.createContainerFunction(appId, containerName, fn)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions`,
          body: JSON.stringify(fn),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerFunction', () => {
    it('should make PUT request with function definition', async () => {
      mockSuccessAPIRequest(successResult)

      const definition = {
        name: 'updatedFunction',
        body: 'console.log("Updated function");',
        parameters: ['param1', 'param2']
      }

      const result = await uiBuilderAPI.updateContainerFunction(appId, containerName, functionId, definition)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions/${functionId}`,
          body: JSON.stringify(definition),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteContainerFunction', () => {
    it('should make DELETE request to remove function', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteContainerFunction(appId, containerName, functionId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions/${functionId}`,
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

  describe('installCustomFunctionsFromMarketplace', () => {
    it('should make POST request to install functions from marketplace', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.installCustomFunctionsFromMarketplace(appId, containerName, productId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions/install/${productId}`,
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

  //-- REUSABLE COMPONENTS -----//

  describe('createReusableComponent', () => {
    it('should make POST request with reusable component data', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        name: 'CustomCard',
        category: 'layout',
        props: {
          title: { type: 'string' },
          content: { type: 'string' }
        }
      }

      const result = await uiBuilderAPI.createReusableComponent(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable`,
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

  describe('loadReusableComponent', () => {
    it('should make GET request to load reusable component', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadReusableComponent(appId, containerName, componentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}`,
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

  describe('deleteReusableComponent', () => {
    it('should make DELETE request to remove reusable component', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteReusableComponent(appId, containerName, componentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}`,
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

  //-- MARKETPLACE -----//

  describe('addReferenceToMarketplaceProduct', () => {
    it('should make POST request to add marketplace reference', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        productId: 'marketplace-product-123',
        version: '1.2.0'
      }

      const result = await uiBuilderAPI.addReferenceToMarketplaceProduct(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/add-reference`,
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

  describe('installComponentFromMarketplace', () => {
    it('should make POST request to install component from marketplace', async () => {
      mockSuccessAPIRequest(successResult)

      const data = {
        version: '2.1.0',
        configuration: {
          theme: 'dark'
        }
      }

      const result = await uiBuilderAPI.installComponentFromMarketplace(appId, containerName, productId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/install/${productId}`,
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

  // Container Settings and Configuration Methods
  describe('updateContainerBackupsPolicy', () => {
    it('should make PUT request to update container backups policy', async () => {
      mockSuccessAPIRequest(successResult)

      const backupsPolicy = { frequency: 'daily', retention: 30, enabled: true }
      const result = await uiBuilderAPI.updateContainerBackupsPolicy(appId, containerName, backupsPolicy)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/backups/policy`,
          body: JSON.stringify(backupsPolicy),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('uploadBackup', () => {
    it('should make POST request to upload backup', async () => {
      mockSuccessAPIRequest(successResult)

      const file = 'mock-backup-file'
      const data = { description: 'Test backup', version: '1.0' }
      const result = await uiBuilderAPI.uploadBackup(appId, containerName, file, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/backups/upload`,
          body: expect.any(Object),
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerCustomConfigs', () => {
    it('should make PUT request to update container custom configs', async () => {
      mockSuccessAPIRequest(successResult)

      const customConfigs = { theme: 'dark', layout: 'responsive', features: ['analytics'] }
      const result = await uiBuilderAPI.updateContainerCustomConfigs(appId, containerName, customConfigs)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/custom-configs`,
          body: JSON.stringify(customConfigs),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerDefaultI18n', () => {
    it('should make PUT request to update container default i18n', async () => {
      mockSuccessAPIRequest(successResult)

      const defaultI18n = 'en_US'
      const result = await uiBuilderAPI.updateContainerDefaultI18n(appId, containerName, defaultI18n)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/i18n`,
          body: JSON.stringify({ defaultI18n }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('saveContainerI18n', () => {
    it('should make PUT request to save container i18n dictionary', async () => {
      mockSuccessAPIRequest(successResult)

      const dictionaryName = 'en_US'
      const dictionaryObject = { hello: 'Hello', goodbye: 'Goodbye' }
      const result = await uiBuilderAPI.saveContainerI18n(appId, containerName, dictionaryName, dictionaryObject)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/i18n/dictionary/${dictionaryName}`,
          body: JSON.stringify(dictionaryObject),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteContainerI18n', () => {
    it('should make DELETE request to delete container i18n dictionary', async () => {
      mockSuccessAPIRequest(successResult)

      const dictionaryName = 'es_ES'
      const result = await uiBuilderAPI.deleteContainerI18n(appId, containerName, dictionaryName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/i18n/dictionary/${dictionaryName}`,
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

  describe('updateContainerI18nKey', () => {
    it('should make PUT request to update container i18n key', async () => {
      mockSuccessAPIRequest(successResult)

      const key = 'welcome_message'
      const changes = { en_US: 'Welcome!', es_ES: '¡Bienvenido!' }
      const result = await uiBuilderAPI.updateContainerI18nKey(appId, containerName, key, changes)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/i18n/key/${key}`,
          body: JSON.stringify(changes),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('renameContainerI18nKey', () => {
    it('should make PUT request to rename container i18n key', async () => {
      mockSuccessAPIRequest(successResult)

      const oldKeyName = 'old_key'
      const newKeyName = 'new_key'
      const result = await uiBuilderAPI.renameContainerI18nKey(appId, containerName, oldKeyName, newKeyName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/i18n/key/${oldKeyName}/rename?newKeyName=${newKeyName}`,
          body: undefined,
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteContainerI18nKeys', () => {
    it('should make DELETE request to delete container i18n keys', async () => {
      mockSuccessAPIRequest(successResult)

      const keys = ['key1', 'key2', 'key3']
      const result = await uiBuilderAPI.deleteContainerI18nKeys(appId, containerName, keys)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/i18n/key`,
          body: JSON.stringify(keys),
          method: 'DELETE',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('uploadContainerFavicon', () => {
    it('should make PUT request to upload container favicon', async () => {
      mockSuccessAPIRequest(successResult)

      const favicon = 'favicon-file-data'
      const result = await uiBuilderAPI.uploadContainerFavicon(appId, containerName, favicon)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/favicon`,
          body: expect.any(Object),
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('removeContainerFavicon', () => {
    it('should make DELETE request to remove container favicon', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.removeContainerFavicon(appId, containerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/favicon`,
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

  describe('updateContainerViewport', () => {
    it('should make PUT request to update container viewport', async () => {
      mockSuccessAPIRequest(successResult)

      const viewport = { width: 'device-width', initialScale: 1.0 }
      const result = await uiBuilderAPI.updateContainerViewport(appId, containerName, viewport)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/viewport`,
          body: JSON.stringify(viewport),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerMetaTags', () => {
    it('should make PUT request to update container meta tags', async () => {
      mockSuccessAPIRequest(successResult)

      const metaTags = [
        { name: 'description', content: 'My app description' },
        { name: 'keywords', content: 'app,mobile,web' }
      ]
      const result = await uiBuilderAPI.updateContainerMetaTags(appId, containerName, metaTags)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/meta-tags`,
          body: JSON.stringify(metaTags),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerCustomHeadContent', () => {
    it('should make PUT request to update container custom head content', async () => {
      mockSuccessAPIRequest(successResult)

      const data = '<script>console.log("Custom head content")</script>'
      const result = await uiBuilderAPI.updateContainerCustomHeadContent(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/custom-head-content`,
          body: JSON.stringify({ data }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerExternalLibraries', () => {
    it('should make PUT request to update container external libraries', async () => {
      mockSuccessAPIRequest(successResult)

      const externalLibraries = [
        { name: 'jquery', url: 'https://code.jquery.com/jquery-3.6.0.min.js' },
        { name: 'bootstrap', url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css' }
      ]
      const result = await uiBuilderAPI.updateContainerExternalLibraries(appId, containerName, externalLibraries)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/external-libraries`,
          body: JSON.stringify(externalLibraries),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerPWASettings', () => {
    it('should make PUT request to update container PWA settings', async () => {
      mockSuccessAPIRequest(successResult)

      const settings = {
        enabled: true,
        name: 'My PWA App',
        shortName: 'MyApp',
        description: 'Progressive Web App',
        themeColor: '#000000'
      }
      const result = await uiBuilderAPI.updateContainerPWASettings(appId, containerName, settings)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pwa/settings`,
          body: JSON.stringify(settings),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('updateContainerPWAIcon', () => {
    it('should make PUT request to update container PWA icon', async () => {
      mockSuccessAPIRequest(successResult)

      const file = 'pwa-icon-file-data'
      const result = await uiBuilderAPI.updateContainerPWAIcon(appId, containerName, file)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pwa/icon`,
          body: expect.any(Object),
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  // Page Logic Methods
  describe('updatePageLogic', () => {
    it('should make PUT request to update page logic', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { code: 'console.log("Page logic updated")', language: 'javascript' }
      const result = await uiBuilderAPI.updatePageLogic(appId, containerName, pageName, componentUid, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/logic/${componentUid}/`,
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

  describe('deletePageLogic', () => {
    it('should make DELETE request to delete page logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deletePageLogic(appId, containerName, pageName, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/logic/${componentUid}/${handlerName}`,
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

  describe('deletePageUnusedLogic', () => {
    it('should make DELETE request to delete page unused logic', async () => {
      mockSuccessAPIRequest(successResult)

      const componentUids = ['comp1', 'comp2', 'comp3']
      const result = await uiBuilderAPI.deletePageUnusedLogic(appId, containerName, pageName, componentUids)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/pages/${pageName}/unused-logic`,
          body: JSON.stringify({ componentUids }),
          method: 'DELETE',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  // Layout Logic Methods
  describe('updateLayoutUI', () => {
    it('should make PUT request to update layout UI', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { components: [], styles: {} }
      const result = await uiBuilderAPI.updateLayoutUI(appId, containerName, layoutId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/ui`,
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

  describe('getLayoutLogic', () => {
    it('should make GET request to get layout logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.getLayoutLogic(appId, containerName, layoutId, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/logic/${componentUid}/${handlerName}`,
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

  describe('updateLayoutLogic', () => {
    it('should make PUT request to update layout logic', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { code: 'console.log("Layout logic")', language: 'javascript' }
      const result = await uiBuilderAPI.updateLayoutLogic(appId, containerName, layoutId, componentUid, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/logic/${componentUid}/`,
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

  describe('createLayoutLogic', () => {
    it('should make POST request to create layout logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.createLayoutLogic(appId, containerName, layoutId, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/logic/${componentUid}/${handlerName}`,
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

  describe('deleteLayoutLogic', () => {
    it('should make DELETE request to delete layout logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteLayoutLogic(appId, containerName, layoutId, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/logic/${componentUid}/${handlerName}`,
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

  describe('deleteLayoutUnusedLogic', () => {
    it('should make DELETE request to delete layout unused logic', async () => {
      mockSuccessAPIRequest(successResult)

      const componentUids = ['comp1', 'comp2']
      const result = await uiBuilderAPI.deleteLayoutUnusedLogic(appId, containerName, layoutId, componentUids)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/layouts/${layoutId}/unused-logic`,
          body: JSON.stringify({ componentUids }),
          method: 'DELETE',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  // Reusable Component Methods
  describe('cloneReusableComponent', () => {
    it('should make POST request to clone reusable component', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { name: 'Cloned Component', description: 'A cloned component' }
      const result = await uiBuilderAPI.cloneReusableComponent(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/clone`,
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

  describe('upgradeReusableComponent', () => {
    it('should make POST request to upgrade reusable component', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { version: '2.0.0', changes: ['Updated styles', 'New features'] }
      const result = await uiBuilderAPI.upgradeReusableComponent(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/upgrade`,
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

  describe('updateReusableComponent', () => {
    it('should make PUT request to update reusable component', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { id: componentId, name: 'Updated Component', properties: {} }
      const result = await uiBuilderAPI.updateReusableComponent(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}`,
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

  describe('updateReusableComponentUI', () => {
    it('should make PUT request to update reusable component UI', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { ui: { elements: [], styles: {} } }
      const result = await uiBuilderAPI.updateReusableComponentUI(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/ui`,
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

  describe('getReusableComponentLogic', () => {
    it('should make GET request to get reusable component logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.getReusableComponentLogic(appId, containerName, componentId, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/logic/${componentUid}/${handlerName}`,
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

  describe('updateReusableComponentLogic', () => {
    it('should make PUT request to update reusable component logic', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { code: 'console.log("Reusable component logic")', language: 'javascript' }
      const result = await uiBuilderAPI.updateReusableComponentLogic(appId, containerName, componentId, componentUid, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/logic/${componentUid}/`,
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

  describe('createReusableComponentLogic', () => {
    it('should make POST request to create reusable component logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.createReusableComponentLogic(appId, containerName, componentId, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/logic/${componentUid}/${handlerName}`,
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

  describe('deleteReusableComponentLogic', () => {
    it('should make DELETE request to delete reusable component logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteReusableComponentLogic(appId, containerName, componentId, componentUid, handlerName)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/logic/${componentUid}/${handlerName}`,
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

  describe('deleteReusableComponentUnusedLogic', () => {
    it('should make DELETE request to delete reusable component unused logic', async () => {
      mockSuccessAPIRequest(successResult)

      const componentUids = ['comp1', 'comp2']
      const result = await uiBuilderAPI.deleteReusableComponentUnusedLogic(appId, containerName, componentId, componentUids)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/reusable/${componentId}/unused-logic`,
          body: JSON.stringify({ componentUids }),
          method: 'DELETE',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  // Custom Component Methods
  describe('cloneCustomComponent', () => {
    it('should make POST request to clone custom component', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { name: 'Cloned Custom Component', description: 'A cloned custom component' }
      const result = await uiBuilderAPI.cloneCustomComponent(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/clone`,
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

  describe('upgradeCustomComponent', () => {
    it('should make POST request to upgrade custom component', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { version: '2.0.0', improvements: ['Better performance', 'New API'] }
      const result = await uiBuilderAPI.upgradeCustomComponent(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/upgrade`,
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

  describe('loadCustomComponent', () => {
    it('should make GET request to load custom component', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadCustomComponent(appId, containerName, componentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}`,
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

  describe('updateCustomComponent', () => {
    it('should make PUT request to update custom component', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { id: componentId, name: 'Updated Custom Component', code: 'console.log("updated")' }
      const result = await uiBuilderAPI.updateCustomComponent(appId, containerName, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}`,
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

  describe('updateCustomComponentPreview', () => {
    it('should make PUT request to update custom component preview', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { previewHtml: '<div>Preview</div>', previewCss: '.preview { color: red; }' }
      const result = await uiBuilderAPI.updateCustomComponentPreview(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/preview`,
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

  describe('loadComponentFileContent', () => {
    it('should make GET request to load component file content', async () => {
      mockSuccessAPIRequest(successResult)

      const fileId = 'file-123'
      const result = await uiBuilderAPI.loadComponentFileContent(appId, containerName, componentId, fileId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/content/${fileId}`,
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

  describe('updateCustomComponentFiles', () => {
    it('should make PUT request to update custom component files', async () => {
      mockSuccessAPIRequest(successResult)

      const files = [
        { name: 'component.js', content: 'console.log("component")' },
        { name: 'styles.css', content: '.component { color: blue; }' }
      ]
      const result = await uiBuilderAPI.updateCustomComponentFiles(appId, containerName, componentId, files)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/content/`,
          body: JSON.stringify({ files }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('uploadCustomComponentFiles', () => {
    it('should make POST request to upload custom component files', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { files: ['file1', 'file2'], metadata: { version: '1.0' } }
      const result = await uiBuilderAPI.uploadCustomComponentFiles(appId, containerName, componentId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/files`,
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

  describe('getCustomComponentFileDownloadLink', () => {
    it('should make GET request to get custom component file download link', async () => {
      mockSuccessAPIRequest(successResult)

      const fileId = 'file-456'
      const result = await uiBuilderAPI.getCustomComponentFileDownloadLink(appId, containerName, componentId, fileId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/components/custom/${componentId}/files/sign?fileId=${fileId}`,
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

  // Container Function Methods
  describe('deleteContainerFunctionsPack', () => {
    it('should make DELETE request to delete container functions pack', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.deleteContainerFunctionsPack(appId, containerName, productId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions/remove-functions-pack/${productId}`,
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

  describe('loadContainerFunctionLogic', () => {
    it('should make GET request to load container function logic', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await uiBuilderAPI.loadContainerFunctionLogic(appId, containerName, functionId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions/${functionId}/logic`,
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

  describe('updateContainerFunctionLogic', () => {
    it('should make PUT request to update container function logic', async () => {
      mockSuccessAPIRequest(successResult)

      const data = { code: 'function myFunction() { return "updated"; }', language: 'javascript' }
      const result = await uiBuilderAPI.updateContainerFunctionLogic(appId, containerName, functionId, data)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/${appId}/console/ui-builder/containers/${containerName}/functions/${functionId}/logic`,
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
