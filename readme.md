# 🦄 SuperLogs
Super simple logs. 

Super logs uses the builder pattern to not just build logs but also build a relationship tree between runtime code

### Install
yarn
```
yarn add -D superlogs
```

or for npm
```
npm i --dev superlogs
```

### Require
For CommonJs
```js
const superlogs = require('superlogs');
const logger = superlogs.logger;
```

For Babel 
```js
import {logger} from 'superlogs';
```

For Typescript 
```typescript
import {logger} from 'superlogs';
```

 
### Usage 
An example 

```js
  logger('PlaybookService')
    .addMethod('list', 'list a playbook')
        .addStep('validate', 'validate the DTO')
          .addData('user', {username: 'mitchell'})
          .addMongo('playbooks', {id: 100, name: 'airbnb'})
        .addStep('if user', 'if no user exists', StepCat.ifBlock)
          .addError('no user found', {message: 'not found'})
          .addThrows('NoUserFoundError', {message: 'not found'})
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
```


## API
@todo - write this

## Authour/Author
Nick Mitchell - @todo

