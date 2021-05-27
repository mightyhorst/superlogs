/**
 * example.js
 */
const {logger} = require('./index');
const {errorToJson} = require('./src');

/**
 * @debug
 */
function run() {
  logger('PlaybookService')
    .addMethod('data', 'data method')
      .addStep('validate the DTO')
        .addData('user', { username: 'mitchell' })
        .addData({user: { username: 'mitchell' }})
        .addMongo('playbooks', { id: 100, name: 'airbnb' })
      .addStep('if no user exists', 'if')
        .addError(new Error('not found'))
        .addThrows(new TypeError('wrong type'))
      .addStep('create the DB')
      .addStep('update the DB')
    .addMethod('logic', 'logic stuff')
      .addStep('case logic')
        .addCheck('check description here')
      .addStep('if logic')
        .addIf('if statement')
      .addStep('else if logic')
        .addElseIf('else if statement')
      .addStep('else logic')
}
run();

/**
 * @sample
 */
 const txtErrorStackSample = `Error: Missing unicorn
 at Object.<anonymous> (/Users/sindresorhus/dev/clean-stack/unicorn.js:2:15)
 at Module._compile (module.js:409:26)
 at Object.Module._extensions..js (module.js:416:10)
 at Module.load (module.js:343:32)
 at Function.Module._load (module.js:300:12)
 at Function.Module.runMain (module.js:441:10)
 at startup (node.js:139:18)
`;

const test1 = errorToJson({
    name: "MockError",
    message: "MockError message",
    stack: txtErrorStackSample
});
const test2 = errorToJson(new Error("oh no"));
const test3 = errorToJson(new TypeError("oh no"));
const test4 = errorToJson(new SyntaxError("SyntaxError"));
const test5 = errorToJson(new ReferenceError("ReferenceError"));

/**
* @debug
*/
console.log("--- @debug ---");
console.log({ test1 });
console.log({ test2 });
console.log({ test3 });
console.log({ test4 });
console.log({ test5 });
