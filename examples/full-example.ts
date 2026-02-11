/**
 * Full usage example for ClawCash wallet
 * Demonstrates all available features
 */

import {
  createWallet,
  importWallet,
  quickSend,
  createTradingManager,
  createBalanceManager,
} from 'clawcash';

async function main() {
  console.log('=== ClawCash Full Example ===\n');

  // ============================================================
  // 1. Wallet Creation
  // ============================================================
  console.log('1. Creating new wallet...');
  const wallet = createWallet();

  const addresses = await wallet.getAddresses();
  console.log('   Addresses:');
  console.log('     Ethereum:', addresses.ethereum);
  console.log('     Polygon:', addresses.polygon);
  console.log('     BSC:', addresses.bsc);
  console.log('     Arbitrum:', addresses.arbitrum);
  console.log('     Bitcoin:', addresses.bitcoin);

  // Save mnemonic!
  console.log('\n   ⚠️  SAVE THIS MNEMONIC:');
  console.log('   ', wallet.exportMnemonic());

  // ============================================================
  // 2. Import Existing Wallet
  // ============================================================
  console.log('\n2. Importing existing wallet...');
  const mnemonic = wallet.exportMnemonic();
  const importedWallet = importWallet(mnemonic);
  console.log('   ✓ Wallet imported successfully');

  // ============================================================
  // 3. Balance Management
  // ============================================================
  console.log('\n3. Checking balances...');
  const balanceManager = createBalanceManager(wallet);

  const allBalances = await balanceManager.getAllBalances();
  for (const summary of allBalances) {
    console.log(`   ${summary.chain}:`);
    if (summary.balances.length > 0) {
      for (const bal of summary.balances) {
        console.log(`     ${bal.symbol}: ${bal.formatted}`);
      }
    } else {
      console.log('     (no balance or RPC error)');
    }
  }

  // ============================================================
  // 4. Trading (Exchange Operations)
  // ============================================================
  console.log('\n4. Trading operations...');
  const tradingManager = createTradingManager();

  // Add Binance exchange (requires API keys)
  // tradingManager.addExchange('binance', {
  //   apiKey: 'your-api-key',
  //   apiSecret: 'your-api-secret',
  //   sandbox: true, // Use testnet
  // });

  // For demo, show what markets are available (without API keys)
  console.log('   To enable trading:');
  console.log('   1. Get API keys from your exchange');
  console.log('   2. Add exchange with tradingManager.addExchange()');
  console.log('   3. Connect with tradingManager.connect()');

  // ============================================================
  // 5. Token Registry
  // ============================================================
  console.log('\n5. Token information...');
  import {
    getTokenAddress,
    hasToken,
    getTokensForChain,
  } from 'clawcash';

  console.log('   USDT on Polygon:', getTokenAddress('USDT', 'polygon'));
  console.log('   USDC on Ethereum:', getTokenAddress('USDC', 'ethereum'));
  console.log('   Tokens on BSC:', getTokensForChain('bsc'));

  // ============================================================
  // 6. Quick Send (Example)
  // ============================================================
  console.log('\n6. Quick send example...');
  console.log('   To send 0.01 ETH:');
  console.log('   const txHash = await quickSend(');
  console.log('     wallet,');
  console.log('     "ethereum",');
  console.log('     "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",');
  console.log('     "0.01"');
  console.log('   );');

  console.log('\n=== Example Complete ===');
}

main().catch(console.error);
