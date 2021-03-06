/**
 * @requires Components
 */
const { errorToJson } = require('./error');
const { formats } = require('./formats');

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
 * @class LoggerBrowser
 */
class LoggerBrowser {
    constructor(app) {
        this.app = app;
        this.formats = formats();
    }

    /**
     * log the namespace
     * @param {string} namespace - class or file or namespace
     */
    namespace(namespace) {
        console.log(`namespace: ${namespace}`);
    }

    /**
     * log the method
     * @param {string} method - method name
     */
    method(method) {
        /*
        console.log(
            `%c[${this.app.namespace}.${method.name}]%c  š¦${method.description}`,
            this.formats.method(method.color),
            this.formats.method(method.color),
        );
        */
        console.log(
            `%c[${this.app.namespace}.${method.name}]   š¦${method.description}     `,
            this.formats.method(method.color),
        );
    }

    /**
     * Log Step
     * @param {StepModel} step - step model
     */
    step(step) {
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c   %cā¢š¦ ${step.description}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            this.formats.step(step.methodColor)
        );
    }

    /**
     * log data
     * @param {string} key - key of the data
     * @param {any} val - data value
     * @param {'success' | 'failed'} optionalFlag 
     */
    data(key, val, optionalFlag) {
        let tag = USE_EMOTICONS ? 'š' : '@data';
        if (optionalFlag === 'success') {
            tag = USE_EMOTICONS ? 'ā' : '@success';
        }
        else if (optionalFlag === 'failed') {
            tag = USE_EMOTICONS ? 'ā' : '@failed';
        }

        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${key}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            {
                [key]: val
            }
        );
    }

    /**
     * returns 
     * @param {string} key - return key
     * @param {any} val - return payload
     */
    returns(key, val) {
        let tag = USE_EMOTICONS ? 'š' : '@returns';

        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${key}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            {
                [key]: val
            }
        );
    }
    
    /**
     * done 
     * @param {string} key - return key
     * @param {any} val - return payload
     */
    done(key, val) {
        let tag = USE_EMOTICONS ? 'š' : '@done';

        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${key}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            {
                [key]: val
            }
        );
    }

    /**
     * @function logMongo
     * @param {string} description - print description
     * @param {any?} debugData - optional debug data
     */
    mongo(description, debugData) {
        const tag = USE_EMOTICONS ? 'š³' : '@mongo';
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            debugData
        );
    }

    /**
     * log dispatch
     * @param {string} type - dispatch action
     * @param {any} payload - action value
     * @param {'pending'|'success'|'failed'} optionalLifecycle - optional lifecycle
     */
    dispatch(type, payload, optionalLifecycle) {
        const tag = USE_EMOTICONS ? 'š„' : '@dispatch';
        const step = this.app.last.step;

        let debugData = {};
        if(payload){
            payload = `{${payload}}`;
            debugData.payload = payload;
        }
        if(optionalLifecycle) debugData.lifecycle = optionalLifecycle;

        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${type}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            debugData,
        );
    }

    /**
     * log fetch
     * @param {string} description - description e.g. GET /url 
     * @param {any} debugValue - optional value to print
     */
    fetch(description, debugValue) {
        const tag = USE_EMOTICONS ? 'š©' : '@fetch';
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            debugValue,
        );
    }

    /**
     * Fire event
     * @param {string} key - event name
     * @param {any} val - payload
     * @param {string} channel - 'rabbit','socket','document'
     */
    fireEvent(key, val, channel) {
        const tag = USE_EMOTICONS ? 'š„' : '@event';
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${key}`,
            this.formats.method(step.methodColor),
            this.formats.clear(),
            {
                [key]: val,
                channel
            }
        );
    }

    /**
     * log error 
     * @param {ErrorJson} errorJson - error as json model
     * @param {string} description - description
     */
    error(errorJson, description) {
        const tag = USE_EMOTICONS ? 'š©' : '@error';
        const step = this.app.last.step;

        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.error(),
            {
                error: errorJson
            }
        );
    }

    /**
     * log throws 
     * @param {ErrorJson} errorJson - error as json model
     * @param {string} description - description
     */
    throws(errorJson, description) {
        const tag = USE_EMOTICONS ? 'š£' : '@throws';
        const step = this.app.last.step;

        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ---> ${errorJson.name || description}`,
            this.formats.method(step.methodColor),
            this.formats.error(),
        );
    }

    /**
     * log goTo
     * @param {string?} gotoNamespace - namespace for the class or file to goto   
     * @param {string} gotoMethod - method name
     * @param {boolean?} isReturn - optional is returned or not
     */
    goTo(gotoNamespace, gotoMethod, isReturn) {
        const tag = USE_EMOTICONS ? 'š' : '@goto';
        const step = this.app.last.step;

        const txt = gotoNamespace ? 
            `${gotoNamespace}.${gotoMethod}` : 
            `${gotoMethod}`;

        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[@goto] ${isReturn ? 'š...' : 'š...'} ${txt}`,
            this.formats.method(step.methodColor),
            this.formats.goTo()
        );
    }

    /**
     * Log Try
     * @param {string} description - checkDesc
     */
    logTry(description) {
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c   ā¢ā[@try] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.check(),
        );
    }
    
    /**
     * Log Then
     * @param {string} description - description
     * @param {any} payload - payload
     */
     logThen(description, payload) {
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c   ā¢š¤½āāļø[@then] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.then(),
            payload,
        );
    }
    
    /**
     * Log Catch
     * @param {string} description - description
     * @param {any} catchPayload - catch payload
     */
    logCatch(description, catchPayload) {
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c   ā¢š„[@catch] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.catch(),
            catchPayload,
        );
    }
    
    /**
     * Log Check
     * @param {string} checkDesc - checkDesc
     * @param {any?} debugData? - optional debug data
     */
    check(checkDesc, debugData) {
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c   ā¢š[@check] ${checkDesc}`,
            this.formats.method(step.methodColor),
            this.formats.check(),
            debugData || '',
        );
    }

    /**
     * log if
     * @param {string} statement - the if statement description
     * @param {any?} val - optional value to print
     * @param {StepCat} ifType - 'if' | 'elseif' | 'else'
     */
    if(statement, val, ifType) {
        if (!ifType) ifType = StepCat.ifBlock;

        const tag = USE_EMOTICONS ? 'š·' : '';
        const step = this.app.last.step;
        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢${tag} [@${ifType}] ${statement}`,
            this.formats.method(step.methodColor),
            this.formats.if(),
            val || ''
        );
    }

    /**
     * 
     * @param {string} description - description of the loop
     * @param {any?} debugData - optional data to loop through
     * @param {'for'|'forEach'} loopType - for or forEach
     */
    loop(description, debugData, loopType) {
        const tag = USE_EMOTICONS ? 'š' : '@'+loopType;
        const step = this.app.last.step;

        console.log(
            `%c[${this.app.namespace}.${step.methodName}]%c      ā¢[${tag}] ${description}`,
            this.formats.method(step.methodColor),
            this.formats.loop(),
            debugData || '',
        );
    }
}

function loggerBrowser(app) {
    return new LoggerBrowser(app);
}

module.exports = {
    loggerBrowser,
};
