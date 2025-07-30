import sha256 from 'crypto-js/sha256';

export function hashField(value) {
  return sha256(value.trim().toLowerCase()).toString();
}

