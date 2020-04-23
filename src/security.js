import _sortBy from 'lodash/sortBy'

import totalRows from './utils/total-rows'
import { buildGetUrl, buildPutUrl, buildDeleteUrl } from './security-url-builder'
import { SYSTEM_ROLES, ALL_OBJECTS, PermissionPolicies } from './constants/security'

import urls from './urls'

const emptyResponse = { data: [] }

const sortEntitiesByName = response => {
  response.data = _sortBy(response.data, 'name')

  return response
}

const castArray = items => Array.isArray(items) ? items : [items]

const transformOwnerResponse = response => ({
  data: [{
    permissions: response
  }]
})

const transformRolesResponse = response => ({ data: response })
const transformUsersResponse = response => ({ data: response })

/**
 * Transforms
 *      [{operationName, operationId, roles: [{roleId, roleName, access}, ...]}, ...]
 * into
 *      { data: [ { roleId, name, permissions: [{operation, access}, ..] }] }
 *
 * @param {Array} response
 * @returns {{data: Array}}
 */
const transformAclRolesResponse = response => {
  const rolesMap = {}

  response.forEach(operation => {
    operation.roles.forEach(role => {
      if (!rolesMap[role.roleId]) {
        rolesMap[role.roleId] = { roleId: role.roleId, name: role.roleName, permissions: [] }
      }

      rolesMap[role.roleId].permissions.push({
        operation: operation.operationName,
        access   : role.access
      })
    })
  })

  return transformRolesResponse(Object.keys(rolesMap).map(roleId => rolesMap[roleId]))
}

/**
 * Here is the situation :
 *
 * for users the response is { data: [ { permissions: [{operation, access}, ..] }] }
 * for roles the response is [ {permissions: [{operation, access}, ...]} ]
 * for owner the response is [{ operation, access }, ...]
 *
 * for acl roles the response is absolute EVIL in absolutely CRAZY form :
 *      [{operationName, operationId, [roles: [{roleId, roleName, access}]]}]
 *
 *
 * Since, we want to store, handle and render all permissions using the same set of classes/components
 * we need to have the response to be the same for all policies :
 *
 * { data: [ { permissions: [{operation, access}, ..] }] }
 *
 * This method does exactly this
 *
 * @param {*} response
 * @returns {{data: Array.<{permissions: Array}>}}
 */
const alignGetResponseShape = response => {
  if (response.data) {
    return response //a normal response, nothing to do here
  }

  const empty = !response.length
  const rolesResponse = !empty && !!response[0].permissions
  const aclRolesResponse = !empty && !!response[0].operationId
  const usersResponse = !empty && !!response[0].userId

  return (empty && emptyResponse)
    || (rolesResponse && transformRolesResponse(response))
    || (aclRolesResponse && transformAclRolesResponse(response))
    || (usersResponse && transformUsersResponse(response))
    || transformOwnerResponse(response)
}

const enrichPermissions = result => {
  result.data.forEach(item => {
    item.permissions = toPermissionsMap(item.permissions)
  })

  return result
}

const enrichEntities = result => {
  result.data.forEach(item => {
    item.id = item.userId || item.roleId || 'owner'
  })

  return result
}

/**
 * For owner the response is 'GRANT_INHERIT'
 * for roles acl the response is complete GET response
 * for all other types the response is array of objects with two fields {operation, access}
 * possibly wrapped into 'permissions' field..  ︻デ═一
 *
 * We want to cast all these responses to the following structure
 *
 * {
 *  [policyItemId]: {
 *      [operation] : {access},
 *      ...
 *  },
 *  ...
 * }
 */
const alignModifyResponseShape = (appId, policy, policyItemId, service, serviceItemId, serviceItemName,
                                  objectId, operation) => response => {
  if (!response) {
    return {}
  }

  const isOwnerPolicy = policy === PermissionPolicies.OWNER
  const isRolesPolicy = policy === PermissionPolicies.ROLES
  const isObjectACL = objectId !== ALL_OBJECTS

  const result = {}

  if (isOwnerPolicy) {

    result.owner = {
      [operation]: response
    }

  } else if (isObjectACL && isRolesPolicy) {

    response.forEach(operation => {
      operation.roles.forEach(role => {
        result[role.roleId] = result[role.roleId] || {}
        result[role.roleId][operation.operationName] = role.access
      })
    })

  } else {
    if (response.permissions) {
      response = response.permissions
    }

    const permissions = result[policyItemId] = {}

    response.forEach(permission => permissions[permission.operation] = permission.access)
  }

  return result
}

