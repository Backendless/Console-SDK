class BaseService {
  constructor(req) {
    this.req = req
  }

  static create(req, ...args) {
    const instance = new this(req, ...args)

    const methods = Object.getOwnPropertyNames(this.prototype)
      .filter(name => name !== 'constructor' && typeof instance[name] === 'function')

    return methods.reduce((obj, name) => {
      obj[name] = instance[name].bind(instance)

      return obj
    }, {})
  }
}

export default BaseService
