let editor,lineSpacing=4,outPut,outErr,fS,lS;
window.onload = () => {
    outPut = document.getElementById('output');
    outErr = document.getElementById('error');
    fS=document.getElementById('fontSize');
    lS=document.getElementById('lineSpacing');
    if(localStorage.langnestLineSpacing!=null){
        lineSpacing=localStorage.langnestLineSpacing;
    }else{
        localStorage.langnestLineSpacing=4;
    }
    if(localStorage.langnestFontSize!=null){
        document.getElementById("code-editor").style.fontSize=localStorage.langnestFontSize+'px';
    }else{
        localStorage.langnestFontSize=15;
    }
    fS.value=document.getElementById("code-editor").style.fontSize.replace('px','');
    lS.value=lineSpacing;
    editor = CodeMirror(document.getElementById("code-editor"), {
        lineNumbers: true,
        mode: 'none',
        theme: 'ayu-dark',
        autoCloseBrackets: true, // Automatically close brackets, parentheses, and quotes
        autoCloseQuotes: true,
    });
    if(localStorage.langnestLastCode!=null){
        editor.setValue(localStorage.langnestLastCode);
    }
    
    // Array of custom words
    var customWords = ['num', 'bool', 'list', 'string', 'print', 'func', 'input','length','add','at','return', 'true', 'false', 'if', 'else', 'while','for'];
    // Corresponding array of colors
    var customColors = ['cm-keywords','cm-keywords','cm-keywords','cm-keywords','cm-func','cm-func','cm-func','cm-func','cm-func','cm-func','cm-return', 'cm-boolean','cm-boolean', 'cm-if-else','cm-if-else' ,'cm-if-else','cm-if-else'  ];
    
    var lineSpaces = 0; // Variable to track indentation level
    
    function countBracesUntilIndex(index) {
        var content = editor.getValue();
        var count = 0;
    
        for (var i = 0; i < index; i++) {
            if (content[i] === '{') {
                count++;
            } else if (content[i] === '}') {
                count--;
            }
        }
    
        return count;
    }
    
    function highlightCustomWords() {
        editor.operation(function () {
            var content = editor.getValue();
    
            // Clear existing marks
            editor.getAllMarks().forEach(mark => mark.clear());
    
            // Find and mark custom words with corresponding colors
            for (var i = 0; i < customWords.length; i++) {
                var word = customWords[i];
                var colorClass = customColors[i];
    
                var customRegex = new RegExp('\\b' + word + '\\b', 'g');
                var match;
                while ((match = customRegex.exec(content)) !== null) {
                    var from = editor.posFromIndex(match.index);
                    var to = editor.posFromIndex(match.index + match[0].length);
                    editor.markText(from, to, { className: colorClass });
                }
            }
    
            
    
            // Highlight anything between double quotes, including the quotes
            var doubleQuoteRegex = /"([^"]*)"/g;
            var doubleQuoteMatch;
            while ((doubleQuoteMatch = doubleQuoteRegex.exec(content)) !== null) {
                var from = editor.posFromIndex(doubleQuoteMatch.index);
                var to = editor.posFromIndex(doubleQuoteMatch.index + doubleQuoteMatch[0].length);
                editor.markText(from, to, { className: 'cm-double-quote' });
            }
    
            // Highlight comments starting with //
            var commentRegex = /\/\/(.*)/g;
            var commentMatch;
            while ((commentMatch = commentRegex.exec(content)) !== null) {
                var from = editor.posFromIndex(commentMatch.index);
                var to = editor.posFromIndex(commentMatch.index + commentMatch[0].length);
                editor.markText(from, to, { className: 'cm-comment' });
            }

            // Highlight numbers in blue
            var numberRegex = /\b\d+\b/g;
            var numberMatch;
            while ((numberMatch = numberRegex.exec(content)) !== null) {
                var from = editor.posFromIndex(numberMatch.index);
                var to = editor.posFromIndex(numberMatch.index + numberMatch[0].length);
                editor.markText(from, to, { className: 'cm-number' });
            }
        });
    }
    
    highlightCustomWords();
    
    // Log the index of the code after which the cursor is present on cursor activity
    editor.on("cursorActivity", function () {
        highlightCustomWords();
        var cursorIndex = editor.indexFromPos(editor.getCursor());
        lineSpaces = countBracesUntilIndex(cursorIndex) * lineSpacing; // Update lineSpaces based on braces count
    });
    
    // Add spaces based on lineSpaces when Enter key is pressed
    editor.on("keydown", function (cm, event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default behavior of Enter key
            var cursor = editor.getCursor();
            let curLine = cursor.line;
            var spaces = Array(lineSpaces + 1).join(' '); // Create a string with the appropriate number of spaces
            if (editor.getValue()[editor.indexFromPos(editor.getCursor())] == "}") {
                editor.replaceRange('\n' + spaces + '\n' + Array(lineSpaces-lineSpacing+1).join(' '), cursor);
                //console.log(editor.getCursor());
                editor.setCursor({ line: curLine + 1, ch: lineSpaces }); // Insert spaces at the cursor positionF
            } else {
                editor.replaceRange('\n' + spaces, cursor);
                //console.log(editor.getCursor());
                editor.setCursor({ line: curLine + 1, ch: lineSpaces });
            }
        }
    });
};

function executeProgram(){
    let code=editor.getValue();
    // localStorage.langnestLastCode=code;
    executeCode(code,outPut,outErr);
}
function executeProgramAndShow(){
    let code=editor.getValue();
    localStorage.langnestLastCode=code;
    document.getElementById('editor').style.display="none";
    document.getElementById('outputDiv').style.display="block";//open the output first
    executeCode(code,outPut,outErr);    
}
function applyChanges(){
    lineSpacing=lS.value;
    localStorage.langnestLineSpacing=lineSpacing;
    document.getElementById("code-editor").style.fontSize=fS.value+'px';
    localStorage.langnestFontSize=fS.value;
}
function saveCode(){
    let code=editor.getValue();
    localStorage.langnestLastCode=code;
    alert("Code Saved");
}
function refreshCode(){
    editor.setValue("");
}
function showCode(){
    document.getElementById('editor').style.display="flex";
    document.getElementById('outputDiv').style.display="none";
}