const combine = (...tokens) => {
  const result = tokens.reduce((memo, token) => {
    if (token) {
      memo = memo ? `${memo} AND (${token})` : token
    }

    return memo
  }, '')

  return result ? result : undefined
}

export default {
  combine
}
