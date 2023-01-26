import { dataHive, dataHives, dataHiveStore, dataHiveStoreKey } from './urls'
import { prepareRoutes } from './utils/routes'

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

export default req => ({

  getHiveNames(appId) {
    return req.get(dataHives(appId))
  },

  createHive(appId, hiveName) {
    return req.post(`${dataHive(appId, hiveName)}`)
  },

  renameHive(appId, oldName, newName) {
    return req.put(dataHive(appId, oldName)).query({ newName })
  },

  deleteHive(appId, hiveName) {
    return req.delete(`${dataHive(appId, hiveName)}`)
  },

  loadHiveStoreKeys(appId, hiveName, storeType, { pageSize, cursor }) {
    return req.get(`${dataHive(appId, hiveName)}/${storeType}/keys`)
      .query({ pageSize, cursor })
  },

  loadHiveStoreValues(appId, hiveName, storeType, keys) {
    if (storeType === HiveDataTypesMap.KEY_VALUE) {
      return [req.post(dataHiveStore(appId, hiveName, storeType), keys)]
    }

    if (storeType === HiveDataTypesMap.SORTED_SET) {
      return keys.map(key => req.get(`${dataHiveStoreKey(appId, hiveName, storeType, key)}/get-range-by-rank`)
        .query({
          startRank : 0,
          stopRank  : 99,
          withScores: true
        }))
    }

    return keys.map(key => req.get(dataHiveStoreKey(appId, hiveName, storeType, key)))
  },

  setHiveStoreValue(appId, hiveName, storeType, keyName, payload) {
    return req.put(dataHiveStoreKey(appId, hiveName, storeType, keyName), payload)
  },

  addHiveStoreValue(appId, hiveName, storeType, keyName, payload) {
    return req.put(`${dataHiveStoreKey(appId, hiveName, storeType, keyName)}/add`, payload)
  },

  removeHiveStoreRecords(appId, hiveName, storeType, keys) {
    return req.delete(dataHiveStore(appId, hiveName, storeType), keys)
  },

  removeHiveStoreValue(appId, hiveName, storeType, keyName, values) {
    return req.delete(`${dataHiveStoreKey(appId, hiveName, storeType, keyName)}/values`, values)
  },

  //---- Base Type -------------------------//

  setKeyExpiration(appId, hiveName, storeType, key, { ttl, unixTime }) {
    if (ttl !== undefined) {
      return req.put(routes.setKeyExpire(appId, hiveName, storeType, key)).query({ ttl })
    }

    return req.put(routes.setKeyExpireAt(appId, hiveName, storeType, key)).query({ unixTime })
  },

  getKeyExpirationTTL(appId, hiveName, storeType, key) {
    return req.get(routes.keyExpirationTTL(appId, hiveName, storeType, key))
  },

  clearKeyExpiration(appId, hiveName, storeType, key) {
    return req.put(routes.clearKeyExpiration(appId, hiveName, storeType, key))
  },

  getKeySecondsSinceLastOperation(appId, hiveName, storeType, key) {
    return req.get(routes.keySecondsSinceLastOperation(appId, hiveName, storeType, key))
  },

  //---- Base Type -------------------------//

  //---- LIST Type -------------------------//

  addHiveListStoreItems(appId, hiveName, key, items) {
    return req.put(routes.addListStoreItems(appId, hiveName, key), items)
  },

  removeHiveListStoreItemByValue(appId, hiveName, key, value) {
    return req.put(routes.removeListStoreItemByValue(appId, hiveName, key), { value })
  },

  updateHiveListStoreItemByIndex(appId, hiveName, key, index, value) {
    return req.put(routes.listStoreItemByIndex(appId, hiveName, key, index), { value })
  },

  //---- LIST Type -------------------------//

  //---- SET Type -------------------------//

  addHiveSetStoreItems(appId, hiveName, key, items) {
    return req.put(routes.addSetStoreItems(appId, hiveName, key), items)
  },

  removeHiveSetStoreItemByValue(appId, hiveName, key, value) {
    return req.delete(routes.removeSetStoreItemByValue(appId, hiveName, key), [value])
  },

//---- SET Type -------------------------//
})
