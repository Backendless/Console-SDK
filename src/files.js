import urls from './urls'
import totalRows from './utils/total-rows'
import { FOLDER } from './utils/cache-tags'
import decorateRequest from './utils/decorate-request'

const getFileFolder = file => {
  const tokens = file.split('/')

  if (tokens.length > 1) {
    tokens.pop()

    return tokens.join('/')
  }

  return ''
}

const SERVER_CODE_FOLDER = /^servercode/
const isServerCodeFolder = folderName => SERVER_CODE_FOLDER.test(folderName)

const enrichDirectoryParams = (directory, path) => {
  const readOnly = isServerCodeFolder(path)

  directory.readOnly = readOnly

  return directory
}

export default decorateRequest({

  loadDirectory: req => (appId, authKey, path, params) => {
    path = path || '/'

    const { pattern, sub, sortBy, sortDirection, pageSize, offset } = params || {}

    const dataReq = req.get(urls.fileView(appId, authKey, path))
      .query({ pattern, sub, sortBy, sortDirection, pageSize, offset })
      .cacheTags(FOLDER(appId, path))

    return totalRows(req).getWithData(dataReq).then(result => enrichDirectoryParams(result, path))
  },

  createDir: req => (appId, path, folderName) => {
    return req.post(urls.createDir(appId, path, folderName)).cacheTags(FOLDER(appId, path))
  },

  getFileContent: req => (appId, authKey, filePath) => {
    return req.get(urls.fileDownload(appId, authKey, filePath))
  },

  performOperation: req => (appId, filePath, operation) => {
    filePath = filePath || encodeURIComponent('/') //for root directory operations it has send '/' as path

    return req.put(`${urls.appConsole(appId)}/files/${filePath}`)
      .query({ operation })
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  fileExists: req => (appId, filePath) => {
    return req.get(urls.fileExists(appId, filePath))
  },

  editFile: req => (appId, filePath, fileContent) => {
    return req.post(urls.fileEdit(appId, filePath), { file: fileContent })
  },

  createFile: req => (appId, filePath, fileContent) => {
    return req
      .post(urls.fileCreate(appId, filePath), { file: fileContent })
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  moveFile: req => (appId, filePath, newFilePath) => {
    return req.post(urls.fileMove(appId, filePath), newFilePath)
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  copyFile: req => (appId, filePath, newFilePath) => {
    return req.post(urls.fileCopy(appId, filePath), newFilePath)
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  renameFile: req => (appId, filePath, newFileName) => {
    return req.post(urls.fileRename(appId, filePath), newFileName)
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  deleteFile: req => (appId, filePath) => {
    return req.delete(urls.fileDelete(appId, filePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  uploadFile: req => (appId, file, path, fileName) => {
    return req.post(urls.fileUpload(appId, `${path}/${fileName}`), file)
      .cacheTags(FOLDER(appId, path))
  },

  createConsoleFile: req => (appId, path, content) => {
    return req.post(`${urls.appConsole(appId)}/files/create/${path}`, content)
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(path)))
  },

  viewFiles: req => (appId, authKey, path = '') => {
    return req.get(urls.fileView(appId, authKey, path, { host: req.fileDownloadURL }))
  }
})
