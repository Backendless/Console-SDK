/* eslint-disable max-len */

import urls from './urls'

import BaseService from './base/base-service'

const DEFAULT_NAME_PATTERN = '*'

const normalizeResponse = item => ({
  ...item,
  objectId: item.name,
})

class AtomicCounters extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'counters'
  }

  /**
   * @typedef {Object} getAtomicCounters__params
   * @paramDef {"type":"number","label":"Page Size","name":"pageSize","description":"Number of counters to return per page","required":false}
   * @paramDef {"type":"number","label":"Offset","name":"offset","description":"Number of counters to skip for pagination","required":false}
   * @paramDef {"type":"string","label":"Sort Field","name":"sortField","description":"Field name to sort counters by","required":false}
   * @paramDef {"type":"string","label":"Sort Direction","name":"sortDir","description":"Direction of sorting, either ASC or DESC","required":false}
   * @paramDef {"type":"string","label":"Pattern","name":"pattern","description":"Filter counters by name pattern (wildcards supported)","required":false}
   */

  /**
   * @aiToolName Get Atomic Counters
   * @category Counters
   * @description Retrieves a list of atomic counters with pagination and sorting support.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"getAtomicCounters__params","name":"params","label":"Query Parameters","description":"Optional pagination, sorting, and filtering parameters","required":true}
   * @sampleResult {"data":[{"objectId":"counterA","name":"counterA","value":10},{"objectId":"counterB","name":"counterB","value":25}],"totalRows":2}
   * */
  get(appId, params = {}) {
    const { pageSize, offset, sortField, sortDir, pattern = DEFAULT_NAME_PATTERN } = params
    return this.req
      .get(urls.atomicCounters(appId))
      .query({ pageSize, offset, sortField, sortDir, pattern })
  }

  /**
   * @aiToolName List Atomic Counter Names
   * @category Counters
   * @description Retrieves a list of all atomic counter names matching a specified pattern.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"pattern","label":"Pattern","description":"Filter counters by name pattern (wildcards supported)","required":false}
   */
  listNames(appId, pattern = DEFAULT_NAME_PATTERN) {
    return this.req.get(`${urls.atomicCounters(appId)}/${pattern}/list-names`)
  }

  /**
   * @aiToolName List Atomic Counters by Names
   * @category Counters
   * @description Retrieves atomic counters by a list of specific names.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"array","name":"names","label":"Counter Names","description":"Array of atomic counter names to retrieve","required":true}
   */
  listCounters(appId, names) {
    return this.req.post(`${urls.atomicCounters(appId)}/list-by-names`, names)
  }

  /**
   * @aiToolName Create Atomic Counter
   * @category Counters
   * @methodPath atomicCounters.create
   * @description Creates a new atomic counter with the specified initial value.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"name","label":"Counter Name","description":"The name of the atomic counter","required":true}
   * @paramDef {"type":"number","name":"value","label":"Initial Value","description":"Initial value for the counter","required":true}
   * @sampleResult {"name":"counterA","value":10}
   */
  create(appId, name, value) {
    return this.req
      .post(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`, { value })
      .then(normalizeResponse)
  }

  /**
   * @aiToolName Update Atomic Counter
   * @category Counters
   * @methodPath atomicCounters.update
   * @description Updates the value of an atomic counter.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"name","label":"Counter Name","description":"The name of the atomic counter to update","required":true}
   * @paramDef {"type":"number","name":"currentValue","label":"Current Value","description":"The expected current value of the counter (used for optimistic concurrency)","required":true}
   * @paramDef {"type":"number","name":"newValue","label":"New Value","description":"The new value to set for the counter","required":true}
   * @sampleResult ""
   */
  update(appId, name, currentValue, newValue) {
    return this.req.put(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`, { currentValue, newValue })
  }

  /**
   * @aiToolName Remove Atomic Counter
   * @category Counters
   * @methodPath atomicCounters.remove
   * @description Permanently removes an atomic counter by its name.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"name","label":"Counter Name","description":"The name of the atomic counter to be removed","required":true}
   * @sampleResult ""
   */
  remove(appId, name) {
    return this.req.delete(`${urls.atomicCounters(appId)}/${encodeURIComponent(name)}`)
  }
}

export default req => AtomicCounters.create(req)
