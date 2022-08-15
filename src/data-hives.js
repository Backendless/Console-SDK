import { dataHive, dataHives, dataHiveStore, dataHiveStoreKey } from './urls'

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
          stopRank  : 100,
          withScores: true
        }))
    }

    return keys.map(key => req.get(dataHiveStoreKey(appId, hiveName, storeType, key)))
  },

  saveHiveStoreRecord(appId, hiveName, storeType, keyName, payload) {
    if (storeType === HiveDataTypesMap.KEY_VALUE) {
      return req.put(dataHiveStore(appId, hiveName, storeType), { [keyName]: payload.value })
    }

    return req.put(dataHiveStoreKey(appId, hiveName, storeType, keyName), payload)
  },

  removeHiveStoreRecords(appId, hiveName, storeType, keys) {
    return req.delete(dataHiveStore(appId, hiveName, storeType), keys)
  },
})
