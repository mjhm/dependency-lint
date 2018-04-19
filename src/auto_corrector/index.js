const _ = require('lodash')
const ERRORS = require('../errors')
const sortedObject = require('sorted-object')

export default class AutoCorrector {
  correct({ packageJson, results }) {
    const { changes, fixes } = this.getChanges(results)
    const updatedPackageJson = this.applyChanges({ changes, packageJson })
    return { fixes, updatedPackageJson }
  }

  getChanges(results) {
    const changes = []
    const fixes = { dependencies: [], devDependencies: [] }
    _.each(results, (modules, type) => {
      _.each(modules, module => {
        const change = this.getChange({ module, type })
        if (change) {
          changes.push(change)
          fixes[type].push(module.name)
        }
      })
    })
    return { changes, fixes }
  }

  getChange({ module, type }) {
    if (module.errorIgnored) {
      return _.noop
    }
    switch (module.error) {
      case ERRORS.SHOULD_BE_DEPENDENCY:
      case ERRORS.SHOULD_BE_DEV_DEPENDENCY:
        return function(packageJson) {
          const newType =
            type === 'dependencies' ? 'devDependencies' : 'dependencies'
          const version = packageJson[type][module.name]
          delete packageJson[type][module.name]
          if (!packageJson[newType]) {
            packageJson[newType] = {}
          }
          packageJson[newType][module.name] = version
          packageJson[newType] = sortedObject(packageJson[newType])
        }
      case ERRORS.UNUSED:
        return packageJson => delete packageJson[type][module.name]
      default:
        return _.noop
    }
  }

  applyChanges({ changes, packageJson }) {
    const updatedPackageJson = _.cloneDeep(packageJson)
    _.each(changes, change => change(updatedPackageJson))
    return updatedPackageJson
  }
}

module.exports = AutoCorrector
