/* eslint-disable max-len */

import { dataHive, dataHives, dataHiveStore, dataHiveStoreKey } from './urls'
import { prepareRoutes } from './utils/routes'
import BaseService from './base/BaseService'

const routes = prepareRoutes({
  setKeyExpire                : '/:appId/console/hive/:hiveName/:store/:key/expire',
  setKeyExpireAt              : '/:appId/console/hive/:hiveName/:store/:key/expire-at',
  keyExpirationTTL            : '/:appId/console/hive/:hiveName/:store/:key/get-expiration-ttl',
  clearKeyExpiration          : '/:appId/console/hive/:hiveName/:store/:key/clear-expiration',
  keySecondsSinceLastOperation: '/:appId/console/hive/:hiveName/:store/:key/seconds-since-last-operation',
  //
  addListStoreItems         : '/:appId/console/hive/:hiveName/list/:key/add-last',
  removeListStoreItemByValue: '/:appId/console/hive/:hiveName/list/:key/delete-value',
  listStoreItemByIndex      : '/:appId/console/hive/:hiveName/list/:key/:index',

  addSetStoreItems          : '/:appId/console/hive/:hiveName/set/:key/add',
  removeSetStoreItemByValue : '/:appId/console/hive/:hiveName/set/:key/values',
})

const HiveDataTypesMap = {
  KEY_VALUE : 'key-value',
  LIST      : 'list',
  MAP       : 'map',
  SET       : 'set',
  SORTED_SET: 'sorted-set',
}

