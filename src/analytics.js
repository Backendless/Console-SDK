import urls from './urls'

const year = 'YEAR'
const month = 'MONTH'
const lastDay = 'MONTH' //no server analogue for now
const sixmo = 'HALF_YEAR'

const periods = { lastDay, year, month, sixmo }

const transformPeriod = period => periods[period] || month

const buildSegmentsQuery = (key, segments) => {
  const result = {}

  if (segments) {
    segments.forEach(segment => {
      result[`${key}[${segment}]`] = true
    })
  }

  return result
}

const buildClientTypeSegmentsQuery = clientTypes => buildSegmentsQuery('apiKeyName', clientTypes)
const buildMessagingTypeSegmentsQuery = messagingType => buildSegmentsQuery('messagingType', messagingType)

export default req => ({
  getAppStats(appId, period) {
    return req.get(`${urls.appConsole(appId)}/application/stats`)
      .query({
        period: transformPeriod(period)
      })
  },

  performance(appId, { aggInterval, from, to }) {
    const params = {
      aggregationPeriod: aggInterval.name,
      startEpochSecond : from / 1000, // the server expects timestamp in seconds, not in milliseconds
      endEpochSecond   : to / 1000
    }

    return req.get(`${urls.appConsole(appId)}/performance`)
      .query(params)
      .then(points => {
        const result = {}

        for (let i = from; i <= to; i += aggInterval.value) {
          result[i] = points[i / 1000] // the server return timestamp in seconds, not in milliseconds
        }

        return result
      })
  },

  concurrentRequests(appId, { aggInterval, from, to }) {
    const params = {
      aggregationPeriod: aggInterval.name,
      startEpochSecond : from / 1000, // the server expects timestamp in seconds, not in milliseconds
      endEpochSecond   : to / 1000
    }

    return req.get(`${urls.appConsole(appId)}/concurrent-requests`)
      .query(params)
      .then(points => {
        const result = {}

        for (let i = from; i <= to; i += aggInterval.value) {
          result[i] = points[i / 1000] // the server return timestamp in seconds, not in milliseconds
        }

        return result
      })
  },

  apiCalls(appId, { clientTypes, columns = {}, period, from, to }) {
    period = period.toUpperCase()

    const params = {
      ...buildClientTypeSegmentsQuery(clientTypes),

      'withServiceName'     : columns.services,
      'withMethodName'      : columns.methods,
      'withSuccessCallCount': true, //TODO: the server always return SuccessCallCount values
      'withErrorCount'      : true, //TODO: the server always return ErrorCount values

      period,
    }

    if (period === 'CUSTOM') {
      params.dateFrom = from
      params.dateTo = to
    }

    return req.get(`${urls.appConsole(appId)}/apicalls`).query(params)
  },

  messages(appId, { clientTypes, messagingTypes, period, from, to }) {
    period = period.toUpperCase()

    const params = {
      ...buildClientTypeSegmentsQuery(clientTypes),
      ...buildMessagingTypeSegmentsQuery(messagingTypes),

      period,
    }

    if (period === 'CUSTOM') {
      params.dateFrom = from
      params.dateTo = to
    }

    return req.get(`${urls.appConsole(appId)}/messaging`).query(params)
  },

  users(appId, { period, from, to }) {
    period = period.toUpperCase()

    const params = {
      withActiveUsers    : true, //TODO: the server always return ActiveUsers values
      withNewUsers       : true, //TODO: the server always return NewUsers values
      withRegisteredUsers: true, //TODO: the server always return RegisteredUsers values
      withReturningUsers : true, //TODO: the server always return ReturningUsers values

      period,
    }

    if (period === 'CUSTOM') {
      params.dateFrom = from
      params.dateTo = to
    }

    return req.get(`${urls.appConsole(appId)}/userstats`).query(params)
  },

  workers(appId, query) {
    return req.get(`${urls.appConsole(appId)}/workers`).query(query)
  },

  pricingEstimate(appId, query) {
    return req.billing.get(`/${appId}/console/billing/application/tiers/price-estimation`).query(query)
  }
})
