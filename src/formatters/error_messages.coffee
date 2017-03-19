ERRORS = require '../errors'


errorMessages = {}
errorMessages[ERRORS.MISSING] = 'missing'
errorMessages[ERRORS.SHOULD_BE_DEPENDENCY] = 'should be dependency'
errorMessages[ERRORS.SHOULD_BE_DEV_DEPENDENCY] = 'should be devDependency'
errorMessages[ERRORS.UNUSED] = 'unused'


module.exports = errorMessages
