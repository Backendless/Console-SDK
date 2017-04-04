const UNITS_CONVERTERS = {
  miles     : 'mi',
  yards     : 'yd',
  kilometers: 'km',
  meters    : 'km'
}

const RADIUS_CONVERTERS = {
  meters: value => value / 1000
}

const SQL = {
  and: (...tokens) => {
    const result = tokens.reduce((memo, token) => {
      if (token) {
        memo = memo ? `${memo} AND (${token})` : token
      }

      return memo
    }, '')

    return result ? result : undefined
  },

  in: (name, items) => {
    const tokens = items.map(item => typeof item === 'string' ? `'${item}'` : item)

    return items.length ? `(${name} IN (${tokens.join(', ')}))` : undefined
  },

  distance: (lat, lng, unit, radius) => {
    const u = UNITS_CONVERTERS[unit]
    const r = RADIUS_CONVERTERS[unit] ? RADIUS_CONVERTERS[unit](radius) : radius

    return `distance(${lat}, ${lng}, latitude, longitude) < ${u}(${r})`
  }
}

export default SQL
