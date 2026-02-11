/**
 * Public Payment API
 * Simple, agent-friendly functions for payments
 */

import type { ClawCashWallet } from '../core/wallet.js';
import type { PaymentParams, FeeEstimate } from '../core/types.js';

/**
 * Send a payment
 * @param wallet - The wallet instance
 * @param params - Payment parameters
 * @returns Transaction hash
 */
export async function sendPaymentAPI(
  wallet: ClawCashWallet,
  params: PaymentParams
): Promise<string> {
  return await wallet.sendPayment(params);
}

/**
 * Estimate transaction fee
 * @param wallet - The wallet instance
 * @param params - Payment parameters
 * @returns Fee estimate
 */
export async function estimateFeesAPI(
  wallet: ClawCashWallet,
  params: PaymentParams
): Promise<FeeEstimate> {
  return await wallet.estimateFee(params);
}

/**
 * Quick payment - simplified interface
 * @param wallet - The wallet instance
 * @param chain - The blockchain network
 * @param to - Recipient address
 * @param amount - Amount to send (as decimal string)
 * @param token - Token symbol (defaults to native)
 */
export async function quickSend(
  wallet: ClawCashWallet,
  chain: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum',
  to: string,
  amount: string,
  token: 'ETH' | 'MATIC' | 'BNB' = 'ETH'
): Promise<string> {
  // Get sender address first
  const addresses = await wallet.getAddresses();
  const from = addresses[chain];

  return await wallet.sendPayment({
    chain,
    from,
    to,
    amount,
    token,
  });
}
