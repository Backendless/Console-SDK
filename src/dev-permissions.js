import urls from './urls'

const AccessTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY'
}

const OperationsTypes = {
  /** App Access Security */
  INVITE_TEAM_MEMBER           : 'Add developer',
  ASSIGN_TEAM_MEMBER_PERMISSION: 'Modify permission',
  REMOVE_TEAM_MEMBER           : 'Remove developer',

  /** App Settings */
  APP_RESET                 : 'Application reset',
  CHANGE_CORS_DOMAIN_CONTROL: 'Change CORS/domain control',
  CHANGE_CUSTOM_DOMAIN      : 'Change custom domain',
  CHANGE_EMAIL_SETTINGS     : 'Change email settings',
  CHANGE_LIMIT_NOTIFICATION : 'Change limit notification',
  CHANGE_MOBILE_SETTINGS    : 'Change mobile settings',
  CHANGE_SOCIAL_SETTINGS    : 'Change social settings',
  CREATE_REPOSITORY         : 'Create repository',
  DELETE_APPLICATION        : 'Delete application',
  ENABLE_DISABLE_GIT        : 'Enable/disable git',
  INSTALL_LICENSE           : 'Install license',
  REGENERATE_API_KEYS       : 'Regenerate API keys',
  SET_GOOGLE_KEY            : 'Set Google service account private key',

  /** Billing */
  BILLING_SECTION            : 'Billing section',
  ADD_UPDATE_CREDIT_CARD     : 'Add/update credit card',
  CHANGE_BILLING_PLAN        : 'Change billing plan',
  MARKETPLACE_DELETE_PURCHASE: 'Delete Marketplace purchases',
  MARKETPLACE_PURCHASE       : 'Purchase from the Marketplace',

  /** Business Logic */
  BUSINESS_LOGIC_SECTION          : 'Business Logic section',
  CREATE_MARKETPLACE_CONFIGURATION: 'Create marketplace configuration',
  DELETE_FROM_MARKETPLACE         : 'Delete from marketplace',
  INVOKE_EVENT_WITH_MODEL         : 'Invoke event with model',
  MODIFY_BL                       : 'Modify Business Logic',
  PUBLISH_TO_MARKETPLACE          : 'Publish to Marketplace',
  RUN_TIMER                       : 'Run timer',

  /** Cache */
  CACHE_SECTION : 'Cache section',
  ADD_CHANGE_KEY: 'Add/change key',
  DELETE_KEY    : 'Delete key',

  /** Data Service */
  DATA_SERVICE_SECTION            : 'Data Service section',
  CHANGE_DYNAMIC_SCHEMA_DEFINITION: 'Change "Dynamic Schema Definition" configuration',
  CHANGE_OBJECT_ACL_PERMISSIONS   : 'Change ACL permissions for objects',
  CHANGE_DATA_RELATIONSHIP        : 'Change data relationship',
  CHANGE_GEO_RELATIONSHIP         : 'Change geo relationship',
  CHANGE_GLOBAL_OWNER_PERMISSIONS : 'Change global owner permissions',
  CHANGE_OWNER_PERMISSIONS        : 'Change owner permissions',
  CHANGE_TABLE_PERMISSIONS        : 'Change user/role permissions for a table',
  CHANGE_DELETE_TABLE_COLUMN      : 'Change/delete columns',
  CREATE_TABLE_COLUMN             : 'Create columns',
  CREATE_DATA_RELATIONSHIP        : 'Create data relationship',
  CREATE_GEO_RELATIONSHIP         : 'Create geo relationship',
  CREATE_TABLE                    : 'Create tables',
  CREATE_DELETE_UPDATE_OBJECTS    : 'Create/delete/update objects in DATA BROWSER',
  DELETE_OBJECT_ACL_PERMISSIONS   : 'Delete object acl permissions',
  DELETE_OWNER_PERMISSIONS        : 'Delete owner permissions',
  DELETE_TABLE_PERMISSIONS        : 'Delete table permissions',
  RENAME_DELETE_TABLE             : 'Rename/delete tables',

  /** Data connector */
  DATA_CONNECTOR_SECTION: 'Data Connector section',
  ACTIVATE_DATACONNECTOR: 'Activate data connector',
  STORED_PROCEDURE      : 'Call stored procedure',
  CHANGE_DATACONNECTOR  : 'Change data connector',
  DELETE_DATACONNECTOR  : 'Delete data connector',

  /** Email Templates */
  EMAIL_TEMPLATES_SECTION: 'Email Templates section',
  CREATE_EMAIL_TEMPLATE  : 'Create new email template',
  DELETE_EMAIL_TEMPLATE  : 'Delete email template',
  MODIFY_EMAIL_TEMPLATE  : 'Modify email templates',
  SEND_TEST_EMAIL        : 'Send test email',

  /** File Service */
  FILES_SECTION                : 'Files section',
  CHANGE_FILE_PERMISSIONS      : 'Change directories/files permissions',
  COPY_FILE                    : 'Copy file',
  CREATE_DIRECTORY             : 'Create directories',
  DELETE_FILE_PERMISSIONS      : 'Delete file permissions',
  DOWNLOAD_FILE                : 'Download file',
  EDIT_FILE                    : 'Edit file',
  MOVE_FILE                    : 'Move file',
  RENAME_DELETE_DIRECTORY_FILES: 'Rename/delete directories/files',
  UNZIP_FILE                   : 'Unzip file',
  UPLOAD_CREATE_FILES          : 'Upload/create files',
  VIEW_DIRECTORY_CONTENT       : 'View directory content',
  ZIP_DIRECTORY                : 'Zip directory',

  /** Geolocation */
  GEOLOCATION_SECTION            : 'Geolocation section',
  ADD_CATEGORY                   : 'Add category',
  CHANGE_GEO_CATEGORY_PERMISSIONS: 'Change user/role permissions for geo category',
  COPY_GEO_POINTS                : 'Copy geo points',
  CREATE_GEOFENCE                : 'Create a geofence',
  CREATE_GEO_CATEGORY            : 'Create geo category',
  DELETE_GEO_CATEGORY_PERMISSIONS: 'Delete geo category permissions',
  MODIFY_GEO_POINT_METADATA      : 'Modify geopoint metadata',
  MODIFY_DELETE_GEOFENCE         : 'Modify/delete a geofence',
  REMOVE_ALL_GEO_POINTS          : 'Remove all geo points',
  REMOVE_GEO_POINTS              : 'Remove geo points',
  RENAME_DELETE_GEO_CATEGORY     : 'Rename/delete geo category',
  SETUP_SAMPLE_GEO_DATA          : 'Setup sample data',

  /** Import/Export */
  IMPORT_EXPORT_SECTION: 'Import/Export section',
  CLONE_APP            : 'Clone application',
  EXPORT_APP           : 'Export app settings/app data',
  IMPORT               : 'Import',

  /** Landing Page */
  LANDING_PAGE_SECTION: 'Landing Page section',
  MODIFY_LANDING_PAGE : 'Modify landing page',
  PUBLISH_LANDING_PAGE: 'Publish landing page',

  /** Log Management */
  LOG_MANAGEMENT_SECTION : 'Log Management section',
  CHANGE_LOG_CONFIG      : 'Change logging configuration',
  CHANGE_LOG_INTEGRATIONS: 'Change logging integrations',
  DELETE_LOGGERS         : 'Delete log files',

  /** Messaging/Push Notifications */
  MESSAGING_SECTION                      : 'Messaging section',
  CHANGE_MESSAGING_CHANNEL_PERMISSIONS   : 'Change user/role permissions for messaging channel',
  CHANGE_DELETE_PUSH_BUTTON_OPTIONS      : 'Change/delete button options',
  CHANGE_DELETE_MESSAGING_CHANNEL_OPTIONS: 'Change/delete channel options',
  CHANGE_DELETE_PUSH_TEMPLATE            : 'Change/delete push template',
  CREATE_PUSH_BUTTON_OPTIONS             : 'Create button options',
  CREATE_MESSAGING_CHANNEL_OPTIONS       : 'Create channel options',
  CREATE_MESSAGING_CHANNEL               : 'Create messaging channel',
  CREATE_PUSH_TEMPLATE                   : 'Create push template',
  DELETE_DEVICES                         : 'Delete devices',
  DELETE_MESSAGING_CHANNEL_PERMISSIONS   : 'Delete messaging channel permissions',
  RENAME_DELETE_MESSAGING_CHANNEL        : 'Rename/delete messaging channel',
  SEND_MESSAGE_TO_CHANNEL                : 'Send a message to a channel',
  SEND_PUSH_BY_TEMPLATE                  : 'Send push notification with template',

  /** Security Roles */
  SECURITY_ROLES_SECTION : 'Security Roles section',
  ADD_DELETE_ROLE        : 'Add/delete security role',
  ASSIGN_ROLE_PERMISSIONS: 'Map users to roles',
  MODIFY_ROLE_PERMISSIONS: 'Modify security role permissions',

  /** User Management */
  USERS_SECTION                 : 'Users section',
  CHANGE_LOGIN_PROPS            : 'Change login properties',
  CHANGE_USER_REGISTRATION_PROPS: 'Change user registration properties',
}

const OperationsLabels = {}

Object.keys(OperationsTypes).forEach(operation => {
  OperationsLabels[operation] = OperationsTypes[operation]
  OperationsTypes[operation] = operation
})

export const DevPermissions = {
  OperationsTypes,
  OperationsLabels,
  AccessTypes,
}

export default req => ({

  get(appId, operation) {
    return req.get(`${urls.security(appId)}/${operation}`)
  }
})
