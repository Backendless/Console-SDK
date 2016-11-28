const DEFAULT_TTL = 30000 // 30 sec

/**
 * @typedef {Object} CacheItem
 * @property {*} value
 * @property {Array.<RegExp|String>} tags
 * @property {Number} ttl
 */

/**
 * @param {*} value
 * @param {Array.<RegExp|String>}tags
 * @param {Number} ttl
 * @returns {CacheItem}
 */
const cacheItem = (value, tags, ttl) => ({ value, tags, ttl })

const currentTime = () => new Date().getTime()

/**
 * Returns true if tag A matches tag B :
 *  - if they are non-strictly equal
 *  - if one of them is Regexp matching the opposite
 *
 * @param {String|RegExp} a
 * @param {String|RegExp} b
 * @returns {Boolean}
 */
const tagsMatches = (a, b) => {
  let result = a == b // eslint-disable-line

  if (!result && a instanceof RegExp) {
    result = a.test(b)
  }

  if (!result && b instanceof RegExp) {
    result = b.test(a)
  }

  return result
}

/**
 * Returns true if any of A tags matches any of B tags
 *
 * @param {Array.<String|RegExp>} a
 * @param {Array.<String|RegExp>} b
 * @returns {Boolean}
 */
const tagsContainMatches = (a, b) => {
  return !!a.find(aTag => b.find(bTag => tagsMatches(aTag, bTag)))
}


/**
 * A Cache with TTL and optional tags for the keys
 * Makes it possible to assign multiple tags for a key and delete keys by tags
 * Optionally it starts flushing timer which cleans all outdated keys
 */
export default class Cache {

  /**
   * @param {Number?} flushInternal
   */
  constructor(flushInternal) {
    if (flushInternal) {
      this.flushInterval = setInterval(this.flush.bind(this), flushInternal)
    }

    /**
     * @type {Map.<String, CacheItem>}
     */
    this.map = new Map()
  }

  /**
   * @param {String} key
   * @returns {*}
   */
  get(key) {
    const cacheItem = this.map.get(key)

    if (cacheItem) {
      if (cacheItem.ttl > currentTime()) {
        return cacheItem.value
      } else {
        this.map.delete(key)
      }
    }
  }

  /**
   * @param {String} key
   * @param {*} value
   * @param {Array.<RegExp|String>=} tags
   * @param {Number=} ttl
   */
  set(key, value, tags, ttl = DEFAULT_TTL) {
    this.map.set(key, cacheItem(value, tags, currentTime() + ttl))
  }

  /**
   * @param {String} key
   */
  delete(key) {
    this.map.delete(key)
  }

  /**
   * @param {Array.<String>} tags
   */
  deleteByTags(tags) {
    for (const [key, value] of this.map) {
      if (value.tags && tagsContainMatches(tags, value.tags)) {
        this.delete(key)
      }
    }
  }

  /**
   * Deletes all outdated keys
   */
  flush() {
    const now = currentTime()

    for (const [key, value] of this.map) {
      if (value.ttl < now) {
        this.delete(key)
      }
    }
  }
}
