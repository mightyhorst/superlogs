/**
 * example.js
 */
const logger = require('./index');

function run() {
  logger('PlaybookService')
    .addMethod('list', 'list a playbook')
    .addStep('validate', 'validate the DTO')
    .addData('user', { username: 'mitchell' })
    .addMongo('playbooks', { id: 100, name: 'airbnb' })
    .addStep('if user', 'if no user exists', 'if')
    .addError('no user found', { message: 'not found' })
    .addThrows('NoUserFoundError', { message: 'not found' })
    .addStep('createdb', 'create the DB')
    .addStep('updatedb', 'update the DB')
    .addMethod('get', 'get a playbook')
    .addStep('validate', 'validate the DTO')
    .addStep('createdb', 'create the DB')
    .addStep('updatedb', 'update the DB')
    .addMethod('create', 'create a playbook')
    .addStep('validate', 'validate the DTO')
    .addStep('createdb', 'create the DB')
    .addStep('updatedb', 'update the DB')
    .addMethod('create', 'create a playbook')
    .addStep('validate', 'validate the DTO')
    .addStep('createdb', 'create the DB')
    .addStep('updatedb', 'update the DB')
    .addMethod('create', 'create a playbook')
    .addMethod('create', 'create a playbook')
    .addMethod('create', 'create a playbook')
    .addMethod('create', 'create a playbook')
}
run();