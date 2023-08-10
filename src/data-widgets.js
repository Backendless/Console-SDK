import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  dashboards       : '/:appId/console/data-widgets/dashboards',
  dashboard        : '/:appId/console/data-widgets/dashboards/:dashboardId',
  dashboardSettings: '/:appId/console/data-widgets/dashboards/:dashboardId/settings',
  dashboardLayout  : '/:appId/console/data-widgets/dashboards/:dashboardId/layouts',
  dashboardRename  : '/:appId/console/data-widgets/dashboards/:dashboardId/rename',

  dashlets                : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets',
  dashletAdd              : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/add',
  dashletCreate           : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/new',
  dashlet                 : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/:dashletId',
  dashletConfigure        : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/:dashletId/configure',
  dashletLayout           : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/:dashletId/layout',
  dashletFiles            : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/:dashletId/files',
  dashletFile             : '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/:dashletId/files/:fileId',
  dashletFilesDownloadLink: '/:appId/console/data-widgets/dashboards/:dashboardId/dashlets/:dashletId/files/sign',
})

export default req => ({
  getDashboards(appId) {
    return req.get(routes.dashboards(appId))
  },

  createDashboard(appId, dashboard) {
    return req.post(routes.dashboards(appId), dashboard)
  },

  updateDashboardSettings(appId, dashboardId, settings) {
    return req.put(routes.dashboardSettings(appId, dashboardId), settings)
  },

  deleteDashboard(appId, name) {
    return req.delete(routes.dashboard(appId, name))
  },

  renameDashboard(appId, dashboardId, newName) {
    return req.put(routes.dashboardRename(appId, dashboardId), { newName })
  },

  updateDashboardLayouts(appId, dashboardName, layouts) {
    return req.put(routes.dashboardLayout(appId, dashboardName), layouts)
  },

  loadDashletComponents(appId, dashboardId) {
    return req.get(routes.dashlets(appId, dashboardId))
  },

  createDashletComponent(appId, dashboardId, dashlet) {
    return req.post(routes.dashletCreate(appId, dashboardId), dashlet)
  },

  getDashletComponentFileDownloadLink(appId, dashboardId, dashletId, fileId) {
    return req.get(routes.dashletFilesDownloadLink(appId, dashboardId, dashletId))
      .query({ fileId })
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

  loadDashletFilesList(appId, dashboardId, dashletId) {
    return req.get(routes.dashletFiles(appId, dashboardId, dashletId))
  },

  loadDashletFileContent(appId, dashboardId, dashletId, fileName) {
    return req.get(routes.dashletFile(appId, dashboardId, dashletId, fileName))
  },

  updateDashletFiles(appId, dashboardId, dashletId, files) {
    return req.put(routes.dashletFiles(appId, dashboardId, dashletId), files)
  }
})
