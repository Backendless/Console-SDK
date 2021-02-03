export const GEO_POINT = 'GEO_POINT'
export const GEO_FENCE = 'GEO_FENCE'
export const TABLE = 'TABLE'
export const FOLDER = (appId, folder) => compose('FOLDER', appId, folder)
export const TABLE_DATA = table => compose('TABLE_DATA', table)
export const CHANNEL_DEVICES = channel => compose('CHANNEL_DEVICES', channel)
export const GEO_CATEGORY = (appId, category) => composePattern('GEO_CATEGORY', appId, category)
export const BL_MODELS = (appId, language) => composePattern('BL_MODELS', appId, language)
export const BL_CHAIN = (appId, eventId, context) => composePattern('BL_CHAIN', appId, eventId, context)
export const VIEW_DATA = viewId => compose('VIEW_DATA', viewId)
export const VIEW_GROUP_DATA = viewId => compose('VIEW_GROUP_DATA', viewId)

const compose = (...tokens) => tokens.join('-')
const composePattern = (prefix, value) => value ? [prefix, value].join('-') : new RegExp(prefix + '.*')
