import Request  from 'backendless-request'
import * as CacheTags from './utils/cache-tags'
import urls from './urls'

import analytics from './analytics'
import apps from './apps'
import billing from './billing'
import bl from './bl'
import codegen from './codegen'
import email from './email'
import files from './files'
import geo from './geo'
import invites from './invites'
import messaging from './messaging'
import projectTemplate from './project-template'
import security from './security'
import settings from './settings'
import status from './status'
import warning from './warning'
import transfer from './transfer'
import marketplace from './marketplace'
import codeless from './codeless'

class Context {

  constructor(authKey) {
    this.authKey = authKey
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
    return (serverUrl && !path.startsWith(serverUrl))
      ? serverUrl + path
      : path
  }

  Request.methods.forEach(method => {
    result[method] = (path, body) =>
      context.apply(new Request(addServerUrl(path), method, body))
  })

  return result
}

const getBillingReq = (req, context) => {
  if (context.billingReqErr) {
    return Promise.reject(context.billingReqErr)
  }

  if (!context.billingReq) {
    context.billingReq = status(req)().then(
      ({ billingURL }) => contextifyRequest(context, billingURL),
      err => {
        context.billingReqErr = err.message || err
        console.warn('Unable to get server status. ' + context.billingReqErr)
      }
    )
  }

  return context.billingReq
}

const createClient = (serverUrl, authKey) => {
  const context = new Context(authKey)

  const request = contextifyRequest(context, serverUrl)

  const billingReq = getBillingReq(request, context)

  return {
    analytics      : analytics(request, context),
    apps           : apps(request, context),
    billing        : billing(billingReq),
    bl             : bl(request, context),
    codegen        : codegen(request, context),
    email          : email(request, context),
    files          : files(request, context),
    geo            : geo(request, context),
    invites        : invites(request, context),
    messaging      : messaging(request, context),
    projectTemplate: projectTemplate(request, context),
    security       : security(request, context),
    settings       : settings(request, context),
    status         : status(request, context),
    transfer       : transfer(request, context),
    warning        : warning(request, context),
    codeless       : codeless(request, context),
    marketplace    : marketplace(billingReq),
    tables         : tables(request, context),
    user           : user(request, context),
    users          : users(request, context)
  }
}

export {
  createClient,
  CacheTags,
  Request,
  urls
}
