/**
 * @requires Components
 */
const {errorToJson} = require('./error');
const {formats} = require('./formats');

console.log('logger.formats--->', formats);
console.log('logger.errorToJson--->', errorToJson);

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
  }
  
  addNamespace(namespace){
      this.namespace = namespace;
      this.logNamespace(namespace);
      return this;
  }
  logNamespace(namespace) {
    console.log(`namespace: ${namespace}`);
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

    this.logMethod(method);
    return this;
  }
  
  logMethod(method) {
    console.log(
      `%c[${this.namespace}.${method.name}]%c  📦${method.description}`,
      this.formats.method(method.color),
      this.formats.method(method.color),
    );
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
    let step = {
      name: stepName || `step ${method.steps.length}`,
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
    this.logStep(step);
    return this;
  }

  /**
   * Log Step
   * @param {StepModel} step - step model
   */
  logStep(step) {
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c   •🦄 ${step.description}`,
      this.formats.method(step.methodColor),
      this.formats.step(step.methodColor)
    );
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

    this.logData(key, val, optionalFlag);

    const step = this.last.step;
    step.sequence.push({
      type: 'data',
      key: key,
      val: val,
    })
    step.data.push({ key, val });

    return this;
  }
  logData(key, val, optionalFlag) {
    let tag = USE_EMOTICONS ? '🗂': '@data';
    if(optionalFlag === 'success'){
      tag = USE_EMOTICONS ? '✅': '@success';
    }
    else if(optionalFlag === 'failed'){
      tag = USE_EMOTICONS ? '❌': '@fail';
    }

    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ${key}`,
      this.formats.method(step.methodColor),
      this.formats.clear(),
      {
        [key]: val
      }
    );
  }

  

  /**
   * @function addMongo
   * @param {string} description - print description
   * @param {any?} debugData - optional debug data
   */
  addMongo(description, debugData) {
    this.logMongo(description, debugData);

    const step = this.last.step;
    step.sequence.push({
      type: 'mongo',
      key: description,
      val: debugData,
    });

    return this;
  }

  /**
   * @function logMongo
   * @param {string} description - print description
   * @param {any?} debugData - optional debug data
   */
  logMongo(description, debugData) {
    const tag = USE_EMOTICONS ? '🌳': '@mongo';
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ${description}`,
      this.formats.method(step.methodColor),
      this.formats.clear(),
      debugData
    );
  }

  /**
   * @function addDispatch
   */
  addDispatch(key, val) {
    this.logDispatch(key, val);

    const step = this.last.step;
    step.sequence.push({
      type: 'dispatch',
      key: key,
      val: val,
    });

    return this;
  }
  logDispatch(key, val) {
    const tag = USE_EMOTICONS ? '⚡️': '@dispatch';
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ${key}`,
      this.formats.method(step.methodColor),
      this.formats.clear(),
      {
        [key]: val
      }
    );
  }

  /**
   * @function addFetch
   */
  addFetch(method, url, body, headers) {
    this.logFetch(`${method} ${url}`, { method, url, body, headers });

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
  logFetch(key, val) {
    const tag = USE_EMOTICONS ? '☁️': '@fetch';
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ${key}`,
      this.formats.method(step.methodColor),
      this.formats.clear(),
      {
        [key]: val
      }
    );
  }

  /**
   * @function addFireEvent
   */
  addFireEvent(key, val, channel) {
    this.logFireEvent(key, val, channel);

    const step = this.last.step;
    step.sequence.push({
      type: 'event',
      key: key,
      val: val,
      channel
    });

    return this;
  }
  logFireEvent(key, val, channel) {
    const tag = USE_EMOTICONS ? '💥': '@event';
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ${key}`,
      this.formats.method(step.methodColor),
      this.formats.clear(),
      {
        [key]: val,
        channel
      }
    );
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
    
    this.logError(
      errorJson,
      description
    );
    return this;
  }
  logError(errorJson, description) {
    const tag = USE_EMOTICONS ? '💩': '@error';
    const step = this.last.step;

    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ${description}`,
      this.formats.method(step.methodColor),
      this.formats.error(),
      {
        error: errorJson
      }
    );
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
    
    this.logThrows(
      errorJson,
      description
    );
    return this;
  }

  logThrows(errorJson, description) {
    const tag = USE_EMOTICONS ? '💣': '@throws';
    const step = this.last.step;

    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[${tag}] ---> ${description}`,
      this.formats.method(step.methodColor),
      this.formats.error(),
    );
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

    this.logGoTo(namespace, method);

    const step = this.last.step;
    step.sequence.push({
      type: 'goto',
      namespace,
      method,
    });

    return this;
  }
  logGoTo(gotoNamespace, gotoMethod, isReturn) {
    const tag = USE_EMOTICONS ? '👉': '@goto';
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@goto] ${isReturn ? '👈...': '👉...'} ${gotoNamespace}.${gotoMethod}`,
      this.formats.method(step.methodColor),
      this.formats.goTo()
    );
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
    this.logCheck(checkDesc, debugData);
    return this;
  }

  /**
   * Log Check
   * @param {string} checkDesc - checkDesc
   * @param {any?} debugData? - optional debug data
   */
  logCheck(checkDesc, debugData) {
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c   •🖐[@check] ${checkDesc}`,
      this.formats.method(step.methodColor),
      this.formats.check(),
      debugData,
    );
  }

  /**
   * @function addIf
   */
  addIf(description, val) {
    this.logIf(description, val, 'if');

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
    this.logIf(description, val, 'elseif');

    const step = this.last.step;
    step.sequence.push({
      type: 'elseif',
      description,
      val: val,
    })

    return this;
  }
  addElse(description, val) {
    this.logIf(key, val, 'else');

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
  logIf(statement, val, ifType) {
    if(!ifType) ifType = StepCat.ifBlock;

    const tag = USE_EMOTICONS ? '🔷': '';
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •${tag} [@${ifType}] ${statement}`,
      this.formats.method(step.methodColor),
      this.formats.if(),
      val
    );
  }
}

function logger(namespace) {
  return new Logger(namespace);
}

module.exports = {
  logger,
};
