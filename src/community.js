import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  comments     : '/console/community/comments',
  comment      : '/console/community/comments/:commentId',
  commentAction: '/console/community/comments/:commentId/:action',

  reviews: '/console/community/reviews',
  review : '/console/community/reviews/:reviewId',

  vote  : '/console/community/vote/like',
  likers: '/console/community/vote/likers',

  blacklistStatus: '/console/community/blacklist/status',

  onProductInstall: '/console/community/activity/products/install',

  reportUserActivity: '/console/community/activity/report',

  devSuicide:  '/console/community/dev/suicide',
})

export const community = req => ({

  //---- COMMENTS ----//

  getComments(context, itemId, sorting) {
    return req.community.get(routes.comments()).query({ context, itemId, sorting })
  },

  createComments(comment) {
    return req.community.post(routes.comments(), comment)
  },

  editComment(commentId, body) {
    return req.community.put(routes.comment(commentId), { commentId, body })
  },

  deleteComment(commentId) {
    return req.community.delete(routes.comment(commentId))
  },

  hideComment(commentId) {
    return req.community.put(routes.commentAction(commentId, 'hide'))
  },

  displayComment(commentId) {
    return req.community.put(routes.commentAction(commentId, 'display'))
  },

  //---- REVIEWS ----//

  getReviews(context, itemId, sorting) {
    return req.community.get(routes.reviews()).query({ context, itemId, sorting })
  },

  createReview(review) {
    return req.community.post(routes.reviews(), review)
  },

  editReview(reviewId, body, rating) {
    return req.community.put(routes.review(reviewId), { body, rating })
  },

  deleteReview(reviewId) {
    return req.community.delete(routes.review(reviewId))
  },

  //---- VOTES ----//

  vote(vote) {
    return req.community.post(routes.vote(), vote)
  },

  getLikers(type, itemId) {
    return req.community.get(routes.likers()).query({ type, itemId })
  },

  getUserBlacklistStatus() {
    return req.community.get(routes.blacklistStatus())
  },

  //---- ACTIVITY ----//

  onProductInstall(productId) {
    return req.community.post(routes.onProductInstall(), { productId })
  },

  reportUserActivity() {
    return req.community.post(routes.reportUserActivity())
  },

  onDeveloperSuicide() {
    return req.community.delete(routes.devSuicide())
  }
})
