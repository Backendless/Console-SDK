import urls from './urls'

const year = 'YEAR'
const month = 'MONTH'
const lastDay = 'MONTH' //no server analogue for now
const sixmo = 'HALF_YEAR'

const periods = { lastDay, year, month, sixmo }

const transformPeriod = period => periods[period] || month

export default req => ({
  getAppStats(appId, period) {
    return req.get(`${urls.appConsole(appId)}/application/stats`)
      .query({
        period: transformPeriod(period)
      })
  },

  performance(appId, query) {
    const params = {
      aggregationPeriod: query.aggInterval.name,
      startEpochSecond : (query.from) / 1000, //TODO: the server expects timestamp in seconds not in milliseconds
      endEpochSecond   : (query.to) / 1000      //TODO: the server expects timestamp in seconds not in milliseconds
    }

    return req.get(`${urls.appConsole(appId)}/performance`)
      .query(params)
      .then(points => {
        const result = {}

        for (let i = query.from; i <= query.to; i += query.aggInterval.value) {
          result[i] = points[i / 1000] //TODO: the server return timestamp in seconds not in milliseconds
        }

        return result
      })
  },

  apiCalls(appId, query) {
    const { columns, excludeDevices, period, from, to } = query

    const params = {
      'deviceType[ALL]'     : !excludeDevices.ALL,
      'deviceType[IOS]'     : !excludeDevices.IOS,
      'deviceType[ANDROID]' : !excludeDevices.ANDROID,
      'deviceType[WP]'      : !excludeDevices.WP,
      'deviceType[AS]'      : !excludeDevices.AS,
      'deviceType[JS]'      : !excludeDevices.JS,
      'deviceType[REST]'    : !excludeDevices.REST,
      'deviceType[BL]'      : !excludeDevices.BL,
      'withServiceName'     : columns.services,
      'withMethodName'      : columns.methods,
      'withSuccessCallCount': true, //TODO: the server always return SuccessCallCount values
      'withErrorCount'      : true, //TODO: the server always return ErrorCount values
      'period'              : period.toUpperCase()
    }

    if (period === 'custom') {
      params.dateFrom = from
      params.dateTo = to
    }

    return req.get(`${urls.appConsole(appId)}/apicalls`).query(params)
  },

  messages(appId, query) {
    const { excludeDevices, excludeMessages, period, from, to } = query

    const params = {
      'deviceType[ALL]'       : !excludeDevices.ALL,
      'deviceType[IOS]'       : !excludeDevices.IOS,
      'deviceType[ANDROID]'   : !excludeDevices.ANDROID,
      'deviceType[WP]'        : !excludeDevices.WP,
      'deviceType[AS]'        : !excludeDevices.AS,
      'deviceType[JS]'        : !excludeDevices.JS,
      'deviceType[REST]'      : !excludeDevices.REST,
      'deviceType[BL]'        : !excludeDevices.BL,
      'messagingType[ALL]'    : !excludeMessages.ALL,
      'messagingType[PUSH]'   : !excludeMessages.PUSH,
      'messagingType[PUB_SUB]': !excludeMessages.PUB_SUB,
      'period'                : period.toUpperCase()
    }

    if (period === 'custom') {
      params.dateFrom = from
      params.dateTo = to
    }

    return req.get(`${urls.appConsole(appId)}/messaging`).query(params)
  },

  users(appId, query) {
    const { period, from, to } = query

    const params = {
      withActiveUsers    : true, //TODO: the server always return ActiveUsers values
      withNewUsers       : true, //TODO: the server always return NewUsers values
      withRegisteredUsers: true, //TODO: the server always return RegisteredUsers values
      withReturningUsers : true, //TODO: the server always return ReturningUsers values
      period             : period.toUpperCase()
    }

    if (period === 'custom') {
      params.dateFrom = from
      params.dateTo = to
    }

    return req.get(`${urls.appConsole(appId)}/userstats`).query(params)
  }
})
