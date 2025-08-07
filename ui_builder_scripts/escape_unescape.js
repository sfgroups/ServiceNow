function escapeTextAreaValue(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\\/g, '\\\\')     // Escape backslashes
    .replace(/\n/g, '\\n')      // Escape newlines
    .replace(/\r/g, '\\r')      // Escape carriage return
    .replace(/"/g, '\\"');      // Escape double quotes
}


function unescapeTextAreaValue(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}
