import urls from './urls'
import totalRows from './utils/total-rows'
import { FOLDER } from './utils/cache-tags'
import { encodePath } from './utils/path'

const getFileFolder = file => {
  const tokens = file.split('/')

  if (tokens.length > 1) {
    tokens.pop()

    return tokens.join('/')
  }

  return ''
}

export default req => ({

  loadDirectory(appId, authKey, path, params) {
    path = path || '/'

    const { pattern, sub, sortBy, sortDirection, pageSize, offset } = params || {}

    const dataReq = req.get(urls.directoryView(appId, authKey, path))
      .query({ pattern, sub, sortBy, sortDirection, pageSize, offset })
      .cacheTags(FOLDER(appId, path))

    return totalRows(req).getWithData(dataReq)
  },

  async loadFullDirectory(appId, authKey, path, params) {
    let currentQuery = {
      ...params,
      pageSize: 100,
      offset  : 0,
    }

    const url = urls.directoryView(appId, authKey, path)

    const totalCount = await totalRows(req).get(url)

    const filesList = []
    const requests = []

    while (currentQuery.offset < totalCount) {
      requests.push(req.get(url).query(currentQuery))

      currentQuery = {
        ...currentQuery,
        offset: currentQuery.offset + 100,
      }
    }

    const results = await Promise.all(requests)

    results.forEach(files => filesList.push(...files))

    return filesList
  },

  createDir(appId, path, folderName) {
    return req.post(urls.createDir(appId, path, folderName)).cacheTags(FOLDER(appId, path))
  },

  async getFileContent(appId, authKey, filePath) {
    const fileDownloadURL = await req.getFileDownloadURL()

    return req.get(urls.fileDownload(appId, authKey, filePath, { host: fileDownloadURL }))
  },

  performOperation(appId, filePath, operation) {
    //for root directory operations it has send '/' as path
    const path = filePath ? encodePath(filePath) : encodeURIComponent('/')

    return req.put(`${urls.appConsole(appId)}/files/${path}`)
      .query({ operation })
      .cacheTags(FOLDER(appId, getFileFolder(path)))
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
    return req.post(urls.fileMove(appId, filePath), encodePath(newFilePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  copyFile(appId, filePath, newFilePath) {
    return req.post(urls.fileCopy(appId, filePath), encodePath(newFilePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  },

  renameFile(appId, filePath, newFileName) {
    return req.post(urls.fileRename(appId, filePath), encodeURIComponent(newFileName))
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
    return req.post(`${urls.appConsole(appId)}/files/create/${encodePath(path)}`, content)
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(path)))
  },

  viewFiles(appId, authKey, path = '') {
    return req.get(urls.fileView(appId, authKey, path))
  }
})
