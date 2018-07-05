/* eslint-disable max-len */

import { optional } from './utils/path'

export const console = authKey => `/console${optional(authKey)}`
export const appConsole = (appId, authKey) => `/${appId}${console(authKey)}`

const consoleSection = section => appId => `${appConsole(appId)}/${section}`

export const mailSettings = consoleSection('mailsettings')
export const security = consoleSection('security')
export const serverCode = consoleSection('servercode')
export const blBasePath = consoleSection('localservices')
export const data = consoleSection('data')
export const systemData = consoleSection('system/data')
export const geo = consoleSection('geo')
export const files = consoleSection('files')
export const messaging = consoleSection('messaging')

export const dataTables = appId => `${data(appId)}/tables`
export const dataTable = (appId, tableName) => `${data(appId)}/${tableName}`
export const dataRecord = (appId, tableName, recordId) => `${dataTable(appId, tableName)}/${recordId}`
export const dataConfigs = appId => `${data(appId)}/config`
export const tableColumns = (appId, tableName) => `${dataTables(appId)}/${tableName}/columns`
export const securityRoles = appId => `${security(appId)}/roles`

const generalizeEventCategory = category => !category || category === 'TIMER' ? 'timers' : 'events'

export const blHandlersCategory = (appId, mode, category) =>
  `${ serverCode(appId) }/${ mode.toLowerCase() }/${ generalizeEventCategory(category) }`

export const blHandlersChain = (appId, eventId, context) =>
  `${ serverCode(appId) }/chain/${ eventId }/${ context }`

export const fileDownload = (appId, authKey, filePath) =>
  `${appConsole(appId, authKey)}/files/download/${filePath}`

export const fileUpload = (appId, filePath) =>
  `${files(appId)}/upload/${filePath}/`

export const createDir = (appId, path, folderName) => {
  path = path ? `${path}/` : ''

  return `${files(appId)}/createdir/${path}${folderName}/`
}

export const fileView = (appId, authKey, filePath) =>
  `${appConsole(appId, authKey)}/files/view/${filePath}`

export const fileExists = (appId, filePath) =>
  `${files(appId)}/files/exists/${filePath}`

export const fileEdit = (appId, filePath) =>
  `${files(appId)}/edit/${filePath}/`

export const fileMove = (appId, filePath) =>
  `${files(appId)}/move/${filePath}/`

export const fileCopy = (appId, filePath) =>
  `${files(appId)}/copy/${filePath}/`

export const fileRename = (appId, filePath) =>
  `${files(appId)}/rename/${filePath}/`

export const fileDelete = (appId, filePath) =>
  `${files(appId)}/${filePath}/`

export const fileCreate = (appId, filePath) =>
  `${files(appId)}/create/${filePath}/`

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
export const messagingScheduledPushes = appId => `${messagingPush(appId)}/scheduled`
export const messagingScheduledPush = (appId, name) => `${messagingScheduledPushes(appId)}/${name}`
export const messagingPushSchedules = appId => `${messagingPush(appId)}/schedules`
export const messagingPushSchedule = (appId, name) => `${messagingPushSchedules(appId)}/${name}`

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

export const dataConnectors = appId => `${appConsole(appId)}/dataconnectors`
export const dataConnectorTemplates = appId => `${dataConnectors(appId)}/templates`
export const dataConnector = (appId, connectorId) => `${dataConnectors(appId)}/${connectorId}`
export const dataConnectorTables = (appId, connectorId) => `${dataConnector(appId, connectorId)}/tables`
export const dataConnectorTableEntries = (appId, connectorId, tableName) => `${dataConnectorTables(appId, connectorId)}/${tableName}/entries`
export const dataConnectorStoredProcedures = (appId, connectorId) => `${dataConnector(appId, connectorId)}/storedprocs`
export const dataConnectorStoredProcedureExecution = (appId, connectorId, procedureId) => `${dataConnectorStoredProcedures(appId, connectorId)}/${procedureId}/execution`

export const apiDocs = appId => `${appConsole(appId)}/api-docs`
export const apiDocsData = appId => `${apiDocs(appId)}/data`
export const apiDocsDataTable = (appId, tableName) => `${apiDocsData(appId)}/table/${tableName}`
export const apiDocsMessagingChannel = (appId, channelName) => `${apiDocs(appId)}/messaging/channel/${channelName}`
export const apiDocsFiles = appId => `${apiDocs(appId)}/files`

export const cache = (appId, key) => `${appConsole(appId)}/cache${optional(key)}`
export const counters = (appId, key) => `${systemData(appId)}/counters${optional(key)}`

export default {
  appConsole,
  appInfo,
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
  counters,
  codelessApiServices,
  codelessDeployModel,
  codelessFunctionSource,
  codelessFunctions,
  console,
  createDir,
  data,
  dataConfigs,
  dataRecord,
  dataTable,
  dataTables,
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
  geo,
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
  messagingScheduledPushes,
  messagingScheduledPush,
  messagingPushSchedules,
  messagingPushSchedule,
  mobileSettings,
  proLicense,
  security,
  securityRoles,
  serverCode,
  tableColumns,
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
}
