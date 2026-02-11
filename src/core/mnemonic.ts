/**
 * BIP39 Mnemonic generation and validation
 * Uses ethers.js which has built-in BIP39 support
 */

import { Mnemonic } from 'ethers';

/**
 * Generate a new BIP39 mnemonic phrase
 * @returns 12 word mnemonic phrase
 */
export function generateMnemonic(): string {
  // Generate 16 bytes of entropy for 12 words
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Mnemonic.fromEntropy(array).phrase;
}

/**
 * Validate a mnemonic phrase
 * @param mnemonic - The mnemonic phrase to validate
 * @returns True if valid
 */
export function validateMnemonic(mnemonic: string): boolean {
  try {
    Mnemonic.fromPhrase(mnemonic);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the entropy from a mnemonic (for backup/encryption)
 * @param mnemonic - The mnemonic phrase
 * @returns The entropy as a hex string
 */
export function mnemonicToEntropy(mnemonic: string): string {
  return Mnemonic.fromPhrase(mnemonic).entropy;
}

/**
 * Create mnemonic from entropy
 * @param entropy - The entropy hex string
 * @returns The mnemonic phrase
 */
export function entropyToMnemonic(entropy: string): string {
  return Mnemonic.fromEntropy(entropy).phrase;
}
