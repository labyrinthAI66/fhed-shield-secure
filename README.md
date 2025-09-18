# FHE Shield Secure

A secure financial assessment platform built with Fully Homomorphic Encryption (FHE) technology, providing privacy-preserving underwriting and risk analysis.

## Features

- **FHE-Encrypted Data Processing**: All sensitive financial data is encrypted using Zama's FHE technology
- **Secure Risk Assessment**: Privacy-preserving underwriting without exposing raw data
- **Web3 Integration**: Built-in wallet connection with RainbowKit
- **Real-time Analytics**: Comprehensive dashboard for risk analysis
- **Multi-chain Support**: Compatible with Ethereum Sepolia testnet

## Technologies

This project is built with:

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Web3**: RainbowKit, Wagmi, Viem
- **FHE**: Zama FHE Oracle Solidity
- **Blockchain**: Ethereum Sepolia

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/labyrinthAI66/fhed-shield-secure.git

# Navigate to the project directory
cd fhed-shield-secure

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

## Smart Contract

The project includes FHE-enabled smart contracts for secure data processing:

- **FHE Oracle Integration**: Uses Zama's FHE oracle for encrypted computations
- **Privacy-Preserving Operations**: All sensitive calculations performed on encrypted data
- **Gas-Efficient**: Optimized for minimal transaction costs

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Security

This project implements state-of-the-art FHE technology to ensure maximum privacy and security for financial data processing. All sensitive operations are performed on encrypted data without decryption.
