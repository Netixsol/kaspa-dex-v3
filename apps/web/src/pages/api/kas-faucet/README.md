# KAS Faucet System

A comprehensive faucet system for distributing KAS tokens on the testnet. This system provides a secure, rate-limited, and user-friendly way to distribute tokens directly from a wallet without requiring smart contracts.

## Features

- ✅ **Direct Wallet Transfers**: Sends KAS directly from your wallet using Viem
- ✅ **Rate Limiting**: Prevents abuse with 24-hour cooldowns and request limits
- ✅ **Queue Management**: Handles high demand with automatic pausing
- ✅ **Real-time Status**: Shows queue status, cooldowns, and claim history
- ✅ **Admin Controls**: Pause/unpause, cleanup, and monitoring tools
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Responsive UI**: Beautiful, modern interface with timers and progress bars
- ✅ **Bot Protection**: hCaptcha integration to prevent automated abuse

## API Endpoints

### Public Endpoints

- `POST /api/kas-faucet/claim` - Submit a claim request (with optional captcha)
- `GET /api/kas-faucet/status?address=0x...` - Get claim status for an address
- `GET /api/kas-faucet/queue` - Get current queue status

### Admin Endpoint

- `POST /api/kas-faucet/admin` - Admin operations (pause, unpause, cleanup, status)

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required: Private key for the faucet wallet
FAUCET_PRIVATE_KEY=0x...

# Optional: Admin key for management (change in production!)
FAUCET_ADMIN_KEY=your-secure-admin-key-here

# Optional: Custom RPC URL
KAS_RPC_URL=https://rpc.kasplextest.xyz

# hCaptcha Configuration (recommended for production)
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
```

### 2. hCaptcha Setup (Optional but Recommended)

**For Production:**
1. Sign up at https://www.hcaptcha.com/
2. Create a new site and add your production domain (e.g., `yourdomain.com`)
3. Get your site key and secret key
4. Replace the test keys in your production environment variables

**For Development (localhost):**
- **Important**: You CANNOT add `localhost`, `127.0.0.1`, or local development domains to hCaptcha production sites
- The `.env.example` is pre-configured with hCaptcha's official test keys that work on localhost:
  - Site Key: `10000000-ffff-ffff-ffff-000000000001`
  - Secret Key: `0x0000000000000000000000000000000000000000`
- These test keys always return successful verification and work on any domain
- The frontend will show a green "Development Mode" indicator when using test keys

**Troubleshooting hCaptcha on localhost:**
- If hCaptcha widget doesn't load: Check browser console for errors
- If you see "Invalid site key": Make sure you're using the test keys for development
- If widget shows but verification fails: Check the backend secret key configuration
- For production: Ensure your domain is added to your hCaptcha site configuration

**Note**: If hCaptcha is not configured or fails, the faucet will operate without captcha verification (useful for development).

### 3. Wallet Setup

1. Create a wallet with KAS tokens on the testnet
2. Add the private key to `FAUCET_PRIVATE_KEY`
3. Ensure the wallet has sufficient KAS for distribution

### 4. Directory Structure

The faucet creates a data directory structure:
```
apps/web/data/
└── kas-faucet.json  # Stores claims, queue, and system status
```

## Configuration

The faucet is configured in `utils.ts`:

```typescript
export const FAUCET_CONFIG = {
  AMOUNT: '50', // KAS tokens per claim
  COOLDOWN_HOURS: 24, // Hours between claims
  QUEUE_CAPACITY: 30, // Max queue size before auto-pause
  RATE_LIMIT_WINDOW: 10 * 60 * 1000, // 10 minutes
  RATE_LIMIT_REQUESTS: 5, // Max requests per window
  PAUSE_DURATION: 10 * 60 * 1000, // Auto-pause duration
  // ... other configs
}
```

## API Usage Examples

### Claim Tokens

```bash
# Basic claim request
curl -X POST /api/kas-faucet/claim \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x1234567890123456789012345678901234567890"}'

# Claim request with captcha token
curl -X POST /api/kas-faucet/claim \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "captchaToken": "hcaptcha-response-token"
  }'
```

### Check Claim Status

```bash
curl -X GET "/api/kas-faucet/status?address=0x1234567890123456789012345678901234567890"
```

### Get Queue Status

```bash
curl -X GET "/api/kas-faucet/queue"
```

## Usage

### For Users

1. Enter a valid Ethereum address (42 characters, starts with 0x)
2. Complete the hCaptcha verification (if configured)
3. Click "Claim 50 KAS"
4. Wait for transaction confirmation
5. Must wait 24 hours before next claim

### For Administrators

Use the admin API to manage the faucet:

```bash
# Get faucet status
curl -X POST /api/kas-faucet/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "status", "adminKey": "your-admin-key"}'

# Pause faucet for 30 minutes
curl -X POST /api/kas-faucet/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "pause", "adminKey": "your-admin-key", "duration": 30}'

# Unpause faucet
curl -X POST /api/kas-faucet/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "unpause", "adminKey": "your-admin-key"}'

# Reset queue
curl -X POST /api/kas-faucet/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "reset_queue", "adminKey": "your-admin-key"}'

# Cleanup old data
curl -X POST /api/kas-faucet/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "cleanup", "adminKey": "your-admin-key"}'
```

## Security Features

- **Bot Protection**: hCaptcha integration to prevent automated abuse
- **Rate Limiting**: 5 requests per 10 minutes per address
- **Cooldown Period**: 24 hours between successful claims
- **Admin Authentication**: Secure admin key for management
- **Input Validation**: Comprehensive address validation
- **Error Handling**: Detailed error messages and logging
- **Direct Wallet Transfer**: No smart contract vulnerabilities

## Monitoring

The system tracks:
- Total claims (pending, completed, failed)
- Queue size and capacity
- Rate limit violations
- System pause status
- Faucet wallet balance

## Troubleshooting

### Common Issues

1. **"FAUCET_PRIVATE_KEY not found"**
   - Set the environment variable in `.env.local`

2. **"Insufficient funds"**
   - Add more KAS to the faucet wallet

3. **"Rate limited"**
   - Users must wait 10 minutes between requests

4. **"Address in cooldown"**
   - Users must wait 24 hours between successful claims

5. **"Queue is full"**
   - Faucet auto-pauses when queue reaches capacity
   - Use admin API to reset queue or wait for auto-unpause

6. **hCaptcha/Sentry Conflict Error**
   - Error: `qe.setPropagationContext is not a function`
   - This is a known conflict between hCaptcha and Sentry
   - The app includes fallback handling and Sentry error filtering
   - Users can bypass captcha if it fails to load
   - Solution: Update Sentry configuration to ignore hCaptcha errors

7. **Captcha Not Loading**
   - Check `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set correctly
   - Verify hCaptcha domain configuration
   - Use the bypass option if captcha fails to load