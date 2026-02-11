/**
 * Public Wallet API
 * Simple, agent-friendly functions for wallet operations
 */

import { ClawCashWallet, importWallet } from '../core/wallet.js';
import type { WalletConfig, WalletAddresses, Chain, Balance, TokenSymbol } from '../core/types.js';

/**
 * Create a new wallet
 * @param config - Optional wallet configuration
 * @returns Wallet addresses for all supported chains
 */
export async function createWalletAPI(config?: WalletConfig): Promise<{
  wallet: ClawCashWallet;
  addresses: WalletAddresses;
}> {
  const wallet = new ClawCashWallet(config);
  const addresses = await wallet.getAddresses();
  return { wallet, addresses };
}

/**
 * Import a wallet from mnemonic
 * @param mnemonic - BIP39 mnemonic phrase
 * @returns Wallet addresses for all supported chains
 */
export async function importWalletAPI(mnemonic: string): Promise<{
  wallet: ClawCashWallet;
  addresses: WalletAddresses;
}> {
  const wallet = importWallet(mnemonic);
  const addresses = await wallet.getAddresses();
  return { wallet, addresses };
}

/**
 * Get wallet balance
 * @param wallet - The wallet instance
 * @param chain - The blockchain network
 * @param token - Optional token symbol
 */
export async function getBalanceAPI(
  wallet: ClawCashWallet,
  chain: Chain,
  token?: TokenSymbol
): Promise<Balance> {
  return await wallet.getBalance(chain, token);
}

/**
 * Export wallet mnemonic (use carefully!)
 * @param wallet - The wallet instance
 */
export function exportMnemonicAPI(wallet: ClawCashWallet): string {
  return wallet.exportMnemonic();
}
