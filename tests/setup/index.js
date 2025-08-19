// Test setup for Backendless Console SDK
// This file is loaded before each test suite
import {
  apiRequestCalls,
  mockAPIRequest,
  mockFailedAPIRequest,
  mockSuccessAPIRequest,
  resetRequestCache
} from './mock-request'
import { createClient } from '../../src'

global.mockAPIRequest = mockAPIRequest
global.mockSuccessAPIRequest = mockSuccessAPIRequest
global.mockFailedAPIRequest = mockFailedAPIRequest

global.apiRequestCalls = apiRequestCalls

global.createAPIClient = createClient

// Reset all mocks after each test
afterEach(() => {
  resetRequestCache()
  jest.clearAllMocks()
})
