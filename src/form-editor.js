import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  forms     : '/api/node-server/manage/app/:appId/form-editor',
  createForm: '/api/node-server/manage/app/:appId/form-editor/form',
  updateForm: '/api/node-server/manage/app/:appId/form-editor/form/:formId',
  deleteForm: '/api/node-server/manage/app/:appId/form-editor/form/:formId',
  launchForm: '/api/app/:appId/form-editor/:formId/view',
})

export default req => ({

  getForms(appId) {
    return req.get(routes.forms(appId))
  },

  createForm(appId, formSource, appSettings) {
    return req.post(routes.createForm(appId), {
      formSource,
      appSettings
    })
  },

  updateForm(appId, formSource) {
    return req.put(routes.updateForm(appId, formSource.id), { formSource })
  },

  deleteForm(appId, formSource) {
    return req.delete(routes.deleteForm(appId, formSource.id), { formSource })
  },

  launchForm(appId, formId) {
    return req.get(routes.launchForm(appId, formId))
  },

})
