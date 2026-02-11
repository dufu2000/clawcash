/**
 * Ethereum chain implementation using ethers.js v6
 */

import { ethers } from 'ethers';
import { BaseChain } from '../base.js';
import type { Balance, PaymentParams, FeeEstimate, TokenSymbol } from '../../core/types.js';

// Default RPC endpoints
const DEFAULT_RPCS = {
  ethereum: 'https://eth.llamarpc.com',
  polygon: 'https://polygon-rpc.com',
  bsc: 'https://bsc-dataseed.binance.org',
  arbitrum: 'https://arbitrum-one.publicnode.com',
};

// Chain IDs
const CHAIN_IDS = {
  ethereum: 1,
  polygon: 137,
  bsc: 56,
  arbitrum: 42161,
};

/**
 * Ethereum chain implementation
 */
export class EthereumChain extends BaseChain {
  private privateKey: string;
  private wallet: ethers.Wallet;
  private provider: ethers.JsonRpcProvider;

  constructor(
    chain: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum',
    privateKey: string,
    rpcUrl?: string
  ) {
    const config = {
      chainId: CHAIN_IDS[chain].toString(),
      name: chain.charAt(0).toUpperCase() + chain.slice(1),
      rpcUrl: rpcUrl || DEFAULT_RPCS[chain],
      explorerUrl: {
        ethereum: 'https://etherscan.io',
        polygon: 'https://polygonscan.com',
        bsc: 'https://bscscan.com',
        arbitrum: 'https://arbiscan.io',
      }[chain],
    };

    super(config.chainId, config.name, config.rpcUrl, config.explorerUrl);
    this.privateKey = privateKey;
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
  }

  /**
   * Connect to the chain
   */
  async connect(): Promise<void> {
    try {
      await this.provider.getNetwork();
    } catch (error) {
      throw new Error(`Failed to connect to ${this.name}: ${error}`);
    }
  }

  /**
   * Disconnect from the chain
   */
  disconnect(): void {
    // No explicit disconnect needed for JSON-RPC provider
  }

  /**
   * Get the wallet address
   */
  getAddress(): string {
    return this.wallet.address;
  }

  /**
   * Validate an Ethereum address
   */
  validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Get balance (native or ERC-20 token)
   */
  async getBalance(tokenAddress?: string): Promise<Balance> {
    let amount: bigint;
    let decimals: number;
    let symbol: TokenSymbol;

    if (!tokenAddress) {
      // Native token balance
      amount = await this.provider.getBalance(this.wallet.address);
      decimals = 18;
      symbol = this.name === 'Polygon' ? 'MATIC' : this.name === 'Bsc' ? 'BNB' : 'ETH';
    } else {
      // ERC-20 token balance
      const erc20Abi = [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
      ];
      const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);

      const [balanceAmount, tokenDecimals, tokenSymbol] = await Promise.all([
        contract.balanceOf(this.wallet.address),
        contract.decimals(),
        contract.symbol(),
      ]);

      amount = balanceAmount;
      decimals = Number(tokenDecimals);
      symbol = tokenSymbol as TokenSymbol;
    }

    const formatted = ethers.formatUnits(amount, decimals);

    return {
      amount,
      formatted,
      symbol,
      decimals,
    };
  }

  /**
   * Estimate transaction fee
   */
  async estimateFee(params: PaymentParams): Promise<FeeEstimate> {
    const { to, amount, token } = params;

    let gasLimit: bigint;
    let gasPrice: bigint;

    if (token === 'ETH' || token === 'MATIC' || token === 'BNB') {
      // Native transfer
      gasLimit = 21000n; // Standard ETH transfer
    } else {
      // ERC-20 transfer
      const erc20Abi = ['function transfer(address,uint256) returns (bool)'];
      const contract = new ethers.Contract(to, erc20Abi, this.wallet);
      const parsedAmount = ethers.parseUnits(amount, 18); // Assuming 18 decimals
      gasLimit = await contract.transfer.estimateGas(to, parsedAmount);
    }

    const feeData = await this.provider.getFeeData();
    gasPrice = feeData.gasPrice || 0n;

    const gasFee = gasLimit * gasPrice;
    const formatted = ethers.formatEther(gasFee);

    return {
      gasFee,
      gasPrice,
      gasLimit,
      formatted,
    };
  }

  /**
   * Send a transaction
   */
  async sendTransaction(params: PaymentParams): Promise<string> {
    const { to, amount, token } = params;

    if (token === 'ETH' || token === 'MATIC' || token === 'BNB') {
      // Native transfer
      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });
      return tx.hash;
    } else {
      // ERC-20 transfer (simplified, needs token address)
      throw new Error('ERC-20 transfers require token address configuration');
    }
  }

  /**
   * Sign a message
   */
  async signMessage(message: string): Promise<string> {
    return await this.wallet.signMessage(message);
  }
}

/**
 * Factory function for Ethereum chains
 */
export function ethereumFactory(chain: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum') {
  return (privateKey: string, rpcUrl?: string) => new EthereumChain(chain, privateKey, rpcUrl);
}
