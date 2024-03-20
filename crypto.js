async function generateKeys() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );
  return keyPair;
}

function bufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(base64) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function exportPublicKey(key) {
  const exportedKey = await window.crypto.subtle.exportKey("spki", key);
  const exportedKeyBuffer = new Uint8Array(exportedKey);

  return bufferToBase64(exportedKeyBuffer);
}

async function exportPrivateKey(key) {
  const exportedKey = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedKeyBuffer = new Uint8Array(exportedKey);

  return bufferToBase64(exportedKeyBuffer);
}

async function importPublicKey(base64String) {
  const keyBuffer = base64ToBuffer(base64String);
  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    keyBuffer,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["verify"]
  );
  return publicKey;
}

async function importPrivateKey(base64String) {
  const keyBuffer = base64ToBuffer(base64String);
  const privateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["sign"]
  );
  return privateKey;
}

async function signMessage(privateKey, message) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(message);

  const signature = await window.crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 64,
    },
    privateKey,
    encodedData
  );

  return bufferToBase64(signature);
}

async function verifyMessage(publicKey, signature, message) {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  return await window.crypto.subtle.verify(
    {
      name: "RSA-PSS",
      saltLength: 64,
    },
    publicKey,
    base64ToBuffer(signature),
    encodedMessage
  );
}

window.importPrivateKey = importPrivateKey;
window.signMessage = signMessage;
window.verifyMessage = verifyMessage;