class DataHives extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'dataHives'
  }

  /**
   * @aiToolName Get Hive Names
   * @category Data Hives
   * @description Retrieves all hive names for an application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult ["hive1","hive2","testHive"]
   */
  getHiveNames(appId) {
    return this.req.get(dataHives(appId))
  }

  /**
   * @aiToolName Create Hive
   * @category Data Hives
   * @description Creates a new data hive in an application.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive to create","required":true}
   * @sampleResult ""
   */
  createHive(appId, hiveName) {
    return this.req.post(`${dataHive(appId, hiveName)}`)
  }

  /**
   * @aiToolName Rename Hive
   * @category Data Hives
   * @description Renames an existing data hive.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"oldName","label":"Old Name","description":"The current name of the hive","required":true}
   * @paramDef {"type":"string","name":"newName","label":"New Name","description":"The new name for the hive","required":true}
   * @sampleResult {"success":true}
   */
  renameHive(appId, oldName, newName) {
    return this.req.put(dataHive(appId, oldName)).query({ newName })
  }

  /**
   * @aiToolName Delete Hive
   * @category Data Hives
   * @description Deletes a data hive and all its data.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive to delete","required":true}
   * @sampleResult {"success":true}
   */
  deleteHive(appId, hiveName) {
    return this.req.delete(`${dataHive(appId, hiveName)}`)
  }

  loadHiveStoreKeys(appId, hiveName, storeType, { pageSize, cursor }) {
    return this.req.get(`${dataHive(appId, hiveName)}/${storeType}/keys`)
      .query({ pageSize, cursor })
  }

  loadHiveStoreValues(appId, hiveName, storeType, keys) {
    if (storeType === HiveDataTypesMap.KEY_VALUE) {
      return [this.req.post(dataHiveStore(appId, hiveName, storeType), keys)]
    }

    if (storeType === HiveDataTypesMap.SORTED_SET) {
      return keys.map(key => this.req.get(`${dataHiveStoreKey(appId, hiveName, storeType, key)}/get-range-by-rank`)
        .query({
          startRank : 0,
          stopRank  : 99,
          withScores: true
        }))
    }

    return keys.map(key => this.req.get(dataHiveStoreKey(appId, hiveName, storeType, key)))
  }

  /**
   * @typedef {Object} HiveStorePayload
   * @property {any} value - The actual value to store. Format depends on storeType:
   * - key-value: any value (string, number, object, array)
   * - list: array of values [item1, item2, ...]
   * - map: object with key-value pairs {key1: value1, key2: value2}
   * - set: array of unique values [item1, item2, ...]
   * - sorted-set: array of [score, value] pairs [[1.5, "item1"], [2.0, "item2"]]
   */

  /**
   * @aiToolName Set Hive Store Value
   * @category Data Hives
   * @description Sets a value in the hive store for any store type (key-value, list, map, set, sorted-set). Value must be wrapped in object with 'value' field.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"keyName","label":"Key Name","description":"The key name","required":true}
   * @paramDef {"type":"HiveStorePayload","name":"payload","label":"Payload","description":"Object with 'value' field containing data to store","required":true}
   * @sampleResult true
   */
  setHiveStoreValue(appId, hiveName, storeType, keyName, payload) {
    return this.req.put(dataHiveStoreKey(appId, hiveName, storeType, keyName), payload)
  }

  /**
   * @aiToolName Add Hive Store Value
   * @category Data Hives
   * @description Adds/creates a value in the hive store for any store type (key-value, list, map, set, sorted-set). Value must be wrapped in object with 'value' field.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"keyName","label":"Key Name","description":"The key name","required":true}
   * @paramDef {"type":"HiveStorePayload","name":"payload","label":"Payload","description":"Object with 'value' field containing data to store","required":true}
   * @sampleResult true
   */
  addHiveStoreValue(appId, hiveName, storeType, keyName, payload) {
    return this.req.put(`${dataHiveStoreKey(appId, hiveName, storeType, keyName)}/add`, payload)
  }

  /**
   * @aiToolName Remove Hive Store Records
   * @category Data Hives
   * @description Removes multiple records from a hive store by their keys. Works with any store type (key-value, list, map, set, sorted-set).
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"array","name":"keys","label":"Keys","description":"Array of key names to remove","required":true}
   * @sampleResult 1
   */
  removeHiveStoreRecords(appId, hiveName, storeType, keys) {
    return this.req.delete(dataHiveStore(appId, hiveName, storeType), keys)
  }

  /**
   * @aiToolName Remove Hive Store Value
   * @category Data Hives
   * @description Removes specific values from a hive store key. Works with any store type (key-value, list, map, set, sorted-set).
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"keyName","label":"Key Name","description":"The key name","required":true}
   * @paramDef {"type":"array","name":"values","label":"Values","description":"Array of values to remove from the key","required":true}
   * @sampleResult 1
   */
  removeHiveStoreValue(appId, hiveName, storeType, keyName, values) {
    return this.req.delete(`${dataHiveStoreKey(appId, hiveName, storeType, keyName)}/values`, values)
  }

  //---- Base Type -------------------------//

  /**
   * @typedef {Object} SetKeyExpiration__options
   * @property {number} [ttl] - Time to live in seconds from now (e.g., 60 = expire in 1 minute, 3600 = expire in 1 hour)
   * @property {number} [unixTime] - Unix timestamp in seconds when key should expire
   */

  /**
   * @aiToolName Set Key Expiration
   * @category Data Hives
   * @description Sets expiration time for a hive key of any store type (key-value, list, map, set, sorted-set). Use either TTL (seconds from now) or Unix timestamp (in seconds).
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @paramDef {"type":"SetKeyExpiration__options","name":"options","label":"Expiration Options","description":"Object with either ttl (seconds from now) or unixTime (Unix timestamp in seconds)","required":true}
   * @sampleResult ""
   */
  setKeyExpiration(appId, hiveName, storeType, key, { ttl, unixTime }) {
    if (ttl !== undefined) {
      return this.req.put(routes.setKeyExpire(appId, hiveName, storeType, key)).query({ ttl })
    }

    return this.req.put(routes.setKeyExpireAt(appId, hiveName, storeType, key)).query({ unixTime })
  }

  /**
   * @aiToolName Get Key Expiration TTL
   * @category Data Hives
   * @description Gets the time-to-live for a hive key of any store type (key-value, list, map, set, sorted-set).
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @sampleResult 34
   */
  getKeyExpirationTTL(appId, hiveName, storeType, key) {
    return this.req.get(routes.keyExpirationTTL(appId, hiveName, storeType, key))
  }

  /**
   * @aiToolName Clear Key Expiration
   * @category Data Hives
   * @description Removes expiration from a hive key of any store type (key-value, list, map, set, sorted-set).
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @sampleResult true
   */
  clearKeyExpiration(appId, hiveName, storeType, key) {
    return this.req.put(routes.clearKeyExpiration(appId, hiveName, storeType, key))
  }

  /**
   * @aiToolName Get Key Seconds Since Last Operation
   * @category Data Hives
   * @description Gets seconds elapsed since the last operation on a key of any store type (key-value, list, map, set, sorted-set).
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"storeType","label":"Store Type","description":"The type of store. Valid values: 'key-value', 'list', 'map', 'set', 'sorted-set'","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @sampleResult 4
   */
  getKeySecondsSinceLastOperation(appId, hiveName, storeType, key) {
    return this.req.get(routes.keySecondsSinceLastOperation(appId, hiveName, storeType, key))
  }

  //---- Base Type -------------------------//

  //---- LIST Type -------------------------//

  /**
   * @aiToolName Add List Store Items
   * @category Data Hives
   * @description [LIST STORE TYPE] Adds items to the end of a list store. Lists maintain insertion order and allow duplicates. Creates the list if it doesn't exist.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @paramDef {"type":"array","name":"items","label":"Items","description":"Array of items to add to the list","required":true}
   * @sampleResult 6
   */
  addHiveListStoreItems(appId, hiveName, key, items) {
    return this.req.put(routes.addListStoreItems(appId, hiveName, key), items)
  }

  /**
   * @aiToolName Remove List Item by Value
   * @category Data Hives
   * @description [LIST STORE TYPE] Removes items with specified value from a list store. Lists maintain insertion order and allow duplicates.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @paramDef {"type":"string","name":"value","label":"Value","description":"The value to remove","required":true}
   * @sampleResult 1
   */
  removeHiveListStoreItemByValue(appId, hiveName, key, value) {
    return this.req.put(routes.removeListStoreItemByValue(appId, hiveName, key), { value })
  }

  /**
   * @aiToolName Update List Item by Index
   * @category Data Hives
   * @description [LIST STORE TYPE] Updates a list item at specified index. Lists are zero-indexed and maintain insertion order.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @paramDef {"type":"number","name":"index","label":"Index","description":"The index position","required":true}
   * @paramDef {"type":"string","name":"value","label":"Value","description":"The new value","required":true}
   * @sampleResult ""
   */
  updateHiveListStoreItemByIndex(appId, hiveName, key, index, value) {
    return this.req.put(routes.listStoreItemByIndex(appId, hiveName, key, index), { value })
  }

  //---- LIST Type -------------------------//

  //---- SET Type -------------------------//

  /**
   * @aiToolName Add Set Store Items
   * @category Data Hives
   * @description [SET STORE TYPE] Adds items to a set store. Sets automatically handle duplicates - only unique values are stored. Creates the set if it doesn't exist.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @paramDef {"type":"array","name":"items","label":"Items","description":"Array of items to add to the set (duplicates will be filtered out)","required":true}
   * @sampleResult 3
   */
  addHiveSetStoreItems(appId, hiveName, key, items) {
    return this.req.put(routes.addSetStoreItems(appId, hiveName, key), items)
  }

  /**
   * @aiToolName Remove Set Item by Value
   * @category Data Hives
   * @description [SET STORE TYPE] Removes specified value from a set store. Sets contain only unique values.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"hiveName","label":"Hive Name","description":"The name of the hive","required":true}
   * @paramDef {"type":"string","name":"key","label":"Key","description":"The key name","required":true}
   * @paramDef {"type":"string","name":"value","label":"Value","description":"The value to remove","required":true}
   * @sampleResult 1
   */
  removeHiveSetStoreItemByValue(appId, hiveName, key, value) {
    return this.req.delete(routes.removeSetStoreItemByValue(appId, hiveName, key), [value])
  }

  //---- SET Type -------------------------//
}

export default req => DataHives.create(req)
