/**
 * Main ClawCash Wallet class
 * Orchestrates all wallet functionality across multiple chains
 */

import { KeyManager } from './key-manager.js';
import { generateMnemonic, validateMnemonic } from './mnemonic.js';
import { ethereumFactory } from '../chains/evm/ethereum.js';
import { BitcoinChain } from '../chains/bitcoin/bitcoin.js';
import { registerChain, getChain } from '../chains/base.js';
import type {
  WalletConfig,
  WalletAddresses,
  Chain,
  Balance,
  PaymentParams,
  FeeEstimate,
  TokenSymbol,
} from './types.js';

// Register EVM chains
registerChain('ethereum', ethereumFactory('ethereum'));
registerChain('polygon', ethereumFactory('polygon'));
registerChain('bsc', ethereumFactory('bsc'));
registerChain('arbitrum', ethereumFactory('arbitrum'));

// Register Bitcoin chain
registerChain('bitcoin', (privateKey: string) => new BitcoinChain(privateKey));

/**
 * Main ClawCash wallet class
 */
export class ClawCashWallet {
  private keyManager: KeyManager;
  private config: WalletConfig;

  /**
   * Create a new wallet instance
   * @param config - Wallet configuration
   */
  constructor(config: WalletConfig = {}) {
    const mnemonic = config.mnemonic || generateMnemonic();

    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    this.keyManager = new KeyManager(mnemonic);
    this.config = { ...config, mnemonic };
  }

  /**
   * Get wallet addresses for all supported chains
   */
  async getAddresses(): Promise<WalletAddresses> {
    const addresses: Partial<WalletAddresses> = {};

    // Get EVM chain addresses
    for (const chain of ['ethereum', 'polygon', 'bsc', 'arbitrum'] as Chain[]) {
      const chainInstance = getChain(chain, this.keyManager.derivePrivateKey(chain));
      try {
        await chainInstance.connect();
      } catch {
        // Connection failed, but we can still get the address
      }
      addresses[chain] = chainInstance.getAddress();
    }

    // Bitcoin address
    addresses.bitcoin = this.getBitcoinAddress();

    return addresses as WalletAddresses;
  }

  /**
   * Get Bitcoin address (simplified version)
   */
  private getBitcoinAddress(): string {
    // This is a placeholder - real implementation would use bitcoinjs-lib
    const pk = this.keyManager.derivePrivateKey('bitcoin');
    // For now, return a mock address
    return 'bc1q' + pk.slice(0, 38);
  }

  /**
   * Get balance for a specific chain and token
   * @param chain - The blockchain network
   * @param token - Optional token symbol (defaults to native)
   */
  async getBalance(chain: Chain, _token?: TokenSymbol): Promise<Balance> {
    const chainInstance = getChain(chain, this.keyManager.derivePrivateKey(chain));
    await chainInstance.connect();
    return await chainInstance.getBalance();
  }

  /**
   * Estimate transaction fee
   * @param params - Payment parameters
   */
  async estimateFee(params: PaymentParams): Promise<FeeEstimate> {
    const chainInstance = getChain(
      params.chain,
      this.keyManager.derivePrivateKey(params.chain)
    );
    await chainInstance.connect();
    return await chainInstance.estimateFee(params);
  }

  /**
   * Send a payment
   * @param params - Payment parameters
   */
  async sendPayment(params: PaymentParams): Promise<string> {
    const chainInstance = getChain(
      params.chain,
      this.keyManager.derivePrivateKey(params.chain)
    );
    await chainInstance.connect();
    return await chainInstance.sendTransaction(params);
  }

  /**
   * Sign a message
   * @param message - The message to sign
   * @param chain - The chain to sign with
   */
  async signMessage(message: string, chain: Chain): Promise<string> {
    const chainInstance = getChain(chain, this.keyManager.derivePrivateKey(chain));
    await chainInstance.connect();
    return await chainInstance.signMessage(message);
  }

  /**
   * Export the mnemonic (handle with care!)
   */
  exportMnemonic(): string {
    return this.keyManager.getMnemonic();
  }

  /**
   * Export all private keys (for backup only)
   */
  exportPrivateKeys(): Record<Chain, string> {
    return this.keyManager.exportPrivateKeys();
  }

  /**
   * Get wallet info
   */
  getInfo() {
    return {
      mnemonic: this.config.mnemonic ? '***configured***' : '***auto-generated***',
    };
  }
}

/**
 * Create a new wallet
 * @param mnemonic - Optional mnemonic phrase
 */
export function createWallet(mnemonic?: string): ClawCashWallet {
  return new ClawCashWallet({ mnemonic });
}

/**
 * Import a wallet from mnemonic
 * @param mnemonic - BIP39 mnemonic phrase
 */
export function importWallet(mnemonic: string): ClawCashWallet {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }
  return new ClawCashWallet({ mnemonic });
}
