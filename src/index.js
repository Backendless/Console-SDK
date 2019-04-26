import Request from 'backendless-request'
import * as CacheTags from './utils/cache-tags'
import urls from './urls'

import analytics from './analytics'
import apiDocs from './api-docs'
import apps from './apps'
import billing from './billing'
import bl from './bl'
import blueprints from './blueprints'
import cache from './cache'
import codegen from './codegen'
import codeless from './codeless'
import counters from './counters'
import dataConnectors from './data-connectors'
import email from './email'
import files from './files'
import geo from './geo'
import invites from './invites'
import license from './license'
import marketplace from './marketplace'
import messaging from './messaging'
import navigator from './navigator'
import projectTemplate from './project-template'
import security from './security'
import settings from './settings'
import status from './status'
import tables from './tables'
import transfer from './transfer'
import user from './user'
import users from './users'
import warning from './warning'

class Context {

  constructor(authKey, middleware) {
    this.authKey = authKey
    this.middleware = middleware
  }

  setAuthKey(authKey) {
    this.authKey = authKey
  }

  /**
   * @param {Request} req
   * @returns {Request}
   */
  apply(req) {
    if (this.authKey) {
      req.set('auth-key', this.authKey)
    }

    if (this.middleware) {
      this.middleware(req)
    }

    return req
  }
}

/**
 * @param {Context} context
 * @param {String} serverUrl
 */
const contextifyRequest = (context, serverUrl) => {
  const result = {}

  const addServerUrl = path => {
    return (serverUrl && !path.startsWith('http'))
      ? serverUrl + path
      : path
  }

  Request.methods.forEach(method => {
    result[method] = (path, body) => context.apply(new Request(addServerUrl(path), method, body))
  })

  return result
}

const DEFAULT_OPTIONS = {
  useFileDownloadURL: true,
}

const createClient = (serverUrl, authKey, options) => {
  options = Object.assign(DEFAULT_OPTIONS, options)

  const context = new Context(authKey, options.middleware)
  const request = contextifyRequest(context, serverUrl)

  const statusMiddleware = () => {
    if (!context.statusRequest) {
      context.statusRequest = status(request)()
        .then(apiStatus => {
          request.apiStatus = apiStatus

          if (options.useFileDownloadURL) {
            request.fileDownloadURL = apiStatus.fileDownloadURL
          }

          return request
        })
        .catch(e => {
          delete context.statusRequest

          throw e
        })
    }

    return context.statusRequest
  }

  const billingMiddleware = () => {
    if (context.cachedBillingRequest) {
      return Promise.resolve(context.cachedBillingRequest)
    }

    return statusMiddleware()
      .then(({ apiStatus }) => {
        return context.cachedBillingRequest = contextifyRequest(context, apiStatus.billingURL)
      })
  }

  return request.api = {
    analytics      : analytics(request),
    apiDocs        : apiDocs(request),
    apps           : apps(request),
    billing        : billing(billingMiddleware),
    bl             : bl(request),
    blueprints     : blueprints(request),
    cache          : cache(request),
    codegen        : codegen(statusMiddleware),
    codeless       : codeless(request),
    counters       : counters(request),
    dataConnectors : dataConnectors(request),
    email          : email(request),
    files          : files(statusMiddleware),
    geo            : geo(request),
    invites        : invites(request),
    license        : license(request),
    marketplace    : marketplace(billingMiddleware),
    messaging      : messaging(request),
    navigator      : navigator(request),
    projectTemplate: projectTemplate(statusMiddleware),
    security       : security(request),
    settings       : settings(request),
    status         : status(request),
    tables         : tables(request),
    transfer       : transfer(request),
    user           : user(request, context),
    users          : users(request),
    warning        : warning(request),
  }
}

export {
  createClient,
  CacheTags,
  Request,
  urls
}
