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

})