/**
 * Converts permissions object to permissions map where key is operation and value is access
 * E.q.
 *     [{operation: 'Update', access: 'Grant}, {operation: 'Find', access: 'Deny'}]
 *     =>
 *     {Update: 'Grant', Find: 'Deny'}
 * @param permissions
 * @returns {{}}
 */
const toPermissionsMap = permissions => {
  const map = {}

  if(permissions) {
    permissions.forEach(permission => {
      map[permission.operation] = permission.access
    })
  }

  return map
}

//TODO it will be removed when the server will be ready (CONSOLE-307)
const normalizeRolePropsNames = role => ({ id: role.roleId, name: role.rolename, ...role })
//TODO it will be removed when the server will be ready (CONSOLE-307)
const normalizeRolesPropsNames = roles => roles.map(normalizeRolePropsNames)
//TODO it will be removed when the server will be ready to provide this info (CONSOLE-307)

const enrichRolesProps = roles => roles.map(role => ({ system: SYSTEM_ROLES.includes(role.name), ...role }))

export default req => {
  const loadPermissions = (appId, policy, service, serviceItemId, serviceItemName,
                           objectId, filterParams = {}) => {

    const url = buildGetUrl(appId, policy, service, serviceItemId, serviceItemName, objectId, filterParams)

    const addTotalRows = response => {
      if (policy === PermissionPolicies.USERS) {
        return totalRows(req).getFor(req.get(urls.dataTable(appId, 'Users')))
          .then(totalRows => ({ ...response, totalRows }))
      }

      return response
    }

    return req.get(url)
      .then(alignGetResponseShape)  //transform all policies responses to the same shape with 'data' prop
      .then(enrichPermissions)      //transform permissions array into permissions map
      .then(enrichEntities)         //transform users and roles entities to the shape with 'id' property
      .then(addTotalRows)           //resolve totalRows property
      .then(sortEntitiesByName)
  }

  const setPermission = (appId, policy, policyItemId, service, serviceItemId, serviceItemName,
                         objectId, permission) => {
    const isOwnerPolicy = policy === PermissionPolicies.OWNER
    const isObjectACL = objectId !== ALL_OBJECTS

    //for owner and object acl the body should contain just {access, permission} object
    //for all other cases it must be wrapped into an array and object :
    //{ permissions: [{access,permission}, ...] }
    let body

    if (isOwnerPolicy || isObjectACL) {
      body = permission
    } else {
      body = {
        permissions: castArray(permission)
      }
    }

    const url = buildPutUrl(appId, policy, service, serviceItemId, serviceItemName,
      objectId, policyItemId, permission)

    return req.put(url, body)
      .then(alignModifyResponseShape(
        appId, policy, policyItemId, service, serviceItemId, serviceItemName, objectId, permission
      ))
  }

  const dropPermissions = (...args) => {
    const url = buildDeleteUrl(...args)

    return req.delete(url).then(alignModifyResponseShape(...args))
  }

  const searchDataACLUsers = (appId, tableName, objectID, query) => {
    return req.get(`${urls.security(appId)}/data/${tableName}/objectAcl/${objectID}/users/search/${query}`)
      .then(result => ({ data: result }))
      .then(enrichPermissions)
      .then(enrichEntities)
      .then(sortEntitiesByName)
  }

  const loadRoles = appId => req.get(urls.securityRoles(appId))
    .then(normalizeRolesPropsNames) //TODO it will be removed when the server will be ready (CONSOLE-307)
    .then(enrichRolesProps) //TODO it will be removed when the server will be ready (CONSOLE-307)

  const createRole = (appId, name) => req.put(`${urls.securityRoles(appId)}/${encodeURIComponent(name)}`)
    .then(normalizeRolePropsNames)

  const deleteRole = (appId, id) => req.delete(`${urls.securityRoles(appId)}/${id}`)

  const loadRolePermissions = (appId, id) =>
    req.get(`${urls.securityRoles(appId)}/permissions/${id}`)

  const setRolePermission = (appId, id, permission) =>
    req.put(`${urls.securityRoles(appId)}/permissions/${id}`, permission)

  return {
    loadRoles,
    createRole,
    deleteRole,
    loadRolePermissions,
    loadPermissions,
    setRolePermission,
    setPermission,
    dropPermissions,
    searchDataACLUsers
  }
}
