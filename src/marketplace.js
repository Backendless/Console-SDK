import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  sections        : '/console/community/marketplace/sections',
  categories      : '/console/community/marketplace/categories',
  categoryProducts: '/console/community/marketplace/categories/:categoryId/products',

  products             : '/console/community/marketplace/products',
  product              : '/console/community/marketplace/products/:productId',
  productApprove       : '/console/community/marketplace/products/:productId/approve',
  productReject        : '/console/community/marketplace/products/:productId/reject',
  productConfigurations: '/console/community/marketplace/products/:productId/configurations',

  submissions: '/console/community/marketplace/submissions',

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

  //---- SUBMISSIONS ==>

  getSubmissions() {
    return req.get(routes.submissions())
  },

  //---- SUBMISSIONS ----//

})
