import urls from './urls'

export const IMAGE_FILE = /(\jpg|\jpeg|\png|\gif|\ico)$/
export const XSLT_FILE = /(\.xsl|\.xslt)$/

const PROJECT_TEMPLATES_PATH = 'codegen/projecttemplates'
const PROMPT_FILE_NAME = 'prompt.json'
const DEFAULT_PROMPT = 'Make a selection'

const getFolders = folders => folders.filter(({ size }) => !size)

export default req => {
  const loadDirectory = (appId, authKey, path) => req.get(urls.fileView(appId, authKey, path))

  const loadTemplates = (appId, authKey, path = '') => {
    const result = {}

    return loadDirectory(appId, authKey, `${PROJECT_TEMPLATES_PATH}/${path}`)
      .then(children => {
        result.children = getFolders(children)

        const map = children.map(child => {
          if (child.name === PROMPT_FILE_NAME) {
            return loadDirectory(appId, authKey, child.url)
              .then(({ prompt }) => result.prompt = prompt)
          } else {
            result.prompt = DEFAULT_PROMPT
          }

          if (!child.size) {
            return loadDirectory(appId, authKey, child.url).then(children => {
              const icon = children.find(({ name }) => IMAGE_FILE.test(name))
              const readme = children.find(({ name }) => name === 'README.md')

              if (icon) {
                child.icon = urls.fileView(appId, authKey, icon.url)
              }

              let chain = Promise.resolve()

              if (readme) {
                chain = chain
                  .then(() => loadDirectory(appId, authKey, readme.url))
                  .then(readmeContent => child.readme = readmeContent)
              }

              chain = chain
                .then(() => {
                  const xslt = children.find(({ name }) => XSLT_FILE.test(name))

                  if (xslt) {
                    child.xslt = xslt.url

                    return
                  }

                  child.children = children
                })

              return chain
            })
          }
        })

        return Promise.all(map).then(() => result)
      })
  }

  const generateProject = (appId, xsl) => {
    return req.post(`${urls.appConsole(appId)}/codegen`, { xsl })
  }

  return {
    loadTemplates,
    generateProject
  }
}
