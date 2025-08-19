describe('apiClient.marketplace', () => {
  let apiClient
  let marketplaceAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    marketplaceAPI = apiClient.marketplace
  })

  describe('getSections', () => {
    it('should make GET request to get sections', async () => {
      const sectionsResult = {
        sections: [
          { id: 'templates', name: 'Templates', description: 'Ready-to-use app templates' },
          { id: 'components', name: 'Components', description: 'Reusable UI components' },
          { id: 'plugins', name: 'Plugins', description: 'Backend functionality extensions' }
        ]
      }
      mockSuccessAPIRequest(sectionsResult)

      const result = await marketplaceAPI.getSections()

      expect(result).toEqual(sectionsResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/sections',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Marketplace service unavailable', 503)

      const error = await marketplaceAPI.getSections().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Marketplace service unavailable' },
        message: 'Marketplace service unavailable',
        status: 503
      })
    })
  })

  describe('getCategories', () => {
    it('should make GET request to get categories with query', async () => {
      const categoriesResult = {
        categories: [
          { id: 'web', name: 'Web Apps', count: 25 },
          { id: 'mobile', name: 'Mobile Apps', count: 18 }
        ]
      }
      mockSuccessAPIRequest(categoriesResult)

      const query = { section: 'templates', featured: true }
      const result = await marketplaceAPI.getCategories(query)

      expect(result).toEqual(categoriesResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/categories?section=templates&featured=true',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty query', async () => {
      mockSuccessAPIRequest({ categories: [] })

      const result = await marketplaceAPI.getCategories()

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/categories',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getCategoryProducts', () => {
    it('should make GET request to get category products', async () => {
      const productsResult = {
        products: [
          { id: 'ecommerce-template', name: 'E-commerce Template', price: 49.99 },
          { id: 'blog-template', name: 'Blog Template', price: 29.99 }
        ]
      }
      mockSuccessAPIRequest(productsResult)

      const categoryId = 'web-templates'
      const result = await marketplaceAPI.getCategoryProducts(categoryId)

      expect(result).toEqual(productsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/categories/${categoryId}/products`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getProducts', () => {
    it('should make GET request to get products with query', async () => {
      const productsResult = {
        products: [
          {
            id: 'chat-plugin',
            name: 'Real-time Chat Plugin',
            category: 'plugins',
            price: 39.99,
            rating: 4.5,
            downloads: 1250
          }
        ],
        totalCount: 1,
        pageSize: 10,
        offset: 0
      }
      mockSuccessAPIRequest(productsResult)

      const query = { category: 'plugins', search: 'chat', limit: 10 }
      const result = await marketplaceAPI.getProducts(query)

      expect(result).toEqual(productsResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/products?category=plugins&search=chat&limit=10',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getProduct', () => {
    it('should make GET request to get product details', async () => {
      const productResult = {
        product: {
          id: 'ecommerce-template',
          name: 'Advanced E-commerce Template',
          description: 'Complete e-commerce solution with payment integration',
          price: 99.99,
          version: '2.1.0',
          author: 'Backendless Team',
          features: ['Shopping Cart', 'Payment Gateway', 'Inventory Management'],
          screenshots: ['screenshot1.png', 'screenshot2.png']
        }
      }
      mockSuccessAPIRequest(productResult)

      const productId = 'ecommerce-template'
      const result = await marketplaceAPI.getProduct(productId)

      expect(result).toEqual(productResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getProductVersions', () => {
    it('should make GET request to get product versions', async () => {
      const versionsResult = {
        versions: [
          { version: '2.1.0', releaseDate: '2024-01-15', changelog: 'Bug fixes and improvements' },
          { version: '2.0.0', releaseDate: '2024-01-01', changelog: 'Major update with new features' }
        ]
      }
      mockSuccessAPIRequest(versionsResult)

      const productId = 'ecommerce-template'
      const query = { includePrerelease: false }
      const result = await marketplaceAPI.getProductVersions(productId, query)

      expect(result).toEqual(versionsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/versions?includePrerelease=false`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getProductConfigurations', () => {
    it('should make GET request to get product configurations with version query', async () => {
      const configurationsResult = {
        configurations: [
          { key: 'database.host', value: 'localhost', type: 'string' },
          { key: 'database.port', value: '5432', type: 'number' },
          { key: 'features.analytics', value: 'true', type: 'boolean' }
        ],
        version: '2.1.0'
      }
      mockSuccessAPIRequest(configurationsResult)

      const productId = 'ecommerce-template'
      const version = '2.1.0'
      const result = await marketplaceAPI.getProductConfigurations(productId, version)

      expect(result).toEqual(configurationsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/configurations?version=${version}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Product configuration not found', 404)

      const productId = 'invalid-product'
      const version = '1.0.0'
      const error = await marketplaceAPI.getProductConfigurations(productId, version).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Product configuration not found' },
        message: 'Product configuration not found',
        status: 404
      })
    })
  })

  describe('getProductPrivateDevs', () => {
    it('should make GET request to get product private devs using req.community', async () => {
      const privateDevsResult = {
        privateDevs: [
          { userId: 'dev-123', email: 'dev1@example.com', role: 'owner' },
          { userId: 'dev-456', email: 'dev2@example.com', role: 'collaborator' }
        ],
        count: 2
      }
      mockSuccessAPIRequest(privateDevsResult)

      const productId = 'premium-plugin'
      const result = await marketplaceAPI.getProductPrivateDevs(productId)

      expect(result).toEqual(privateDevsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/private-devs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to private developers list', 403)

      const productId = 'restricted-plugin'
      const error = await marketplaceAPI.getProductPrivateDevs(productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to private developers list' },
        message: 'Access denied to private developers list',
        status: 403
      })
    })
  })

  describe('updateProductPrivateDevs', () => {
    it('should make PUT request to update product private devs using req.community', async () => {
      const updateResult = {
        success: true,
        updatedCount: 3,
        message: 'Private developers list updated successfully'
      }
      mockSuccessAPIRequest(updateResult)

      const productId = 'premium-plugin'
      const privateDevs = [
        { userId: 'dev-123', email: 'dev1@example.com', role: 'owner' },
        { userId: 'dev-456', email: 'dev2@example.com', role: 'collaborator' },
        { userId: 'dev-789', email: 'dev3@example.com', role: 'viewer' }
      ]

      const result = await marketplaceAPI.updateProductPrivateDevs(productId, privateDevs)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/private-devs`,
        body: JSON.stringify(privateDevs),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid user ID in private developers list', 400)

      const productId = 'premium-plugin'
      const privateDevs = [
        { userId: 'invalid-user', email: 'invalid@example.com', role: 'owner' }
      ]
      const error = await marketplaceAPI.updateProductPrivateDevs(productId, privateDevs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid user ID in private developers list' },
        message: 'Invalid user ID in private developers list',
        status: 400
      })
    })
  })

  describe('getProductResources', () => {
    it('should make GET request to get product resources', async () => {
      mockSuccessAPIRequest('binary-file-content')

      const productId = 'template-123'
      const options = { versionId: 'v2.1.0', filePath: 'assets/images/logo.png' }
      const result = await marketplaceAPI.getProductResources(productId, options)

      expect(result).toEqual('binary-file-content')
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/resources?versionId=v2.1.0&filePath=assets%252Fimages%252Flogo.png`,
        body: undefined,
        method: 'GET',
        encoding: null,
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle resources without file path', async () => {
      mockSuccessAPIRequest('resource-list')

      const productId = 'template-123'
      const options = { versionId: 'v1.0.0' }
      const result = await marketplaceAPI.getProductResources(productId, options)

      expect(result).toEqual('resource-list')
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/resources?versionId=v1.0.0`,
        body: undefined,
        method: 'GET',
        encoding: null,
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getProductResourcesDetails', () => {
    it('should make GET request to get product resources details', async () => {
      const detailsResult = {
        resources: [
          { name: 'index.html', size: 2048, type: 'text/html' },
          { name: 'style.css', size: 1024, type: 'text/css' },
          { name: 'script.js', size: 4096, type: 'application/javascript' }
        ],
        totalSize: 7168
      }
      mockSuccessAPIRequest(detailsResult)

      const productId = 'template-456'
      const versionId = 'v1.5.0'
      const result = await marketplaceAPI.getProductResourcesDetails(productId, versionId)

      expect(result).toEqual(detailsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/resources/details?versionId=${versionId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('publishProduct', () => {
    it('should make POST request to publish product', async () => {
      const publishResult = {
        productId: 'new-plugin-789',
        status: 'pending-review',
        message: 'Product submitted for review'
      }
      mockSuccessAPIRequest(publishResult)

      const product = {
        name: 'Custom Authentication Plugin',
        description: 'Advanced authentication plugin with social media integration',
        category: 'plugins',
        price: 59.99,
        version: '1.0.0',
        files: [
          { name: 'plugin.js', content: '/* plugin code */' },
          { name: 'README.md', content: '# Plugin Documentation' }
        ],
        metadata: {
          author: 'Developer Name',
          license: 'MIT',
          dependencies: ['@backendless/js-sdk'],
          tags: ['authentication', 'social', 'oauth']
        }
      }

      const result = await marketplaceAPI.publishProduct(product)

      expect(result).toEqual(publishResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/products',
        body: JSON.stringify(product),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('approveProduct', () => {
    it('should make PUT request to approve product', async () => {
      const approveResult = {
        productId: 'pending-product-123',
        status: 'approved',
        approvedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(approveResult)

      const productId = 'pending-product-123'
      const result = await marketplaceAPI.approveProduct(productId)

      expect(result).toEqual(approveResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/approve`,
        body: undefined,
        method: 'PUT',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('rejectProduct', () => {
    it('should make PUT request to reject product with reason', async () => {
      const rejectResult = {
        productId: 'rejected-product-456',
        status: 'rejected',
        rejectedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(rejectResult)

      const productId = 'rejected-product-456'
      const reason = {
        category: 'quality-issues',
        message: 'Code quality does not meet marketplace standards',
        details: ['Missing error handling', 'Poor documentation', 'Security vulnerabilities']
      }

      const result = await marketplaceAPI.rejectProduct(productId, reason)

      expect(result).toEqual(rejectResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}/reject`,
        body: JSON.stringify(reason),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('removeProduct', () => {
    it('should make DELETE request to remove product', async () => {
      const removeResult = {
        success: true,
        removedProductId: 'old-product-789',
        message: 'Product removed successfully'
      }
      mockSuccessAPIRequest(removeResult)

      const productId = 'old-product-789'
      const reason = {
        type: 'developer-request',
        message: 'Product no longer maintained'
      }

      const result = await marketplaceAPI.removeProduct(productId, reason)

      expect(result).toEqual(removeResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/products/${productId}`,
        body: JSON.stringify(reason),
        method: 'DELETE',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getAppPurchases', () => {
    it('should make GET request to get app purchases', async () => {
      const purchasesResult = {
        purchases: [
          {
            productId: 'ecommerce-template',
            purchaseDate: '2024-01-10T09:00:00Z',
            version: '2.1.0',
            price: 99.99,
            status: 'active'
          },
          {
            productId: 'chat-plugin',
            purchaseDate: '2024-01-05T14:30:00Z',
            version: '1.2.0',
            price: 39.99,
            status: 'active'
          }
        ],
        totalSpent: 139.98
      }
      mockSuccessAPIRequest(purchasesResult)

      const result = await marketplaceAPI.getAppPurchases(appId)

      expect(result).toEqual(purchasesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/community/marketplace/app-purchases`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('allocateAppProduct', () => {
    it('should make POST request to allocate app product', async () => {
      const allocationResult = {
        success: true,
        allocationId: 'alloc-123',
        productId: 'premium-template',
        appId: appId,
        allocatedAt: '2024-01-15T15:00:00Z'
      }
      mockSuccessAPIRequest(allocationResult)

      const productId = 'premium-template'
      const options = {
        version: '3.0.0',
        licenseType: 'single-app',
        paymentMethod: 'credit-card'
      }

      const result = await marketplaceAPI.allocateAppProduct(appId, productId, options)

      expect(result).toEqual(allocationResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/community/marketplace/app-purchases/${productId}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('isAppProductPurchased', () => {
    it('should make GET request to check if app product is purchased', async () => {
      const existsResult = {
        exists: true,
        purchaseDate: '2024-01-10T09:00:00Z',
        version: '2.1.0',
        status: 'active'
      }
      mockSuccessAPIRequest(existsResult)

      const productId = 'ecommerce-template'
      const result = await marketplaceAPI.isAppProductPurchased(appId, productId)

      expect(result).toEqual(existsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/community/marketplace/app-purchases/${productId}/exists`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getAppInstalls', () => {
    it('should make GET request to get app installs', async () => {
      const installsResult = {
        installs: [
          {
            productId: 'analytics-plugin',
            installDate: '2024-01-12T11:00:00Z',
            version: '1.5.0',
            status: 'installed'
          }
        ]
      }
      mockSuccessAPIRequest(installsResult)

      const result = await marketplaceAPI.getAppInstalls(appId)

      expect(result).toEqual(installsResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/marketplace/installs`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getInstallsDetails', () => {
    it('should make GET request to get installs details', async () => {
      const detailsResult = {
        details: [
          {
            productId: 'plugin-1',
            name: 'Analytics Plugin',
            version: '1.5.0',
            size: '2.5MB',
            dependencies: ['plugin-common']
          },
          {
            productId: 'plugin-2',
            name: 'Security Plugin',
            version: '2.0.0',
            size: '1.8MB',
            dependencies: []
          }
        ]
      }
      mockSuccessAPIRequest(detailsResult)

      const productIds = ['plugin-1', 'plugin-2']
      const result = await marketplaceAPI.getInstallsDetails(productIds)

      expect(result).toEqual(detailsResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/installs/details?productIds=plugin-1&productIds=plugin-2',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('installProductDependencies', () => {
    it('should make POST request to install product dependencies', async () => {
      const installResult = {
        success: true,
        installedDependencies: ['dependency-1', 'dependency-2'],
        installationId: 'install-456'
      }
      mockSuccessAPIRequest(installResult)

      const data = {
        productId: 'complex-plugin',
        version: '2.1.0',
        dependencies: [
          { id: 'dependency-1', version: '1.0.0' },
          { id: 'dependency-2', version: '2.3.1' }
        ],
        installOptions: {
          overwriteExisting: false,
          createBackup: true
        }
      }

      const result = await marketplaceAPI.installProductDependencies(appId, data)

      expect(result).toEqual(installResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/marketplace/product-dependencies/install`,
        body: JSON.stringify(data),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getSubmissions', () => {
    it('should make GET request to get submissions', async () => {
      const submissionsResult = {
        submissions: [
          {
            id: 'submission-123',
            productName: 'New Plugin',
            status: 'pending',
            submittedAt: '2024-01-14T10:00:00Z'
          }
        ]
      }
      mockSuccessAPIRequest(submissionsResult)

      const result = await marketplaceAPI.getSubmissions()

      expect(result).toEqual(submissionsResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/submissions',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getAccountPurchases', () => {
    it('should make GET request to get account purchases', async () => {
      const accountPurchasesResult = {
        purchases: [
          {
            productId: 'premium-plan',
            purchaseDate: '2024-01-01T00:00:00Z',
            renewalDate: '2024-02-01T00:00:00Z',
            price: 29.99,
            status: 'active'
          }
        ]
      }
      mockSuccessAPIRequest(accountPurchasesResult)

      const result = await marketplaceAPI.getAccountPurchases()

      expect(result).toEqual(accountPurchasesResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/account-purchases',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('allocateAccountProduct', () => {
    it('should make POST request to allocate account product with options', async () => {
      const allocationResult = {
        success: true,
        allocationId: 'account-alloc-456',
        productId: 'enterprise-plan',
        allocatedAt: '2024-01-15T16:00:00Z',
        status: 'active'
      }
      mockSuccessAPIRequest(allocationResult)

      const productId = 'enterprise-plan'
      const options = {
        billingCycle: 'annual',
        paymentMethod: 'credit-card',
        couponCode: 'ENTERPRISE20',
        autoRenew: true
      }

      const result = await marketplaceAPI.allocateAccountProduct(productId, options)

      expect(result).toEqual(allocationResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/account-purchases/${productId}`,
        body: JSON.stringify(options),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with payment error', async () => {
      mockFailedAPIRequest('Payment method declined', 402)

      const productId = 'premium-plan'
      const options = { paymentMethod: 'invalid-card' }
      const error = await marketplaceAPI.allocateAccountProduct(productId, options).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Payment method declined' },
        message: 'Payment method declined',
        status: 402
      })
    })
  })

  describe('updateAccountPurchasesPaymentProfile', () => {
    it('should make PUT request to update payment profile with paymentProfileId in body', async () => {
      const updateResult = {
        success: true,
        message: 'Payment profile updated successfully',
        updatedAt: '2024-01-15T17:00:00Z'
      }
      mockSuccessAPIRequest(updateResult)

      const paymentProfileId = 'payment-profile-789'
      const result = await marketplaceAPI.updateAccountPurchasesPaymentProfile(paymentProfileId)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/account-purchases/update-payment-profile',
        body: JSON.stringify({ paymentProfileId }),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with invalid payment profile error', async () => {
      mockFailedAPIRequest('Invalid payment profile ID', 400)

      const paymentProfileId = 'invalid-profile'
      const error = await marketplaceAPI.updateAccountPurchasesPaymentProfile(paymentProfileId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid payment profile ID' },
        message: 'Invalid payment profile ID',
        status: 400
      })
    })
  })

  describe('reactivateAccountPurchase', () => {
    it('should make POST request to reactivate account purchase', async () => {
      const reactivationResult = {
        success: true,
        productId: 'premium-plan',
        reactivatedAt: '2024-01-15T18:00:00Z',
        newExpirationDate: '2024-02-15T18:00:00Z',
        status: 'active'
      }
      mockSuccessAPIRequest(reactivationResult)

      const productId = 'premium-plan'
      const result = await marketplaceAPI.reactivateAccountPurchase(productId)

      expect(result).toEqual(reactivationResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/console/community/marketplace/account-purchases/${productId}/renew`,
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with subscription not found error', async () => {
      mockFailedAPIRequest('Subscription not found or already active', 404)

      const productId = 'nonexistent-plan'
      const error = await marketplaceAPI.reactivateAccountPurchase(productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Subscription not found or already active' },
        message: 'Subscription not found or already active',
        status: 404
      })
    })
  })

  describe('getDeveloperPayoutHistory', () => {
    it('should make GET request to get developer payout history', async () => {
      const payoutResult = {
        payouts: [
          {
            id: 'payout-123',
            amount: 245.67,
            date: '2024-01-01T00:00:00Z',
            status: 'completed',
            products: ['product-1', 'product-2']
          }
        ],
        totalEarnings: 1234.56
      }
      mockSuccessAPIRequest(payoutResult)

      const result = await marketplaceAPI.getDeveloperPayoutHistory()

      expect(result).toEqual(payoutResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/developer-sales/payouts',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })

  describe('getDeveloperProductSales', () => {
    it('should make GET request to get developer product sales', async () => {
      const productSalesResult = {
        sales: [
          {
            productId: 'ecommerce-template',
            productName: 'E-commerce Template',
            totalSales: 1599.93,
            totalUnits: 16,
            averagePrice: 99.99,
            lastSaleDate: '2024-01-14T15:30:00Z',
            revenue: {
              monthly: 899.91,
              yearly: 1599.93
            }
          },
          {
            productId: 'chat-plugin',
            productName: 'Real-time Chat Plugin',
            totalSales: 799.75,
            totalUnits: 20,
            averagePrice: 39.99,
            lastSaleDate: '2024-01-13T09:45:00Z',
            revenue: {
              monthly: 479.88,
              yearly: 799.75
            }
          }
        ],
        totalRevenue: 2399.68,
        totalUnits: 36,
        reportPeriod: 'all-time'
      }
      mockSuccessAPIRequest(productSalesResult)

      const result = await marketplaceAPI.getDeveloperProductSales()

      expect(result).toEqual(productSalesResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/developer-sales/product-sales',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to developer sales data', 403)

      const error = await marketplaceAPI.getDeveloperProductSales().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to developer sales data' },
        message: 'Access denied to developer sales data',
        status: 403
      })
    })
  })

  describe('getDeveloperGeneralSales', () => {
    it('should make GET request to get developer general sales with query', async () => {
      const salesResult = {
        sales: [
          {
            date: '2024-01-15',
            totalSales: 399.95,
            transactionCount: 5,
            products: {
              'template-1': { sales: 199.95, count: 2 },
              'plugin-1': { sales: 199.95, count: 3 }
            }
          }
        ],
        period: 'monthly',
        totalRevenue: 399.95
      }
      mockSuccessAPIRequest(salesResult)

      const query = { period: 'monthly', year: 2024, month: 1 }
      const result = await marketplaceAPI.getDeveloperGeneralSales(query)

      expect(result).toEqual(salesResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/marketplace/developer-sales/general-sales?period=monthly&year=2024&month=1',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
