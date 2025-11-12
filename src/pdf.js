/* eslint-disable max-len */

import { prepareRoutes } from './utils/routes'
import BaseService from './base/base-service'

const routes = prepareRoutes({
  generatePDF: '/api/node-server/manage/app/:appId/pdf/generate',
  templates  : '/:appId/console/pdf',
  template   : '/:appId/console/pdf/:templateId',
})

class PDF extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'pdf'
  }

  generatePDF(appId, payload) {
    return this.req.nodeAPI.post(routes.generatePDF(appId), payload)
  }

  /**
   * @aiToolName List Templates
   * @category PDF
   * @description Get all PDF templates for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"id":"template1","name":"Invoice Template","created":1234567890}]
   */
  listTemplates(appId) {
    return this.req.get(routes.templates(appId))
  }

  /**
   * @aiToolName Load Template
   * @category PDF
   * @description Load a specific PDF template
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"templateId","label":"Template ID","description":"The identifier of the template to load","required":true}
   * @sampleResult {"id":"template1","name":"Invoice Template","content":"<html>...</html>","created":1234567890}
   */
  loadTemplate(appId, templateId) {
    return this.req.get(routes.template(appId, templateId))
  }

  createTemplate(appId, template) {
    return this.req.post(routes.templates(appId), template)
  }

  updateTemplate(appId, template) {
    return this.req.put(routes.template(appId, template.id), template)
  }

  /**
   * @aiToolName Delete Template
   * @category PDF
   * @description Delete a PDF template
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"templateId","label":"Template ID","description":"The identifier of the template to delete","required":true}
   * @sampleResult true
   */
  deleteTemplate(appId, templateId) {
    return this.req.delete(routes.template(appId, templateId))
  }
}

export default req => PDF.create(req)
