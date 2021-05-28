/**
 * @requires Components
 */
const {errorToJson} = require('./error');
const {formats} = require('./formats');
const {loggerBrowser} = require('./logger.browser');

/**
 * @enum Step Categories
 */
const StepCat = {
  block: 'step',
  ifBlock: 'if',
  elseIfBlock: 'elseif',
  elseBlock: 'else',
}

/**
 * @constant config
 */
const USE_EMOTICONS = true;

/**
 * @class Logger
 */
class Logger {
  constructor(namespace) {
    this.namespace = namespace;
    this.last = {
      method: '',
      color: 0,
    };
    this.methods = [];
    this.formats = formats();
    this.log = loggerBrowser(this);
  }
  
  addNamespace(namespace){
      this.namespace = namespace;
      this.log.namespace(namespace);
      return this;
  }

  /**
   * Add Method
   * @param {string} methodName - method name
   * @param {string} methodDesc - method description
   * @returns 
   */
  addMethod(methodName, methodDesc) {
    let method = {
      name: methodName,
      description: methodDesc,
      color: this.formats.getColor(),
      steps: [],
    }
    this.methods.push(method);
    this.last.method = method;

    this.log.method(method);
    return this;
  }

  /**
   * Add step
   * @param {string} stepDesc - description
   * @param {string} stepName - name
   * @param {StepCat} cat - category of block, if, else, elseIf
   * @returns 
   */
  addStep(stepDesc, stepName, cat) {
    if (!cat) cat = StepCat.block;

    const method = this.last.method;

    if(!method) console.error('💩 Adding step when there is no method', this.last);

    let step = {
      name: stepName || (method && method.steps) ? `step ${method.steps.length}` : `step ∞`,
      description: stepDesc,
      cat,
      methodName: '',
      methodColor: '',
      data: [],
      logic: [],
      sequence: [],
    }
    step.methodName = method.name;
    step.methodColor = method.color;
    method.steps.push(step);
    this.last.step = step;
    this.log.step(step);
    return this;
  }

  /**
   * Add data to the step
   * @param {string|any} keyOrData - key or json
   * @param {any} dataValIfKey - json value if key is a string
   * @param {'success' | 'failed'} - optional flag for returned data
   * @returns 
   */
  addData(keyOrData, dataValIfKey, optionalFlag) {

    let key, val;
    if(typeof(keyOrData) === 'string'){
      key = keyOrData;
      val = dataValIfKey;
    }
    else if(typeof(keyOrData) === 'object'){
      key = Object.keys(keyOrData)[0];
      val = keyOrData[key];
    }
    else{
      throw new Error('addData must be either a string or JSON object: '+ typeof(keyOrData));
    }

    this.log.data(key, val, optionalFlag);

    const step = this.last.step;
    step.sequence.push({
      type: 'data',
      key: key,
      val: val,
    })
    step.data.push({ key, val });

    return this;
  }

  /**
   * @function addMongo
   * @param {string} description - print description
   * @param {any?} debugData - optional debug data
   */
  addMongo(description, debugData) {
    this.log.mongo(description, debugData);

    const step = this.last.step;
    step.sequence.push({
      type: 'mongo',
      key: description,
      val: debugData,
    });

    return this;
  }

  /**
   * @function addDispatch
   * @param {string} actionType - action type
   * @param {any} actionPayload - action payload
   * @returns {Logger} app
   */
  addDispatch(actionType, actionPayload) {
    this.log.dispatch(actionType, actionPayload);

    const step = this.last.step;
    step.sequence.push({
      type: 'dispatch',
      action: {
        type: actionType,
        payload: actionPayload,
      }
    });

    return this;
  }

  /**
   * @function addFetch
   */
  addFetch(method, url, body, headers) {
    this.log.fetch(`${method} ${url}`, { method, url, body, headers });

    const step = this.last.step;
    step.sequence.push({
      type: 'fetch',
      method,
      url,
      body,
      headers,
    });

    return this;
  }

