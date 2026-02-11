/**
 * Basic usage example for ClawCash wallet
 */

import { createWallet } from 'clawcash';

async function main() {
  console.log('=== ClawCash Basic Usage Example ===\n');

  // Create a new wallet
  console.log('1. Creating new wallet...');
  const wallet = createWallet();

  // Get addresses for all chains
  console.log('2. Getting addresses for all chains...');
  const addresses = await wallet.getAddresses();
  console.log('   Ethereum:', addresses.ethereum);
  console.log('   Polygon:', addresses.polygon);
  console.log('   BSC:', addresses.bsc);
  console.log('   Arbitrum:', addresses.arbitrum);
  console.log('   Bitcoin:', addresses.bitcoin);

  // Get mnemonic (save this!)
  console.log('\n3. Your mnemonic (save this safely):');
  console.log('   ', wallet.exportMnemonic());

  // Check balance
  console.log('\n4. Checking Ethereum balance...');
  try {
    const balance = await wallet.getBalance('ethereum');
    console.log('   Balance:', balance.formatted, balance.symbol);
  } catch (error) {
    console.log('   (RPC may be rate limited)');
  }

  // Estimate fee
  console.log('\n5. Estimating transaction fee...');
  try {
    const fee = await wallet.estimateFee({
      chain: 'ethereum',
      from: addresses.ethereum,
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      amount: '0.001',
      token: 'ETH'
    });
    console.log('   Estimated fee:', fee.formatted, 'ETH');
  } catch (error) {
    console.log('   (RPC may be rate limited)');
  }

  console.log('\n=== Example Complete ===');
  console.log('\nIMPORTANT: Save your mnemonic phrase securely!');
  console.log('Anyone with access to it can control your wallet.');
}

main().catch(console.error);
