module.exports.config = require('./config');
module.exports.dbTablesEnum = require('./db/dbTablesEnum');
module.exports.errors = require('./errors');
module.exports.regexp = require('./regexp');
module.exports.dynamicParams = require('./dynamic-params');
module.exports.authKeywords = require('./auth/auth-keywords');

module.exports.emailActions = require('./mail/email-actions');
module.exports.mailKeywords = require('./mail/mail-keywords');

module.exports.responseCodes = require("./response/response-codes.enum");
module.exports.responseMessages = require('./response/response-messages.enum');

module.exports.frontendEndpoints = require('./endpoints/frontend-endpoints');
module.exports.serverEndpoints = require('./endpoints/server-endpoints');

module.exports.mimetypes = require('./files/mimetypes');
module.exports.staticDirNames = require('./files/static-dir-names');