function escapeTextAreaForWrite(text) {
  if (typeof text !== 'string') return '';

  let workingText = text
    .slice(0, 1000)                // Limit to 1000 characters
    .replace(/\\n/g, '\n')         // Clean double-escaped newlines
    .replace(/\^/g, '')            // Remove caret
    .replace(/\\/g, '\\\\')        // Escape backslashes
    .replace(/"/g, '\\"')          // Escape double quotes
    .replace(/'/g, "\\'")          // Escape single quotes
    .replace(/(\r\n|\r|\n)/g, '\\n'); // Encode newlines

  return workingText;
}

function unescapeTextAreaFromRead(text) {
  if (typeof text !== 'string') return '';

  return text
    .replace(/\\\\/g, '\\')        // Unescape backslashes
    .replace(/\\"/g, '"')          // Unescape double quotes
    .replace(/\\'/g, "'")          // Unescape single quotes
    .replace(/\\n/g, '\n');        // Convert \n to actual newline
}
