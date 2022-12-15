import { dataHive, dataHives, dataHiveStore, dataHiveStoreKey } from './urls'
import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  addListStoreItems         : '/:appId/console/hive/:hiveName/list/:key/add-last',
  removeListStoreItemByValue: '/:appId/console/hive/:hiveName/list/:key/delete-value',
  listStoreItemByIndex      : '/:appId/console/hive/:hiveName/list/:key/:index',
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
})
