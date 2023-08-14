/* eslint-disable max-len */

import { encodePath, optional } from './utils/path'

export const console = authKey => `/console${optional(authKey)}`
export const appConsole = (appId, authKey) => `/${appId}${console(authKey)}`

const consoleSection = section => appId => `${appConsole(appId)}/${section}`

export const mailSettings = consoleSection('mailsettings')
export const security = consoleSection('security')
export const serverCode = consoleSection('servercode')
export const blBasePath = consoleSection('localservices')
export const data = consoleSection('data')
export const geo = consoleSection('geo')
export const files = consoleSection('files')
export const messaging = consoleSection('messaging')

export const dataTables = appId => `${data(appId)}/tables`
export const dataTable = (appId, tableName) => `${data(appId)}/${encodeURI(tableName)}`
export const dataTableBulkCreate = (appId, tableName) => `${data(appId)}/bulk/${encodeURI(tableName)}`
export const dataTableBulkUpsert = (appId, tableName) => `${data(appId)}/bulkupsert/${encodeURI(tableName)}`
export const dataTableGroup = (appId, tableName) => `${data(appId)}/data-grouping/${encodeURI(tableName)}`
export const dataTableGroupCount = (appId, tableName) => `${dataTableGroup(appId, tableName)}/count`
export const dataRecord = (appId, tableName, recordId) => `${dataTable(appId, tableName)}/${recordId}`
export const dataCell = (appId, tableName, recordId, columnName) => `${dataRecord(appId, tableName, recordId)}/${columnName}`
export const dataConfigs = appId => `${data(appId)}/config`
export const tableColumns = (appId, tableName) => `${dataTables(appId)}/${encodeURI(tableName)}/columns`
export const securityRoles = appId => `${security(appId)}/roles`

const generalizeEventCategory = category => !category || category === 'TIMER' ? 'timers' : 'events'

export const blHandlersCategory = (appId, mode, category) =>
  `${serverCode(appId)}/${mode.toLowerCase()}/${generalizeEventCategory(category)}`

export const blHandlersChain = (appId, eventId, context) =>
  `${serverCode(appId)}/chain/${eventId}/${context}`

const composeFileUrl = (appId, operation, filePath) => {
  const routeParts = [files(appId)]

  if (operation) {
    routeParts.push(operation)
  }

  routeParts.push(encodePath(filePath), '')

  return routeParts.join('/')
}

export const fileExists = (appId, filePath) => composeFileUrl(appId, 'exists', filePath)
export const fileEdit = (appId, filePath) => composeFileUrl(appId, 'edit', filePath)
export const fileMove = (appId, filePath) => composeFileUrl(appId, 'move', filePath)
export const fileCopy = (appId, filePath) => composeFileUrl(appId, 'copy', filePath)
export const fileRename = (appId, filePath) => composeFileUrl(appId, 'rename', filePath)
export const fileDelete = (appId, filePath) => composeFileUrl(appId, null, filePath)
export const fileCreate = (appId, filePath) => composeFileUrl(appId, 'create', filePath)
export const fileUpload = (appId, filePath) => composeFileUrl(appId, 'upload', filePath)

export const fileView = (appId, filePath, options = {}) => {
  if (filePath && !filePath.startsWith('/')) {
    filePath = `/${filePath}`
  }

  return `${options.host || ''}${appConsole(appId)}/files/view${encodePath(filePath)}`
}

export const fileDownload = (appId, filePath, options = {}) =>
  `${options.host || ''}${appConsole(appId)}/files/download/${encodePath(filePath)}`

export const createDir = (appId, path, folderName) => {
  path = path ? `${path}/` : ''

  const dirPath = encodePath(path + folderName)

  return `${files(appId)}/createdir/${dirPath}/`
}

export const directoryView = (appId, filePath, options = {}) => {
  if (filePath && filePath.startsWith('/')) {
    filePath = filePath.slice(1)
  }

  if (filePath.endsWith('/')) {
    filePath = filePath.slice(0, -1)
  }

  return `${options.host || ''}${appConsole(appId)}/files/directory/view${optional(encodePath(filePath))}`
}

export const blProd = (appId, language, model) =>
  `${serverCode(appId)}/${model}/production/${language}`

export const blDraft = (appId, language, model) =>
  `${serverCode(appId)}/${model}/draft/${language}`

export const blDraftsProjectDownload = (appId, authKey, language, model) =>
  `${appConsole(appId, authKey)}/servercode/${model}/draft/${language}/download`

export const blServicesClientDownload = (appId, authKey, serviceId, language) =>
  `${appConsole(appId, authKey)}/localservices/${serviceId}/${language}/download`

export const messagingChannels = appId =>
  `${messaging(appId)}/channels`

export const messagingPush = appId => `${messaging(appId)}/push`
export const messagingPushRecipientsCount = appId => `${messaging(appId)}/pushsize`
export const messagingPushTemplates = appId => `${messagingPush(appId)}/templates`
export const messagingPushTemplate = (appId, name) => `${messagingPushTemplates(appId)}/${name}`
export const messagingPushButtonTemplates = appId => `${messaging(appId)}/button-templates`
export const messagingPushButtonTemplate = (appId, name) => `${messagingPushButtonTemplates(appId)}/${name}`
export const messagingPushChannelTemplates = appId => `${messaging(appId)}/channel-templates`
export const messagingPushChannelTemplate = (appId, name) => `${messagingPushChannelTemplates(appId)}/${name}`

export const messagingChannel = (appId, channelId) =>
  `${messagingChannels(appId)}/${channelId}`

export const mobileSettings = appId =>
  `${appConsole(appId)}/mobilesettings`

