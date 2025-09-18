# Vercel Deployment Guide for FHE Shield Secure

## Prerequisites

1. Vercel account (free tier available)
2. GitHub repository access
3. Environment variables ready

## Step-by-Step Deployment Instructions

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import the repository: `labyrinthAI66/fhed-shield-secure`

### Step 2: Configure Build Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (./)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Environment Variables

Add the following environment variables in Vercel dashboard:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

**How to add environment variables:**
1. Go to Project Settings → Environment Variables
2. Add each variable with its value
3. Make sure to set them for "Production", "Preview", and "Development"

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Your app will be available at the provided Vercel URL

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to be issued

## Post-Deployment Configuration

### Smart Contract Deployment

1. **Deploy to Sepolia Testnet:**
   ```bash
   # Install dependencies
   npm install
   
   # Deploy contract
   npx hardhat run contracts/deploy.js --network sepolia
   ```

2. **Update Contract Address:**
   - Copy the deployed contract address
   - Update `CONTRACT_ADDRESS` in `src/hooks/useContract.ts`
   - Commit and push changes

### Environment Variables Verification

Verify all environment variables are correctly set:
- `NEXT_PUBLIC_CHAIN_ID`: Should be 11155111 for Sepolia
- `NEXT_PUBLIC_RPC_URL`: Should point to Sepolia RPC
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
- `NEXT_PUBLIC_INFURA_API_KEY`: Your Infura API key

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check if all dependencies are in package.json
   - Verify TypeScript compilation
   - Check for missing environment variables

2. **Wallet Connection Issues:**
   - Verify WalletConnect Project ID
   - Check RPC URL configuration
   - Ensure network is set to Sepolia

3. **Contract Interaction Issues:**
   - Verify contract is deployed
   - Check contract address in code
   - Ensure user has Sepolia ETH for transactions

### Performance Optimization

1. **Enable Vercel Analytics:**
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Configure Caching:**
   - Add `vercel.json` for custom caching rules
   - Optimize static assets

## Monitoring and Maintenance

### Health Checks

1. **Regular Monitoring:**
   - Check Vercel dashboard for deployment status
   - Monitor function execution times
   - Watch for error rates

2. **Updates:**
   - Push changes to main branch for automatic deployment
   - Test on preview deployments first
   - Monitor for breaking changes

### Security Considerations

1. **Environment Variables:**
   - Never commit sensitive keys to repository
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **Smart Contract Security:**
   - Audit contract code before mainnet deployment
   - Test thoroughly on testnets
   - Implement proper access controls

## Support

For issues related to:
- **Vercel Deployment**: Check Vercel documentation
- **Smart Contracts**: Review Hardhat documentation
- **Web3 Integration**: Check Wagmi/RainbowKit docs
- **FHE Implementation**: Refer to Zama documentation

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Zama FHE Documentation](https://docs.zama.ai)
