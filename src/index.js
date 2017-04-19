import Request  from 'backendless-request'
import * as CacheTags from './utils/cache-tags'
import urls from './urls'

import security from './security'
import geo from './geo'
import tables from './tables'
import codegen from './codegen'
import files from './files'
import bl from './bl'
import email from './email'
import user from './user'
import messaging from './messaging'
import settings from './settings'
import projectTemplate from './project-template'
import billing from './billing'
import marketplace from './marketplace'
import analytics from './analytics'
import apps from './apps'
import users from './users'
import status from './status'
import transfer from './transfer'
import marketplace from './marketplace'

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

const createClient = (serverUrl, authKey) => {
  const context = new Context(authKey)

  const request = contextifyRequest(context, serverUrl)

  const client = {
    user           : user(request, context),
    users          : users(request, context),
    apps           : apps(request, context),
    security       : security(request, context),
    geo            : geo(request, context),
    tables         : tables(request, context),
    files          : files(request, context),
    codegen        : codegen(request, context),
    bl             : bl(request, context),
    email          : email(request, context),
    messaging      : messaging(request, context),
    settings       : settings(request, context),
    projectTemplate: projectTemplate(request, context),
    marketplace    : marketplace(request, context),
    analytics      : analytics(request, context),
    status         : status(request, context),
    transfer       : transfer(request, context),
    marketplace    : marketplace(request, context)
  }

  return client.status().then(status => ({
    ...client,
    billing: billing(contextifyRequest(context, status.billingURL), context)
  }))
}

export {
  createClient,
  CacheTags,
  Request,
  urls
}
