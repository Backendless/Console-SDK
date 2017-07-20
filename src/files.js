import urls from './urls'
import totalRows from './utils/total-rows'
import { FOLDER } from './utils/cache-tags'

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

export default req => ({
  loadDirectory(appId, authKey, path, pattern, pageSize = 15, offset = 0) {
    path = path || '/'
    const params = { pageSize, offset, pattern }

    const dataReq = req.get(urls.fileView(appId, authKey, path)).query(params)
      .cacheTags(FOLDER(appId, path))

    return totalRows(req).getWithData(dataReq).then(result => enrichDirectoryParams(result, path))
  },

  createDir(appId, path, folderName) {
    return req.post(urls.createDir(appId, path, folderName)).cacheTags(FOLDER(appId, path))
  },

  getFileContent(appId, authKey, filePath) {
    return req.get(urls.fileDownload(appId, authKey, filePath))
  },

  performOperation(appId, filePath, operation) {
    filePath = filePath || encodeURIComponent('/') //for root directory operations it has send '/' as path

    return req.put(`${urls.appConsole(appId)}/files/${filePath}`)
      .query({ operation })
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  fileExists(appId, filePath) {
    return req.get(urls.fileExists(appId, filePath))
  },

  editFile(appId, filePath, fileContent) {
    return req.post(urls.fileEdit(appId, filePath), { file: fileContent })
  },

  createFile(appId, filePath, fileContent) {
    return req
      .post(urls.fileCreate(appId, filePath), { file: fileContent })
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  moveFile(appId, filePath, newFilePath) {
    return req.post(urls.fileMove(appId, filePath), newFilePath)
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  copyFile(appId, filePath, newFilePath) {
    return req.post(urls.fileCopy(appId, filePath), newFilePath)
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  renameFile(appId, filePath, newFileName) {
    return req.post(urls.fileRename(appId, filePath), newFileName)
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  deleteFile(appId, filePath) {
    return req.delete(urls.fileDelete(appId, filePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  uploadFile(appId, file, path, fileName) {
    return req.post(urls.fileUpload(appId, `${path}/${fileName}`), file)
      .cacheTags(FOLDER(appId, path))
  },

  createConsoleFile(appId, path, content) {
    return req.post(`${urls.appConsole(appId)}/files/create/${path}`, content)
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(path)))
  },

  viewFiles(appId, authKey, path = '') {
    return req.get(urls.fileView(appId, authKey, path))
  }
})
