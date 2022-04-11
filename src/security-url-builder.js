/**
 * This class is created to resolve a huge amount of inconsistency between various security REST endpoints
 * Someday, all these inconsistency, hopefully will be resolved on server and we will be able to delete
 * this class or some part of it
 */

import urls from './urls'
import * as qs from 'backendless-request/lib/qs'
import _isEmpty from 'lodash/isEmpty'
import { PermissionPolicies, PermissionServices, ALL_OBJECTS } from './constants/security'

const baseUrl = appId => urls.security(appId)

/**
 * Returns calculated GET url in form of 'security/:stickingPoint?:queryParams'
 *
 * The stickingPoint value is calculated by the folliwing rules
 *
 * default                        =>  :service/:serviceItemId/:policy
 * service=files, policy=users    =>  :service/:policy/:serviceItemId   (BKNDLSS-13008)
 * service=files, policy=roles    =>  :policy/:service/:serviceItemId   (BKNDLSS-13008)
 * policy=owner                   =>  :service/ownerpolicy/:serviceItemId
 * policy=columns                 =>  :service/:serviceItemId/:policy/permissions
 * objectId != ALL_OBJECTS        =>  :service/:serviceItemName/objectAcl/:objectId/:policy
 *
 * @returns {string}
 */
export const buildGetUrl = (appId, policy, service, serviceItemId, serviceItemName, objectId, filterParams) => {
  const isFilesService = service === PermissionServices.FILES
  const isRolesPolicy = policy === PermissionPolicies.ROLES
  const isOwnerPolicy = policy === PermissionPolicies.OWNER
  const isColumnsPolicy = policy === PermissionPolicies.COLUMNS
  const isObjectACL = objectId !== ALL_OBJECTS

  let stickingPoint = `${service}/${serviceItemId}/${policy}`

  if (filterParams.identity != null) {
    filterParams.name = filterParams.identity
  }

  if (isOwnerPolicy) {
    stickingPoint = `${service}/ownerpolicy/${serviceItemId}`
  } else if (isFilesService && isRolesPolicy) {
    stickingPoint = `roles/${service}/${serviceItemId}`
  } else if (isFilesService) {
    if (filterParams.name) {
      stickingPoint = `users/search/${encodeURI(filterParams.name)}/${service}/${serviceItemId}`
    } else {
      stickingPoint = `${service}/users/${serviceItemId}`
    }
  } else if (isColumnsPolicy) {
    stickingPoint = `${service}/${serviceItemId}/${policy}/permissions`
  } else if (isObjectACL) {
    stickingPoint = `${service}/${serviceItemName}/objectAcl/${objectId}/${policy}`
  }

  return `${baseUrl(appId)}/${stickingPoint}${_isEmpty(filterParams) ? '' : `?${qs.stringify(filterParams)}`}`
}

/**
 * Returns calculated PUT url according to rules :
 *
 * default                      : 'security/:service/:serviceItemId/:policy/:policyItemId'
 * policy=owner                 : 'security/:service/ownerpolicy/{serviceItemId}
 * service=file & policy=users  : 'security/:policy/:policyItemId/file/:serviceItemId'
 * service=file & policy=roles  : 'security/:policy/:policyItemId/files/:serviceItemId'
 * objectId!=all                : 'security/:service/:serviceItemName/objectAcl/:objectID/users/:policyItemId'
 * service=api & operation=all  : 'security/:service/:serviceItemId/:policy/:policyItemId/:access'
 *
 * @returns {string}
 */
export const buildPutUrl = (appId, policy, service, serviceItemId, serviceItemName, objectId,
                            policyItemId, permission) => {
  const { OWNER, USERS, ROLES, COLUMNS } = PermissionPolicies
  const isOwnerPolicy = policy === OWNER
  const isUserPolicy = policy === USERS
  const isRolesPolicy = policy === ROLES
  const isColumnsPolicy = policy === COLUMNS
  const isFilesService = service === PermissionServices.FILES
  const isApiService = service === PermissionServices.API_SERVICES
  const isObjectACL = objectId !== ALL_OBJECTS

  let stickingPoint = `${service}/${serviceItemId}/${policy}/${policyItemId}`

  if (isOwnerPolicy) {
    stickingPoint = `${service}/ownerpolicy/${serviceItemId}`
  } else if (isObjectACL) {
    stickingPoint = `${service}/${serviceItemName}/objectAcl/${objectId}/${policy}/${policyItemId}`
  } else if (isFilesService) {
    if (isUserPolicy) {
      stickingPoint = `${policy}/${policyItemId}/file/${serviceItemId}`
    } else if (isRolesPolicy) {
      stickingPoint = `${policy}/${policyItemId}/files/${serviceItemId}`
    }
  } else if (isApiService && permission.operation === 'all') {
    stickingPoint += '/access/' + permission.access
  } else if (isColumnsPolicy) {
    stickingPoint = `${service}/${serviceItemId}/${policy}/permissions/${permission.operation}/${policyItemId}`
  }

  return `${baseUrl(appId)}/${stickingPoint}`
}

/**
 * Returns calculated DELETE url according to rules :
 *
 * default                      : security/:service/:serviceItemId/:policy/:policyItemId:(/:operation)
 * policy=owner                 : security/:service/ownerpolicy/:serviceItemId/:operation
 * objectId!=all & policy=roles : security/:service/:serviceItemName/objectAcl/:objectId/:policy/:operation
 * objectId!=all & policy=users : security/:service/:serviceItemName/objectAcl/:objectId/:policy/:policyItemId
 * service=files                : security/:policy/:policyItemId/:service/:serviceItemId
 *
 * @returns {string}
 */
export const buildDeleteUrl = (appId, policy, policyItemId, service, serviceItemId, serviceItemName,
                               objectId, operation) => {
  const isFilesService = service === PermissionServices.FILES
  const isOwnerPolicy = policy === PermissionPolicies.OWNER
  const isRolesPolicy = policy === PermissionPolicies.ROLES
  const isObjectACL = objectId !== ALL_OBJECTS

  const operationEscaped = operation && encodeURIComponent(operation)

  if (isOwnerPolicy) {
    return `${baseUrl(appId)}/${service}/ownerpolicy/${serviceItemId}/${operationEscaped}`
  }

  if (isObjectACL) {
    const stickingPoint = isRolesPolicy ? operationEscaped : encodeURIComponent(policyItemId)

    return `${baseUrl(appId)}/${service}/${serviceItemName}/objectAcl/${objectId}/${policy}/${stickingPoint}`
  }

  if (isObjectACL && isRolesPolicy) {
    return `${baseUrl(appId)}/${service}/${serviceItemName}/ownerpolicy/${policyItemId}/${operationEscaped}`
  }

  if (isFilesService) {
    if (isRolesPolicy) {
      return `${baseUrl(appId)}/${policy}/${policyItemId}/${service}/${serviceItemId}`
    }

    return `${baseUrl(appId)}/${service}/${policy}/${policyItemId}/${serviceItemId}`
  }

  let result = `${baseUrl(appId)}/${service}/${serviceItemId}/${policy}/${policyItemId}`

  if (operationEscaped && operationEscaped !== 'all') {
    result += '/' + operationEscaped
  }

  return result
}
