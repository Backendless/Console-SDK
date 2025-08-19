# Testing Guidelines for Backendless Console SDK

This document provides comprehensive testing guidelines and patterns for writing tests in the Backendless Console SDK project.

## Test File Structure

### File Naming and Location
- Test files should be placed in `tests/specs/` directory
- Test files should be named `{module-name}.test.js` (e.g., `activity-manager.test.js` for `src/activity-manager.js`)

### Basic Test Structure
```javascript
import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.{moduleName}', () => {
  let apiClient
  let moduleAPI
  
  const appId = 'test-app-id'
  const successResult = { foo: 'bar' }
  
  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    moduleAPI = apiClient.{moduleName}
  })
  
  describe('methodName', () => {
    it('should describe what the test does', async () => {
      // Test implementation
    })
  })
})
```

## Global Test Utilities

These utilities are available globally through `tests/setup.js`:

### `createAPIClient(serverUrl)`
Creates an API client instance for testing.
```javascript
const apiClient = createAPIClient('http://test-host:3000')
```

### `mockSuccessAPIRequest(response, statusCode = 200)`
Mocks a successful API request with the given response.
```javascript
mockSuccessAPIRequest({ data: 'test' })
```

### `mockFailedAPIRequest(errorMessage = 'test error message', statusCode = 400)`
Mocks a failed API request.
```javascript
mockFailedAPIRequest('Unauthorized', 401)
```

### `apiRequestCalls()`
Returns all calls made to Request.send in a structured format.
```javascript
expect(apiRequestCalls()).toEqual([{
  path: 'http://test-host:3000/api/endpoint',
  method: 'POST',
  body: JSON.stringify(data),
  encoding: 'utf8',
  headers: { 'Content-Type': 'application/json' },
  timeout: 0,
  withCredentials: false
}])
```

## Testing Patterns

### 1. Testing Successful API Calls
```javascript
it('should make POST request with correct parameters', async () => {
  mockSuccessAPIRequest(successResult)
  
  const data = { key: 'value' }
  const result = await moduleAPI.someMethod(appId, data)
  
  // Always verify the result
  expect(result).toEqual(successResult)
  
  // Verify the request parameters
  expect(apiRequestCalls()).toEqual([{
    path: 'http://test-host:3000/expected/path',
    method: 'POST',
    body: JSON.stringify(data),
    encoding: 'utf8',
    headers: { 'Content-Type': 'application/json' },
    timeout: 0,
    withCredentials: false
  }])
})
```

### 2. Testing Failed API Calls
```javascript
it('fails when server responds with non 200 status code', async () => {
  mockFailedAPIRequest('Unauthorized', 401)
  
  const error = await moduleAPI.someMethod(appId, data).catch(e => e)
  
  expect(error).toBeInstanceOf(Error)
  expect({ ...error }).toEqual({
    body: { message: 'Unauthorized' },
    message: 'Unauthorized',
    status: 401
  })
  
  // Still verify the request was made correctly
  expect(apiRequestCalls()).toEqual([...])
})
```

### 3. Testing Multiple API Calls
```javascript
it('should make multiple requests', async () => {
  // Mock multiple responses in order
  mockSuccessAPIRequest(result1)
  mockSuccessAPIRequest(result2)
  
  await moduleAPI.method1(appId, data1)
  await moduleAPI.method2(appId, data2)
  
  expect(apiRequestCalls()).toEqual([
    { /* first call */ },
    { /* second call */ }
  ])
})
```

### 4. Testing Methods with Query Parameters
```javascript
it('should add query parameters to request', async () => {
  mockSuccessAPIRequest(successResult)
  
  const query = { limit: 10, offset: 20 }
  await moduleAPI.getList(appId, query)
  
  expect(apiRequestCalls()[0].path).toContain('?limit=10&offset=20')
})
```

### 5. Testing Methods with Different HTTP Methods
```javascript
// GET request
expect(apiRequestCalls()).toEqual([{
  path: 'http://test-host:3000/path',
  method: 'GET',
  // Note: GET requests typically don't have body
  encoding: 'utf8',
  timeout: 0,
  withCredentials: false
}])

// DELETE request
expect(apiRequestCalls()).toEqual([{
  path: 'http://test-host:3000/path',
  method: 'DELETE',
  encoding: 'utf8',
  timeout: 0,
  withCredentials: false
}])

// PUT request with body
expect(apiRequestCalls()).toEqual([{
  path: 'http://test-host:3000/path',
  method: 'PUT',
  body: JSON.stringify(updateData),
  encoding: 'utf8',
  headers: { 'Content-Type': 'application/json' },
  timeout: 0,
  withCredentials: false
}])
```

## Important Testing Rules

