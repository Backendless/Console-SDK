import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  forms     : '/api/node-server/manage/app/:appId/form-editor',
  createForm: '/api/node-server/manage/app/:appId/form-editor/form',
  updateForm: '/api/node-server/manage/app/:appId/form-editor/form/:formName',
  deleteForm: '/api/node-server/manage/app/:appId/form-editor/form/:formName',
  renameForm: '/api/node-server/manage/app/:appId/form-editor/rename-form',
  launchForm: '/api/app/:appId/form-editor/:formName/view',
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
    return req.put(routes.updateForm(appId, formSource.name), { formSource })
  },

  deleteForm(appId, formName) {
    return req.delete(routes.deleteForm(appId, formName))
  },

  renameForm(appId, oldFormName, newFormName) {
    return req.put(routes.renameForm(appId), {
      oldFormName,
      newFormName
    })
  },

  launchForm(appId, formName) {
    return req.get(routes.launchForm(appId, formName), { formName })
  },

})
