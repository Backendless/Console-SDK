import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  sections        : 'marketplace/sections',
  categoryProducts: 'marketplace/categories/:categoryId/products',

  products             : 'marketplace/products',
  product              : 'marketplace/products/:productId',
  productApprove       : 'marketplace/products/:productId/approve',
  productReject        : 'marketplace/products/:productId/reject',
  productConfigurations: 'marketplace/products/:productId/configurations',

  purchases              : 'marketplace/purchases',
  purchasesProduct       : 'marketplace/purchases/:productId',
  purchasesProductPreview: 'marketplace/purchases/:productId/preview',
})

export default req => ({

  //---- SECTIONS ==>

  getSections(appId) {
    return req.get(routes.sections(appId))
  },

  getCategoryProducts(appId, categoryId) {
    return req.get(routes.categoryProducts(appId, categoryId))
  },

  //---- SECTIONS ----//

  //---- PRODUCT ==>

  // getProduct(appId, productId) {
  //   return req.get(routes.product(appId, productId))
  // },

  getProductConfigurations(appId, productId) {
    return req.get(routes.productConfigurations(appId, productId))
  },

  publishProduct(appId, product) {
    return req.post(routes.products(appId), product)
  },

  approveProduct(appId, productId) {
    return req.put(routes.productApprove(appId, productId))
  },

  rejectProduct(appId, productId, reason) {
    return req.put(routes.productReject(appId, productId), reason)
  },

  removeProduct(appId, productId, reason) {
    return req.delete(routes.product(appId, productId), reason)
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
