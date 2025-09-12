import fs from 'fs'
import jsdoc2md from 'jsdoc-to-markdown'
import { resolve } from 'path'

function isMethodAndNotSystem(item) {
  return item.kind === 'function'
    && item.access !== 'private'
    && item.undocumented !== true
    && item.tags
    && item.tags.length > 0
}

function getReturnsData(returns) {
  const { type, description } = returns?.[0] || {}

  return {
    returnsType       : type?.names,
    returnsDescription: description,
  }
}

function extractServiceName(data) {
  for (const item of data) {
    if (item.kind === 'member' && item.name === 'serviceName' && item.meta?.code?.value) {
      return item.meta.code.value
    }
  }

  return null
}

export default class JSDocCollector {
  constructor({ sourcePaths = [], outputPath = './definitions.json' }) {
    this.sourcePaths = sourcePaths
    this.outputPath = outputPath
  }

  getJsFiles(paths) {
    const files = []

    const walk = filePath => {
      if (!fs.existsSync(filePath)) return

      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        fs.readdirSync(filePath).forEach(entry => walk(resolve(filePath, entry)))
      } else if (stats.isFile() && filePath.endsWith('.js')) {
        files.push(filePath)
      }
    }

    paths.forEach(p => walk(p))
    return files
  }

  async collect() {
    const jsFiles = this.getJsFiles(this.sourcePaths)

    if (jsFiles.length === 0) {
      console.warn('⚠️ No JS files found in provided paths')
      return []
    }

    const services = []
    let methodsCount = 0
    const globalTypedefs = new Map()

    for (const fileName of jsFiles) {
      try {
        const data = await jsdoc2md.getJsdocData({ files: fileName })

        const fileTypedefs = this.collectTypedefs(data)

        fileTypedefs.forEach((typedef, name) => {
          globalTypedefs.set(name, typedef)
        })

        const serviceName = extractServiceName(data)
        const serviceInfo = { fileName, serviceName }

        if (!serviceName) {
          console.error(`Add "serviceName" to class constructor ${fileName}`)
          continue
        }

        const methodsOfServiceClass = data.filter(isMethodAndNotSystem)

        const methods = methodsOfServiceClass.map(methodJSDocData => {
            methodsCount++
            return this.shapeTemplateDTO(methodJSDocData, globalTypedefs)
          }
        )

        services.push({ methods, serviceInfo })
      } catch (error) {
        console.error(`❌ Error processing ${fileName}:`, error.message)
      }
    }

    fs.writeFileSync(this.outputPath, JSON.stringify(services, null, 2))
    console.log(`✅ Documentation collected successfully to ${this.outputPath}`)
    console.log(`📊 Collected ${services.length} services with ${methodsCount} methods`)

    return services
  }

  collectTypedefs(data) {
    const typedefs = new Map()

    data.filter(item => item.kind === 'typedef').forEach(item => {
      const typedefName = item.name
      const properties = []

      if (item.tags) {
        item.tags.forEach(tag => {
          if (tag.originalTitle === 'paramDef') {
            try {
              const paramDef = JSON.parse(tag.value)

              properties.push({
                name       : paramDef.name,
                label      : paramDef.label,
                type       : paramDef.type?.toLowerCase() || 'string',
                optional   : !paramDef.required || true,
                description: paramDef.description,
              })
            } catch (error) {
              console.warn(`Failed to parse paramDef in typedef ${typedefName}:`, tag.value)
            }
          }
        })
      }

      if (properties.length > 0) {
        typedefs.set(typedefName, {
          name       : typedefName,
          description: item.description,
          properties
        })
      }
    })

    return typedefs
  }

  shapeTemplateDTO(methodData, typedefs) {
    const { tags, name, description, returns } = methodData

    const dto = {
      params     : [],
      methodName : name,
      description: description?.replaceAll('\n', ' ').trim(),
      ...getReturnsData(returns),
    }

    if (tags) {
      tags.forEach(tag => {
        const { originalTitle, value } = tag

        if (originalTitle === 'category') {
          dto.category = value
        }

        if (originalTitle === 'registerAs') {
          dto.registerAs = value
        }

        if (originalTitle === 'aiToolName') {
          dto.methodLabel = value
        }

        if (originalTitle === 'requiredOauth2Scopes') {
          dto.scopes = value
            .trim()
            .split(' ')
            .map(el => (el === '|' ? 'or' : el))
        }

        if (originalTitle === 'route') {
          const [methodType, route] = value.replace(/\s+/g, ' ').split(' ')
          dto.methodType = methodType
          dto.route = route
        }

        if (originalTitle === 'paramDef') {
          const param = JSON.parse(value)

          if (typedefs.has(param.type)) {
            const typedef = typedefs.get(param.type)
            param.properties = typedef.properties
            param.expandedFromTypedef = param.type
            param.type = 'object'
          }

          param.optional = !param.required || true

          delete param.required

          dto.params.push(param)
        }

        if (originalTitle === 'sampleResult') {
          dto.sampleResult = value
        }
      })
    }

    return dto
  }
}
