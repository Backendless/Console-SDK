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

  appPurchases              : '/:appId/console/community/marketplace/app-purchases',
  appPurchasesProduct       : '/:appId/console/community/marketplace/app-purchases/:productId',
  appPurchasesProductPreview: '/:appId/console/community/marketplace/app-purchases/:productId/preview',

  accountPurchases       : '/console/community/marketplace/account-purchases',
  accountPurchasesProduct: '/console/community/marketplace/account-purchases/:productId',
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

  getAppPurchases(appId) {
    return req.get(routes.appPurchases(appId))
  },

  allocateAppProduct(appId, productId, options) {
    return req.post(routes.appPurchasesProduct(appId, productId), options)
  },

  // previewProduct(appId, productId, options) {
  //   return req.post(routes.appPurchasesProductPreview(appId, productId), options)
  // },

  //---- PURCHASES ----//

  //---- SUBMISSIONS ==>

  getSubmissions() {
    return req.get(routes.submissions())
  },

  getAccountPurchases() {
    return req.get(routes.accountPurchases())
  },

  allocateAccountProduct(productId, options) {
    return req.post(routes.accountPurchasesProduct(productId), options)
  },
})
