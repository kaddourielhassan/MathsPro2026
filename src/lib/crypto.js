/**
 * Utilitaires de cryptographie pour MathsPro.
 * Utilise l'API Web Crypto native du navigateur.
 */

/**
 * Génère un sel aléatoire.
 */
export function generateSalt(length = 16) {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Calcule le hash PBKDF2 d'une chaîne avec un sel.
 */
export async function hashString(str, salt) {
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(str)
  const saltData = encoder.encode(salt)

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  const derivedKey = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    256
  )

  const hashArray = Array.from(new Uint8Array(derivedKey))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Vérifie si une chaîne correspond à un hash/sel donné.
 */
export async function verifyHash(str, salt, hash) {
  if (!str || !salt || !hash) return false
  const testHash = await hashString(str, salt)
  return testHash === hash
}
