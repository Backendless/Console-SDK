import { prepareRoutes } from './utils/routes'

/* eslint-disable max-len */
const routes = prepareRoutes({
  dashboards       : '/:appId/console/data-to-visualize/dashboards',
  dashboard        : '/:appId/console/data-to-visualize/dashboards/:dashboardId',
  dashboardSettings: '/:appId/console/data-to-visualize/dashboards/:dashboardId/settings',
  dashboardLayout  : '/:appId/console/data-to-visualize/dashboards/:dashboardId/layouts',

  dashlets        : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets',
  dashletAdd      : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets/add',
  dashlet         : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets/:dashletId',
  dashletConfigure: '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets/:dashletId/configure',
  dashletLayout   : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlets/:dashletId/layout',

  dashletComponents                : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components',
  dashletComponentCreate           : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/create',
  dashletComponent                 : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/',
  dashletComponentFiles            : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/files',
  dashletComponentFile             : '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/files/:fileId',
  dashletComponentFilesDownloadLink: '/:appId/console/data-to-visualize/dashboards/:dashboardId/dashlet-components/:componentId/files/sign',
})

export default req => ({
  getDashboards(appId) {
    return req.get(routes.dashboards(appId))
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

  updateDashboardLayouts(appId, dashboardName, layouts) {
    return req.put(routes.dashboardLayout(appId, dashboardName), layouts)
  },

  addDashboardDashlet(appId, dashboardId, dashlet) {
    return req.post(routes.dashletAdd(appId, dashboardId), dashlet)
  },

  deleteDashboardDashlet(appId, dashboardId, dashletId) {
    return req.delete(routes.dashlet(appId, dashboardId, dashletId))
  },

  updateDashboardDashlet(appId, dashboardId, dashletId, changes) {
    return req.put(routes.dashlet(appId, dashboardId, dashletId), changes)
  },

  configureDashboardDashlet(appId, dashboardId, dashlet) {
    return req.put(routes.dashletConfigure(appId, dashboardId, dashlet.id), dashlet)
  },

  loadDashletComponents(appId, dashboardId) {
    return req.get(routes.dashletComponents(appId, dashboardId))
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

  updateDashletComponentFiles(appId, dashboardId, componentId, files) {
    return req.put(routes.dashletComponentFiles(appId, dashboardId, componentId), files)
  }
})