  /**
   * @function addFireEvent
   */
  addFireEvent(key, val, channel) {
    this.log.fireEvent(key, val, channel);

    const step = this.last.step;
    step.sequence.push({
      type: 'event',
      key: key,
      val: val,
      channel
    });

    return this;
  }

  /**
   * @function addError
   * @param {Error} error - error model or child of Error
   * @param {string?} optionalDescription - optional descritpion to print
   * @returns {Logger} this
   */
   addError(error, optionalDescription) {
    const errorJson = errorToJson(error);
    const description = optionalDescription || errorJson.message;
    
    const step = this.last.step;
    step.sequence.push({
      type: 'throws',
      error: errorJson,
      description,
    });
    
    this.log.error(
      errorJson,
      description
    );
    return this;
  }

  /**
   * @function addThrows
   * @param {Error} error - error model
   * @param {string?} optionalDescription? - optional description - otherwise the error type will be used 
   * @returns 
   */
  addThrows(error, optionalDescription) {

    const errorJson = errorToJson(error);
    const description = optionalDescription || errorJson.message;
    
    const step = this.last.step;
    step.sequence.push({
      type: 'throws',
      error: errorJson,
      description,
    });
    
    this.log.throws(
      errorJson,
      description
    );
    return this;
  }
  addThrow(error, optionalDescription){
    return this.addThrows(error, optionalDescription)
  }

  /**
   * @function addGoto
   * @param {string} method - method name
   * @param {string} namespace - namespace or class name
   * @param {boolean?} isReturn - optional direction
   * @returns {Logger} this
   */
  addGoto(method, namespace, isReturn) {

    if(!namespace) namespace = this.last.namespace;

    this.log.goTo(namespace, method);

    const step = this.last.step;
    step.sequence.push({
      type: 'goto',
      namespace,
      method,
    });

    return this;
  }
  addGoTo(method, namespace, isReturn) {
    return this.addGoto(method, namespace, isReturn);
  }

  /**
   * @function addCheck
   * @description Add Check or Switch
   * @param {string} checkDesc - description
   * @param {any?} debugData? - optional debug data
   * @returns 
   */
  addCheck(checkDesc, debugData) {
    const step = this.last.step;
    this.log.check(checkDesc, debugData);
    return this;
  }

  /**
   * @function addLoop
   */
  addLoop(description, debugData, loopType) {

    if(!loopType) loopType = 'for';

    this.log.loop(description, debugData, loopType);

    const step = this.last.step;

    const logic = {
      type: loopType,
      parentStep: step,
      description, 
      val: debugData,
      isOpen: true,
    };
    this.last.logic = logic;

    step.sequence.push({
      type: loopType,
      description,
      val: debugData,
    });

    return this;
  }
  addEndFor() {
    const logic = this.last.logic;
    logic.isOpen = false;
    return this;
  }

  /**
   * @function addIf
   */
  addIf(description, val) {
    this.log.if(description, val, 'if');

    const step = this.last.step;

    const logic = {
      type: 'if',
      parentStep: step,
      description, 
      val,
      isOpen: true,
    };
    this.last.logic = logic;

    step.sequence.push({
      type: 'if',
      description,
      val: val,
    })

    return this;
  }
  addElseIf(description, val) {
    this.log.if(description, val, 'elseif');

    const step = this.last.step;
    step.sequence.push({
      type: 'elseif',
      description,
      val: val,
    })

    return this;
  }
  addElse(description, val) {
    this.log.if(key, val, 'else');

    const step = this.last.step;
    step.sequence.push({
      type: 'else',
      description,
      val: val,
    })

    return this;
  }
  addEndIf() {
    const logic = this.last.logic;
    logic.isOpen = false;
    return this;
  }
}

function logger(namespace) {
  return new Logger(namespace);
}

module.exports = {
  logger,
};
