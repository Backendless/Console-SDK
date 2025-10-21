import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  knowledgeBase         : '/api/node-server/manage/app/:appId/knowledge-base',
  knowledgeBaseById     : '/api/node-server/manage/app/:appId/knowledge-base/:id',
  knowledgeBaseFiles    : '/api/node-server/manage/app/:appId/knowledge-base/:id/files',
  knowledgeBaseFilesById: '/api/node-server/manage/app/:appId/knowledge-base/:id/files/:fileId',
})

export default req => ({
  getAllKnowledgeBases(appId) {
    return req.nodeAPI.get(routes.knowledgeBase(appId))
  },

  getKnowledgeBase(appId, id) {
    return req.nodeAPI.get(routes.knowledgeBaseById(appId, id))
  },

  createKnowledgeBase(appId, data) {
    return req.nodeAPI.post(routes.knowledgeBase(appId), data)
  },

  updateKnowledgeBaseMetaInfo(appId, id, data) {
    return req.nodeAPI.put(routes.knowledgeBaseById(appId, id), data)
  },

  deleteKnowledgeBase(appId, id) {
    return req.nodeAPI.delete(routes.knowledgeBaseById(appId, id))
  },

  uploadFiles(appId, id, files) {
    return req.nodeAPI.post(routes.knowledgeBaseFiles(appId, id), files)
  },

  deleteFile(appId, id, fileId) {
    return req.nodeAPI.delete(routes.knowledgeBaseFilesById(appId, id, fileId))
  }
})
