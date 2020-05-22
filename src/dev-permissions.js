import urls from './urls'

const AccessTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY'
}

const OperationsTypes = {
  /** App Access Security */
  INVITE_OR_REMOVE_TEAM_MEMBER : { id: 1, label: 'Add/remove developer' },
  ASSIGN_TEAM_MEMBER_PERMISSION: { id: 3, label: 'Modify permission' },

  /** App Settings */
  APP_RESET                 : { id: 13, label: 'Application reset' },
  MODIFY_CORS_DOMAIN_CONTROL: { id: 8, label: 'Modify CORS/domain control' },
  MODIFY_CUSTOM_DOMAIN      : { id: 9, label: 'Modify custom domain' },
  MODIFY_EMAIL_SETTINGS     : { id: 7, label: 'Modify email settings' },
  MODIFY_LIMIT_NOTIFICATION : { id: 14, label: 'Modify limit notification' },
  MODIFY_MOBILE_SETTINGS    : { id: 6, label: 'Modify mobile settings' },
  MODIFY_SOCIAL_SETTINGS    : { id: 5, label: 'Modify social settings' },
  DELETE_APPLICATION        : { id: 11, label: 'Delete application' },
  ENABLE_DISABLE_GIT        : { id: 10, label: 'Enable/disable git' },
  MANAGE_API_KEYS           : { id: 4, label: 'Manage API keys' },

  /** Billing */
  BILLING_SECTION            : 'Billing section',
  ADD_UPDATE_CREDIT_CARD     : { id: 20, label: 'Add/update credit card' },
  MODIFY_BILLING_PLAN        : { id: 21, label: 'Modify billing plan' },
  MARKETPLACE_DELETE_PURCHASE: { id: 23, label: 'Delete Marketplace purchases' },
  MARKETPLACE_PURCHASE       : { id: 22, label: 'Purchase from the Marketplace' },

  /** Business Logic */
  BUSINESS_LOGIC_SECTION : 'Business Logic section',
  DELETE_FROM_MARKETPLACE: { id: 98, label: 'Delete from marketplace' },
  INVOKE_EVENT_WITH_MODEL: { id: 97, label: 'Invoke event with model' },
  MODIFY_BL              : { id: 93, label: 'Modify Business Logic' },
  PUBLISH_TO_MARKETPLACE : { id: 94, label: 'Publish to Marketplace' },
  RUN_TIMER              : { id: 96, label: 'Run timer' },

  /** Data Service */
  DATA_SERVICE_SECTION                  : 'Data Service section',
  MODIFY_DYNAMIC_SCHEMA_DEFINITION      : { id: 47, label: 'Modify "Dynamic Schema Definition" configuration' },
  CREATE_MODIFY_DELETE_COLUMN           : { id: 42, label: 'Create/Rename/Delete columns' },
  CREATE_MODIFY_DELETE_TABLE            : { id: 40, label: 'Create/Rename/Delete tables' },
  CREATE_DELETE_UPDATE_OBJECTS          : { id: 46, label: 'Create/delete/update objects' },
  CREATE_MODIFY_DELETE_TABLE_PERMISSIONS: { id: 44, label: 'Manage permissions for tables (including ACL)' },
  CREATE_MODIFY_DELETE_OWNER_PERMISSIONS: { id: 54, label: 'Manage global owner permissions' },

  /** Data connector */
  DATA_CONNECTOR_SECTION             : 'Data Connector section',
  CREATE_MODIFY_DELETE_DATA_CONNECTOR: { id: 99, label: 'Manage data connectors' },
  STORED_PROCEDURE                   : { id: 102, label: 'Call stored procedure' },

  /** Email Templates */
  EMAIL_TEMPLATES_SECTION      : 'Email Templates section',
  CREATE_MODIFY_DELETE_TEMPLATE: { id: 33, label: 'Manage email templates. Send test email' },

  /** File Service */
  FILES_SECTION               : 'Files section',
  MODIFY_FILE_PERMISSIONS     : { id: 60, label: 'Manage directories/files permissions' },
  MANAGE_DIRECTORIES_AND_FILES: { id: 57, label: 'Manage directories and files' },
  UPLOAD_CREATE_FILES         : { id: 59, label: 'Upload/create files' },
  VIEW_DIRECTORY_CONTENT      : { id: 106, label: 'View directory content' },

  /** Geolocation */
  GEOLOCATION_SECTION              : 'Geolocation section',
  MODIFY_GEO_CATEGORY_PERMISSIONS  : { id: 83, label: 'Manage user/role permissions for geo category' },
  CREATE_MODIFY_DELETE_GEOFENCE    : { id: 85, label: 'Create/Rename/Delete geofences' },
  MODIFY_GEO_POINT_METADATA        : { id: 84, label: 'Modify geopoint metadata' },
  CREATE_MODIFY_DELETE_GEO_CATEGORY: { id: 81, label: 'Create/Rename/Delete geo category' },
  CREATE_MODIFY_DELETE_GEO_POINT   : { id: 88, label: 'Create/Modify/Delete/Copy geo points' },

  /** Import/Export */
  IMPORT_EXPORT_SECTION: 'Import/Export section',
  CLONE_APP            : { id: 27, label: 'Clone application' },
  EXPORT_APP           : { id: 24, label: 'Export app settings/app data' },
  IMPORT               : { id: 25, label: 'Import' },

  /** Landing Page */
  LANDING_PAGE_SECTION: 'Landing Page section',
  MODIFY_LANDING_PAGE : { id: 29, label: 'Modify landing page' },
  PUBLISH_LANDING_PAGE: { id: 30, label: 'Publish landing page' },

  /** Log Management */
  LOG_MANAGEMENT_SECTION : 'Log Management section',
  MODIFY_LOG_CONFIG      : { id: 17, label: 'Modify logging configuration' },
  MODIFY_LOG_INTEGRATIONS: { id: 19, label: 'Modify logging integrations' },
  DELETE_LOGGERS         : { id: 18, label: 'Delete log files' },

  /** Messaging/Push Notifications */
  MESSAGING_SECTION                   : 'Messaging section',
  MODIFY_MESSAGING_CHANNEL_PERMISSIONS: { id: 70, label: 'Manage user/role permissions for messaging channel' },
  CREATE_MODIFY_DELETE_BUTTON         : { id: 73, label: 'Create/Rename/Delete button options' },
  CREATE_MODIFY_DELETE_CHANEL_OPTIONS : { id: 75, label: 'Create/Rename/Delete channel options' },
  CREATE_MODIFY_DELETE_CHANEL         : { id: 67, label: 'Create/Rename/Delete messaging channels' },
  CREATE_MODIFY_DELETE_PUSH_TEMPLATE  : { id: 71, label: 'Create/Rename/Delete push template' },
  SEND_MESSAGE_TO_CHANNEL             : { id: 69, label: 'Send a message to a channel' },
  SEND_PUSH_BY_TEMPLATE               : { id: 77, label: 'Send push notification with template' },

  /** Security Roles */
  SECURITY_ROLES_SECTION : 'Security Roles section',
  ADD_MODIFY_ASSIGN_ROLE : { id: 37, label: 'Manage security roles' },
  ASSIGN_ROLE_PERMISSIONS: { id: 39, label: 'Map users to roles' },

  /** User Management */
  USERS_SECTION                 : 'Users section',
  MODIFY_LOGIN_PROPS            : { id: 32, label: 'Modify login properties' },
  MODIFY_USER_REGISTRATION_PROPS: { id: 31, label: 'Modify user registration properties' },
  LOGOUT_ALL_USERS              : { id: 107, label: 'Logout all users' },
}

const OperationsIds = {}
const OperationsLabels = {}

Object.keys(OperationsTypes).forEach(key => {
  const v = OperationsTypes[key]

  OperationsIds[key] = typeof v === 'string' ? v : v.id
  OperationsLabels[key] = typeof v === 'string' ? v : v.label
  OperationsTypes[key] = key
})

export const DevPermissions = {
  OperationsTypes,
  OperationsIds,
  OperationsLabels,
  AccessTypes,
}

export default req => ({

  get(appId, operation) {
    return req.get(`${urls.security(appId)}/${operation}`)
  }
})
