import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  comments: '/console/community/comments',
  comment : '/console/community/comments/:commentId',

  reviews: '/console/community/reviews',
  review : '/console/community/reviews/:reviewId',

  vote  : '/console/community/vote/like',
  likers: '/console/community/vote/likers',

  blacklistStatus: '/console/community/blacklist/status',

  onProductInstall: '/console/community/activity/products/install',
})

export const community = req => ({

  //---- COMMENTS ----//

  getComments(context, itemId, sorting) {
    return req.get(routes.comments()).query({ context, itemId, sorting })
  },

  createComments(comment) {
    return req.post(routes.comments(), comment)
  },

  editComment(commentId, body) {
    return req.put(routes.comment(commentId), { commentId, body })
  },

  deleteComment(commentId) {
    return req.delete(routes.comment(commentId))
  },

  //---- REVIEWS ----//

  getReviews(context, itemId, sorting) {
    return req.get(routes.reviews()).query({ context, itemId, sorting })
  },

  createReview(review) {
    return req.post(routes.reviews(), review)
  },

  editReview(reviewId, body, rating) {
    return req.put(routes.review(reviewId), { body, rating })
  },

  deleteReview(reviewId) {
    return req.delete(routes.review(reviewId))
  },

  //---- VOTES ----//

  vote(vote) {
    return req.post(routes.vote(), vote)
  },

  getLikers(type, itemId) {
    return req.get(routes.likers()).query({ type, itemId })
  },

  getUserBlacklistStatus() {
    return req.get(routes.blacklistStatus())
  },

  //---- ACTIVITY ----//

  onProductInstall(productId) {
    return req.get(routes.onProductInstall(), { productId })
  },

})
