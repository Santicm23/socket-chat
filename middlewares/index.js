
const validateJWT = require('./validate-jwt');
const validateParams = require('./validate-params');
const validateRoles = require('./validate-roles');
const validateFiles = require('./validate-files');


module.exports = {
    ...validateJWT,
    ...validateParams,
    ...validateRoles,
    ...validateFiles
}