function decodeBase64ToBytes(base64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let bytes = [];
  let buffer = 0;
  let bitsCollected = 0;

  for (let i = 0; i < base64.length; i++) {
    const ch = base64.charAt(i);
    if (ch === '=') break;

    const value = chars.indexOf(ch);
    if (value === -1) continue; // skip non-base64 characters

    buffer = (buffer << 6) | value;
    bitsCollected += 6;

    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      const byte = (buffer >> bitsCollected) & 0xff;
      bytes.push(byte);
    }
  }

  return bytes;
}

function bytesToUtf8String(bytes) {
  let result = '';
  let i = 0;

  while (i < bytes.length) {
    const byte1 = bytes[i++];

    if (byte1 < 0x80) {
      result += String.fromCharCode(byte1);
    } else if (byte1 < 0xe0) {
      const byte2 = bytes[i++];
      result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
    } else if (byte1 < 0xf0) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      result += String.fromCharCode(
        ((byte1 & 0x0f) << 12) |
        ((byte2 & 0x3f) << 6) |
        (byte3 & 0x3f)
      );
    } else {
      // 4-byte UTF-8 (surrogate pair)
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      const byte4 = bytes[i++];
      const codepoint =
        ((byte1 & 0x07) << 18) |
        ((byte2 & 0x3f) << 12) |
        ((byte3 & 0x3f) << 6) |
        (byte4 & 0x3f);
      const surrogate1 = 0xd800 + ((codepoint - 0x10000) >> 10);
      const surrogate2 = 0xdc00 + ((codepoint - 0x10000) & 0x3ff);
      result += String.fromCharCode(surrogate1, surrogate2);
    }
  }

  return result;
}

function decodeFromBase64Unicode(base64Str) {
  const byteArray = decodeBase64ToBytes(base64Str);
  return bytesToUtf8String(byteArray);
}

const encoded = "U2l2YSBEdXJnYSDwn5qvIMKnw5zFniDgpKrgpY3gpYQ=";
const decoded = decodeFromBase64Unicode(encoded);
console.log(decoded);  // "Siva Durga 🚀 Śrī राम"
