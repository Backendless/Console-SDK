describe('apiClient.files', () => {
  let apiClient
  let filesAPI

  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    filesAPI = apiClient.files
  })

  describe('loadDirectory', () => {
    it('should load directory with default path and totalRows integration', async () => {
      const mockTotalCount = 25
      const mockData = [
        { name: 'file1.txt', type: 'file', size: 1024 },
        { name: 'folder1', type: 'directory' }
      ]

      mockSuccessAPIRequest(mockData)      // Data request first
      mockSuccessAPIRequest(mockTotalCount) // Count request second

      const result = await filesAPI.loadDirectory(appId)

      expect(result).toEqual({
        totalRows: mockTotalCount,
        data: mockData
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/files/directory/view',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: 'http://test-host:3000/test-app-id/console/files/directory/view/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should load directory with custom path', async () => {
      const mockTotalCount = 10
      const mockData = []
      const path = '/uploads/images'

      mockSuccessAPIRequest(mockData)      // Data request first
      mockSuccessAPIRequest(mockTotalCount) // Count request second

      const result = await filesAPI.loadDirectory(appId, path)

      expect(result).toEqual({
        totalRows: mockTotalCount,
        data: mockData
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/test-app-id/console/files/directory/view/uploads/images',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        },
        {
          path: 'http://test-host:3000/test-app-id/console/files/directory/view/uploads/images/count',
          method: 'GET',
          body: undefined,
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should load directory with query parameters', async () => {
      const mockTotalCount = 5
      const mockData = []
      const params = {
        pattern: '*.txt',
        sub: true,
        sortBy: 'name',
        sortDirection: 'asc',
        pageSize: 20,
        offset: 40
      }

      mockSuccessAPIRequest(mockData)      // Data request first
      mockSuccessAPIRequest(mockTotalCount) // Count request second

      const result = await filesAPI.loadDirectory(appId, '/docs', params)

      expect(result).toEqual({
        totalRows: mockTotalCount,
        data: mockData
      })

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/docs?pattern=*.txt&sub=true&sortBy=name&sortDirection=asc&pageSize=20&offset=40'
      )
      expect(apiRequestCalls()[1].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/docs/count?pattern=*.txt&sub=true'
      )
    })

    it('should handle path with special characters', async () => {
      const mockTotalCount = 1
      const mockData = []
      const path = '/folder with spaces/special-chars@#$&+?='

      mockSuccessAPIRequest(mockData)      // Data request first
      mockSuccessAPIRequest(mockTotalCount) // Count request second

      await filesAPI.loadDirectory(appId, path)

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/folder%20with%20spaces/special-chars%40%23%24%26%2B%3F%3D'
      )
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Directory not found', 404)

      const error = await filesAPI.loadDirectory(appId, '/nonexistent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Directory not found' },
        message: 'Directory not found',
        status: 404
      })
    })
  })

  describe('loadFullDirectory', () => {
    it('should load all files with pagination', async () => {
      const totalCount = 250
      const mockFile1 = { name: 'file1.txt', type: 'file' }
      const mockFile2 = { name: 'file2.txt', type: 'file' }
      const mockFile3 = { name: 'file3.txt', type: 'file' }

      // Mock total count request (first request in loadFullDirectory)
      mockSuccessAPIRequest(totalCount)

      // Mock paginated data requests (3 pages of 100 items each)
      mockSuccessAPIRequest(Array(100).fill(mockFile1))
      mockSuccessAPIRequest(Array(100).fill(mockFile2))
      mockSuccessAPIRequest(Array(50).fill(mockFile3))

      const result = await filesAPI.loadFullDirectory(appId, '/uploads')

      expect(result).toHaveLength(250)
      expect(result.slice(0, 100)).toEqual(Array(100).fill(mockFile1))
      expect(result.slice(100, 200)).toEqual(Array(100).fill(mockFile2))
      expect(result.slice(200, 250)).toEqual(Array(50).fill(mockFile3))

      expect(apiRequestCalls()).toHaveLength(4) // 1 for count + 3 for data

      // Verify count request (totalRows.get call)
      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/uploads/count'
      )

      // Verify paginated requests
      expect(apiRequestCalls()[1].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/uploads?pageSize=100&offset=0'
      )
      expect(apiRequestCalls()[2].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/uploads?pageSize=100&offset=100'
      )
      expect(apiRequestCalls()[3].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/uploads?pageSize=100&offset=200'
      )
    })

    it('should handle custom parameters with pagination', async () => {
      const totalCount = 150
      const params = { pattern: '*.pdf', sortBy: 'size' }

      mockSuccessAPIRequest(totalCount)
      mockSuccessAPIRequest([])
      mockSuccessAPIRequest([])

      await filesAPI.loadFullDirectory(appId, '/documents', params)

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/documents/count'
      )
      expect(apiRequestCalls()[1].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/documents?pattern=*.pdf&sortBy=size&pageSize=100&offset=0'
      )
      expect(apiRequestCalls()[2].path).toBe(
        'http://test-host:3000/test-app-id/console/files/directory/view/documents?pattern=*.pdf&sortBy=size&pageSize=100&offset=100'
      )
    })

    it('fails when count request fails', async () => {
      mockFailedAPIRequest('Permission denied', 403)

      const error = await filesAPI.loadFullDirectory(appId, '/private').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('createDir', () => {
    it('should create directory with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.createDir(appId, '/uploads', 'new-folder')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/createdir//uploads/new-folder/',
        method: 'POST',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should create directory in root path', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.createDir(appId, '', 'root-folder')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/createdir/root-folder/'
      )
    })

    it('should handle folder names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.createDir(appId, '/test', 'folder with spaces & symbols')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/createdir//test/folder%20with%20spaces%20%26%20symbols/'
      )
    })

    it('fails when directory already exists', async () => {
      mockFailedAPIRequest('Directory already exists', 409)

      const error = await filesAPI.createDir(appId, '/uploads', 'existing').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
    })
  })

  describe('getFileContent', () => {
    it('should download file content with correct path', async () => {
      const fileContent = 'Hello, World!'
      mockSuccessAPIRequest(fileContent)

      const result = await filesAPI.getFileContent(appId, '/uploads/test.txt')

      expect(result).toBe(fileContent)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/download//uploads/test.txt',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest('content')

      await filesAPI.getFileContent(appId, '/docs/file with spaces & symbols.txt')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/download//docs/file%20with%20spaces%20%26%20symbols.txt'
      )
    })

    it('fails when file does not exist', async () => {
      mockFailedAPIRequest('File not found', 404)

      const error = await filesAPI.getFileContent(appId, '/nonexistent.txt').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('performOperation', () => {
    it('should perform operation on file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.performOperation(appId, '/uploads/test.txt', 'compress')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files//uploads/test.txt?operation=compress',
        method: 'PUT',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle root directory operation', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.performOperation(appId, null, 'cleanup')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/%2F?operation=cleanup'
      )
    })

    it('should handle empty file path as root directory', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.performOperation(appId, '', 'maintenance')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/%2F?operation=maintenance'
      )
    })

    it('fails when operation is not allowed', async () => {
      mockFailedAPIRequest('Operation not permitted', 403)

      const error = await filesAPI.performOperation(appId, '/system/config.txt', 'delete').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('fileExists', () => {
    it('should check if file exists with correct path', async () => {
      const existsResult = { exists: true }
      mockSuccessAPIRequest(existsResult)

      const result = await filesAPI.fileExists(appId, '/uploads/test.txt')

      expect(result).toEqual(existsResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/exists//uploads/test.txt/',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest({ exists: false })

      await filesAPI.fileExists(appId, '/docs/file with spaces.pdf')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/exists//docs/file%20with%20spaces.pdf/'
      )
    })

    it('fails when server error occurs', async () => {
      mockFailedAPIRequest('Internal server error', 500)

      const error = await filesAPI.fileExists(appId, '/test.txt').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(500)
    })
  })

  describe('editFile', () => {
    it('should edit file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const fileContent = 'Updated file content'
      const result = await filesAPI.editFile(appId, '/uploads/test.txt', fileContent)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/edit//uploads/test.txt/',
        method: 'POST',
        body: JSON.stringify({ file: fileContent }),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const content = 'new content'
      await filesAPI.editFile(appId, '/docs/my file & notes.txt', content)

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/edit//docs/my%20file%20%26%20notes.txt/'
      )
    })

    it('fails when file is read-only', async () => {
      mockFailedAPIRequest('File is read-only', 403)

      const error = await filesAPI.editFile(appId, '/system/config.txt', 'new content').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(403)
    })
  })

  describe('createFile', () => {
    it('should create file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const fileContent = 'New file content'
      const result = await filesAPI.createFile(appId, '/uploads/newfile.txt', fileContent)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/create//uploads/newfile.txt/',
        method: 'POST',
        body: JSON.stringify({ file: fileContent }),
        encoding: 'utf8',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.createFile(appId, '/docs/new file & notes.txt', 'content')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/create//docs/new%20file%20%26%20notes.txt/'
      )
    })

    it('fails when file already exists', async () => {
      mockFailedAPIRequest('File already exists', 409)

      const error = await filesAPI.createFile(appId, '/uploads/existing.txt', 'content').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
    })
  })

  describe('moveFile', () => {
    it('should move file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.moveFile(appId, '/uploads/old.txt', '/documents/new.txt')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/move//uploads/old.txt/',
        method: 'POST',
        body: '/documents/new.txt',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.moveFile(appId, '/old folder/file.txt', '/new folder/renamed file.txt')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/move//old%20folder/file.txt/'
      )
      expect(apiRequestCalls()[0].body).toBe('/new%20folder/renamed%20file.txt')
    })

    it('fails when source file does not exist', async () => {
      mockFailedAPIRequest('Source file not found', 404)

      const error = await filesAPI.moveFile(appId, '/nonexistent.txt', '/new.txt').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('copyFile', () => {
    it('should copy file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.copyFile(appId, '/uploads/original.txt', '/backups/copy.txt')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/copy//uploads/original.txt/',
        method: 'POST',
        body: '/backups/copy.txt',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.copyFile(appId, '/docs/original file.pdf', '/archive/copy & backup.pdf')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/copy//docs/original%20file.pdf/'
      )
      expect(apiRequestCalls()[0].body).toBe('/archive/copy%20%26%20backup.pdf')
    })

    it('fails when destination already exists', async () => {
      mockFailedAPIRequest('Destination file already exists', 409)

      const error = await filesAPI.copyFile(appId, '/source.txt', '/existing.txt').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
    })
  })

  describe('renameFile', () => {
    it('should rename file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.renameFile(appId, '/uploads/oldname.txt', 'newname.txt')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/rename//uploads/oldname.txt/',
        method: 'POST',
        body: 'newname.txt',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.renameFile(appId, '/docs/old file.txt', 'new file & notes.txt')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/rename//docs/old%20file.txt/'
      )
      expect(apiRequestCalls()[0].body).toBe('new%20file%20%26%20notes.txt')
    })

    it('fails when new name already exists', async () => {
      mockFailedAPIRequest('File with this name already exists', 409)

      const error = await filesAPI.renameFile(appId, '/file.txt', 'existing.txt').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
    })
  })

  describe('deleteFile', () => {
    it('should delete file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.deleteFile(appId, '/uploads/unwanted.txt')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files//uploads/unwanted.txt/',
        method: 'DELETE',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle file paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.deleteFile(appId, '/temp/file with spaces & symbols.tmp')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files//temp/file%20with%20spaces%20%26%20symbols.tmp/'
      )
    })

    it('fails when file does not exist', async () => {
      mockFailedAPIRequest('File not found', 404)

      const error = await filesAPI.deleteFile(appId, '/nonexistent.txt').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(404)
    })
  })

  describe('uploadFile', () => {
    it('should upload file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const fileData = 'binary file data'

      const result = await filesAPI.uploadFile(appId, fileData, '/uploads', 'test.txt')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/upload//uploads/test.txt/?overwrite=false',
        method: 'POST',
        body: fileData,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should upload file with overwrite flag', async () => {
      mockSuccessAPIRequest(successResult)

      const fileData = 'file content'
      await filesAPI.uploadFile(appId, fileData, '/docs', 'document.pdf', true)

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/upload//docs/document.pdf/?overwrite=true'
      )
    })

    it('should handle file names with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      const fileData = 'content'
      await filesAPI.uploadFile(appId, fileData, '/uploads', 'file with spaces & symbols.txt')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/upload//uploads/file%20with%20spaces%20%26%20symbols.txt/?overwrite=false'
      )
    })

    it('fails when upload quota exceeded', async () => {
      mockFailedAPIRequest()

      const error = await filesAPI.uploadFile(appId, 'large file', '/uploads', 'large.zip').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('createConsoleFile', () => {
    it('should create console file with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const content = 'console file content'
      const result = await filesAPI.createConsoleFile(appId, '/config/settings.json', content)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/create//config/settings.json',
        method: 'POST',
        body: content,
        encoding: 'utf8',
        headers: { 'Accept': '*/*' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.createConsoleFile(appId, '/config/app settings & config.json', 'content')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/create//config/app%20settings%20%26%20config.json'
      )
    })

    it('fails when path is invalid', async () => {
      mockFailedAPIRequest()

      const error = await filesAPI.createConsoleFile(appId, '', 'content').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })

  describe('viewFiles', () => {
    it('should view files with default empty path', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.viewFiles(appId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/view',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should view files with custom path', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await filesAPI.viewFiles(appId, '/uploads/images')

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/test-app-id/console/files/view/uploads/images',
        method: 'GET',
        body: undefined,
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle paths with special characters', async () => {
      mockSuccessAPIRequest(successResult)

      await filesAPI.viewFiles(appId, '/docs/folder with spaces & symbols')

      expect(apiRequestCalls()[0].path).toBe(
        'http://test-host:3000/test-app-id/console/files/view/docs/folder%20with%20spaces%20%26%20symbols'
      )
    })

    it('fails when path does not exist', async () => {
      mockFailedAPIRequest()

      const error = await filesAPI.viewFiles(appId, '/nonexistent').catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'test error message' },
        message: 'test error message',
        status: 400
      })
    })
  })
})
