# ClawCash

> TypeScript cryptocurrency wallet library for AI agents in the openclaw ecosystem

ClawCash is a simple, secure, multi-chain wallet library designed specifically for AI agents. It enables agents to:

- Create and manage multi-chain wallet addresses
- Send and receive cryptocurrency payments
- Query balances across multiple blockchains
- Sign messages and transactions

## Features

- **Multi-chain support**: Ethereum, Polygon, BSC, Arbitrum, Bitcoin (coming soon)
- **Simple API**: Designed for AI agents with intuitive function names
- **Secure**: BIP39/BIP32 key derivation, private key encryption
- **TypeScript**: Full type safety and excellent IDE support
- **Agent-friendly**: Clear error messages and simplified interfaces

## Installation

```bash
npm install clawcash
```

## Quick Start

### Create a New Wallet

```typescript
import { createWallet } from 'clawcash';

// Create a new wallet (generates mnemonic automatically)
const wallet = createWallet();

// Get addresses for all supported chains
const addresses = await wallet.getAddresses();
console.log(addresses);
// {
//   ethereum: '0x...',
//   polygon: '0x...',
//   bsc: '0x...',
//   arbitrum: '0x...',
//   bitcoin: 'bc1...'
// }
```

### Import Existing Wallet

```typescript
import { importWallet } from 'clawcash';

const mnemonic = 'your twelve word mnemonic phrase here';
const wallet = importWallet(mnemonic);
```

### Check Balance

```typescript
// Check native token balance
const balance = await wallet.getBalance('ethereum');
console.log(balance);
// { amount: 1000000000000000000n, formatted: '1.0', symbol: 'ETH', decimals: 18 }
```

### Send Payment

```typescript
import { quickSend } from 'clawcash';

// Quick send on Ethereum
const txHash = await quickSend(
  wallet,
  'ethereum',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  '0.1'  // amount in ETH
);
console.log('Transaction hash:', txHash);
```

### Estimate Fees

```typescript
const fee = await wallet.estimateFee({
  chain: 'ethereum',
  from: '0x...',
  to: '0x...',
  amount: '0.1',
  token: 'ETH'
});
console.log(`Estimated fee: ${fee.formatted} ETH`);
```

## API Reference

### Wallet Operations

| Function | Description |
|----------|-------------|
| `createWallet(mnemonic?)` | Create new or import wallet |
| `importWallet(mnemonic)` | Import wallet from mnemonic |
| `wallet.getAddresses()` | Get all chain addresses |
| `wallet.getBalance(chain)` | Get balance for chain |
| `wallet.sendPayment(params)` | Send payment |
| `wallet.estimateFee(params)` | Estimate transaction fee |
| `wallet.signMessage(msg, chain)` | Sign a message |

### Supported Chains

| Chain | Symbol | Status |
|-------|--------|--------|
| Ethereum | ETH | ✅ Implemented |
| Polygon | MATIC | ✅ Implemented |
| BSC | BNB | ✅ Implemented |
| Arbitrum | ETH | ✅ Implemented |
| Bitcoin | BTC | 🚧 Coming soon |

### Supported Tokens

- Native tokens: ETH, MATIC, BNB
- ERC-20 tokens: USDT, USDC (coming soon)

## Advanced Usage

### Custom RPC URLs

```typescript
const wallet = createWallet({
  rpcUrls: {
    ethereum: 'https://your-custom-rpc-url.com'
  }
});
```

### Export Mnemonic (Handle with Care!)

```typescript
const mnemonic = wallet.exportMnemonic();
console.log('Keep this safe:', mnemonic);
```

## Security

- Never log or expose private keys or mnemonics
- Always validate addresses before sending
- Use environment variables for RPC URLs
- Implement rate limiting for production use

## License

MIT License - see [LICENSE](LICENSE) for details.

## OpenClaw Ecosystem

ClawCash is part of the [OpenClaw](https://github.com/openclaw) ecosystem of tools for AI agents.
