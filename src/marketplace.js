import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  sections        : '/console/community/marketplace/sections',
  categories      : '/console/community/marketplace/categories',
  categoryProducts: '/console/community/marketplace/categories/:categoryId/products',

  products               : '/console/community/marketplace/products',
  product                : '/console/community/marketplace/products/:productId',
  productResources       : '/console/community/marketplace/products/:productId/resources',
  productResourcesDetails: '/console/community/marketplace/products/:productId/resources/details',
  productVersions        : '/console/community/marketplace/products/:productId/versions',
  productApprove         : '/console/community/marketplace/products/:productId/approve',
  productReject          : '/console/community/marketplace/products/:productId/reject',
  productConfigurations  : '/console/community/marketplace/products/:productId/configurations',
  productPrivateDevs     : '/console/community/marketplace/products/:productId/private-devs',

  submissions: '/console/community/marketplace/submissions',

  appPurchases              : '/:appId/console/community/marketplace/app-purchases',
  appPurchasesProduct       : '/:appId/console/community/marketplace/app-purchases/:productId',
  appPurchasesProductExists : '/:appId/console/community/marketplace/app-purchases/:productId/exists',
  appPurchasesProductPreview: '/:appId/console/community/marketplace/app-purchases/:productId/preview',

  accountPurchases       : '/console/community/marketplace/account-purchases',
  accountPurchasesProduct: '/console/community/marketplace/account-purchases/:productId',

  accountPurchasesPaymentProfile: '/console/community/marketplace/account-purchases/update-payment-profile',
  accountPurchaseReactivate     : '/console/community/marketplace/account-purchases/:productId/renew',

  developerPayoutHistory: '/console/community/marketplace/developer-sales/payouts',
  developerProductSales : '/console/community/marketplace/developer-sales/product-sales',
  developerGeneralSales : '/console/community/marketplace/developer-sales/general-sales',

  installDetails: '/console/community/marketplace/installs/details',

  appInstalls: '/api/app/:appId/marketplace/installs',
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

  getProductVersions(productId, query) {
    return req.community.get(routes.productVersions(productId)).query(query)
  },

  getProductResources(productId, { versionId, filePath }) {
    if (filePath) {
      filePath = encodeURIComponent(filePath)
    }

    return req.community.get(routes.productResources(productId)).query({ versionId, filePath })
      .setEncoding(null)
  },

  getProductResourcesDetails(productId, versionId) {
    return req.community.get(routes.productResourcesDetails(productId)).query({ versionId })
  },

  getProductConfigurations(productId, version) {
    return req.get(routes.productConfigurations(productId)).query({ version })
  },

  getProductPrivateDevs(productId) {
    return req.community.get(routes.productPrivateDevs(productId))
  },

  updateProductPrivateDevs(productId, privateDevs) {
    return req.community.put(routes.productPrivateDevs(productId), privateDevs)
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

  isAppProductPurchased(appId, productId) {
    return req.community.get(routes.appPurchasesProductExists(appId, productId))
  },

  // previewProduct(appId, productId, options) {
  //   return req.post(routes.appPurchasesProductPreview(appId, productId), options)
  // },

  //---- PURCHASES ----//

  //---- APP INSTALLS ==>

  getAppInstalls(appId) {
    return req.get(routes.appInstalls(appId))
  },

  getInstallsDetails(productIds) {
    return req.community.get(routes.installDetails()).query({ productIds })
  },

  //---- APP INSTALLS ----//

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

  updateAccountPurchasesPaymentProfile(paymentProfileId) {
    return req.put(routes.accountPurchasesPaymentProfile(), { paymentProfileId })
  },

  reactivateAccountPurchase(productId) {
    return req.post(routes.accountPurchaseReactivate(productId))
  },

  getDeveloperPayoutHistory() {
    return req.get(routes.developerPayoutHistory())
  },

  getDeveloperProductSales() {
    return req.get(routes.developerProductSales())
  },

  getDeveloperGeneralSales(query) {
    return req.get(routes.developerGeneralSales()).query(query)
  },

})
