import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  sections        : '/console/community/marketplace/sections',
  categories      : '/console/community/marketplace/categories',
  categoryProducts: '/console/community/marketplace/categories/:categoryId/products',

  products             : '/console/community/marketplace/products',
  product              : '/console/community/marketplace/products/:productId',
  productResources     : '/console/community/marketplace/products/:productId/resources',
  productApprove       : '/console/community/marketplace/products/:productId/approve',
  productReject        : '/console/community/marketplace/products/:productId/reject',
  productConfigurations: '/console/community/marketplace/products/:productId/configurations',

  submissions  : '/console/community/marketplace/submissions',

  stripeConnectAuth : '/console/community/marketplace/stripe-connect/auth',
  stripeConnectToken: '/console/community/marketplace/stripe-connect/token',
  stripeConnect     : '/console/developer/stripe-connect',

  purchases              : '/:appId/console/community/marketplace/purchases',
  purchasesProduct       : '/:appId/console/community/marketplace/purchases/:productId',
  purchasesProductPreview: '/:appId/console/community/marketplace/purchases/:productId/preview',
})

export const marketplace = req => ({

  //---- SECTIONS ==>

  getSections() {
    return req.get(routes.sections())
  },

  //---- SECTIONS ----//

  //---- CATEGORIES ==>

  getCategories(query) {
    return req.get(routes.categories()).query(query)
  },

  getCategoryProducts(categoryId) {
    return req.get(routes.categoryProducts(categoryId))
  },

  //---- CATEGORIES ----//

  //---- PRODUCTS ==>

  getProducts(query) {
    return req.get(routes.products()).query(query)
  },
  //---- PRODUCTS ----//

  //---- PRODUCT ==>

  getProduct(productId) {
    return req.community.get(routes.product(productId))
  },

  getProductResources(productId) {
    return req.community.get(routes.productResources(productId))
  },

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

  //---- SUBMISSIONS ==>

  getSubmissions() {
    return req.get(routes.submissions())
  },

  //---- DEVELOPER PROGRAM ----//

  completeStripeConnection(data) {
    return req.post(routes.stripeConnectAuth(), data)
  },

  getStripeConnectToken() {
    return req.get(routes.stripeConnectToken())
  },

  getStripeConnectAccountId() {
    return req.get(routes.stripeConnect())
  },

  setStripeConnectAccountId(data) {
    return req.put(routes.stripeConnect(), data)
  },
})
