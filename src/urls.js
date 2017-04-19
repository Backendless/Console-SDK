export const console = authKey => `/console${authKey ? '/' + authKey : ''}`
export const appConsole = (appId, authKey) => `/${appId}${console(authKey)}`

const consoleSection = section => appId => `${appConsole(appId)}/${section}`

export const mailSettings = consoleSection('mailsettings')
export const security = consoleSection('security')
export const serverCode = consoleSection('servercode')
export const blBasePath = consoleSection('localservices')
export const data = consoleSection('data')
export const geo = consoleSection('geo')

export const dataTables = appId => `${data(appId)}/tables`
export const dataTable = (appId, tableName) => `${data(appId)}/${tableName}`
export const dataRecord = (appId, tableName, recordId) => `${dataTable(appId, tableName)}/${recordId}`
export const dataConfigs = appId => `${data(appId)}/config`
export const tableColumns = (appId, tableName) => `${dataTables(appId)}/${tableName}/columns`
export const securityRoles = appId => `${security(appId)}/roles`

const generalizeEventCategory = category => !category || category === 'TIMER' ? 'timers' : 'events'

export const blHandlersCategory = (appId, mode, category) =>
  `${ serverCode(appId) }/${ mode.toLowerCase() }/${ generalizeEventCategory(category) }`

export const fileDownload = (appId, authKey, filePath) =>
  `${appConsole(appId, authKey)}/files/download/${filePath}`

export const fileUpload = (appId, filePath) =>
  `${appConsole(appId)}/files/upload/${filePath}/`

export const createDir = (appId, path, folderName) => {
  path = path ? `${path}/` : ''

  return `${appConsole(appId)}/files/createdir/${path}${folderName}/`
}

export const fileView = (appId, authKey, filePath) =>
  `${appConsole(appId, authKey)}/files/view/${filePath}`

export const fileEdit = (appId, filePath) =>
  `${appConsole(appId)}/files/edit/${filePath}/`

export const fileDelete = (appId, filePath) =>
  `${appConsole(appId)}/files/${filePath}/`

export const fileCreate = (appId, filePath) =>
  `${appConsole(appId)}/files/create/${filePath}/`

export const blProd = (appId, language) =>
  `${serverCode(appId)}/production/${language}`

export const blDraft = (appId, language) =>
  `${serverCode(appId)}/draft/${language}`

export const blDraftsProjectDownload = (appId, authKey, language) =>
  `${appConsole(appId, authKey)}/servercode/draft/${language}/download`

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

export const marketplace = appId =>
  `${appConsole(appId)}/marketplace`

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
  blBasePath,
  fileDownload,
  fileUpload,
  fileView,
  fileEdit,
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
  marketplace,
}
