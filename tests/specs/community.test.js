import { mockFailedAPIRequest } from '../setup/mock-request'

describe('apiClient.community', () => {
  let apiClient
  let communityAPI

  const successResult = { foo: 'bar' }
  const commentId = 'comment-123'
  const reviewId = 'review-456'
  const productId = 'product-789'
  const itemId = 'item-abc'
  const context = 'marketplace'

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    communityAPI = apiClient.community
  })

  //---- COMMENTS ----//

  describe('getComments', () => {
    it('should make GET request with query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const sorting = 'createdAt:desc'
      const result = await communityAPI.getComments(context, itemId, sorting)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments?context=${context}&itemId=${itemId}&sorting=${encodeURIComponent(sorting)}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined sorting parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.getComments(context, itemId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments?context=${context}&itemId=${itemId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle all undefined parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.getComments()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/comments',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await communityAPI.getComments(context, itemId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments?context=${context}&itemId=${itemId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('createComments', () => {
    it('should make POST request with comment data', async () => {
      mockSuccessAPIRequest(successResult)

      const comment = {
        body: 'Test comment',
        author: 'user-123',
        itemId: 'item-456'
      }

      const result = await communityAPI.createComments(comment)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/comments',
          body: JSON.stringify(comment),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty comment object', async () => {
      mockSuccessAPIRequest(successResult)

      const comment = {}
      const result = await communityAPI.createComments(comment)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/comments',
          body: JSON.stringify(comment),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Bad Request', 400)

      const comment = { body: 'Test' }
      const error = await communityAPI.createComments(comment).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Bad Request' },
        message: 'Bad Request',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/comments',
          body: JSON.stringify(comment),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('editComment', () => {
    it('should make PUT request with comment id and body', async () => {
      mockSuccessAPIRequest(successResult)

      const body = 'Updated comment text'
      const result = await communityAPI.editComment(commentId, body)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}`,
          body: JSON.stringify({ commentId, body }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty body', async () => {
      mockSuccessAPIRequest(successResult)

      const body = ''
      const result = await communityAPI.editComment(commentId, body)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}`,
          body: JSON.stringify({ commentId, body }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Comment not found', 404)

      const body = 'Updated text'
      const error = await communityAPI.editComment(commentId, body).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Comment not found' },
        message: 'Comment not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}`,
          body: JSON.stringify({ commentId, body }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteComment', () => {
    it('should make DELETE request with comment id', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.deleteComment(commentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Comment not found', 404)

      const error = await communityAPI.deleteComment(commentId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Comment not found' },
        message: 'Comment not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('hideComment', () => {
    it('should make PUT request to hide comment', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.hideComment(commentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}/hide`,
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Forbidden', 403)

      const error = await communityAPI.hideComment(commentId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Forbidden' },
        message: 'Forbidden',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}/hide`,
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('displayComment', () => {
    it('should make PUT request to display comment', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.displayComment(commentId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}/display`,
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Forbidden', 403)

      const error = await communityAPI.displayComment(commentId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Forbidden' },
        message: 'Forbidden',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/comments/${commentId}/display`,
          method: 'PUT',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  //---- REVIEWS ----//

  describe('getReviews', () => {
    it('should make GET request with query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const sorting = 'rating:desc'
      const result = await communityAPI.getReviews(context, itemId, sorting)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews?context=${context}&itemId=${itemId}&sorting=${encodeURIComponent(sorting)}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined sorting parameter', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.getReviews(context, itemId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews?context=${context}&itemId=${itemId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle all undefined parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.getReviews()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/reviews',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Unauthorized', 401)

      const error = await communityAPI.getReviews(context, itemId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized' },
        message: 'Unauthorized',
        status: 401
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews?context=${context}&itemId=${itemId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('createReview', () => {
    it('should make POST request with review data', async () => {
      mockSuccessAPIRequest(successResult)

      const review = {
        body: 'Great product!',
        rating: 5,
        author: 'user-123',
        itemId: 'item-456'
      }

      const result = await communityAPI.createReview(review)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/reviews',
          body: JSON.stringify(review),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty review object', async () => {
      mockSuccessAPIRequest(successResult)

      const review = {}
      const result = await communityAPI.createReview(review)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/reviews',
          body: JSON.stringify(review),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid rating', 400)

      const review = { body: 'Test', rating: 10 }
      const error = await communityAPI.createReview(review).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid rating' },
        message: 'Invalid rating',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/reviews',
          body: JSON.stringify(review),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('editReview', () => {
    it('should make PUT request with review id, body and rating', async () => {
      mockSuccessAPIRequest(successResult)

      const body = 'Updated review text'
      const rating = 4
      const result = await communityAPI.editReview(reviewId, body, rating)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews/${reviewId}`,
          body: JSON.stringify({ body, rating }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined rating', async () => {
      mockSuccessAPIRequest(successResult)

      const body = 'Updated review text'
      const result = await communityAPI.editReview(reviewId, body)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews/${reviewId}`,
          body: JSON.stringify({ body, rating: undefined }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty body and rating', async () => {
      mockSuccessAPIRequest(successResult)

      const body = ''
      const rating = 0
      const result = await communityAPI.editReview(reviewId, body, rating)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews/${reviewId}`,
          body: JSON.stringify({ body, rating }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Review not found', 404)

      const body = 'Updated text'
      const rating = 3
      const error = await communityAPI.editReview(reviewId, body, rating).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Review not found' },
        message: 'Review not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews/${reviewId}`,
          body: JSON.stringify({ body, rating }),
          method: 'PUT',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('deleteReview', () => {
    it('should make DELETE request with review id', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.deleteReview(reviewId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews/${reviewId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Review not found', 404)

      const error = await communityAPI.deleteReview(reviewId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Review not found' },
        message: 'Review not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/reviews/${reviewId}`,
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  //---- VOTES ----//

  describe('vote', () => {
    it('should make POST request with vote data', async () => {
      mockSuccessAPIRequest(successResult)

      const vote = {
        itemId: 'item-123',
        type: 'like',
        value: 1
      }

      const result = await communityAPI.vote(vote)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/vote/like',
          body: JSON.stringify(vote),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle empty vote object', async () => {
      mockSuccessAPIRequest(successResult)

      const vote = {}
      const result = await communityAPI.vote(vote)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/vote/like',
          body: JSON.stringify(vote),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Already voted', 409)

      const vote = { itemId: 'item-123' }
      const error = await communityAPI.vote(vote).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Already voted' },
        message: 'Already voted',
        status: 409
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/vote/like',
          body: JSON.stringify(vote),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getLikers', () => {
    it('should make GET request with type and itemId query parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const type = 'product'
      const result = await communityAPI.getLikers(type, itemId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/vote/likers?type=${type}&itemId=${itemId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined itemId', async () => {
      mockSuccessAPIRequest(successResult)

      const type = 'product'
      const result = await communityAPI.getLikers(type)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/vote/likers?type=${type}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle all undefined parameters', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.getLikers()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/vote/likers',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Invalid type', 400)

      const type = 'invalid'
      const error = await communityAPI.getLikers(type, itemId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid type' },
        message: 'Invalid type',
        status: 400
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: `http://test-host:3000/console/community/vote/likers?type=${type}&itemId=${itemId}`,
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('getUserBlacklistStatus', () => {
    it('should make GET request to blacklist status endpoint', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.getUserBlacklistStatus()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/blacklist/status',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Service unavailable', 503)

      const error = await communityAPI.getUserBlacklistStatus().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Service unavailable' },
        message: 'Service unavailable',
        status: 503
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/blacklist/status',
          body: undefined,
          method: 'GET',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  //---- ACTIVITY ----//

  describe('onProductInstall', () => {
    it('should make POST request with productId', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.onProductInstall(productId)

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/activity/products/install',
          body: JSON.stringify({ productId }),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('should handle undefined productId', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.onProductInstall()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/activity/products/install',
          body: JSON.stringify({ productId: undefined }),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Product not found', 404)

      const error = await communityAPI.onProductInstall(productId).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Product not found' },
        message: 'Product not found',
        status: 404
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/activity/products/install',
          body: JSON.stringify({ productId }),
          method: 'POST',
          encoding: 'utf8',
          headers: { 'Content-Type': 'application/json' },
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('reportUserActivity', () => {
    it('should make POST request to report activity endpoint', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.reportUserActivity()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/activity/report',
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Rate limit exceeded', 429)

      const error = await communityAPI.reportUserActivity().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Rate limit exceeded' },
        message: 'Rate limit exceeded',
        status: 429
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/activity/report',
          method: 'POST',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })

  describe('onDeveloperSuicide', () => {
    it('should make DELETE request to dev suicide endpoint', async () => {
      mockSuccessAPIRequest(successResult)

      const result = await communityAPI.onDeveloperSuicide()

      expect(result).toEqual(successResult)

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/dev/suicide',
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })

    it('fails when server responds with non 200 status code', async () => {
      mockFailedAPIRequest('Operation not permitted', 403)

      const error = await communityAPI.onDeveloperSuicide().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Operation not permitted' },
        message: 'Operation not permitted',
        status: 403
      })

      expect(apiRequestCalls()).toEqual([
        {
          path: 'http://test-host:3000/console/community/dev/suicide',
          body: undefined,
          method: 'DELETE',
          encoding: 'utf8',
          headers: {},
          timeout: 0,
          withCredentials: false
        }
      ])
    })
  })
})