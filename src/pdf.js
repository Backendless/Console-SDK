import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  generatePDF: '/api/app/:appId/pdf/generate',
  templates  : '/:appId/console/pdf',
  template   : '/:appId/console/pdf/:templateId',
})

export default req => ({
  generatePDF(appId, pdf, inputs) {
    return req.post(routes.generatePDF(appId), { pdf, inputs })
  },

  listTemplates(appId) {
    return req.get(routes.templates(appId))
  },

  loadTemplate(appId, templateId) {
    return req.get(routes.template(appId, templateId))
  },

  createTemplate(appId, template) {
    return req.post(routes.templates(appId), template)
  },

  updateTemplate(appId, template) {
    return req.put(routes.template(appId, template.id), template)
  },

  deleteTemplate(appId, templateId) {
    return req.delete(routes.template(appId, templateId))
  },
})
