const StepCat = {
  block: 'step',
  ifBlock: 'if',
  elseIfBlock: 'elseif',
  elseBlock: 'else',
}

class Logger {
  constructor(namespace) {
    this.namespace = namespace;
    this.last = {
      method: '',
      color: 0,
    };
    this.methods = [];
    this.colors = [
      '#0088ff',
      'rgba(0, 200, 0, .8)',
      'rgba(200, 0, 0, .8)',
      'rgba(0, 0, 200, .8)',
    ];
  }
  format() {

  }
  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  randomColor() {
    return this.randomIntFromInterval(0, 255);
  }
  logNamespace(namespace) {
    console.log(`namespace: ${namespace}`);
  }
  addMethod(methodName, methodDesc) {
    let method = {
      name: methodName,
      desc: methodDesc,
      color: this.getColor(),
      steps: [],
    }
    this.methods.push(method);
    this.last.method = method;

    this.logMethod(method);
    return this;
  }
  getColor() {
    let currentColor;
    if (this.last.color < this.colors.length) {
      currentColor = this.colors[this.last.color++];
    }
    else {
      currentColor = `rgb(${this.randomColor()}, ${this.randomColor()}, ${this.randomColor()})`;
    }
    return currentColor;
  }
  getFormat(color, isBold) {
    return `background: ${color}; color:white; padding: 2px; border: 1px solid rgba(0,0,0,.1); border-radius: 2px; font-weight: ${isBold ? 'bold' : 'normal'}`;
  }
  getFormatClear(isBold, isItalic) {
    return `background: #fff; color:#000; font-weight: ${isBold ? 'bold' : 'normal'}; font-style: ${isItalic ? 'italic' : 'none'}`;
  }
  getFormatError(isBold, isItalic) {
    return `background: #fff; color:rgba(200,0,0,1); font-weight: ${isBold ? 'bold' : 'normal'}; font-style: ${isItalic ? 'italic' : 'none'}`;
  }
  logMethod(method) {
    console.log(
      `%c[${this.namespace}.${method.name}]%c  📦${method.desc}`,
      this.getFormat(method.color),
      this.getFormat(method.color),
      // this.getFormatClear(true)
    );
  }
  addStep(stepName, stepDesc, cat) {
    if (!cat) cat = StepCat.block;

    let step = {
      name: stepName,
      desc: stepDesc,
      cat,
      methodName: '',
      methodColor: '',
      data: [],
      logic: [],
      sequence: [],
    }
    const method = this.last.method;
    step.methodName = method.name;
    step.methodColor = method.color;
    method.steps.push(step);
    this.last.step = step;
    this.logStep(step);
    return this;
  }
  logStep(step) {
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c   •🦄[@${step.cat}] ${step.desc}`,
      this.getFormat(step.methodColor),
      this.getFormatClear(true, false)
    );
  }
  addData(key, val) {
    this.logData(key, val);

    const step = this.last.step;
    step.sequence.push({
      type: 'data',
      key: key,
      val: val,
    })
    step.data.push({ key, val });

    return this;
  }
  logData(key, val) {
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@data] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatClear(),
      {
        [key]: val
      }
    );
  }
  addError(key, val, errCat) {
    this.logError(key, val, errCat);

    const step = this.last.step;
    step.sequence.push({
      type: 'error',
      key: key,
      val: val,
    })
    step.data.push({ key, val, isError: true });

    return this;
  }
  logError(key, val, errCat) {
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@error] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatError(),
      {
        [key]: val
      }
    );
  }

  /**
   * @function addMongo
   */
  addMongo(key, val) {
    this.logMongo(key, val);

    const step = this.last.step;
    step.sequence.push({
      type: 'mongo',
      key: key,
      val: val,
    });

    return this;
  }
  logMongo(key, val) {
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@mongo] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatClear(),
      {
        [key]: val
      }
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
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@dispatch] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatClear(),
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
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@fetch] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatClear(),
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
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@event] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatClear(),
      {
        [key]: val,
        channel
      }
    );
  }


  /**
   * @function addThrows
   */
  addThrows(key, val, errCat) {
    this.logThrows(key, val, errCat);

    const step = this.last.step;
    step.sequence.push({
      type: 'throws',
      key: key,
      val: val,
      errCat
    });

    return this;
  }
  logThrows(key, val, errCat) {
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@throw] ${key}`,
      this.getFormat(step.methodColor),
      this.getFormatError(),
      {
        [key]: val,
        errCat
      }
    );
  }

  /**
   * @function addGoto
   */
  addGoto(namespace, method) {
    this.logGoTo(namespace, method);

    const step = this.last.step;
    step.sequence.push({
      type: 'goto',
      namespace,
      method,
    });

    return this;
  }
  logGoTo(gotoNamespace, gotoMethod) {
    const step = this.last.step;
    console.log(
      `%c[${this.namespace}.${step.methodName}]%c      •[@goto] 👉 ${gotoNamespace}.${gotoMethod}`,
      this.getFormat(step.methodColor),
      this.getFormatError()
    );
  }


  /**
   * @function addIf
   */
  addIf(desc, val) {
    const step = this.last.step;



    return this;
  }
  addElseIf() {
    const step = this.last.step;



    return this;
  }
  addElse() {
    const step = this.last.step;



    return this;
  }
  addEndIf() {
    const step = this.last.step;



    return this;
  }
  logIf() {
    const step = this.last.step;
    // console.log('todo');
  }
}

function logger(namespace) {
  return new Logger(namespace);
}

module.exports = {
  logger,
};
