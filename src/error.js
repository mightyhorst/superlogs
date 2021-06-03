/**
* @exports errorToJson
*/
function errorToJson(error) {
    const { message, name } = error;

    if(!error.stack){
        const err = new Error(`error.stack is not set. [@error] ${JSON.stringify(error, null, 4)}`);
        console.warn(err.message);

        return {
            name,
            message,
        }
    }

    return {
        name,
        message,
        stack: errorStackToJson(error.stack)
    };
}

function errorStackToJson(txtErrorStack) {
    if(!txtErrorStack) throw new Error(`txtErrorStack is not set: ${txtErrorStack}`);

    /**
     * @step split stack into lines
     */
    const lines = txtErrorStack.split("\n");
    const stack = lines
        .map((line, index) => {
            let lineSplit = line.split("at ");
            if (lineSplit.length > 0) {
                return lineSplit[1];
            } else {
                return null;
            }
        })
        .filter((line) => !!line);

    /**
     * @step parse each line and create a stack model 
     */
    const stackModels = stack.map((line, index) => {
        let lineSplit = line.split(" (");

        let functionPath;
        let filePathAll;

        /**
         * @expect e.g.
         *  at Object.<anonymous> (/Users/sindresorhus/dev/clean-stack/unicorn.js:2:15)
         */
        if (lineSplit.length > 1) {
            functionPath = lineSplit[0];
            filePathAll = lineSplit[1].replace(")", "");
        } 
        /**
         * @expect e.g.
         * at https://cdpn.io/cp/internal/boomboom/pen.js?key=pen.js-4f22c602-2b1e-1eb0-69f7-427c997d028a:22:27
         */
        else {
            functionPath = "";
            filePathAll = lineSplit[0].replace(")", "");
        }

        if (filePathAll.substr(0, 4) === "http") {
            let filePathSplit = filePathAll.split(":");
            let filePath = filePathSplit[0] + filePathSplit[1];
            let fileLine = filePathSplit[filePathSplit.length - 2];
            let fileChar = filePathSplit[filePathSplit.length - 1];
            return {
                functionName: functionPath,
                functionPath,
                filePath,
                fileLine,
                fileChar,
                depth: index
            };
        } 
        else {
            let filePathSplit = filePathAll.split(":");

            if (filePathSplit.length > 0) {
                let filePath = filePathSplit[0];
                let fileLine = filePathSplit[1];
                let fileChar = filePathSplit[2];
                let functionStack = functionPath.split(".");
                let functionName = functionStack[functionStack.length - 1];
                return {
                    functionName,
                    functionPath,
                    functionStack,
                    filePath,
                    fileLine,
                    fileChar,
                    depth: index
                };
            } 
            else {
                return {
                    isError: true,
                    filePathAll
                };
            }
        }
    });
    return stackModels;
}

/**
 * @exports errorToJson
 */
module.exports = {errorToJson};
