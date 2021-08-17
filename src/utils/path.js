export const optional = path => {
  return path ? '/' + path : ''
}

export const encodePath = path => path.split('/').map(pathPart => encodeURIComponent(pathPart)).join('/')