### DO:
1. **Always verify the result** - Check that the method returns the expected value
2. **Always verify the request** - Use `apiRequestCalls()` to verify request parameters
3. **Use descriptive test names** - Clearly describe what the test is verifying
4. **Mock before calling** - Always set up mocks before calling the method being tested
5. **Test both success and failure cases** - Include tests for error scenarios
6. **Use consistent formatting** - Follow the existing code style in the project
7. **Clean up after each test** - Mocks are automatically cleared after each test

### DON'T:
1. **Don't modify source code** - Tests should only test existing functionality
2. **Don't test implementation details** - Focus on the public API interface
3. **Don't use hardcoded timestamps** - Use `Date.now()` or similar for dynamic values
4. **Don't forget async/await** - All API methods return promises
5. **Don't test parameter validation** - Unless the source code explicitly validates

## Common Request Properties

Most API requests will have these standard properties:
```javascript
{
  path: 'http://test-host:3000/{endpoint}',
  method: 'POST|GET|PUT|DELETE',
  body: JSON.stringify(data), // For POST/PUT requests with JSON body
  encoding: 'utf8',
  headers: { 'Content-Type': 'application/json' }, // For JSON requests
  timeout: 0,
  withCredentials: false
}
```

## Example: Complete Test File

```javascript
import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.userManagement', () => {
  let apiClient
  let userAPI
  
  const appId = 'test-app-id'
  const userId = 'user-123'
  const successResult = { id: userId, name: 'Test User' }
  
  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    userAPI = apiClient.userManagement
  })
  
  describe('createUser', () => {
    it('should create user with correct parameters', async () => {
      mockSuccessAPIRequest(successResult)
      
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      }
      
      const result = await userAPI.createUser(appId, userData)
      
      expect(result).toEqual(successResult)
      
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/users`,
        method: 'POST',
        body: JSON.stringify(userData),
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })
    
    it('fails when server returns error', async () => {
      mockFailedAPIRequest('Email already exists', 409)
      
      const userData = { email: 'duplicate@example.com' }
      const error = await userAPI.createUser(appId, userData).catch(e => e)
      
      expect(error).toBeInstanceOf(Error)
      expect(error.status).toBe(409)
      expect(error.message).toBe('Email already exists')
    })
  })
  
  describe('getUser', () => {
    it('should fetch user by id', async () => {
      mockSuccessAPIRequest(successResult)
      
      const result = await userAPI.getUser(appId, userId)
      
      expect(result).toEqual(successResult)
      
      expect(apiRequestCalls()).toEqual([{
        path: `http://test-host:3000/${appId}/users/${userId}`,
        method: 'GET',
        encoding: 'utf8',
        timeout: 0,
        withCredentials: false
      }])
    })
  })
})
```

## Special Cases

### Testing File Uploads
```javascript
it('should upload file', async () => {
  const formData = new FormData()
  formData.append('file', fileBlob, 'test.pdf')
  
  mockSuccessAPIRequest({ fileId: '123' })
  
  const result = await fileAPI.upload(appId, formData)
  
  expect(apiRequestCalls()[0]).toMatchObject({
    method: 'POST',
    body: formData, // FormData is passed as-is
    // Note: Content-Type is not set for FormData (browser sets it)
  })
})
```

### Testing Methods with Optional Parameters
```javascript
it('should handle optional parameters', async () => {
  mockSuccessAPIRequest([])
  
  // Call without optional params
  await api.getList(appId)
  
  expect(apiRequestCalls()[0].path).toBe('http://test-host:3000/path')
  
  // Call with optional params
  await api.getList(appId, { limit: 10 })
  
  expect(apiRequestCalls()[1].path).toBe('http://test-host:3000/path?limit=10')
})
```

## Additional Testing Patterns

### Testing Array Query Parameters
When testing methods that accept arrays as query parameters, the system repeats the parameter name:
```javascript
it('should handle array query parameters', async () => {
  mockSuccessAPIRequest([])
  
  await api.loadAppsInfo(['app1', 'app2', 'app3'])
  
  expect(apiRequestCalls()[0].path).toBe(
    'http://test-host:3000/console/apps-info?appsIds=app1&appsIds=app2&appsIds=app3'
  )
})
```

### Testing Undefined Query Parameters
When query parameters are undefined, they are typically omitted from the URL:
```javascript
it('should omit undefined query parameters', async () => {
  mockSuccessAPIRequest([])
  
  await api.getApps() // zone parameter is undefined
  
  expect(apiRequestCalls()[0].path).toBe('http://test-host:3000/console/applications')
})
```

### Testing Error Message Formats
Always use error messages as a string when using `mockFailedAPIRequest`:
```javascript
// Correct - passing string directly
mockFailedAPIRequest('Error message', 400)

// Incorrect - wrap in object
mockFailedAPIRequest({ message: 'Error message' }, 400)
```

The error object structure will be:
```javascript
expect({ ...error }).toEqual({
  body: { message: 'Error message' },
  message: 'Error message',
  status: 400
})
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/specs/activity-manager.test.js

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```
