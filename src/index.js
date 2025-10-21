import Request from 'backendless-request'
import * as CacheTags from './utils/cache-tags'
import urls from './urls'

import activityManager from './activity-manager'
import analytics from './analytics'
import apiDocs from './api-docs'
import apps from './apps'
import automation from './automation'
import { billingAPI } from './billing'
import bl from './bl'
import cloudCode from './cloud-code'
import blueprints from './blueprints'
import cache from './cache'
import cacheControl from './cache-control'
import codeless from './codeless'
import counters from './counters'
import dataConnectors from './data-connectors'
import dataViews from './data-views'
import dataHives from './data-hives'
import dataToVisualize from './data-to-visualize'
import developerProfile from './developer-profile'
import devTeam from './dev-team'
import email from './email'
import files from './files'
import formEditor from './form-editor'
import gamification from './gamification'
import license from './license'
import messaging from './messaging'
import navigator from './navigator'
import security from './security'
import devPermissions, { DevPermissions } from './dev-permissions'
import openAI from './open-ai'
import integrations from './integrations'
import pdf from './pdf'
import settings from './settings'
import status from './status'
import tables from './tables'
import transfer from './transfer'
import user from './user'
import users from './users'
import warning from './warning'
import uiBuilder from './ui-builder'
import chartBuilder from './chart-builder'
import visualizations from './visualizations'
import consolePreview from './console-preview'
import quickApps from './quick-apps'
import frExtensions from './fr-extensions'
import mcpServices from './mcp-services'
import mcpHosting from './mcp-hosting'
import webhooks from './webhooks'
import knowledgeBase from './knowledge-base'

import { community } from './community'
import { marketplace } from './marketplace'
import { referrals } from './referrals'
import { initialQuestionnaire } from './initial-questionnaire'
import { sqlService } from './sql-service'
import { systemAPI } from './system'

class Context {

  constructor(authKey, options) {
    this.options = options
    this.authKey = authKey
    this.middleware = options.middleware
  }

  setAuthKey(authKey) {
    this.authKey = authKey
  }

  /**
   * @param {Request} req
   * @returns {Request}
   */
  apply(req, middleware) {
    if (this.authKey) {
      req.set('auth-key', this.authKey)
    }

    if (this.middleware) {
      this.middleware(req)
    }

    if (middleware) {
      middleware(req)
    }

    return req
  }
}

/**
 * @param {Context} context
 * @param {String} serverUrl
 */
const contextifyRequest = (context, serverUrl, middleware) => {
  const result = {
    context
  }

  const addServerUrl = path => {
    return (serverUrl && !path.startsWith('http'))
      ? serverUrl + path
      : path
  }

  Request.methods.forEach(method => {
    result[method] = (path, body) => context.apply(new Request(addServerUrl(path), method, body), middleware)
  })

  return result
}

const DEFAULT_OPTIONS = {
  billingURL : null,
  billingAuth: null,
}

const createClient = (serverUrl, authKey, options) => {
  options = { ...DEFAULT_OPTIONS, ...options }

  const context = new Context(authKey, options)
  const request = contextifyRequest(context, serverUrl)

  if (options.billingURL) {
    request.billing = contextifyRequest(context, options.billingURL, req => {
      if (options.billingAuth) {
        req.set({ 'Authorization': `Basic ${options.billingAuth}` })
      }
    })
  } else {
    request.billing = request
  }

  if (options.communityURL) {
    request.community = contextifyRequest(context, options.communityURL, req => {
      req.path = req.path.replace('/console/community', '')
    })
  } else {
    request.community = request
  }

  if (options.sqlServiceURL) {
    request.sqlService = contextifyRequest(context, options.sqlServiceURL)
  } else {
    request.sqlService = request
  }

  if (options.automationURL) {
    request.automation = contextifyRequest(context, options.automationURL, req => {
      req.path = req.path.replace('/console/automation', '')
    })
  } else {
    request.automation = request
  }

  if (options.nodeApiURL) {
    request.nodeAPI = contextifyRequest(context, options.nodeApiURL, req => {
      req.path = req.path.replace('/api/node-server', '')
    })
  } else {
    request.nodeAPI = request
  }

  const destroy = () => {
    context.middleware = req => {
      req.send = () => Promise.reject(new Error('Client has been destroyed'))

      return req
    }
  }

  return request.api = {
    destroy,
    request,

    system: systemAPI(request),

    activityManager     : activityManager(request),
    analytics           : analytics(request),
    apiDocs             : apiDocs(request),
    apps                : apps(request),
    automation          : automation(request),
    billing             : billingAPI(request),
    bl                  : bl(request),
    cloudCode           : cloudCode(request),
    blueprints          : blueprints(request),
    cache               : cache(request),
    cacheControl        : cacheControl(request),
    codeless            : codeless(request),
    counters            : counters(request),
    dataConnectors      : dataConnectors(request),
    dataViews           : dataViews(request),
    dataHives           : dataHives(request),
    dataToVisualize     : dataToVisualize(request),
    developerProfile    : developerProfile(request),
    devTeam             : devTeam(request),
    email               : email(request),
    files               : files(request),
    formEditor          : formEditor(request),
    gamification        : gamification(request),
    license             : license(request),
    messaging           : messaging(request),
    navigator           : navigator(request),
    security            : security(request),
    devPermissions      : devPermissions(request),
    openAI              : openAI(request),
    settings            : settings(request),
    status              : status(request),
    tables              : tables(request),
    transfer            : transfer(request),
    user                : user(request, context),
    users               : users(request),
    warning             : warning(request),
    uiBuilder           : uiBuilder(request),
    chartBuilder        : chartBuilder(request),
    community           : community(request),
    sqlService          : sqlService(request),
    marketplace         : marketplace(request),
    referrals           : referrals(request),
    visualizations      : visualizations(request),
    initialQuestionnaire: initialQuestionnaire(request),
    consolePreview      : consolePreview(request),
    quickApps           : quickApps(request),
    integrations        : integrations(request),
    webhooks            : webhooks(request),
    pdf                 : pdf(request),
    frExtensions        : frExtensions(request),
    mcpServices         : mcpServices(request),
    hostingMcpServices  : mcpHosting(request),
    knowledgeBase       : knowledgeBase(request)
  }
}

export {
  createClient,
  CacheTags,
  Request,
  urls,
  DevPermissions,
}
