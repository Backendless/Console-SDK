export const GEO_POINT = 'GEO_POINT'
export const GEO_FENCE = 'GEO_FENCE'
export const TABLE = 'TABLE'
export const FOLDER = folder => compose('FOLDER', folder)
export const TABLE_DATA = table => compose('TABLE_DATA', table)
export const CHANNEL_DEVICES = channel => compose('CHANNEL_DEVICES', channel)
export const GEO_CATEGORY = category => composePattern('GEO_CATEGORY', category)

const compose = (...tokens) => tokens.join('-')
const composePattern = (prefix, value) => value ? [prefix, value].join('-') : new RegExp(prefix + '.*')