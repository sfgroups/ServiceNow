function fixTextAreaForWrite(inputText) {
    let workingText = inputText;

    // Backslash MUST BE FIRST
    workingText = workingText.replace(/\\/g, "\\\\");
    // Carriage returns
    workingText = workingText.replace(/(\r\n|\r|\n)/g, "\\n");
    // Cannot make caret work, just remove
    workingText = workingText.replace(/\^/g, "");

    return workingText;
}