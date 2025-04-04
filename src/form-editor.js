import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  forms     : '/api/node-server/manage/app/:appId/form-editor',
  createForm: '/api/node-server/manage/app/:appId/form-editor/form',
  updateForm: '/api/node-server/manage/app/:appId/form-editor/:formName',
  deleteForm: '/api/node-server/manage/app/:appId/form-editor/:formName',
  renameForm: '/api/node-server/manage/app/:appId/rename-form',
})

export default req => ({

  getForms(appId) {
    return req.get(routes.forms(appId))
  },

  createForm(appId, formSource, formTarget) {
    return req.post(routes.createForm(appId), {
      formSource,
      formTarget
    })
  },

  updateForm(appId, formSource, formTarget) {
    return req.put(routes.updateForm(appId, formSource.name), {
      formSource,
      formTarget
    })
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

})
