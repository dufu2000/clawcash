/**
 * Key management for ClawCash wallet
 * Handles BIP-32/BIP-44 key derivation for multiple chains
 */

import { HDNodeWallet } from 'ethers';
import type { Chain } from './types.js';

/**
 * BIP-44 derivation paths for supported chains (without m/ prefix)
 */
const DERIVATION_PATHS: Record<Chain, string> = {
  // Ethereum and EVM-compatible chains use the same path
  ethereum: "44'/60'/0'/0/0",
  polygon: "44'/60'/0'/0/0",
  bsc: "44'/60'/0'/0/0",
  arbitrum: "44'/60'/0'/0/0",
  // Bitcoin
  bitcoin: "44'/0'/0'/0/0",
};

/**
 * Key manager for handling private key derivation
 */
export class KeyManager {
  private mnemonic: string;
  private derivedKeys: Map<Chain, string> = new Map();

  /**
   * Create a new KeyManager from a mnemonic
   * @param mnemonic - BIP39 mnemonic phrase
   */
  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
  }

  /**
   * Derive a private key for a specific chain
   * @param chain - The blockchain network
   * @returns The derived private key (never exposed in API)
   */
  derivePrivateKey(chain: Chain): string {
    // Check if already derived
    if (this.derivedKeys.has(chain)) {
      return this.derivedKeys.get(chain)!;
    }

    // Get derivation path for chain
    const path = DERIVATION_PATHS[chain];

    // Derive the key using full path from mnemonic
    const wallet = HDNodeWallet.fromPhrase(this.mnemonic, '', 'm/' + path);
    const privateKey = wallet.privateKey;

    // Cache the derived key
    this.derivedKeys.set(chain, privateKey);

    return privateKey;
  }

  /**
   * Get the master mnemonic
   * @returns The mnemonic phrase (handle with care!)
   */
  getMnemonic(): string {
    return this.mnemonic;
  }

  /**
   * Export all derived private keys (for backup only)
   * @returns Record of chain to private key
   */
  exportPrivateKeys(): Record<Chain, string> {
    const result: Partial<Record<Chain, string>> = {};
    for (const chain of Object.keys(DERIVATION_PATHS) as Chain[]) {
      result[chain] = this.derivePrivateKey(chain);
    }
    return result as Record<Chain, string>;
  }

  /**
   * Clear all derived keys from memory
   */
  clear(): void {
    this.derivedKeys.clear();
  }

  /**
   * Get the extended public key (xpub) for the wallet
   * @returns The extended public key
   */
  getExtendedPublicKey(): string {
    const wallet = HDNodeWallet.fromPhrase(this.mnemonic);
    return wallet.extendedKey;
  }
}
