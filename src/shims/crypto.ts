const getCrypto = (): Crypto => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }

  throw new Error('Web Crypto API is not available in this environment');
};

export const randomBytes = (size: number): Uint8Array => {
  const crypto = getCrypto();
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return array;
};

export default { randomBytes };
