let validSeperators = "=(); +-/^*%&|!=<>{},[]";
let keywords = ['num', 'bool', 'list', 'string', 'print', 'func', 'input', 'return', 'true', 'false', 'if', 'else', 'while', 'length', 'currentLineNumberByLangnest'];
var tokens, lineBreaks, currentLineNumber = 1;
var variables, varNames;
var funcNames, funcs;
let outputConsole, errorConsole;
let executionTime = 0, startTime;
function formatSpaces(code) {
    var resultCode = "";
    let i = 0;
    while (i < code.length) {
        if (code[i] == "\"") {
            resultCode += code[i]; i++;
            while (code[i] != "\"") {
                if (i == code.length) {
                    printOutError("\nexpected \" \n");
                    return;
                }
                resultCode += code[i];
                i++;
            }
            resultCode += code[i]; i++;
        } else {
            resultCode += code[i];
            if (code[i] == ' ') {
                while (code[i] == ' ')
                    i++;
            } else {
                i++;
            }
        }
    }
    return resultCode;
}
function isSeperator(ch) {
    for (let i = 0; i < validSeperators.length; i++) {
        if (validSeperators[i] == ch)
            return true;
    }
    return false;
}
function printOut(output) {
    if (isStringValue(output)) {
        output = output.substring(1, output.length - 1);
    }
    output += "";//turn all to a string
    for (let i = 0; i < output.length; i++) {
        if (i < output.length - 1) {
            if (output[i] == "\\" && output[i + 1] == "n") {
                outputConsole.innerHTML += "\n"; i++;
            }
            else
                outputConsole.innerHTML += output[i];
        }
        else
            outputConsole.innerHTML += output[i];
    }
}
function printOutError(output) {
    errorConsole.innerHTML += "At line " + currentLineNumber;
    output += "";//turn all to a string
    for (let i = 0; i < output.length; i++) {
        if (i < output.length - 1) {
            if (output[i] == "\\" && output[i + 1] == "n") {
                errorConsole.innerHTML += "\n"; i++;
            }
            else
                errorConsole.innerHTML += output[i];
        }
        else
            errorConsole.innerHTML += output[i];
    }
}
function isVarNameValid(name) {
    //not be already defined
    if (findIndex(varNames[varNames.length - 1], name) != -1) {
        printOutError("\n\'" + name + "\' is already used as a variable name\n");
        return false;
    }
    //must not be a keyword
    if (findIndex(keywords, name) != -1) {
        printOutError("\ncannot use a keyword as a variable name \'" + name + "\'\n");
        return false;
    }
    //first letter must be a letter
    if (name.charCodeAt(0) >= 65 && name.charCodeAt(0) <= 90 || name.charCodeAt(0) >= 97 && name.charCodeAt(0) <= 122) {
        for (let i = 1; i < name.length; i++) {
            if (!(name.charCodeAt(i) >= 65 && name.charCodeAt(i) <= 90 || name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122 || name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57 || name.charCodeAt(i) == '_')) {
                printOutError("\ninvalid variable name \'" + name + "\'\n");
                return false;
            }
        }
        return true;
    }
    printOutError("\ninvalid variable name \'" + name + "\'\n");
    return false;
}
function isFuncNameValid(name) {
    //not be already defined
    if (findIndex(funcNames, name) != -1) {
        printOutError("\n\'" + name + "\' is already used as a func name\n");
        return false;
    }
    //must not be a keyword
    if (findIndex(keywords, name) != -1) {
        printOutError("\ncannot use a keyword as a func name \'" + name + "\'\n");
        return false;
    }
    //first letter must be a letter
    if (name.charCodeAt(0) >= 65 && name.charCodeAt(0) <= 90 || name.charCodeAt(0) >= 97 && name.charCodeAt(0) <= 122) {
        for (let i = 1; i < name.length; i++) {
            if (!(name.charCodeAt(i) >= 65 && name.charCodeAt(i) <= 90 || name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122 || name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57 || name.charCodeAt(i) == '_')) {
                printOutError("\ninvalid func name \'" + name + "\'\n");
                return false;
            }
        }
        return true;
    }
    printOutError("\ninvalid func name \'" + name + "\'\n");
    return false;
}
function isVariableName(name) {//made for expression evaluation

    if (isBoolValue(name))
        return false;
    //must not be a keyword
    if (findIndex(keywords, name) != -1) {
        printOutError("\ncannot use a keyword \'" + name + "\'  in an expression \n");
        return false;
    }
    //first letter must be a letter
    if (name.charCodeAt(0) >= 65 && name.charCodeAt(0) <= 90 || name.charCodeAt(0) >= 97 && name.charCodeAt(0) <= 122) {
        for (let i = 1; i < name.length; i++) {
            if (!(name.charCodeAt(i) >= 65 && name.charCodeAt(i) <= 90 || name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122 || name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57 || name.charCodeAt(i) == '_')) {
                return false;
            }
        }
        return true;
    }
    return false;
}
function isFunctionName(name) {//made for expression evaluation
    if (isBoolValue(name))
        return false;
    //must not be a keyword
    if (findIndex(keywords, name) != -1) {
        printOutError("\ncannot use a keyword \'" + name + "\'  in an expression \n");
        return false;
    }
    //first letter must be a letter
    if (name.charCodeAt(0) >= 65 && name.charCodeAt(0) <= 90 || name.charCodeAt(0) >= 97 && name.charCodeAt(0) <= 122) {
        for (let i = 1; i < name.length; i++) {
            if (!(name.charCodeAt(i) >= 65 && name.charCodeAt(i) <= 90 || name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122 || name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57 || name.charCodeAt(i) == '_')) {
                return false;
            }
        }
        return true;
    }
    return false;
}
function findIndex(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}
function tokenSeperator(code) {
    let token = "", i = 0;
    tokens = [], lineBreaks = 1, currentLineNumber = 1;
    while (i <= code.length) {
        if (code[i] == "/" && code[i + 1] == "/") {//commenting
            i += 2;
            while (code[i] != "\n" && i < code.length)//new line or code ends
                i++;
            //leave \n for next statement
        }
        if (i == code.length) {//code ended
            if (token.length != 0)
                tokens.push(token.trim());
        }
        if (code[i] == "\n") {
            if (token.length != 0)
                tokens.push(token.trim());
            tokens.push("currentLineNumberByLangnest");
            tokens.push(++lineBreaks);
            token = "";
        }
        else {
            if (code[i] == "\"") {
                if (token.length != 0)
                    tokens.push(token.trim());
                i++;
                token = "";
                while (code[i] != "\"") {
                    if (i == code.length) {
                        printOutError("\nexpected \" \n");
                        return;
                    }
                    token += code[i];
                    i++;
                }
                tokens.push("\"" + token + "\"");
                token = "";
            } else {
                if (isSeperator(code[i])) {
                    if (token.length != 0)
                        tokens.push(token.trim());
                    if (code[i] != " ")
                        tokens.push(code[i]);
                    token = "";
                } else {
                    token += code[i];
                }
            }
        }
        i++;
    }
}
function isNumValue(value) {
    let digitCount = 0, decCount = 0, i = 0;
    if (value[0] == '-') {//identifies negative numbers
        if (value.length == 1)
            return false;
        i++; digitCount++;
    }
    for (; i < value.length; i++) {
        if (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57)
            digitCount++;
        if (value[i] == ".")
            decCount++;
        if (decCount > 1)
            return false;
    }
    return ((digitCount + decCount) == value.length);
}
function isBoolValue(value) {
    return (value == "true" || value == "false");
}
function isStringValue(value) {
    return (value[0] == "\"" && value[value.length - 1] == "\"");
}
function isAPreFunctionCall(token) {
    return (token.indexOf(".") != -1 && !isNumValue(token) && !isStringValue(token) && !isBoolValue(token));
}
function seperateArguements(args) {
    let res = [];
    let i = 0, ii = -1, arg;
    while (i < args.length) {
        if (args[i] == "(") {
            i++;
            let openBrackets = 1;
            let expStart = i;
            while (i < args.length) {
                if (args[i] == "(")
                    openBrackets++;
                if (args[i] == ")") {
                    if (openBrackets == 1)
                        break;
                    openBrackets--;
                }
                i++;
            }
            if (i == args.length) {
                printOutError("\nexpected \')\' \n");
                return;
            }
        }
        else if (args[i] == "[") {
            i++;
            let openBrackets = 1;
            let expStart = i;
            while (i < args.length) {
                if (args[i] == "[")
                    openBrackets++;
                if (args[i] == "]") {
                    if (openBrackets == 1)
                        break;
                    openBrackets--;
                }
                i++;
            }
            if (i == args.length) {
                printOutError("\nexpected \']\' \n");
                return;
            }
        }
        else if (args[i] == ",") {//seperate now and push to res
            arg = args.slice(ii + 1, i);
            if (arg.length == 0) {
                printOutError("\nneed an arguement before and after \',\'\n");
                return;
            }
            res.push(arg);
            ii = i;
        }
        i++;
    }
    arg = args.slice(ii + 1, i);
    if (arg.length == 0 && ii != -1) {
        printOutError("\nneed an arguement before and after \',\'\n");
        return;
    }
    res.push(arg);
    //console.log(res);
    return res;
}
function funcEval(funcName, args) {
    let func, funcIndex = findIndex(funcNames, funcName);
    varNames.push([]);
    variables.push([]);
    func = funcs[funcIndex];
    //console.log(func);
    //console.log(args);
    if (args[0].length != 0) {
        if ((func[0].length + 1) / 2 != args.length) {
            printOutError("\n\'" + funcName + "\' received args not as defined , got more or less arguements than defined \n");
            return;
        }
        //evaluate args received
        for (let i = 0; i < args.length; i++) {
            varNames[varNames.length - 1].push(func[0][i * 2]);
            variables[variables.length - 1].push([args[i][0], args[i][1]]);
        }
    }

    //value to return
    let valToReturn = analyzer(func[1], true, false);
    if (valToReturn != null)
        return valToReturn;
    else
        return "\"\"";//function by default will return "" a empty string
}

