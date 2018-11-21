import Request from 'backendless-request'
import * as CacheTags from './utils/cache-tags'
import urls from './urls'

import security from './security'
import geo from './geo'
import tables from './tables'
import dataConnectors from './data-connectors'
import cache from './cache'
import codegen from './codegen'
import files from './files'
import bl from './bl'
import email from './email'
import user from './user'
import messaging from './messaging'
import settings from './settings'
import projectTemplate from './project-template'
import billing from './billing'
import analytics from './analytics'
import apps from './apps'
import users from './users'
import status from './status'
import warning from './warning'
import transfer from './transfer'
import marketplace from './marketplace'
import codeless from './codeless'
import invites from './invites'
import license from './license'
import blueprints from './blueprints'
import apiDocs from './api-docs'
import counters from './counters'

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
    user           : user(request, context),
    users          : users(request),
    apps           : apps(request),
    security       : security(request),
    geo            : geo(request),
    tables         : tables(request),
    dataConnectors : dataConnectors(request),
    files          : files(statusMiddleware),
    cache          : cache(request),
    codegen        : codegen(statusMiddleware),
    bl             : bl(request),
    email          : email(request),
    messaging      : messaging(request),
    settings       : settings(request),
    projectTemplate: projectTemplate(statusMiddleware),
    analytics      : analytics(request),
    status         : status(request),
    transfer       : transfer(request),
    warning        : warning(request),
    codeless       : codeless(request),
    marketplace    : marketplace(billingMiddleware),
    billing        : billing(billingMiddleware),
    invites        : invites(request),
    license        : license(request),
    blueprints     : blueprints(request),
    apiDocs        : apiDocs(request),
    counters       : counters(request),
  }
}

export {
  createClient,
  CacheTags,
  Request,
  urls
}
