import urls from './urls'

export default req => ({

  getForms(appId) {
    return req.get(`${urls.appConsole(appId)}/form-editor`)
  },

  createForm(appId, formSource, formTarget) {
    return req.post(`${urls.appConsole(appId)}/form-editor/form`, {
      formSource,
      formTarget
    })
  },

  updateForm(appId, formSource, formTarget) {
    return req.put(`${urls.appConsole(appId)}/form-editor/form/${formSource.name}`, {
      formSource,
      formTarget
    })
  },

  deleteForm(appId, formName) {
    return req.delete(`${urls.appConsole(appId)}/form-editor/form/${formName}`)
  },

  renameForm(appId, oldFormName, newFormName) {
    return req.put(`${urls.appConsole(appId)}/form-editor/rename-form`, {
      oldFormName,
      newFormName
    })
  },

})
