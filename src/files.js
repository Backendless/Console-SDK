/* eslint-disable max-len */

import urls from './urls'
import totalRows from './utils/total-rows'
import { FOLDER } from './utils/cache-tags'
import { encodePath } from './utils/path'
import BaseService from './base/base-service'

const getFileFolder = file => {
  const tokens = file.split('/')

  if (tokens.length > 1) {
    tokens.pop()

    return tokens.join('/')
  }

  return ''
}

class Files extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'files'
  }

  /**
   * @typedef {Object} loadDirectory__params
   * @paramDef {"type":"string","label":"Pattern","name":"pattern","description":"Optional search pattern to filter files and directories by name","required":false}
   * @paramDef {"type":"boolean","label":"Sub","name":"sub","description":"Whether to include subdirectories in the search","required":false}
   * @paramDef {"type":"string","label":"Sort By","name":"sortBy","description":"Field to sort results by (e.g., 'name', 'size', 'modified')","required":false}
   * @paramDef {"type":"string","label":"Sort Direction","name":"sortDirection","description":"Sort direction: 'asc' for ascending, 'desc' for descending","required":false}
   * @paramDef {"type":"number","label":"Page Size","name":"pageSize","description":"Number of items to return per page for pagination","required":false}
   * @paramDef {"type":"number","label":"Offset","name":"offset","description":"Number of items to skip for pagination","required":false}
   */

  /**
   * @aiToolName Load Directory
   * @category Data
   * @description Loads the contents of a directory with optional filtering, sorting and pagination support.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"path","label":"Path","description":"The directory path to load. If not specified, root path will be used","required":false}
   * @paramDef {"type":"loadDirectory__params","name":"params","label":"Parameters","description":"Optional parameters for filtering, sorting and pagination","required":false}
   * @sampleResult {"data":[{"name":"documents","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/documents","url":"documents"},{"name":"config.json","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/config.json","size":1024,"url":"config.json"}],"totalRows":2}
   */
  loadDirectory(appId, path, params) {
    path = path || '/'

    const { pattern, sub, sortBy, sortDirection, pageSize, offset } = params || {}

    const dataReq = this.req.get(urls.directoryView(appId, path))
      .query({ pattern, sub, sortBy, sortDirection, pageSize, offset })
      .cacheTags(FOLDER(appId, path))

    return totalRows(this.req).getWithData(dataReq)
  }

  /**
   * @typedef {Object} loadFullDirectory__params
   * @paramDef {"type":"string","label":"Pattern","name":"pattern","description":"Optional search pattern to filter files and directories by name","required":false}
   * @paramDef {"type":"boolean","label":"Sub","name":"sub","description":"Whether to include subdirectories in the search","required":false}
   * @paramDef {"type":"string","label":"Sort By","name":"sortBy","description":"Field to sort results by (e.g., 'name', 'size', 'modified')","required":false}
   * @paramDef {"type":"string","label":"Sort Direction","name":"sortDirection","description":"Sort direction: 'asc' for ascending, 'desc' for descending","required":false}
   */

  /**
   * @aiToolName Load Full Directory
   * @category Data
   * @description Loads the complete contents of a directory by automatically paginating through all results. Unlike loadDirectory, this method returns all items without pagination limits.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"path","label":"Path","description":"The directory path to load completely. If not specified, root path will be used","required":false}
   * @paramDef {"type":"loadFullDirectory__params","name":"params","label":"Parameters","description":"Optional parameters for filtering and sorting (pagination handled automatically)","required":false}
   * @sampleResult [{"name":"documents","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/documents","url":"documents"},{"name":"config.json","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/config.json","size":1024,"url":"config.json"}]
   */
  async loadFullDirectory(appId, path, params) {
    let currentQuery = {
      ...params,
      pageSize: 100,
      offset  : 0,
    }

    const url = urls.directoryView(appId, path)

    const totalCount = await totalRows(this.req).get(url)

    const filesList = []
    const requests = []

    while (currentQuery.offset < totalCount) {
      requests.push(this.req.get(url).query(currentQuery))

      currentQuery = {
        ...currentQuery,
        offset: currentQuery.offset + 100,
      }
    }

    const results = await Promise.all(requests)

    results.forEach(files => filesList.push(...files))

    return filesList
  }

  /**
   * @aiToolName Create Directory
   * @category Data
   * @description Creates a new directory in the specified path.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"path","label":"Path","description":"The path where the directory will be created. If not specified, root path will be used","required":false}
   * @paramDef {"type":"string","name":"folderName","label":"Folder Name","description":"The name of the directory to be created","required":true}
   * @sampleResult {"name":"documents","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/documents","url":"documents"}
   */
  createDir(appId, path, folderName) {
    return this.req.post(urls.createDir(appId, path, folderName)).cacheTags(FOLDER(appId, path))
  }

  /**
   * @aiToolName Get File Content
   * @category Data
   * @description Downloads and returns the content of a specified file.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path to the file within the application","required":true}
   * @sampleResult "This is the content of the file"
   */
  async getFileContent(appId, filePath) {
    return this.req.get(urls.fileDownload(appId, filePath))
  }

  /**
   * @aiToolName Perform File Operation
   * @category Data
   * @description Performs file operations such as compressing directories into ZIP archives or extracting ZIP files.
   *              For root directory operations, the path should be '/' or empty.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path to the file or directory to operate on. Use '/' for root directory operations","required":true}
   * @paramDef {"type":"string","name":"operation","label":"Operation","description":"The operation to perform. Valid values: 'zip' (compress directory) or 'unzip' (extract archive)","required":true}
   * @sampleResult "Operation started successfully. You will receive an email notification when complete."
   */
  performOperation(appId, filePath, operation) {
    //for root directory operations it has send '/' as path
    const path = filePath ? encodePath(filePath) : encodeURIComponent('/')

    return this.req.put(`${urls.appConsole(appId)}/files/${path}`)
      .query({ operation })
      .cacheTags(FOLDER(appId, getFileFolder(path)))
  }

  /**
   * @aiToolName Check File Exists
   * @category Data
   * @description Checks if a file exists at the specified path.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path to check for file existence","required":true}
   * @sampleResult "true"
   */
  fileExists(appId, filePath) {
    return this.req.get(urls.fileExists(appId, filePath))
  }

  /**
   * @aiToolName Edit File
   * @category Data
   * @description Modifies the content of an existing file.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path to the file to be edited","required":true}
   * @paramDef {"type":"string","name":"fileContent","label":"File Content","description":"The new content to be written to the file","required":true}
   * @sampleResult {"name":"example.txt","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/example.txt","size":1024,"url":"example.txt"}
   */
  editFile(appId, filePath, fileContent) {
    return this.req.post(urls.fileEdit(appId, filePath), { file: fileContent })
  }

  /**
   * @aiToolName Create File
   * @category Data
   * @description Creates a new file with the specified content at the given path.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path where the file will be created","required":true}
   * @paramDef {"type":"string","name":"fileContent","label":"File Content","description":"The content to be written to the new file","required":true}
   * @sampleResult {"name":"example.txt","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/example.txt","size":1024,"url":"example.txt"}
   */
  createFile(appId, filePath, fileContent) {
    return this.req
      .post(urls.fileCreate(appId, filePath), { file: fileContent })
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  }

  /**
   * @aiToolName Move File
   * @category Data
   * @description Moves a file from one location to another within the application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"Source File Path","description":"The current path of the file to be moved","required":true}
   * @paramDef {"type":"string","name":"newFilePath","label":"Destination File Path","description":"The new path where the file will be moved","required":true}
   * @sampleResult "https://your-server.com/your-app-id/your-api-key/files/destination/filename.txt"
   */
  moveFile(appId, filePath, newFilePath) {
    return this.req.post(urls.fileMove(appId, filePath), encodePath(newFilePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  }

  /**
   * @aiToolName Copy File
   * @category Data
   * @description Creates a copy of an existing file at a new location.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"Source File Path","description":"The path of the file to be copied","required":true}
   * @paramDef {"type":"string","name":"newFilePath","label":"Destination File Path","description":"The path where the copy will be created","required":true}
   * @sampleResult "https://your-server.com/your-app-id/your-api-key/files/destination/copy-filename.txt"
   */
  copyFile(appId, filePath, newFilePath) {
    return this.req.post(urls.fileCopy(appId, filePath), encodePath(newFilePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  }

  /**
   * @aiToolName Rename File
   * @category Data
   * @description Renames an existing file to a new name.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path of the file to be renamed","required":true}
   * @paramDef {"type":"string","name":"newFileName","label":"New File Name","description":"The new name for the file (without path)","required":true}
   * @sampleResult "https://your-server.com/your-app-id/your-api-key/files/new-filename.txt"
   */
  renameFile(appId, filePath, newFileName) {
    return this.req.post(urls.fileRename(appId, filePath), encodeURIComponent(newFileName))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  }

  /**
   * @aiToolName Delete File
   * @category Data
   * @description Permanently deletes a file from the application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"filePath","label":"File Path","description":"The path of the file to be deleted","required":true}
   * @sampleResult ""
   */
  deleteFile(appId, filePath) {
    return this.req.delete(urls.fileDelete(appId, filePath))
      .cacheTags(FOLDER(appId, getFileFolder(filePath)))
  }

  /**
   * @aiToolName Upload File
   * @category Data
   * @description Uploads a file to the specified path in the application storage.
   *              The file must be sent as multipart/form-data. If a file with the same name exists, it can be optionally overwritten.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application where the file will be stored","required":true}
   * @paramDef {"type":"file","name":"file","label":"File","description":"The file to be uploaded (sent as multipart/form-data)","required":true}
   * @paramDef {"type":"string","name":"path","label":"Target Path","description":"The destination folder path where the file will be uploaded","required":true}
   * @paramDef {"type":"string","name":"fileName","label":"File Name","description":"The name under which the file will be saved","required":true}
   * @paramDef {"type":"boolean","name":"overwrite","label":"Overwrite Existing","description":"Whether to overwrite the file if one with the same name already exists (default: false)","required":false}
   * @sampleResult {"name":"uploaded-file.txt","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/uploads/uploaded-file.txt","size":2048,"url":"uploads/uploaded-file.txt"}
   */
  uploadFile(appId, file, path, fileName, overwrite = false) {
    return this.req.post(urls.fileUpload(appId, `${path}/${fileName}`), file)
      .query({ overwrite })
      .cacheTags(FOLDER(appId, path))
  }

  createConsoleFile(appId, path, content) {
    return this.req.post(`${urls.appConsole(appId)}/files/create/${encodePath(path)}`, content)
      .set('Accept', '*/*') //workarround for BKNDLSS-13702
      .cacheTags(FOLDER(appId, getFileFolder(path)))
  }

  /**
   * @aiToolName View Files
   * @category Data
   * @description Retrieves a view of files and directories for browsing purposes.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"path","label":"Path","description":"The directory path to view. Defaults to root if not specified","required":false}
   * @sampleResult [{"name":"documents","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/documents","url":"documents"},{"name":"config.json","createdOn":1609459200000,"updatedOn":1609459200000,"publicUrl":"https://your-server.com/your-app-id/your-api-key/files/config.json","size":1024,"url":"config.json"}]
   */
  viewFiles(appId, path = '') {
    return this.req.get(urls.fileView(appId, path))
  }
}

export default req => Files.create(req)
