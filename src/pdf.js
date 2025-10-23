/* eslint-disable max-len */

import { prepareRoutes } from './utils/routes'
import BaseService from './base/base-service'

const routes = prepareRoutes({
  generatePDF: '/api/app/:appId/pdf/generate',
  templates  : '/:appId/console/pdf',
  template   : '/:appId/console/pdf/:templateId',
})

class PDF extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'pdf'
  }

  generatePDF(appId, pdf, inputs) {
    return this.req.post(routes.generatePDF(appId), { pdf, inputs })
  }

  listTemplates(appId) {
    return this.req.get(routes.templates(appId))
  }

  loadTemplate(appId, templateId) {
    return this.req.get(routes.template(appId, templateId))
  }

  createTemplate(appId, template) {
    return this.req.post(routes.templates(appId), template)
  }

  updateTemplate(appId, template) {
    return this.req.put(routes.template(appId, template.id), template)
  }

  deleteTemplate(appId, templateId) {
    return this.req.delete(routes.template(appId, templateId))
  }
}

export default req => PDF.create(req)
