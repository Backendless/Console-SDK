export const DataTypes = {
  INT            : 'INT',
  DOUBLE         : 'DOUBLE',
  BOOLEAN        : 'BOOLEAN        ',
  STRING         : 'STRING         ',
  DATETIME       : 'DATETIME       ',
  TEXT           : 'TEXT           ',
  STRING_ID      : 'STRING_ID      ',
  EXTENDED_STRING: 'EXTENDED_STRING',

  FILE_REF: 'FILE_REF',
  DATA_REF: 'DATA_REF',
  GEO_REF : 'GEO_REF ',
  CHILD_OF: 'CHILD_OF',

  UNKNOWN: 'l'
}

export const PRIMITIVES = [
  DataTypes.STRING,
  DataTypes.STRING_ID,
  DataTypes.EXTENDED_STRING,
  DataTypes.TEXT,
  DataTypes.INT,
  DataTypes.DOUBLE
]

export const USERS_TABLE = 'Users'

export const NON_SEARCHABLE_COLUMNS = ['objectId']

export const NON_SEARCHABLE_USERS_COLUMNS = [
  ...NON_SEARCHABLE_COLUMNS,
  'password',
  'socialAccount',
  'userStatus',
  'lastLogin',
  'isEmailConfirmed'
]
