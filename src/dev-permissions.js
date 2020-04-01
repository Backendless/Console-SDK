import urls from './urls'

const AccessTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY'
}

const OperationsTypes = {
  /** App Access Security */
  INVITE_OR_REMOVE_TEAM_MEMBER : 'Add/remove developer',
  ASSIGN_TEAM_MEMBER_PERMISSION: 'Modify permission',

  /** App Settings */
  APP_RESET                 : 'Application reset',
  MODIFY_CORS_DOMAIN_CONTROL: 'Modify CORS/domain control',
  MODIFY_CUSTOM_DOMAIN      : 'Modify custom domain',
  MODIFY_EMAIL_SETTINGS     : 'Modify email settings',
  MODIFY_LIMIT_NOTIFICATION : 'Modify limit notification',
  MODIFY_MOBILE_SETTINGS    : 'Modify mobile settings',
  MODIFY_SOCIAL_SETTINGS    : 'Modify social settings',
  DELETE_APPLICATION        : 'Delete application',
  ENABLE_DISABLE_GIT        : 'Enable/disable git',
  INSTALL_LICENSE           : 'Install license',
  MANAGE_API_KEYS           : 'Manage API keys',
  PROMOTE_APPLICATION       : 'Promote schema from one of your applications to another',

  /** Billing */
  BILLING_SECTION            : 'Billing section',
  ADD_UPDATE_CREDIT_CARD     : 'Add/update credit card',
  MODIFY_BILLING_PLAN        : 'Modify billing plan',
  MARKETPLACE_DELETE_PURCHASE: 'Delete Marketplace purchases',
  MARKETPLACE_PURCHASE       : 'Purchase from the Marketplace',

  /** Business Logic */
  BUSINESS_LOGIC_SECTION : 'Business Logic section',
  DELETE_FROM_MARKETPLACE: 'Delete from marketplace',
  INVOKE_EVENT_WITH_MODEL: 'Invoke event with model',
  MODIFY_BL              : 'Modify Business Logic',
  PUBLISH_TO_MARKETPLACE : 'Publish to Marketplace',
  RUN_TIMER              : 'Run timer',

  /** Data Service */
  DATA_SERVICE_SECTION                  : 'Data Service section',
  MODIFY_DYNAMIC_SCHEMA_DEFINITION      : 'Modify "Dynamic Schema Definition" configuration',
  CREATE_MODIFY_DELETE_COLUMN           : 'Create/Rename/Delete columns',
  CREATE_MODIFY_DELETE_TABLE            : 'Create/Rename/Delete tables',
  CREATE_DELETE_UPDATE_OBJECTS          : 'Create/delete/update objects',
  CREATE_MODIFY_DELETE_TABLE_PERMISSIONS: 'Manage permissions for tables (including ACL)',
  CREATE_MODIFY_DELETE_OWNER_PERMISSIONS: 'Manage global owner permissions',

  /** Data connector */
  DATA_CONNECTOR_SECTION             : 'Data Connector section',
  CREATE_MODIFY_DELETE_DATA_CONNECTOR: 'Manage data connectors',
  STORED_PROCEDURE                   : 'Call stored procedure',

  /** Email Templates */
  EMAIL_TEMPLATES_SECTION      : 'Email Templates section',
  CREATE_MODIFY_DELETE_TEMPLATE: 'Manage email templates. Send test email',

  /** File Service */
  FILES_SECTION               : 'Files section',
  MODIFY_FILE_PERMISSIONS     : 'Manage directories/files permissions',
  MANAGE_DIRECTORIES_AND_FILES: 'Manage directories and files',
  UPLOAD_CREATE_FILES         : 'Upload/create files',
  VIEW_DIRECTORY_CONTENT      : 'View directory content',

  /** Geolocation */
  GEOLOCATION_SECTION              : 'Geolocation section',
  MODIFY_GEO_CATEGORY_PERMISSIONS  : 'Manage user/role permissions for geo category',
  CREATE_MODIFY_DELETE_GEOFENCE    : 'Create/Rename/Delete geofences',
  MODIFY_GEO_POINT_METADATA        : 'Modify geopoint metadata',
  CREATE_MODIFY_DELETE_GEO_CATEGORY: 'Create/Rename/Delete geo category',
  CREATE_MODIFY_DELETE_GEO_POINT   : 'Create/Modify/Delete/Copy geo points',

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
  MODIFY_LOG_CONFIG      : 'Modify logging configuration',
  MODIFY_LOG_INTEGRATIONS: 'Modify logging integrations',
  DELETE_LOGGERS         : 'Delete log files',

  /** Messaging/Push Notifications */
  MESSAGING_SECTION                   : 'Messaging section',
  MODIFY_MESSAGING_CHANNEL_PERMISSIONS: 'Manage user/role permissions for messaging channel',
  CREATE_MODIFY_DELETE_BUTTON         : 'Create/Rename/Delete button options',
  CREATE_MODIFY_DELETE_CHANEL_OPTIONS : 'Create/Rename/Delete channel options',
  CREATE_MODIFY_DELETE_CHANEL         : 'Create/Rename/Delete messaging channels',
  CREATE_MODIFY_DELETE_PUSH_TEMPLATE  : 'Create/Rename/Delete push template',
  DELETE_MESSAGING_CHANNEL_PERMISSIONS: 'Delete messaging channel permissions',
  SEND_MESSAGE_TO_CHANNEL             : 'Send a message to a channel',
  SEND_PUSH_BY_TEMPLATE               : 'Send push notification with template',

  /** Security Roles */
  SECURITY_ROLES_SECTION : 'Security Roles section',
  ADD_MODIFY_ASSIGN_ROLE : 'Manage security roles',
  ASSIGN_ROLE_PERMISSIONS: 'Map users to roles',

  /** User Management */
  USERS_SECTION                 : 'Users section',
  MODIFY_LOGIN_PROPS            : 'Modify login properties',
  MODIFY_USER_REGISTRATION_PROPS: 'Modify user registration properties',
  LOGOUT_ALL_USERS              : 'Logout all users',
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