function evaluateExpression(expressionReceived) {
    let expression = expressionReceived.slice(0, expressionReceived.length);//array copied so changes dont reflect overall
    let res = ['null', '\"\"'];//type , value
    let i = 0;
    //handles input
    while (i < expression.length) {
        if (expression[i] == "input") {
            i++;
            if (expression[i] != "(") {
                printOutError("\nexpected ( after \'print\'\n");
                return;
            }
            i++;

            let openBrackets = 1;
            let expStart = i;
            while (i < expression.length) {
                if (expression[i] == "(")
                    openBrackets++;
                if (expression[i] == ")") {
                    if (openBrackets == 1)
                        break;
                    openBrackets--;
                }
                i++;
            }
            if (i == expression.length) {
                printOutError("\nexpected \')\' \n");
                return;
            }
            let res;
            if (expStart != i)
                res = evaluateExpression(expression.slice(expStart, i));
            else
                res = ['null', '\"\"'];
            printOut(res[1]);
            //stop timer
            executionTime += Date.now() - startTime;
            expression[expStart - 2] = prompt(res[1].substring(1, res[1].length - 1));
            //begint timer
            startTime = Date.now();
            printOut(expression[expStart - 2] + "\n");
            expression.splice(expStart - 1, i - expStart + 2);
            i = expStart - 2;
        }
        i++;
    }
    //handles predefinaed func for variables
    i = 0;
    while (i < expression.length) {
        if (isAPreFunctionCall(expression[i])) {
            let variableName = expression[i].substring(0, expression[i].indexOf("."));
            let calledFunc = expression[i].substring(expression[i].indexOf(".") + 1, expression[i].length);

            let varIndex, j;
            for (j = varNames.length - 1; j >= 0; j--) {
                varIndex = findIndex(varNames[j], variableName);
                if (varIndex != -1) {
                    //replace value
                    //expression[i] = variables[j][varIndex][1];
                    break;
                }
            }
            if (varIndex == -1) {
                printOutError("\'" + variableName + "\' is undefined");
                return;
            }
            let foundVariable = variables[j][varIndex];
            let foundVariableVal = foundVariable[1];
            if (foundVariable[0] == 'string')
                foundVariableVal = foundVariable[1].substring(1, foundVariable[1].length - 1);//remove qoutes if string

            if (calledFunc == "length") {//works for array also
                expression[i] = '' + foundVariableVal.length;
                if (expression[i + 1] != "(" || expression[i + 2] != ")") {
                    printOutError("\'()\'expected after .length");
                    return;
                }
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
            }
            if (calledFunc == "at") {
                i++;
                if (expression[i] != "(") {
                    printOutError("\nexpected \'(\' after \'.at\'\n");
                    return;
                }
                i++;

                let openBrackets = 1;
                let expStart = i;
                while (i < expression.length) {
                    if (expression[i] == "(")
                        openBrackets++;
                    if (expression[i] == ")") {
                        if (openBrackets == 1)
                            break;
                        openBrackets--;
                    }
                    i++;
                }
                if (i == expression.length) {
                    printOutError("\nexpected \')\' \n");
                    return;
                }
                let res = evaluateExpression(expression.slice(expStart, i));
                if (res[0] != 'num') {
                    printOutError("\n\'.at\' expects a numeric index found \'" + res[0] + "\'\n");
                    return;
                }
                let atIndex = parseInt(res[1]);
                if (foundVariable[0] == 'list') {
                    printOutError("\n\'.at()\' not defined for \'list\'\n");
                    return;
                }
                else if (foundVariable[0] == 'string') {
                    if (atIndex >= 0 && atIndex < foundVariableVal.length) {
                        expression[expStart - 2] = '\"' + foundVariableVal[atIndex] + "\"";
                    } else if (atIndex <= -1 && -atIndex <= foundVariableVal.length) {
                        expression[expStart - 2] = '\"' + foundVariableVal[foundVariableVal.length + atIndex] + "\"";
                    } else {
                        printOutError("index \'" + atIndex + "\' out of bounds");
                        return;
                    }
                }
                else {
                    if (atIndex >= 0 && atIndex < foundVariableVal.length) {
                        expression[expStart - 2] = '' + foundVariableVal[atIndex];
                    } else if (atIndex <= -1 && -atIndex <= foundVariableVal.length) {
                        expression[expStart - 2] = '' + foundVariableVal[foundVariableVal.length + atIndex];
                    } else {
                        printOutError("index \'" + atIndex + "\' out of bounds");
                        return;
                    }
                }
                expression.splice(expStart - 1, i - expStart + 2);
                i = expStart - 2;
            }
            if (calledFunc == "add") {
                i++;
                if (expression[i] != "(") {
                    printOutError("\nexpected \'(\' after \'.add\'\n");
                    return;
                }
                i++;

                let openBrackets = 1;
                let expStart = i;
                while (i < expression.length) {
                    if (expression[i] == "(")
                        openBrackets++;
                    if (expression[i] == ")") {
                        if (openBrackets == 1)
                            break;
                        openBrackets--;
                    }
                    i++;
                }
                if (i == expression.length) {
                    printOutError("\nexpected \')\' \n");
                    return;
                }
                if (foundVariable[0] != 'list') {
                    printOutError("\n\'add()\' is not defined for \'" + foundVariable[0] + "\'\n");
                    return;
                }
                let res = evaluateExpression(expression.slice(expStart, i));
                if (res[0] == 'null') {
                    printOutError("\n\'.add\' does not expected a null arguement\n");
                    return;
                }
                foundVariableVal.push(res);
                expression.splice(expStart - 2, i - expStart + 3);
                i = expStart - 3;
            }
        }
        i++;
    }


    i = 1;//i-1 is in game so
    //deal all function calling 
    while (i < expression.length) {
        if (expression[i] == "(") {

            if (isFunctionName(expression[i - 1])) {
                let funcIndex = findIndex(funcNames, expression[i - 1]);
                if (funcIndex == -1) {
                    printOutError("\n\'" + expression[i - 1] + "\' is not defined as a func \n");
                    return;
                }
                i++;
                let openBrackets = 1;
                let expStart = i;
                while (i < expression.length) {
                    if (expression[i] == "(")
                        openBrackets++;
                    if (expression[i] == ")") {
                        if (openBrackets == 1)
                            break;
                        openBrackets--;
                    }
                    i++;
                }
                if (i == expression.length) {
                    printOutError("\nexpected \')\' \n");
                    return;
                }
                let arguements = seperateArguements(expression.slice(expStart, i));

                //solve arguements
                for (let c = 0; c < arguements.length; c++) {
                    arguements[c] = evaluateExpression(arguements[c]);
                    if (arguements[c][0] == 'null') {
                        printOutError("\nfound a null arguement passed to \'" + funcNames[funcIndex] + "\'\n");
                        return;
                    }
                }
                let funcCalledVal = funcEval(funcNames[funcIndex], arguements);
                if (funcCalledVal == "\"\"") {
                    expression[expStart - 2] = funcCalledVal;
                    expression.splice(expStart - 1, i - expStart + 2);
                    i = expStart - 2;
                } else {
                    expression[expStart - 2] = funcCalledVal[1];
                    expression.splice(expStart - 1, i - expStart + 2);
                    i = expStart - 2;
                }

            }

        }
        i++;
    }

    i = 0;
    //deal all brackets 
    while (i < expression.length) {
        if (expression[i] == "(") {
            i++;

            let openBrackets = 1;
            let expStart = i;
            while (i < expression.length) {
                if (expression[i] == "(")
                    openBrackets++;
                if (expression[i] == ")") {
                    if (openBrackets == 1)
                        break;
                    openBrackets--;
                }
                i++;
            }
            if (i == expression.length) {
                printOutError("\nexpected \')\' \n");
                return;
            }
            let res = evaluateExpression(expression.slice(expStart, i));
            expression[expStart - 1] = res[1];
            expression.splice(expStart, i - expStart + 1);
            i = expStart - 1;
        }
        i++;
    }


    //tackle ++ and --
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '+' && expression[i + 1] == "+") {
            if (i == 0 && i != expression.length - 2) {//only prefix
                if (isVariableName(expression[i + 2])) {
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i + 2]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i + 2] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i] = '' + (++variables[j][varIndex][1]);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i + 2] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i + 1, 2);
                } else {
                    printOutError("\n\'++\' requires a variable\n");
                    return;
                }
            }
            else if (i == expression.length - 2 && i != 0) {//only postfix
                if (isVariableName(expression[i - 1])) {
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i - 1]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i - 1] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i - 1] = '' + (variables[j][varIndex][1]++);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i - 1] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i, 2);
                } else {
                    printOutError("\n\'++\' requires a variable\n");
                    return;
                }
            }
            else {

                if (isVariableName(expression[i - 1])) {//postfix
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i - 1]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i - 1] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i - 1] = '' + (variables[j][varIndex][1]++);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i - 1] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i, 2);
                } else if (isVariableName(expression[i + 2])) {//prefix
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i + 2]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i + 2] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i] = '' + (++variables[j][varIndex][1]);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i + 2] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i + 1, 2);
                } else {
                    if (expression[i + 2] == "+") {
                        i++;
                        continue;
                    }
                    printOutError("\n\'++\' did not find a variable\n");
                    return;
                }
            }
        }
        if (expression[i] == '-' && expression[i + 1] == "-") {
            if (i == 0 && i != expression.length - 2) {//only prefix
                if (isVariableName(expression[i + 2])) {
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i + 2]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i + 2] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i] = '' + (--variables[j][varIndex][1]);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i + 2] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i + 1, 2);
                } else {
                    printOutError("\n\'--\' requires a variable\n");
                    return;
                }
            }
            else if (i == expression.length - 2 && i != 0) {//only postfix
                if (isVariableName(expression[i - 1])) {
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i - 1]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i - 1] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i - 1] = '' + (variables[j][varIndex][1]--);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i - 1] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i, 2);
                } else {
                    printOutError("\n\'--\' requires a variable\n");
                    return;
                }
            }
            else {

                if (isVariableName(expression[i - 1])) {//postfix
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i - 1]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i - 1] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i - 1] = '' + (variables[j][varIndex][1]--);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i - 1] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i, 2);
                } else if (isVariableName(expression[i + 2])) {//prefix
                    let varIndex;
                    for (let j = varNames.length - 1; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], expression[i + 2]);
                        if (varIndex != -1) {
                            if (variables[j][varIndex][0] != "num") {
                                printOutError("\n\'" + expression[i + 2] + "\' is not a num value\n");
                                return;
                            }
                            //replace value
                            expression[i] = '' + (--variables[j][varIndex][1]);
                            variables[j][varIndex][1] += '';
                            break;
                        }
                    }
                    if (varIndex == -1) {
                        printOutError("\n\'" + expression[i + 2] + "\' is undefined\n");
                        return;
                    }
                    expression.splice(i + 1, 2);
                } else {
                    if (expression[i + 2] == "-") {
                        i++;
                        continue;
                    }
                    printOutError("\n\'--\' did not find a variable\n");
                    return;
                }
            }
        }
        i++;
    }
    i = 0;
    //replace all variables with their values start from varnames last array that reperesents localVariable
    while (i < expression.length) {
        if (isVariableName(expression[i])) {
            let varIndex;
            for (let j = varNames.length - 1; j >= 0; j--) {
                varIndex = findIndex(varNames[j], expression[i]);
                if (varIndex != -1) {
                    //replace value
                    if (variables[j][varIndex][0] == 'list') {
                        //if list find for [] first

                        if (expression[i + 1] == '[') {
                            i += 2;
                            let openBrackets = 1;
                            let expStart = i;
                            while (i < expression.length) {
                                if (expression[i] == "[")
                                    openBrackets++;
                                if (expression[i] == "]") {
                                    if (openBrackets == 1)
                                        break;
                                    openBrackets--;
                                }
                                i++;
                            }
                            if (i == expression.length) {
                                printOutError("\nexpected \']\' \n");
                                return;
                            }

                            let res = evaluateExpression(expression.slice(expStart, i));//my index
                            if (res[0] != 'num') {
                                printOutError("\nindex must be num value\n");
                                return;
                            }
                            res[1] = parseFloat(res[1]);
                            //check index boundness
                            if (res[1] >= 0 && res[1] < variables[j][varIndex][1].length) {
                            } else if (res[1] <= -1 && -res[1] <= variables[j][varIndex][1].length) {
                                res[1] = variables[j][varIndex][1].length + res[1];
                            } else {
                                printOutError("\n\'" + res[1] + "\' index out of bounds\n");
                                return;
                            }

                            expression[expStart - 2] = variables[j][varIndex][1][res[1]][1];
                            expression.splice(expStart - 1, i - expStart + 2);
                            i = expStart - 2;
                            i++;
                            continue;
                        } else {
                            if (expression.length != 1) {
                                printOutError("\'list\'cannot be evaluated in an expression");
                                return;
                            } else {
                                return variables[j][varIndex][1];
                            }
                        }
                    }
                    expression[i] = variables[j][varIndex][1];
                    break;
                }
            }
            if (varIndex == -1) {
                printOutError("\'" + expression[i] + "\' is undefined");
                return;
            }
        }
        i++;
    }
    i = 0;
    //make all numbers after '-' negative and replace - with plus
    while (i < expression.length) {
        if (expression[i] == '-') {
            if (!isNumValue(expression[i + 1])) {
                printOutError("\nnumber expected after\'-\'\n");
                return;
            }
            expression[i + 1] = '-' + expression[i + 1];
            expression[i] = '+';
        }
        i++;
    }

    //tackle exponents
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '^') {
            if (i == 0 || i == expression.length - 1) {
                printOutError("\n\'^\' requires two numbers\n");
                return;
            }
            if (!isNumValue(expression[i - 1])) {
                printOutError("\n\'" + expression[i - 1] + "\' is not a number\n");
                return;
            }
            if (!isNumValue(expression[i + 1])) {
                printOutError("\n\'" + expression[i + 1] + "\' is not a number\n");
                return;
            }
            //if valid
            expression[i] = '' + Math.pow(parseFloat(expression[i - 1]), parseFloat(expression[i + 1]));
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }

    //tackle division
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '/') {
            if (i == 0 || i == expression.length - 1) {
                printOutError("\n\'/\' requires two numbers\n");
                return;
            }
            if (!isNumValue(expression[i - 1])) {
                printOutError("\n\'" + expression[i - 1] + "\' is not a number\n");
                return;
            }
            if (!isNumValue(expression[i + 1])) {
                printOutError("\n\'" + expression[i + 1] + "\' is not a number\n");
                return;
            }
            //if valid
            expression[i] = '' + (parseFloat(expression[i - 1]) / parseFloat(expression[i + 1]));
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }

    //tackle modulus
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '%') {
            if (i == 0 || i == expression.length - 1) {
                printOutError("\n\'%\' requires two numbers\n");
                return;
            }
            if (!isNumValue(expression[i - 1])) {
                printOutError("\n\'" + expression[i - 1] + "\' is not a number\n");
                return;
            }
            if (!isNumValue(expression[i + 1])) {
                printOutError("\n\'" + expression[i + 1] + "\' is not a number\n");
                return;
            }
            //if valid
            expression[i] = '' + (parseFloat(expression[i - 1]) % parseFloat(expression[i + 1]));
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }

    //tackle multiplication
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '*') {
            if (i == 0 || i == expression.length - 1) {
                printOutError("\n\'*\' requires two numbers\n");
                return;
            }
            if (!isNumValue(expression[i - 1])) {
                printOutError("\n\'" + expression[i - 1] + "\' is not a number\n");
                return;
            }
            if (!isNumValue(expression[i + 1])) {
                printOutError("\n\'" + expression[i + 1] + "\' is not a number\n");
                return;
            }
            //if valid
            expression[i] = '' + (parseFloat(expression[i - 1]) * parseFloat(expression[i + 1]));
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }

    //tackle addition and concatenation *important*
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '+') {
            if (i == 0) {
                expression.splice(0, 1);
                continue;
            }
            if (i == expression.length - 1) {
                printOutError("\n\'+\' requires a number after it\n");
                return;
            }
            if (isNumValue(expression[i - 1]) && isNumValue(expression[i + 1])) {//both are number
                //if valid
                expression[i] = '' + (parseFloat(expression[i - 1]) + parseFloat(expression[i + 1]));
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isNumValue(expression[i - 1]) && isStringValue(expression[i + 1])) {//1st num 2nd string
                expression[i] = '\"' + expression[i - 1] + expression[i + 1].substring(1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isNumValue(expression[i + 1]) && isStringValue(expression[i - 1])) {//1st str 2nd num
                expression[i] = expression[i - 1].substring(0, expression[i - 1].length - 1) + expression[i + 1] + '\"';
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isStringValue(expression[i - 1]) && isStringValue(expression[i + 1])) {//both string
                expression[i] = expression[i - 1].substring(0, expression[i - 1].length - 1) + expression[i + 1].substring(1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isBoolValue(expression[i - 1]) && isStringValue(expression[i + 1])) {//1st bool 2nd string
                expression[i] = '\"' + expression[i - 1] + expression[i + 1].substring(1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isBoolValue(expression[i + 1]) && isStringValue(expression[i - 1])) {//1st str 2nd bool
                expression[i] = expression[i - 1].substring(0, expression[i - 1].length - 1) + expression[i + 1] + '\"';
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else {
                //error
                printOutError("\n\'+\' requires a number or a string as operands\n");
                return;
            }
        }
        i++;
    }

    //tackles!=
    i = 0;
    while (i < expression.length - 1) {
        if (expression[i] == '!' && expression[i + 1] == '=') {
            //handles error detection and debugging
            if (i == 0 || i == expression.length - 2) {//handles error detection and debugging
                printOutError("\n\'!=\' requires two values\n");
                return;
            }//only same operands can be equal
            expression[i] = '' + (expression[i - 1] != expression[i + 2]);
            expression.splice(i + 2, 1);
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;

        }
        i++;
    }
    //tackles<=
    i = 0;
    while (i < expression.length - 1) {
        if (expression[i] == '<' && expression[i + 1] == '=') {
            //handles error detection and debugging
            if (i == 0 || i == expression.length - 2) {//handles error detection and debugging
                printOutError("\n\'<=\' requires two values\n");
                return;
            }
            if (isNumValue(expression[i - 1]) && isNumValue(expression[i + 2])) {
                expression[i] = '' + (parseFloat(expression[i - 1]) <= parseFloat(expression[i + 2]));
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isStringValue(expression[i - 1]) && isStringValue(expression[i + 2])) {
                expression[i] = '' + (expression[i - 1] <= expression[i + 2]);
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isBoolValue(expression[i - 1]) && isBoolValue(expression[i + 2])) {
                expression[i] = '' + (expression[i - 1] <= expression[i + 2]);
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else {
                printOutError("\n\'" + expression[i - 1] + "\' and \'" + expression[i + 2] + "\' are not of same type so cannot compare them\n");
                return;
            }

        }
        i++;
    }

    //tackles>=
    i = 0;
    while (i < expression.length - 1) {
        if (expression[i] == '>' && expression[i + 1] == '=') {
            //handles error detection and debugging
            if (i == 0 || i == expression.length - 2) {//handles error detection and debugging
                printOutError("\n\'>=\' requires two values\n");
                return;
            } if (isNumValue(expression[i - 1]) && isNumValue(expression[i + 2])) {
                expression[i] = '' + (parseFloat(expression[i - 1]) >= parseFloat(expression[i + 2]));
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isStringValue(expression[i - 1]) && isStringValue(expression[i + 2])) {
                expression[i] = '' + (expression[i - 1] >= expression[i + 2]);
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isBoolValue(expression[i - 1]) && isBoolValue(expression[i + 2])) {
                expression[i] = '' + (expression[i - 1] >= expression[i + 2]);
                expression.splice(i + 2, 1);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else {
                printOutError("\n\'" + expression[i - 1] + "\' and \'" + expression[i + 2] + "\' are not of same type so cannot compare them\n");
                return;
            }

        }
        i++;
    }
    //tackle ==
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '=') {
            //handles error detection and debugging
            if (i == expression.length - 1 || expression[i + 1] != '=') {
                printOutError("\n\'=\' expected after \'=\'\n");
                return;
            }
            if (i == 0 || i == expression.length - 2) {//handles error detection and debugging
                printOutError("\n\'==\' requires two values to compare\n");
                return;
            }
            expression[i] = '' + (expression[i - 1] == expression[i + 2]);
            expression.splice(i + 2, 1);
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }
    //tackles>
    i = 0;
    while (i < expression.length - 1) {
        if (expression[i] == '>') {
            //handles error detection and debugging
            if (i == 0 || i == expression.length - 1) {//handles error detection and debugging
                printOutError("\n\'>\' requires two values\n");
                return;
            } if (isNumValue(expression[i - 1]) && isNumValue(expression[i + 1])) {
                expression[i] = '' + (parseFloat(expression[i - 1]) > parseFloat(expression[i + 1]));
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isStringValue(expression[i - 1]) && isStringValue(expression[i + 1])) {
                expression[i] = '' + (expression[i - 1] > expression[i + 1]);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isBoolValue(expression[i - 1]) && isBoolValue(expression[i + 1])) {
                expression[i] = '' + (expression[i - 1] > expression[i + 1]);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else {
                printOutError("\n\'" + expression[i - 1] + "\' and \'" + expression[i + 1] + "\' are not of same type so cannot compare them\n");
                return;
            }

        }
        i++;
    }

    //tackles<
    i = 0;
    while (i < expression.length - 1) {
        if (expression[i] == '<') {
            //handles error detection and debugging
            if (i == 0 || i == expression.length - 1) {//handles error detection and debugging
                printOutError("\n\'<\' requires two values\n");
                return;
            } if (isNumValue(expression[i - 1]) && isNumValue(expression[i + 1])) {
                expression[i] = '' + (parseFloat(expression[i - 1]) < parseFloat(expression[i + 1]));
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isStringValue(expression[i - 1]) && isStringValue(expression[i + 1])) {
                expression[i] = '' + (expression[i - 1] < expression[i + 1]);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else if (isBoolValue(expression[i - 1]) && isBoolValue(expression[i + 1])) {
                expression[i] = '' + (expression[i - 1] < expression[i + 1]);
                expression.splice(i + 1, 1);
                expression.splice(i - 1, 1);
                i--;
            } else {
                printOutError("\n\'" + expression[i - 1] + "\' and \'" + expression[i + 1] + "\' are not of same type so cannot compare them\n");
                return;
            }

        }
        i++;
    }

    //tackles !
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '!') {
            if (i == expression.length - 1) {
                printOutError("\nbool expected after\'!\'\n");
                return;
            }
            if (!isBoolValue(expression[i + 1])) {
                printOutError("\nbool value expected after\'!\'\n");
                return;
            }
            expression[i] = '' + (expression[i + 1] != 'true');
            expression.splice(i + 1, 1);
        }
        i++;
    }
    //tackle &&
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '&') {
            //handles error detection and debugging
            if (i == expression.length - 1 || expression[i + 1] != '&') {
                printOutError("\n\'&\' expected after \'&\'\n");
                return;
            }
            if (i == 0 || i == expression.length - 2) {//handles error detection and debugging
                printOutError("\n\'&&\' requires two bool values\n");
                return;
            }
            if (!isBoolValue(expression[i - 1])) {//handles error detection and debugging
                printOutError("\n\'" + expression[i - 1] + "\' is not a bool value\n");
                return;
            }
            if (!isBoolValue(expression[i + 2])) {//handles error detection and debugging
                printOutError("\n\'" + expression[i + 2] + "\' is not a bool value\n");
                return;
            }
            //if valid
            expression[i] = '' + (expression[i - 1] == 'true' && expression[i + 2] == 'true');
            expression.splice(i + 2, 1);
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }
    //tackle ||
    i = 0;
    while (i < expression.length) {
        if (expression[i] == '|') {
            //handles error detection and debugging
            if (i == expression.length - 1 || expression[i + 1] != '|') {
                printOutError("\n\'|\' expected after \'|\'\n");
                return;
            }
            if (i == 0 || i == expression.length - 2) {//handles error detection and debugging
                printOutError("\n\'||\' requires two bool values\n");
                return;
            }
            if (!isBoolValue(expression[i - 1])) {//handles error detection and debugging
                printOutError("\n\'" + expression[i - 1] + "\' is not a bool value\n");
                return;
            }
            if (!isBoolValue(expression[i + 2])) {//handles error detection and debugging
                printOutError("\n\'" + expression[i + 2] + "\' is not a bool value\n");
                return;
            }
            //if valid
            expression[i] = '' + (expression[i - 1] == 'true' || expression[i + 2] == 'true');
            expression.splice(i + 2, 1);
            expression.splice(i + 1, 1);
            expression.splice(i - 1, 1);
            i--;
        }
        i++;
    }

    //final result

    if (expression.length > 1) {
        printOutError("\nCannot evaluate \'" + expression[1] + "\' without any operator\n");
        return;
    }
    if (expression.length == 0)
        return;
    if (isNumValue(expression[0])) {
        res[0] = 'num';
        res[1] = expression[0];
    }
    if (isStringValue(expression[0])) {
        res[0] = 'string';
        res[1] = expression[0];
    }
    if (isBoolValue(expression[0])) {
        res[0] = 'bool';
        res[1] = expression[0];
    }
    return res;
}
function addElementsToArr(arr, index, elements, offset) {
    let res = [];
    for (let i = 0; i < index; i++) {
        res.push(arr[i]);
    }
    for (let i = 0; i < elements.length; i++) {
        res.push(elements[i]);
    }
    for (let i = index + offset; i < arr.length; i++) {
        res.push(arr[i]);
    }
    return res;
}
function expandShorthand() {
    let i = 1;
    while (i < tokens.length - 1) {
        if ((tokens[i] == "+" || tokens[i] == "*" || tokens[i] == "-" || tokens[i] == "%" || tokens[i] == "/" || tokens[i] == "^") && tokens[i + 1] == "=") {
            if (tokens[i - 1] == "]") {//the disadvantage is only that this wont work for first line
                let operator = tokens[i];
                //lets find the previous line start
                let c = i - 2;
                while (c >= 0) {
                    if (tokens[c] == "currentLineNumberByLangnest")
                        break;
                    c--;
                }
                tokens = addElementsToArr(tokens, i, [], 1);//added equal to
                tokens = addElementsToArr(tokens, i + 1, tokens.slice(c + 2, i), 0);
                tokens = addElementsToArr(tokens, 2 * i - c - 1, operator, 0);
                i = 2 * i - c + 1;
                console.log(tokens[i]);
            }
            else if (isVariableName(tokens[i - 1])) {
                //expand the array
                tokens = addElementsToArr(tokens, i, ['=', tokens[i - 1], tokens[i]], 2);
                i += 2;
            } else {
                printOutError("\n\'" + tokens[i] + "\'= requires a variable as its left operand\n");
                return;
            }
        }
        i++;
    }
}
function commaToVarDec() {
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] == "num" || tokens[i] == "bool" || tokens[i] == "string" || tokens[i] == "list") {
            let dataType = tokens[i];
            i++;
            while (i < tokens.length && tokens[i] != ';') {
                if (tokens[i] == "[") {//list time
                    i++;
                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "[")
                            openBrackets++;
                        if (tokens[i] == "]") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \']\' \n");
                        return;
                    }
                }
                else if (tokens[i] == ',') {
                    tokens = addElementsToArr(tokens, i, [';', dataType], 1);
                    i++;
                }
                i++;
            }
        }
        i++;
    }
}
//dont skip last ; or ending as i++ as end of while loop will do so
//when extracting expression extract between first( and last )
// a block can be considered as a code input for analyzer use recursion to execute all the block and block does not return any value
//for now block is considered only after control statements (if,else,while)
function analyzer(tokensReceived, isCalledByFunction, isCalledByFor) {
    let tokens = tokensReceived.slice(0, tokensReceived.length);//array copied so changes dont reflect overall
    let i = 0;

    if (!isCalledByFunction) {
        varNames.push([]);
        variables.push([]);
    }
    //creates empty array for localVariables
    //extract all functions
    while (i < tokens.length) {
        if (tokens[i] == "currentLineNumberByLangnest") {
            i++;
            currentLineNumber = tokens[i++];
        }
        if (tokens[i] == "func") {
            i++;
            if (isFuncNameValid(tokens[i])) {
                let args, block;
                funcNames.push(tokens[i]);
                i++;
                if (tokens[i] == "(") {
                    i++;
                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "(")
                            openBrackets++;
                        if (tokens[i] == ")") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \')\' \n");
                        return;
                    }
                    args = tokens.slice(expStart, i);
                    tokens.splice(expStart - 3, i - expStart + 4);
                    i -= (args.length + 3);
                } else {
                    printOutError("\n( expected after func name\n");
                    return;
                }
                if (tokens[i] == "{") {
                    i++;
                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "{")
                            openBrackets++;
                        if (tokens[i] == "}") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \'}\' \n");
                        return;
                    }
                    block = tokens.slice(expStart, i);
                    if (findIndex(block, "func") != -1) {
                        printOutError("func cannot be declared inside a block");
                        return;

                    }
                    tokens.splice(expStart - 1, i - expStart + 2);
                    funcs.push([args, block]);
                    i -= (block.length + 2);
                } else {
                    printOutError("\n{ expected after ) for func arguements\n");
                    return;
                }
            } else return;
        }
        i++;
    }



    i = 0;
    while (i < tokens.length) {
        //console.log(tokens[i]);
        if (tokens[i] == "currentLineNumberByLangnest") {
            i++;
            currentLineNumber = tokens[i++];
            continue;
        } else {
            //responds to return
            if (tokens[i] == "return") {
                i++;
                if (tokens[i] == ";") {
                    if (varNames.length > 1) {
                        varNames.pop();
                        variables.pop();
                    }
                    return "\"\"";
                }
                let expStart = i;
                while (i < tokens.length) {
                    if (tokens[i] == ";")
                        break;
                    i++;
                }
                if (i == tokens.length) {
                    printOutError("\nexpected ; after \'" + tokens[i] + "\'\n");
                    return;
                }
                let res = evaluateExpression(tokens.slice(expStart, i));
                if (varNames.length > 1) {
                    varNames.pop();
                    variables.pop();
                }
                return res;
            }


            //handles while statement
            else if (tokens[i] == "while") {
                i++;
                let whileCondition, whileBlock;
                if (tokens[i] == "(") {
                    i++;
                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "(")
                            openBrackets++;
                        if (tokens[i] == ")") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \')\' \n");
                        return;
                    }
                    whileCondition = tokens.slice(expStart, i);
                    i++;
                } else {
                    printOutError("\n( expected after while\n");
                    return;
                }
                if (tokens[i] == "{") {
                    i++;
                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "{")
                            openBrackets++;
                        if (tokens[i] == "}") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \'}\' \n");
                        return;
                    }
                    whileBlock = tokens.slice(expStart, i);

                } else {
                    printOutError("\n{ expected after ) for while\n");
                    return;
                }
                let res = evaluateExpression(whileCondition);
                if (res[0] != 'bool') {
                    printOutError("\nwhile requires a bool value received \'" + res[0] + "\'\n");
                    return;
                }
                while (res[1] == 'true') {
                    let valReturned = analyzer(whileBlock, false, false);
                    if (valReturned != null) {
                        if (varNames.length > 1) {
                            varNames.pop();
                            variables.pop();
                        }
                        return valReturned;
                    }
                    res = evaluateExpression(whileCondition);
                }
            }
            //handles for
            else if (tokens[i] == "for") {
                i++;
                let init, cond, action, forBlock;
                if (tokens[i] == "(") {
                    i++;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == ";")
                            break;
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \';\' \n");
                        return;
                    }

                    init = tokens.slice(expStart, ++i);

                    expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == ";")
                            break;
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \';\' \n");
                        return;
                    }

                    cond = tokens.slice(expStart, i++);

                    expStart = i;

                    let openBrackets = 1;
                    while (i < tokens.length) {
                        if (tokens[i] == "(")
                            openBrackets++;
                        if (tokens[i] == ")") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \')\' \n");
                        return;
                    }

                    action = tokens.slice(expStart, i);
                    action.push(';');
                    i += 1;
                } else {
                    printOutError("\n( expected after for\n");
                    return;
                }
                if (tokens[i] == "{") {
                    i++;
                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "{")
                            openBrackets++;
                        if (tokens[i] == "}") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \'}\' \n");
                        return;
                    }
                    forBlock = tokens.slice(expStart, i);
                } else {
                    printOutError("\n{ expected after ) for \'for\' loop\n");
                    return;
                }

                varNames.push([]);
                variables.push([]);
                analyzer(init, true, true);
                let res = evaluateExpression(cond);
                if (res[0] != 'bool') {
                    printOutError("\for requires a bool value , received \'" + res[0] + "\'\n");
                    return;
                }
                while (res[1] == 'true') {
                    let valReturned = analyzer(forBlock, true, true);//local variables declared
                    if (valReturned != null) {
                        if (varNames.length > 1) {
                            varNames.pop();
                            variables.pop();
                        }
                        return valReturned;
                    }
                    analyzer(action, true, true);
                    res = evaluateExpression(cond);
                }
                //remove local
                varNames.pop();
                variables.pop();
            }



            //handles if statement
            else if (tokens[i] == "if") {
                i++;
                let shouldEvaluateIf = false, shouldEvaluateElseIf = false;
                let elseAppeared = false;
                if (tokens[i] == "(") {
                    i++;

                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "(")
                            openBrackets++;
                        if (tokens[i] == ")") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \')\' \n");
                        return;
                    }
                    let res = evaluateExpression(tokens.slice(expStart, i));
                    if (res[0] != 'bool') {
                        printOutError("\nif requires a bool value received \'" + res[0] + "\'\n");
                        return;
                    }
                    shouldEvaluateIf = (res[1] == 'true');
                    i++;
                } else {
                    printOutError("\n( expected after if\n");
                    return;
                }
                if (tokens[i] == "{") {
                    i++;

                    let openBrackets = 1;
                    let expStart = i;
                    while (i < tokens.length) {
                        if (tokens[i] == "{")
                            openBrackets++;
                        if (tokens[i] == "}") {
                            if (openBrackets == 1)
                                break;
                            openBrackets--;
                        }
                        i++;
                    }
                    if (i == tokens.length) {
                        printOutError("\nexpected \'}\' \n");
                        return;
                    }

                    if (shouldEvaluateIf) {

                        let valReturned = analyzer(tokens.slice(expStart, i), false, false);
                        if (valReturned != null) {
                            if (varNames.length > 1) {
                                varNames.pop();
                                variables.pop();
                            }
                            return valReturned;
                        }
                    }
                    i++;
                } else {
                    printOutError("\n{ expected after ) for if\n");
                    return;
                }
                while (tokens[i] == "else") {
                    if (elseAppeared) {
                        printOutError("\nelse has no if else if structure associated with\n");
                        return;
                    }
                    i++;
                    if (tokens[i] == "if") {
                        i++;
                        if (tokens[i] == "(") {
                            i++;

                            let openBrackets = 1;
                            let expStart = i;
                            while (i < tokens.length) {
                                if (tokens[i] == "(")
                                    openBrackets++;
                                if (tokens[i] == ")") {
                                    if (openBrackets == 1)
                                        break;
                                    openBrackets--;
                                }
                                i++;
                            }
                            if (i == tokens.length) {
                                printOutError("\nexpected \')\' \n");
                                return;
                            }
                            let res = evaluateExpression(tokens.slice(expStart, i));
                            if (res[0] != 'bool') {
                                printOutError("\nif requires a bool value received \'" + res[0] + "\'\n");
                                return;
                            }

                            shouldEvaluateElseIf = !shouldEvaluateIf && (res[1] == 'true');
                            i++;
                        } else {
                            printOutError("\n( expected after if\n");
                            return;
                        }
                        if (tokens[i] == "{") {
                            i++;

                            let openBrackets = 1;
                            let expStart = i;
                            while (i < tokens.length) {
                                if (tokens[i] == "{")
                                    openBrackets++;
                                if (tokens[i] == "}") {
                                    if (openBrackets == 1)
                                        break;
                                    openBrackets--;
                                }
                                i++;
                            }
                            if (i == tokens.length) {
                                printOutError("\nexpected \'}\' \n");
                                return;
                            }
                            if (shouldEvaluateElseIf) {

                                let valReturned = analyzer(tokens.slice(expStart, i), false, false);
                                if (valReturned != null) {
                                    if (varNames.length > 1) {
                                        varNames.pop();
                                        variables.pop();
                                    }
                                    return valReturned;
                                }
                                shouldEvaluateIf = true;//next if must not evaluate
                            }
                        } else {
                            printOutError("\n{ expected after ) for if\n");
                            return;
                        }
                    } else if (tokens[i] == "{") {
                        //only if found
                        elseAppeared = true;
                        i++;

                        let openBrackets = 1;
                        let expStart = i;
                        while (i < tokens.length) {
                            if (tokens[i] == "{")
                                openBrackets++;
                            if (tokens[i] == "}") {
                                if (openBrackets == 1)
                                    break;
                                openBrackets--;
                            }
                            i++;
                        }
                        if (i == tokens.length) {
                            printOutError("\nexpected \'}\' \n");
                            return;
                        }

                        if (!shouldEvaluateIf) {

                            let valReturned = analyzer(tokens.slice(expStart, i), false, false);
                            if (valReturned != null) {
                                if (varNames.length > 1) {
                                    varNames.pop();
                                    variables.pop();
                                }
                                return valReturned;
                            }
                        }

                    } else {
                        //invalid syntax
                        printOutError("\nif or { expected after else\n");
                        return;
                    }
                    i++;
                }
                i--;
            }

            //this else would be without any if
            else if (tokens[i] == "else") {
                printOutError("\nelse without if\n");
                return;
            }
            //handle num var definitions
            else if (tokens[i] == "num") {
                i++;
                if (isVarNameValid(tokens[i])) {
                    i++;
                    if (tokens[i] == ";") {
                        //only declaration
                        varNames[varNames.length - 1].push(tokens[i - 1]);
                        variables[variables.length - 1].push(['num', '0']);
                    } else if (tokens[i] == "=") {
                        i++;
                        //initialization also to be done
                        let varName = tokens[i - 2];
                        let expStart = i;
                        while (tokens[i] != ";") {
                            if (i == tokens.length) {
                                printOutError("\nexpected \';\' \n");
                                return;
                            }
                            i++;
                        }
                        let res = evaluateExpression(tokens.slice(expStart, i));
                        if (res[0] == 'num') {
                            varNames[varNames.length - 1].push(varName);
                            variables[variables.length - 1].push(['num', res[1]]);
                        } else {
                            printOutError("\ncannot convert \'" + res[0] + "\' to num \n");
                            return;
                        }

                    } else {
                        //syntax error
                        printOutError("\n\'=\' or \';\' expected after " + tokens[i - 1] + "\n");
                        return;
                    }
                } else return;
            }

            //handle bool var definitions
            else if (tokens[i] == "bool") {
                i++;
                if (isVarNameValid(tokens[i])) {
                    i++;
                    if (tokens[i] == ";") {
                        //only declaration
                        varNames[varNames.length - 1].push(tokens[i - 1]);
                        variables[variables.length - 1].push(['bool', 'false']);
                    } else if (tokens[i] == "=") {
                        i++;
                        //initialization also to be done
                        let varName = tokens[i - 2];
                        let expStart = i;
                        while (tokens[i] != ";") {
                            if (i == tokens.length) {
                                printOutError("\nexpected \';\' \n");
                                return;
                            }
                            i++;
                        }
                        let res = evaluateExpression(tokens.slice(expStart, i));
                        if (res[0] == 'bool') {
                            varNames[varNames.length - 1].push(varName);
                            variables[variables.length - 1].push(['bool', res[1]]);
                        } else {
                            printOutError("\ncannot convert \'" + res[0] + "\' to bool \n");
                            return;
                        }

                    } else {
                        //syntax error
                        printOutError("\n\'=\' or \';\' expected after " + tokens[i - 1] + "\n");
                        return;
                    }
                } else return;
            }

            //handle string var definitions
            else if (tokens[i] == "string") {
                i++;
                if (isVarNameValid(tokens[i])) {
                    i++;
                    if (tokens[i] == ";") {
                        //only declaration
                        varNames[varNames.length - 1].push(tokens[i - 1]);
                        variables[variables.length - 1].push(['string', '\"\"']);
                    } else if (tokens[i] == "=") {
                        i++;
                        //initialization also to be done
                        let varName = tokens[i - 2];
                        let expStart = i;
                        while (tokens[i] != ";") {
                            if (i == tokens.length) {
                                printOutError("\nexpected \';\' \n");
                                return;
                            }
                            i++;
                        }
                        let res = evaluateExpression(tokens.slice(expStart, i));
                        if (res[0] == 'string') {
                            varNames[varNames.length - 1].push(varName);
                            variables[variables.length - 1].push(['string', res[1]]);
                        } else {
                            printOutError("\ncannot convert \'" + res[0] + "\' to string \n");
                            return;
                        }

                    } else {
                        //syntax error
                        printOutError("\n\'=\' or \';\' expected after " + tokens[i - 1] + "\n");
                        return;
                    }
                } else return;
            }
            //handle list/array var definitions
            else if (tokens[i] == "list") {
                i++;
                if (isVarNameValid(tokens[i])) {
                    i++;
                    if (tokens[i] == ";") {
                        //only declaration
                        varNames[varNames.length - 1].push(tokens[i - 1]);
                        variables[variables.length - 1].push(['list', []]);
                    } else if (tokens[i] == "=") {
                        i++;
                        if (tokens[i] != "[") {
                            printOutError("\n\'[\' is expected after = \n");
                            return;
                        }
                        i++;
                        //initialization also to be done
                        let varName = tokens[i - 3];
                        let expStart = i;
                        while (tokens[i] != "]") {
                            if (i == tokens.length) {
                                printOutError("\nexpected \']\' \n");
                                return;
                            }
                            i++;
                        }
                        if (expStart != i) {
                            let elements = seperateArguements(tokens.slice(expStart, i));
                            //solve elements
                            for (let j = 0; j < elements.length; j++) {
                                elements[j] = evaluateExpression(elements[j]);
                                if (elements[j][0] == 'null') {
                                    printOutError("\n\'" + j + 1 + "\' element of \'" + varName + "\' is null\n");
                                    return;
                                }
                            }
                            varNames[varNames.length - 1].push(varName);
                            variables[variables.length - 1].push(['list', elements]);
                        } else {
                            varNames[varNames.length - 1].push(varName);
                            variables[variables.length - 1].push(['list', []]);
                        }

                        i++;//at ;
                        if (tokens[i] != ";") {
                            printOutError("\nexpected \';\' \n");
                            return;
                        }

                    } else {
                        //syntax error
                        printOutError("\n\'=\' or \';\' expected after " + tokens[i - 1] + "\n");
                        return;
                    }
                } else return;
            }

            //handles assignment operation

            else if (tokens[i] == "=" && tokens[i + 1] != "=" && tokens[i - 1] != "<" && tokens[i - 1] != ">" && tokens[i - 1] != "!") {
                //assignment to be done as deinition already encountered above

                let varIndex, j = varNames.length - 1;
                let foundVariable;
                //encounter array element
                if (tokens[i - 1] == "]") {//the disadvantage is only that this wont work for first line
                    let closeBracIndex = i - 1;
                    //lets find the previous line start
                    let c = i - 2;
                    while (c >= 0) {
                        if (tokens[c] == "currentLineNumberByLangnest")
                            break;
                        c--;
                    }
                    //so my variable will be at c+2
                    for (; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], tokens[c + 2]);
                        if (varIndex != -1)
                            break;
                    }
                    if (varIndex == -1) {//variable does not exist
                        printOutError("\n\'" + tokens[c + 2] + "\' is undefined\n");
                        return;
                    }
                    if (variables[j][varIndex][0] != 'list') {
                        printOutError("\n\'" + tokens[c + 2] + "\' has to be of list type\n");
                        return;
                    }
                    let res = evaluateExpression(tokens.slice(c + 4, closeBracIndex));//index detail
                    if (res[0] != 'num') {
                        printOutError("\nindex must be num value\n");
                        return;
                    }
                    res[1] = parseFloat(res[1]);
                    //check index boundness
                    if (res[1] >= 0 && res[1] < variables[j][varIndex][1].length) {
                    } else if (res[1] <= -1 && -res[1] <= variables[j][varIndex][1].length) {
                        res[1] = variables[j][varIndex][1].length + res[1];
                    } else {
                        printOutError("\n\'" + res[1] + "\' index out of bounds\n");
                        return;
                    }
                    foundVariable = variables[j][varIndex][1][res[1]];
                } else {
                    for (; j >= 0; j--) {
                        varIndex = findIndex(varNames[j], tokens[i - 1]);
                        if (varIndex != -1)
                            break;
                    }
                    if (varIndex == -1) {//variable does not exist
                        printOutError("\n\'" + tokens[i - 1] + "\' is undefined\n");
                        return;
                    }
                    foundVariable = variables[j][varIndex];
                }

                let expStart = ++i;
                while (tokens[i] != ";") {
                    if (i == tokens.length) {
                        printOutError("\nexpected \';\' \n");
                        return;
                    }
                    i++;
                }
                let res = evaluateExpression(tokens.slice(expStart, i));
                if (res[0] == foundVariable[0]) {
                    foundVariable[1] = res[1];
                } else {
                    printOutError("\ncannot convert \'" + res[0] + "\' to \'" + foundVariable[0] + "\' \n");
                    return;
                }
            }

            //handle print function
            else if (tokens[i] == "print") {
                i++;
                if (tokens[i] != "(") {
                    printOutError("\nexpected ( after \'print\'\n");
                    return;
                }
                i++;
                let openBrackets = 1;
                let expStart = i;
                while (i < tokens.length) {
                    if (tokens[i] == "(")
                        openBrackets++;
                    if (tokens[i] == ")") {
                        if (openBrackets == 1)
                            break;
                        openBrackets--;
                    }
                    i++;
                }
                if (i == tokens.length) {
                    printOutError("\nexpected \')\' \n");
                    return;
                }
                if (expStart != i) {
                    let res = evaluateExpression(tokens.slice(expStart, i));
                    if (res[0][0] == 'num' || res[0][0] == 'string' || res[0][0] == 'bool') {
                        printOut("[");
                        for (let j = 0; j < res.length - 1; j++) {
                            printOut(res[j][1] + ",");
                        }
                        printOut(res[res.length - 1][1]);
                        printOut("]");
                    } else
                        printOut(res[1]);
                    i++;
                    if (tokens[i] != ";") {
                        printOutError("\nexpected ; after \')\'\n");
                        return;
                    }
                } else {
                    //nothing to print
                    printOut("");
                }

            }
            else {
                //only an expression possible now upto next ; 
                let expStart = i;
                while (i < tokens.length && tokens[i] != ";")
                    i++;
                let exp = tokens.slice(expStart, i);
                //check if exp is assignment or not and put i on =
                let j = 0;
                for (; j < exp.length; j++) {
                    if (exp[j] == "=" && exp[j + 1] != "=" && exp[j - 1] != "<" && exp[j - 1] != ">" && exp[j - 1] != "!")
                        break;
                }
                if (j == exp.length) {
                    evaluateExpression(exp);
                }
                else
                    i = expStart + j - 1;
            }
            i++;
        }

    }

    if (varNames.length > 1 && !isCalledByFor) {
        varNames.pop();
        variables.pop();
    }
}


function executeCode(code, outConsole, errConsole) {
    outputConsole = outConsole;
    outputConsole.innerHTML = "";
    errorConsole = errConsole;
    errorConsole.innerHTML = "";
    startTime = Date.now();

    code = formatSpaces(code.trim());
    tokenSeperator(code);
    commaToVarDec();
    expandShorthand();
    variables = [], varNames = [];
    funcNames = [], funcs = [];
    analyzer(tokens, false, false);

    printOut("\n\n\nProgram executed in : " + ((Date.now() - startTime + executionTime) / 1000) + " s");
    // console.log(varNames);
    // console.log(variables);
}