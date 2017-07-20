export const console = authKey => `/console${authKey ? '/' + authKey : ''}`
export const appConsole = (appId, authKey) => `/${appId}${console(authKey)}`

const consoleSection = section => appId => `${appConsole(appId)}/${section}`

export const mailSettings = consoleSection('mailsettings')
export const security = consoleSection('security')
export const serverCode = consoleSection('servercode')
export const blBasePath = consoleSection('localservices')
export const data = consoleSection('data')
export const geo = consoleSection('geo')
export const files = consoleSection('files')
export const marketplace = consoleSection('marketplace')

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

export const messaging = appId =>
  `${appConsole(appId)}/messaging`

export const messagingChannels = appId =>
  `${messaging(appId)}/channels`

export const messagingChannel = (appId, channelId) =>
  `${messagingChannels(appId)}/${channelId}`

export const mobileSettings = appId =>
  `${appConsole(appId)}/mobilesettings`

export const billing = appId =>
  `${appConsole(appId)}/billing`

export const codeless = appId => `${appConsole(appId)}/codeless`
export const codelessApiServices = appId => `${codeless(appId)}/api-services`
export const codelessFunctions = appId => `${codeless(appId)}/functions`
export const codelessFunctionSource = (appId, name) => `${codelessFunctions(appId)}/${name}`

export default {
  console,
  appConsole,
  billing,
  mailSettings,
  security,
  securityRoles,
  serverCode,
  data,
  geo,
  dataTable,
  dataRecord,
  dataTables,
  dataConfigs,
  tableColumns,
  blHandlersCategory,
  blHandlersChain,
  blBasePath,
  fileDownload,
  fileUpload,
  fileExists,
  fileView,
  fileEdit,
  fileMove,
  fileCopy,
  fileRename,
  fileDelete,
  fileCreate,
  createDir,
  blDraft,
  blProd,
  blDraftsProjectDownload,
  blServicesClientDownload,
  marketplace,
  messaging,
  messagingChannels,
  messagingChannel,
  mobileSettings,
  codelessApiServices,
  codelessFunctions,
  codelessFunctionSource
}
