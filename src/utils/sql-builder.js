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

  distance: (lat, lng, unit, radius, latName = 'latitude', lngName = ' longitude') => {
    return `distance(${lat}, ${lng}, ${latName}, ${lngName}) < ${unit}(${radius})`
  }
}

export default SQL
