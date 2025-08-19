describe('apiClient.pdf', () => {
  let apiClient
  let pdfAPI

  const appId = 'test-app-id'
  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    pdfAPI = apiClient.pdf
  })

  describe('generatePDF', () => {
    it('should make POST request to generate PDF', async () => {
      const pdfResult = {
        url: 'https://storage.example.com/pdfs/generated-report-123.pdf',
        fileSize: 245680,
        pages: 3,
        generatedAt: '2024-01-15T12:00:00Z',
        expiresAt: '2024-01-16T12:00:00Z'
      }
      mockSuccessAPIRequest(pdfResult)

      const pdf = {
        templateId: 'invoice-template',
        format: 'A4',
        orientation: 'portrait'
      }
      const inputs = {
        customerName: 'John Doe',
        items: [
          { name: 'Product A', quantity: 2, price: 25.99 },
          { name: 'Product B', quantity: 1, price: 45.50 }
        ],
        total: 97.48,
        dueDate: '2024-02-15'
      }

      const result = await pdfAPI.generatePDF(appId, pdf, inputs)

      expect(result).toEqual(pdfResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/api/app/${appId}/pdf/generate`,
        body: JSON.stringify({ pdf, inputs }),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex PDF generation with custom styling', async () => {
      const pdfResult = {
        url: 'https://storage.example.com/pdfs/report-456.pdf',
        fileSize: 1024000,
        pages: 8,
        metadata: {
          title: 'Monthly Sales Report',
          author: 'Backendless App',
          subject: 'Sales Analytics'
        }
      }
      mockSuccessAPIRequest(pdfResult)

      const pdf = {
        templateId: 'sales-report-template',
        format: 'A4',
        orientation: 'landscape',
        margins: {
          top: 20,
          right: 15,
          bottom: 20,
          left: 15
        },
        styling: {
          primaryColor: '#2563eb',
          secondaryColor: '#64748b',
          fontFamily: 'Inter',
          fontSize: 12
        },
        options: {
          includeHeader: true,
          includeFooter: true,
          watermark: 'CONFIDENTIAL',
          compression: 'medium'
        }
      }
      const inputs = {
        reportTitle: 'Q4 2024 Sales Report',
        dateRange: {
          start: '2024-10-01',
          end: '2024-12-31'
        },
        summary: {
          totalRevenue: 485650.25,
          totalOrders: 1247,
          averageOrderValue: 389.45
        },
        chartData: {
          monthlySales: [
            { month: 'Oct', revenue: 145230 },
            { month: 'Nov', revenue: 167890 },
            { month: 'Dec', revenue: 172530 }
          ],
          topProducts: [
            { name: 'Premium Package', sales: 89 },
            { name: 'Standard Package', sales: 156 },
            { name: 'Basic Package', sales: 203 }
          ]
        },
        tables: [
          {
            title: 'Regional Performance',
            headers: ['Region', 'Revenue', 'Orders', 'Growth'],
            rows: [
              ['North America', '$285,640', '742', '+12.3%'],
              ['Europe', '$156,890', '389', '+8.7%'],
              ['Asia Pacific', '$43,120', '116', '+15.2%']
            ]
          }
        ]
      }

      const result = await pdfAPI.generatePDF(appId, pdf, inputs)

      expect(result).toEqual(pdfResult)
    })

    it('should handle simple PDF generation with minimal inputs', async () => {
      const pdfResult = {
        url: 'https://storage.example.com/pdfs/simple-doc.pdf',
        fileSize: 12450,
        pages: 1
      }
      mockSuccessAPIRequest(pdfResult)

      const pdf = { templateId: 'simple-template' }
      const inputs = {
        title: 'Simple Document',
        content: 'This is a basic PDF document.'
      }

      const result = await pdfAPI.generatePDF(appId, pdf, inputs)

      expect(result).toEqual(pdfResult)
    })

    it('should handle PDF generation without template', async () => {
      const pdfResult = {
        url: 'https://storage.example.com/pdfs/dynamic-doc.pdf',
        fileSize: 45680,
        pages: 2
      }
      mockSuccessAPIRequest(pdfResult)

      const pdf = {
        content: '<html><body><h1>Dynamic PDF</h1><p>Generated content</p></body></html>',
        format: 'Letter',
        orientation: 'portrait'
      }
      const inputs = {}

      const result = await pdfAPI.generatePDF(appId, pdf, inputs)

      expect(result).toEqual(pdfResult)
    })

    it('fails when server responds with template not found error', async () => {
      mockFailedAPIRequest('PDF template not found', 404)

      const pdf = { templateId: 'nonexistent-template' }
      const inputs = {}
      const error = await pdfAPI.generatePDF(appId, pdf, inputs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'PDF template not found' },
        message: 'PDF template not found',
        status: 404
      })
    })

    it('fails when server responds with invalid input data error', async () => {
      mockFailedAPIRequest('Invalid input data for PDF generation', 400)

      const pdf = { templateId: 'invoice-template' }
      const inputs = { invalidField: 'value' }
      const error = await pdfAPI.generatePDF(appId, pdf, inputs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid input data for PDF generation' },
        message: 'Invalid input data for PDF generation',
        status: 400
      })
    })

    it('fails when server responds with generation timeout error', async () => {
      mockFailedAPIRequest('PDF generation timeout', 408)

      const pdf = { templateId: 'complex-template' }
      const inputs = { largeDataSet: new Array(10000).fill('data') }
      const error = await pdfAPI.generatePDF(appId, pdf, inputs).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'PDF generation timeout' },
        message: 'PDF generation timeout',
        status: 408
      })
    })
  })

  describe('listTemplates', () => {
    it('should make GET request to list templates', async () => {
      const templatesResult = {
        templates: [
          {
            id: 'invoice-template',
            name: 'Invoice Template',
            description: 'Standard invoice template with company branding',
            category: 'invoicing',
            format: 'A4',
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-12T14:30:00Z'
          },
          {
            id: 'report-template',
            name: 'Monthly Report',
            description: 'Comprehensive monthly business report template',
            category: 'reporting',
            format: 'Letter',
            createdAt: '2024-01-08T11:15:00Z',
            updatedAt: '2024-01-10T16:45:00Z'
          }
        ],
        totalCount: 2,
        categories: ['invoicing', 'reporting', 'certificates', 'contracts']
      }
      mockSuccessAPIRequest(templatesResult)

      const result = await pdfAPI.listTemplates(appId)

      expect(result).toEqual(templatesResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/pdf`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty templates list', async () => {
      const templatesResult = {
        templates: [],
        totalCount: 0,
        message: 'No PDF templates found for this application'
      }
      mockSuccessAPIRequest(templatesResult)

      const result = await pdfAPI.listTemplates(appId)

      expect(result).toEqual(templatesResult)
    })

    it('should handle comprehensive templates with metadata', async () => {
      const templatesResult = {
        templates: [
          {
            id: 'advanced-invoice',
            name: 'Advanced Invoice Template',
            description: 'Professional invoice with tax calculations and multiple currencies',
            category: 'invoicing',
            tags: ['professional', 'multi-currency', 'tax-ready'],
            format: 'A4',
            orientation: 'portrait',
            variables: [
              { name: 'customerName', type: 'string', required: true },
              { name: 'items', type: 'array', required: true },
              { name: 'taxRate', type: 'number', required: false, default: 0.1 }
            ],
            preview: {
              thumbnail: 'https://storage.example.com/thumbnails/invoice-preview.png',
              samplePdf: 'https://storage.example.com/samples/invoice-sample.pdf'
            },
            usage: {
              timesUsed: 45,
              lastUsed: '2024-01-14T10:30:00Z'
            },
            version: '2.1',
            author: 'Template Designer',
            isPublic: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-14T08:20:00Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1
        },
        statistics: {
          totalTemplates: 1,
          mostUsedCategory: 'invoicing',
          recentlyCreated: 0,
          recentlyUpdated: 1
        }
      }
      mockSuccessAPIRequest(templatesResult)

      const result = await pdfAPI.listTemplates(appId)

      expect(result).toEqual(templatesResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized access to PDF templates', 401)

      const error = await pdfAPI.listTemplates(appId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized access to PDF templates' },
        message: 'Unauthorized access to PDF templates',
        status: 401
      })
    })

    it('fails when server responds with app not found error', async () => {
      mockFailedAPIRequest('Application not found', 404)

      const error = await pdfAPI.listTemplates('nonexistent-app').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Application not found' },
        message: 'Application not found',
        status: 404
      })
    })
  })

  describe('loadTemplate', () => {
    it('should make GET request to load template', async () => {
      const templateResult = {
        id: 'invoice-template',
        name: 'Professional Invoice',
        description: 'A comprehensive invoice template with modern design',
        content: '<!DOCTYPE html><html><head><title>Invoice</title></head><body>...</body></html>',
        variables: [
          {
            name: 'customerName',
            type: 'string',
            required: true,
            description: 'Customer or client name'
          },
          {
            name: 'invoiceNumber',
            type: 'string',
            required: true,
            description: 'Unique invoice identifier'
          },
          {
            name: 'items',
            type: 'array',
            required: true,
            description: 'List of invoice items',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'number' }
              }
            }
          }
        ],
        styling: {
          primaryColor: '#2563eb',
          secondaryColor: '#64748b',
          fontFamily: 'Inter',
          headerHeight: 80,
          footerHeight: 60
        },
        layout: {
          format: 'A4',
          orientation: 'portrait',
          margins: { top: 20, right: 15, bottom: 20, left: 15 }
        },
        version: '1.2',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
      mockSuccessAPIRequest(templateResult)

      const templateId = 'invoice-template'
      const result = await pdfAPI.loadTemplate(appId, templateId)

      expect(result).toEqual(templateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/pdf/${templateId}`,
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle simple template structure', async () => {
      const templateResult = {
        id: 'simple-template',
        name: 'Simple Document',
        content: '<html><body><h1>{{title}}</h1><p>{{content}}</p></body></html>',
        variables: [
          { name: 'title', type: 'string', required: true },
          { name: 'content', type: 'string', required: false }
        ]
      }
      mockSuccessAPIRequest(templateResult)

      const templateId = 'simple-template'
      const result = await pdfAPI.loadTemplate(appId, templateId)

      expect(result).toEqual(templateResult)
    })

    it('should handle template with complex nested variables', async () => {
      const templateResult = {
        id: 'report-template',
        name: 'Business Report Template',
        content: '<!-- Complex HTML template -->',
        variables: [
          {
            name: 'company',
            type: 'object',
            required: true,
            properties: {
              name: { type: 'string', required: true },
              address: { type: 'string', required: false },
              logo: { type: 'string', format: 'url', required: false }
            }
          },
          {
            name: 'reportData',
            type: 'object',
            required: true,
            properties: {
              period: { type: 'string', required: true },
              metrics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    value: { type: 'number' },
                    unit: { type: 'string' },
                    trend: { type: 'string', enum: ['up', 'down', 'stable'] }
                  }
                }
              }
            }
          }
        ],
        conditionalBlocks: [
          {
            condition: 'company.logo',
            content: '<img src="{{company.logo}}" alt="Company Logo">'
          }
        ]
      }
      mockSuccessAPIRequest(templateResult)

      const templateId = 'report-template'
      const result = await pdfAPI.loadTemplate(appId, templateId)

      expect(result).toEqual(templateResult)
    })

    it('fails when server responds with template not found error', async () => {
      mockFailedAPIRequest('PDF template not found', 404)

      const templateId = 'nonexistent-template'
      const error = await pdfAPI.loadTemplate(appId, templateId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'PDF template not found' },
        message: 'PDF template not found',
        status: 404
      })
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to template', 403)

      const templateId = 'private-template'
      const error = await pdfAPI.loadTemplate(appId, templateId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to template' },
        message: 'Access denied to template',
        status: 403
      })
    })
  })

  describe('createTemplate', () => {
    it('should make POST request to create template', async () => {
      const createResult = {
        id: 'new-template-123',
        name: 'Custom Invoice Template',
        message: 'Template created successfully',
        createdAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(createResult)

      const template = {
        name: 'Custom Invoice Template',
        description: 'A customized invoice template for our business',
        content: '<!DOCTYPE html><html><head><title>{{invoiceTitle}}</title></head><body><h1>Invoice #{{invoiceNumber}}</h1></body></html>',
        variables: [
          { name: 'invoiceTitle', type: 'string', required: true },
          { name: 'invoiceNumber', type: 'string', required: true }
        ],
        category: 'invoicing',
        format: 'A4',
        orientation: 'portrait'
      }

      const result = await pdfAPI.createTemplate(appId, template)

      expect(result).toEqual(createResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/pdf`,
        body: JSON.stringify(template),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex template creation', async () => {
      const createResult = { id: 'complex-template-456', success: true }
      mockSuccessAPIRequest(createResult)

      const template = {
        name: 'Advanced Report Template',
        description: 'Comprehensive business report with charts and tables',
        content: '<!-- Complex HTML with CSS and JavaScript -->',
        variables: [
          {
            name: 'reportConfig',
            type: 'object',
            required: true,
            properties: {
              title: { type: 'string' },
              subtitle: { type: 'string' },
              dateRange: {
                type: 'object',
                properties: {
                  start: { type: 'string', format: 'date' },
                  end: { type: 'string', format: 'date' }
                }
              }
            }
          }
        ],
        styling: {
          primaryColor: '#1f2937',
          accentColor: '#3b82f6',
          fonts: {
            heading: 'Roboto Slab',
            body: 'Source Sans Pro'
          }
        },
        layout: {
          format: 'A4',
          orientation: 'landscape',
          margins: { top: 25, right: 20, bottom: 25, left: 20 }
        },
        features: {
          includeCharts: true,
          includeTables: true,
          includeWatermark: false,
          compression: 'high'
        },
        tags: ['business', 'report', 'analytics', 'professional']
      }

      const result = await pdfAPI.createTemplate(appId, template)

      expect(result).toEqual(createResult)
    })

    it('should handle minimal template creation', async () => {
      const createResult = { id: 'simple-template-789', success: true }
      mockSuccessAPIRequest(createResult)

      const template = {
        name: 'Simple Template',
        content: '<html><body><h1>{{title}}</h1></body></html>'
      }

      const result = await pdfAPI.createTemplate(appId, template)

      expect(result).toEqual(createResult)
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Template validation failed', 400)

      const template = { name: 'Invalid Template' } // Missing required content
      const error = await pdfAPI.createTemplate(appId, template).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template validation failed' },
        message: 'Template validation failed',
        status: 400
      })
    })

    it('fails when server responds with template name exists error', async () => {
      mockFailedAPIRequest('Template with this name already exists', 409)

      const template = { name: 'Existing Template', content: '<html></html>' }
      const error = await pdfAPI.createTemplate(appId, template).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template with this name already exists' },
        message: 'Template with this name already exists',
        status: 409
      })
    })
  })

  describe('updateTemplate', () => {
    it('should make PUT request to update template', async () => {
      const updateResult = {
        id: 'invoice-template',
        name: 'Updated Invoice Template',
        message: 'Template updated successfully',
        updatedAt: '2024-01-15T12:00:00Z',
        version: '1.3'
      }
      mockSuccessAPIRequest(updateResult)

      const template = {
        id: 'invoice-template',
        name: 'Updated Invoice Template',
        description: 'Updated version with new styling',
        content: '<!DOCTYPE html><html><head><title>Invoice</title><style>/* Updated CSS */</style></head><body>Updated content</body></html>',
        variables: [
          { name: 'customerName', type: 'string', required: true },
          { name: 'newField', type: 'string', required: false }
        ]
      }

      const result = await pdfAPI.updateTemplate(appId, template)

      expect(result).toEqual(updateResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/pdf/${template.id}`,
        body: JSON.stringify(template),
        method: 'PUT',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle partial template updates', async () => {
      const updateResult = { success: true, updated: ['description', 'styling'] }
      mockSuccessAPIRequest(updateResult)

      const template = {
        id: 'report-template',
        description: 'Updated description',
        styling: {
          primaryColor: '#059669'
        }
      }

      const result = await pdfAPI.updateTemplate(appId, template)

      expect(result).toEqual(updateResult)
    })

    it('fails when server responds with template not found error', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const template = { id: 'nonexistent-template', name: 'Updated Name' }
      const error = await pdfAPI.updateTemplate(appId, template).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Template update validation failed', 422)

      const template = { id: 'template-123', content: 'invalid {{unclosed_variable' }
      const error = await pdfAPI.updateTemplate(appId, template).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template update validation failed' },
        message: 'Template update validation failed',
        status: 422
      })
    })
  })

  describe('deleteTemplate', () => {
    it('should make DELETE request to delete template', async () => {
      const deleteResult = {
        success: true,
        message: 'Template deleted successfully',
        deletedTemplateId: 'old-template-123'
      }
      mockSuccessAPIRequest(deleteResult)

      const templateId = 'old-template-123'
      const result = await pdfAPI.deleteTemplate(appId, templateId)

      expect(result).toEqual(deleteResult)
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/console/pdf/${templateId}`,
        body: undefined,
        method: 'DELETE',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle template deletion with usage statistics', async () => {
      const deleteResult = {
        success: true,
        message: 'Template deleted successfully',
        statistics: {
          totalUsages: 47,
          lastUsed: '2024-01-10T14:30:00Z',
          generatedPdfs: 47
        },
        cleanup: {
          backupCreated: true,
          backupLocation: 'backups/templates/template-456_20240115.json'
        }
      }
      mockSuccessAPIRequest(deleteResult)

      const templateId = 'template-456'
      const result = await pdfAPI.deleteTemplate(appId, templateId)

      expect(result).toEqual(deleteResult)
    })

    it('fails when server responds with template not found error', async () => {
      mockFailedAPIRequest('Template not found', 404)

      const templateId = 'nonexistent-template'
      const error = await pdfAPI.deleteTemplate(appId, templateId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Template not found' },
        message: 'Template not found',
        status: 404
      })
    })

    it('fails when server responds with template in use error', async () => {
      mockFailedAPIRequest('Cannot delete template currently in use', 409)

      const templateId = 'active-template'
      const error = await pdfAPI.deleteTemplate(appId, templateId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Cannot delete template currently in use' },
        message: 'Cannot delete template currently in use',
        status: 409
      })
    })

    it('fails when server responds with insufficient permissions error', async () => {
      mockFailedAPIRequest('Insufficient permissions to delete template', 403)

      const templateId = 'protected-template'
      const error = await pdfAPI.deleteTemplate(appId, templateId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Insufficient permissions to delete template' },
        message: 'Insufficient permissions to delete template',
        status: 403
      })
    })
  })
})