export const billing = appId =>
  `${appConsole(appId)}/billing`

export const marketplace = (appId, name) => `${appConsole(appId)}/marketplace/${name}`

export const appInfo = appId =>
  `${appConsole(appId)}/app-info`

export const proLicense = () => `${console()}/license`

export const blueprints = id => `${console()}/blueprints${optional(id)}`

export const landingPage = appId =>
  `${appConsole(appId)}/landing-page`

export const codeless = appId => `${appConsole(appId)}/codeless`
export const codelessApiServices = appId => `${codeless(appId)}/api-services`
export const codelessFunctions = appId => `${codeless(appId)}/functions`
export const codelessFunctionSource = (appId, name) => `${codelessFunctions(appId)}/${name}`
export const codelessDeployModel = (appId, model) => `${codeless(appId)}/deploy/${model}`

export const dataViews = (appId, id) => `${appConsole(appId)}/data/table-views${optional(id)}`

export const dataHives = appId => `${appConsole(appId)}/hive`
export const dataHive = (appId, hiveName) => `${dataHives(appId)}/${hiveName}`
export const dataHiveStore = (appId, hiveName, storeType) => `${dataHive(appId, hiveName)}/${storeType}`
export const dataHiveStoreKey = (appId, hiveName, storeType, keyName) => `${dataHiveStore(appId, hiveName, storeType)}/${keyName}`

export const dataConnectors = appId => `${appConsole(appId)}/dataconnectors`
export const dataConnectorTemplates = appId => `${dataConnectors(appId)}/templates`
export const dataConnector = (appId, connectorId) => `${dataConnectors(appId)}/${connectorId}`
export const dataConnectorTables = (appId, connectorId) => `${dataConnector(appId, connectorId)}/tables`
export const dataConnectorTableEntries = (appId, connectorId, tableName) => `${dataConnectorTables(appId, connectorId)}/${tableName}/entries`
export const dataConnectorStoredProcedures = (appId, connectorId) => `${dataConnector(appId, connectorId)}/storedprocs`
export const dataConnectorStoredProcedureExecution = (appId, connectorId, procedureId) => `${dataConnectorStoredProcedures(appId, connectorId)}/${procedureId}/execution`

export const emailTemplates = (appId, templateName) => `${appConsole(appId)}/emailtemplate${optional(templateName)}`

export const installEmailTemplate = (appId, productId) => `${appConsole(appId)}/email-templates/install/${productId}`

export const apiDocs = appId => `${appConsole(appId)}/api-docs`
export const apiDocsDataTable = (appId, tableName) => `${apiDocs(appId)}/data/table/${tableName}`
export const apiDocsMessagingChannel = (appId, channelName) => `${apiDocs(appId)}/messaging/channel/${channelName}`
export const apiDocsFiles = appId => `${apiDocs(appId)}/files`
export const apiDocsService = (appId, serviceId) => `${apiDocs(appId)}/services/${serviceId}`
export const apiDocsGeo = appId => `${apiDocs(appId)}/geo`

export const cache = (appId, key) => `${appConsole(appId)}/cache${optional(key)}`
export const atomicCounters = appId => `${appConsole(appId)}/counters`

export const gamification = () => `${console()}/gamification`
export const gamificationApp = appId => `${appConsole(appId)}/gamification`

export const userActivity = appId => `${appConsole(appId)}/user-activity`

export const devTeam = (appId, devId) => `${appConsole(appId)}/devteam${optional(devId)}`

export const users = appId => `${appConsole(appId)}/users`
export const oauth1 = appId => `${users(appId)}/oauth1`
export const oauth2 = appId => `${users(appId)}/oauth2`

export const downloadComplianceFile = (appId, complianceName) =>
  `${ security(appId) }/compliances/${ complianceName }/download`

export default {
  appConsole,
  appInfo,
  atomicCounters,
  billing,
  blBasePath,
  blDraft,
  blDraftsProjectDownload,
  blHandlersCategory,
  blHandlersChain,
  blProd,
  blServicesClientDownload,
  blueprints,
  cache,
  codelessApiServices,
  codelessDeployModel,
  codelessFunctionSource,
  codelessFunctions,
  console,
  createDir,
  data,
  dataConfigs,
  dataCell,
  dataRecord,
  dataTable,
  dataTableBulkCreate,
  dataTableBulkUpsert,
  dataTables,
  devTeam,
  emailTemplates,
  fileCopy,
  fileCreate,
  fileDelete,
  fileDownload,
  fileEdit,
  fileExists,
  fileMove,
  fileRename,
  fileUpload,
  fileView,
  gamification,
  gamificationApp,
  directoryView,
  geo,
  installEmailTemplate,
  landingPage,
  mailSettings,
  marketplace,
  messaging,
  messagingChannel,
  messagingChannels,
  messagingPush,
  messagingPushRecipientsCount,
  messagingPushTemplates,
  messagingPushTemplate,
  messagingPushButtonTemplates,
  messagingPushButtonTemplate,
  messagingPushChannelTemplates,
  messagingPushChannelTemplate,
  mobileSettings,
  proLicense,
  security,
  securityRoles,
  serverCode,
  tableColumns,
  userActivity,
  users,
  dataViews,
  dataHives,
  dataConnectors,
  dataConnectorTemplates,
  dataConnector,
  dataConnectorTables,
  dataConnectorTableEntries,
  dataConnectorStoredProcedures,
  dataConnectorStoredProcedureExecution,
  apiDocsDataTable,
  apiDocsMessagingChannel,
  apiDocsFiles,
  apiDocsService,
  apiDocsGeo,
  downloadComplianceFile,
}
