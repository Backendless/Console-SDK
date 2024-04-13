import { prepareRoutes } from './utils/routes'

/* eslint-disable max-len */
const routes = prepareRoutes({
  dashboards       : '/:appId/console/data-to-visualize/dashboards',
  dashboard        : '/:appId/console/data-to-visualize/dashboards/:dashboardId',
  dashboardSettings: '/:appId/console/data-to-visualize/dashboards/:dashboardId/settings',

  dashlets      : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets',
  createDashlets: '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets/create',
  dashlet       : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets/:dashletId',

  dashletComponents                : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components',
  dashletComponentInstall          : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/install',
  dashletComponentCreate           : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/create',
  dashletComponentUpgrade          : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/upgrade',
  dashletComponent                 : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/',
  dashletComponentFiles            : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/files',
  dashletComponentFile             : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/files/:fileId',
  dashletComponentFilesDownloadLink: '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/files/sign',
})

export default req => ({
  getDashboards(appId, query) {
    return req.get(routes.dashboards(appId)).query(query)
  },

  createDashboard(appId, dashboard) {
    return req.post(routes.dashboards(appId), dashboard)
  },

  updateDashboard(appId, dashboardId, changes) {
    return req.put(routes.dashboard(appId, dashboardId), changes)
  },

  updateDashboardSettings(appId, dashboardId, settings) {
    return req.put(routes.dashboardSettings(appId, dashboardId), settings)
  },

  deleteDashboard(appId, name) {
    return req.delete(routes.dashboard(appId, name))
  },

  addDashboardDashlet(appId, dashboardId, dashletComponent) {
    return req.post(routes.dashlets(appId, dashboardId), dashletComponent)
  },

  createDashboardDashlets(appId, dashboardId, dashlets) {
    return req.post(routes.createDashlets(appId, dashboardId), dashlets)
  },

  deleteDashboardDashlet(appId, dashboardId, dashletId) {
    return req.delete(routes.dashlet(appId, dashboardId, dashletId))
  },

  updateDashboardDashlet(appId, dashboardId, dashletId, changes) {
    return req.put(routes.dashlet(appId, dashboardId, dashletId), changes)
  },

  loadDashletComponents(appId, dashboardId) {
    return req.get(routes.dashletComponents(appId, dashboardId))
  },

  installDashletComponent(appId, dashboardId, product) {
    return req.post(routes.dashletComponentInstall(appId, dashboardId), product)
  },

  upgradeDashletComponent(appId, dashboardId, product, versionId) {
    return req.post(routes.dashletComponentUpgrade(appId, dashboardId), { product, versionId })
  },

  createDashletComponent(appId, dashboardId, dashlet) {
    return req.post(routes.dashletComponentCreate(appId, dashboardId), dashlet)
  },

  deleteDashletComponent(appId, dashboardId, componentId) {
    return req.delete(routes.dashletComponent(appId, dashboardId, componentId))
  },

  updateDashletComponent(appId, dashboardId, componentId, changes) {
    return req.put(routes.dashletComponent(appId, dashboardId, componentId), changes)
  },

  getDashletComponentFileDownloadLink(appId, dashboardId, componentId, fileId) {
    return req.get(routes.dashletComponentFilesDownloadLink(appId, dashboardId, componentId))
      .query({ fileId })
  },

  loadDashletComponentFilesList(appId, dashboardId, componentId) {
    return req.get(routes.dashletComponentFiles(appId, dashboardId, componentId))
  },

  loadDashletComponentFileContent(appId, dashboardId, componentId, fileName) {
    return req.get(routes.dashletComponentFile(appId, dashboardId, componentId, fileName))
  },

  uploadDashletComponentFiles(appId, dashboardId, componentId, files) {
    return req.post(routes.dashletComponentFiles(appId, dashboardId, componentId), files)
  },

  updateDashletComponentFiles(appId, dashboardId, componentId, files) {
    return req.put(routes.dashletComponentFiles(appId, dashboardId, componentId), files)
  }
})
