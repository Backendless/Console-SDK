import urls from './urls'

const AccessTypes = {
  GRANT: 'GRANT',
  DENY : 'DENY'
}

const OperationsTypes = {
  /** App Access Security */
  INVITE_OR_REMOVE_TEAM_MEMBER : 1, //Add/remove developer
  ASSIGN_TEAM_MEMBER_PERMISSION: 3, //Modify permission

  /** App Settings */
  APP_RESET                 : 13, //Application reset
  MODIFY_CORS_DOMAIN_CONTROL: 8, //Modify CORS/domain control
  MODIFY_CUSTOM_DOMAIN      : 9, //Modify custom domain
  MODIFY_EMAIL_SETTINGS     : 7, //Modify email settings
  MODIFY_LIMIT_NOTIFICATION : 14, //Modify limit notification
  MODIFY_MOBILE_SETTINGS    : 6, //Modify mobile settings
  MODIFY_SOCIAL_SETTINGS    : 5, //Modify social settings
  DELETE_APPLICATION        : 11, //Delete application
  ENABLE_DISABLE_GIT        : 10, //Enable/disable git
  MANAGE_API_KEYS           : 4, //Manage API keys

  /** Billing */
  BILLING_SECTION            : 'Billing section',
  ADD_UPDATE_CREDIT_CARD     : 20, //Add/update credit card
  MODIFY_BILLING_PLAN        : 21, //Modify billing plan
  MARKETPLACE_DELETE_PURCHASE: 23, //Delete Marketplace purchases
  MARKETPLACE_PURCHASE       : 22, //Purchase from the Marketplace

  /** Business Logic */
  BUSINESS_LOGIC_SECTION : 'Business Logic section',
  DELETE_FROM_MARKETPLACE: 98, //Delete from marketplace
  INVOKE_EVENT_WITH_MODEL: 97, //Invoke event with model
  MODIFY_BL              : 93, //Modify Business Logic
  PUBLISH_TO_MARKETPLACE : 94, //Publish to Marketplace
  RUN_TIMER              : 96, //Run timer

  /** Data Service */
  DATA_SERVICE_SECTION                  : 'Data Service section',
  MODIFY_DYNAMIC_SCHEMA_DEFINITION      : 47, //Modify "Dynamic Schema Definition" configuration
  CREATE_MODIFY_DELETE_COLUMN           : 42, //Create/Rename/Delete columns
  CREATE_MODIFY_DELETE_TABLE            : 40, //Create/Rename/Delete tables
  CREATE_DELETE_UPDATE_OBJECTS          : 46, //Create/delete/update objects
  CREATE_MODIFY_DELETE_TABLE_PERMISSIONS: 44, //Manage permissions for tables (including ACL)
  CREATE_MODIFY_DELETE_OWNER_PERMISSIONS: 54, //Manage global owner permissions

  /** Data connector */
  DATA_CONNECTOR_SECTION             : 'Data Connector section',
  CREATE_MODIFY_DELETE_DATA_CONNECTOR: 99, //Manage data connectors
  STORED_PROCEDURE                   : 102, //Call stored procedure

  /** Email Templates */
  EMAIL_TEMPLATES_SECTION      : 'Email Templates section',
  CREATE_MODIFY_DELETE_TEMPLATE: 33, //Manage email templates. Send test email

  /** File Service */
  FILES_SECTION               : 'Files section',
  MODIFY_FILE_PERMISSIONS     : 60, //Manage directories/files permissions
  MANAGE_DIRECTORIES_AND_FILES: 57, //Manage directories and files
  UPLOAD_CREATE_FILES         : 59, //Upload/create files
  VIEW_DIRECTORY_CONTENT      : 106, //View directory content

  /** Geolocation */
  GEOLOCATION_SECTION              : 'Geolocation section',
  MODIFY_GEO_CATEGORY_PERMISSIONS  : 83, //Manage user/role permissions for geo category
  CREATE_MODIFY_DELETE_GEOFENCE    : 85, //Create/Rename/Delete geofences
  MODIFY_GEO_POINT_METADATA        : 84, //Modify geopoint metadata
  CREATE_MODIFY_DELETE_GEO_CATEGORY: 81, //Create/Rename/Delete geo category
  CREATE_MODIFY_DELETE_GEO_POINT   : 88, //Create/Modify/Delete/Copy geo points

  /** Import/Export */
  IMPORT_EXPORT_SECTION: 'Import/Export section',
  CLONE_APP            : 27, //Clone application
  EXPORT_APP           : 24, //Export app settings/app data
  IMPORT               : 25, //Import

  /** Landing Page */
  LANDING_PAGE_SECTION: 'Landing Page section',
  MODIFY_LANDING_PAGE : 29, //Modify landing page
  PUBLISH_LANDING_PAGE: 30, //Publish landing page

  /** Log Management */
  LOG_MANAGEMENT_SECTION : 'Log Management section',
  MODIFY_LOG_CONFIG      : 17, //Modify logging configuration
  MODIFY_LOG_INTEGRATIONS: 19, //Modify logging integrations
  DELETE_LOGGERS         : 18, //Delete log files

  /** Messaging/Push Notifications */
  MESSAGING_SECTION                   : 'Messaging section',
  MODIFY_MESSAGING_CHANNEL_PERMISSIONS: 70, //Manage user/role permissions for messaging channel
  CREATE_MODIFY_DELETE_BUTTON         : 73, //Create/Rename/Delete button options
  CREATE_MODIFY_DELETE_CHANEL_OPTIONS : 75, //Create/Rename/Delete channel options
  CREATE_MODIFY_DELETE_CHANEL         : 67, //Create/Rename/Delete messaging channels
  CREATE_MODIFY_DELETE_PUSH_TEMPLATE  : 71, //Create/Rename/Delete push template
  SEND_MESSAGE_TO_CHANNEL             : 69, //Send a message to a channel
  SEND_PUSH_BY_TEMPLATE               : 77, //Send push notification with template

  /** Security Roles */
  SECURITY_ROLES_SECTION : 'Security Roles section',
  ADD_MODIFY_ASSIGN_ROLE : 37, //Manage security roles
  ASSIGN_ROLE_PERMISSIONS: 39, //Map users to roles

  /** User Management */
  USERS_SECTION                 : 'Users section',
  MODIFY_LOGIN_PROPS            : 32, //Modify login properties
  MODIFY_USER_REGISTRATION_PROPS: 31, //Modify user registration properties
  LOGOUT_ALL_USERS              : 107, //Logout all users
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
