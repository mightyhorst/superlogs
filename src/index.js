/**
 * @requires barrel file 
 */
const {errorToJson} = require('./error');
const {formats} = require('./formats');
const {logger} = require('./logger');

console.log('formats--->', formats);

/**
 * @exports barrel file
 */
module.exports = {
    what: 'fuck',
    errorToJson,
    formats,
    logger,
}
