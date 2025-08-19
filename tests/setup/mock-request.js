import Request from 'backendless-request'
import { cache as RequestCache } from 'backendless-request/lib/cache'

jest.mock('backendless-request', () => {
  const originalModule = jest.requireActual('backendless-request')

  originalModule.send = jest.fn()

  return originalModule
})

export function mockSuccessAPIRequest(response, statusCode) {
  Request.send.mockResolvedValueOnce({
    body  : JSON.stringify(response),
    status: statusCode || 200,
  })
}

export function mockFailedAPIRequest(errorMessage, statusCode) {
  Request.send.mockResolvedValueOnce({
    body  : JSON.stringify({ message: errorMessage || 'test error message' }),
    status: statusCode || 400,
  })
}

export function resetRequestCache() {
  RequestCache.deleteAll()
}

export function apiRequestCalls() {
  // received is the mock function (Request.send)
  if (!jest.isMockFunction(Request.send)) {
    throw new Error('Expected a mock function but received: ' + typeof Request.send)
  }

  const calls = Request.send.mock.calls

  if (calls.length === 0) {
    throw new Error('Expected Request.send to have been called, but it was not called')
  }

  return calls.map(call => {
    const [path, method, headers, body, encoding, timeout, withCredentials] = call

    return {
      path,
      method,
      headers,
      body,
      encoding,
      timeout,
      withCredentials
    }
  })
}
