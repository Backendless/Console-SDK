import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  sections        : '/console/marketplace/sections',
  categoryProducts: '/console/marketplace/categories/:categoryId/products',

  products             : '/console/marketplace/products',
  product              : '/console/marketplace/products/:productId',
  productApprove       : '/console/marketplace/products/:productId/approve',
  productReject        : '/console/marketplace/products/:productId/reject',
  productConfigurations: '/console/marketplace/products/:productId/configurations',

  purchases              : '/:appId/console/marketplace/purchases',
  purchasesProduct       : '/:appId/console/marketplace/purchases/:productId',
  purchasesProductPreview: '/:appId/console/marketplace/purchases/:productId/preview',

  comments: '/console/marketplace/comments',
  comment : '/console/marketplace/comments/:commentId',
  reviews : '/console/marketplace/reviews',
  review  : '/console/marketplace/review/:reviewId',
  vote    : '/console/marketplace/vote/like',
  likers  : '/console/marketplace/vote/likers',
})

export default req => ({

  //---- SECTIONS ==>

  getSections() {
    return req.get(routes.sections())
  },

  getCategoryProducts(categoryId) {
    return req.get(routes.categoryProducts(categoryId))
  },

  //---- SECTIONS ----//

  //---- PRODUCT ==>

  // getProduct(productId) {
  //   return req.get(routes.product(productId))
  // },

  getProductConfigurations(productId) {
    return req.get(routes.productConfigurations(productId))
  },

  publishProduct(product) {
    return req.post(routes.products(), product)
  },

  approveProduct(productId) {
    return req.put(routes.productApprove(productId))
  },

  rejectProduct(productId, reason) {
    return req.put(routes.productReject(productId), reason)
  },

  removeProduct(productId, reason) {
    return req.delete(routes.product(productId), reason)
  },

  //---- PRODUCT ----//

  //---- PURCHASES ==>

  getPurchases(appId) {
    return req.get(routes.purchases(appId))
  },

  allocateProduct(appId, productId, options) {
    return req.post(routes.purchasesProduct(appId, productId), options)
  },

  // previewProduct(appId, productId, options) {
  //   return req.post(routes.purchasesProductPreview(appId, productId), options)
  // },

  //---- PURCHASES ----//


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

  editReview(reviewId, summary, body, rating) {
    return req.put(routes.review(reviewId), { summary, body, rating })
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
  }

})
