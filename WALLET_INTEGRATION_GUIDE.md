# MetaMask Wallet Connect Integration Guide

## Implementation Complete ✅

The MetaMask wallet connect flow has been fully implemented based on the technical specification. Here's what's been created:

## File Structure

```
src/
├── hooks/
│   └── useWallet.ts                          # Main wallet logic hook
├── utils/
│   ├── metamask.ts                           # MetaMask provider utilities
│   ├── explorer.ts                           # Block explorer URL helpers
│   ├── storage.ts                            # localStorage wrapper
│   └── chains.ts                             # Chain validation & support
├── components/
│   └── WalletConnect/
│       ├── WalletConnectButton.tsx           # Initial connect button
│       ├── WalletDropdown.tsx                # Post-connection dropdown
│       └── index.ts                          # Barrel export
├── context/
│   └── GlobalContext.tsx                     # Global state with wallet context
```

## Quick Start

### 1. Basic Usage

In any component, import and use the wallet components:

```tsx
import { WalletConnectButton } from "@/components/WalletConnect";
import { WalletDropdown } from "@/components/WalletConnect";
import { useGlobalContext } from "@/context/GlobalContext";

export function Header() {
  const { account } = useGlobalContext();

  return (
    <div className="flex items-center gap-2">
      {!account ? (
        <WalletConnectButton />
      ) : (
        <WalletDropdown />
      )}
    </div>
  );
}
```

### 2. Manual Wallet Control

Access wallet functions via the global context:

```tsx
import { useGlobalContext } from "@/context/GlobalContext";

export function MyComponent() {
  const {
    account,
    chainId,
    isConnecting,
    walletError,
    isMetaMaskAvailable,
    connectWallet,
    disconnectWallet,
    resetWalletError,
    formatAccount,
  } = useGlobalContext();

  if (walletError) {
    return <div className="text-red-500">{walletError}</div>;
  }

  if (!isMetaMaskAvailable) {
    return <div>MetaMask not installed</div>;
  }

  return (
    <div>
      {account ? (
        <div>
          Connected: {formatAccount(account)}
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect"}
        </button>
      )}
    </div>
  );
}
```

## Features Implemented

### ✅ Pre-Connection State
- **MetaMask Detection**: Automatically detects if MetaMask is installed
- **Connect Button**: Shows "Install MetaMask" if not installed, "Connect Wallet" if available
- **Loading State**: Displays spinner and "Connecting..." during connection
- **Error Handling**: Shows user-friendly error messages for rejected connections

### ✅ Post-Connection State
- **Wallet Dropdown**: Displays shortened wallet address (0x1A2b...c3dE format)
- **Copy Address**: One-click copy to clipboard with toast notification
- **View on Explorer**: Opens Etherscan or chain-specific explorer
- **Disconnect**: Safely disconnects wallet and clears session

### ✅ Persistence
- **Auto-Restore**: On page refresh, automatically restores wallet connection if still connected
- **localStorage**: Stores wallet address, chain ID, and connection status
- **Verification**: Verifies connection is still valid via eth_accounts RPC call

### ✅ Event Listeners
- **accountsChanged**: Handles user switching accounts in MetaMask
- **chainChanged**: Detects and updates chain ID when user switches networks
- **disconnect**: Clears session when MetaMask is disconnected
- **Cleanup**: Properly removes listeners on component unmount

### ✅ UI/UX
- **Dark Mode Support**: Automatic light/dark theme via Tailwind
- **Smooth Animations**: Dropdown animations via Radix UI
- **Icons**: Professional icons from lucide-react
- **Toast Notifications**: User feedback via sonner
- **Responsive**: Mobile-friendly components

## Utility Functions

### metamask.ts
```tsx
isMetaMaskInstalled()           // Check if MetaMask is installed
getMetaMaskDeepLink()           // Get mobile deep link
getMetaMaskDownloadUrl()        // Get download page URL
requestAccounts()               // Request user accounts
getCurrentChainId()             // Get current chain ID
getCurrentAccounts()            // Get all connected accounts
switchNetwork(chainId)          // Switch to different chain
```

### explorer.ts
```tsx
getExplorerUrl(chainId, address)    // Get explorer URL for address
openExplorer(chainId, address)      // Open explorer in new tab
```

### storage.ts
```tsx
getStoredWallet()               // Get stored wallet data
storeWallet(address, chainId)   // Store wallet data
clearWalletStorage()            // Clear wallet data
```

### chains.ts
```tsx
isChainSupported(chainId)       // Check if chain is supported
getChainName(chainId)           // Get chain name (e.g., "Ethereum")
getChainSymbol(chainId)         // Get chain symbol (e.g., "ETH")
validateChain(chainId)          // Validate chain with message
```

## Supported Chains

Currently supports:
- `0x1` - Ethereum Mainnet
- `0x89` - Polygon
- `0xa` - Optimism
- `0x2105` - Base
- `0xa4b1` - Arbitrum One

Add more chains by updating `SUPPORTED_CHAINS` in `src/utils/chains.ts`:

```tsx
export const SUPPORTED_CHAINS = {
  "0x1": { name: "Ethereum", symbol: "ETH" },
  "0x89": { name: "Polygon", symbol: "MATIC" },
  // Add new chains here...
};
```

## Error Handling

All errors are caught and user-friendly messages are displayed:

```
"MetaMask is not available in this browser."
"Connection request was rejected."
"Failed to connect to MetaMask."
"No accounts found in MetaMask."
```

Access error state:
```tsx
const { walletError, resetWalletError } = useGlobalContext();

if (walletError) {
  return <div>{walletError}</div>;
}
```

## LocalStorage Schema

The wallet state is persisted in localStorage:

```javascript
localStorage.getItem("walletAddress")    // User's wallet address
localStorage.getItem("chainId")          // Connected chain ID (hex)
localStorage.getItem("walletConnected")  // Connection status ("true"/"false")
```

## Flow Summary

```
1. User clicks "Connect Wallet"
   ↓
2. MetaMask modal appears for user to approve
   ↓
3. Wallet address + chain ID retrieved
   ↓
4. Data stored in localStorage
   ↓
5. UI updates: "Connect Wallet" → Dropdown with address
   ↓
6. Event listeners start monitoring for changes
   ↓
7. On page refresh: Auto-restore connection (if still valid)
   ↓
8. On account/chain change: Update automatically
   ↓
9. On disconnect: Clear storage, return to "Connect Wallet"
```

## Testing the Integration

### Test 1: Initial Connection
1. Navigate to your app
2. Click "Connect Wallet"
3. Approve in MetaMask
4. Verify dropdown appears with your address

### Test 2: Page Refresh
1. Connected wallet in dropdown
2. Refresh page (F5)
3. Verify wallet is automatically restored

### Test 3: Account Switch
1. Connected wallet in dropdown
2. Switch account in MetaMask
3. Verify dropdown updates with new address

### Test 4: Chain Switch
1. Connected wallet in dropdown
2. Switch network in MetaMask
3. Verify chain ID updates silently

### Test 5: Disconnect
1. Click dropdown → Disconnect
2. Verify UI returns to "Connect Wallet"
3. Verify localStorage is cleared

### Test 6: MetaMask Disconnect
1. In MetaMask browser extension, click menu
2. "Disconnect from [site]"
3. Verify UI returns to "Connect Wallet"

## Troubleshooting

### Issue: "MetaMask not available" error
**Solution**: Install MetaMask extension or use MetaMask mobile browser

### Issue: Wallet doesn't persist after refresh
**Solution**: Check that localStorage is enabled in browser. Verify ethereum.isMetaMask is true.

### Issue: Dropdown shows wrong address format
**Solution**: The `formatAccount` function displays first 6 + last 4 characters. Full address is shown in dropdown.

### Issue: Account change not detected
**Solution**: Verify `accountsChanged` event listener is registered. Check browser console for errors.

## Next Steps (Optional Enhancements)

### 1. Network Switching
Prompt users to switch to a specific chain:
```tsx
import { switchNetwork } from "@/utils/metamask";

await switchNetwork("0x1"); // Switch to Ethereum
```

### 2. Chain Validation
Validate user is on the correct chain:
```tsx
import { validateChain } from "@/utils/chains";

const validation = validateChain(chainId);
if (!validation.isValid) {
  // Prompt user to switch network
}
```

### 3. Connection Timeout
Add timeout for connection requests:
```tsx
const timeout = 30000; // 30 seconds
Promise.race([requestAccounts(), timeoutPromise]);
```

### 4. Transaction Signing
Add functions to sign transactions and messages:
```tsx
const signature = await window.ethereum.request({
  method: "personal_sign",
  params: [message, account],
});
```

## API Reference

### useWallet Hook

```tsx
interface WalletState {
  account: string | null;          // Connected wallet address
  chainId: string | null;          // Current chain ID (hex)
  isConnecting: boolean;           // Connection in progress
  walletError: string | null;      // Error message
  isMetaMaskAvailable: boolean;    // MetaMask installed
  formatAccount: (address) => string;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  resetWalletError: () => void;
}

const wallet = useWallet();
```

### Global Context

```tsx
interface GlobalContextType {
  account: string | null;
  chainId: string | null;
  isConnecting: boolean;
  walletError: string | null;
  isMetaMaskAvailable: boolean;
  formatAccount: (address) => string;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  resetWalletError: () => void;
  // ... other context values
}

const context = useGlobalContext();
```

## Security Notes

✅ **Implemented:**
- No private keys handled in frontend
- localStorage only stores public address (not sensitive data)
- All requests go through MetaMask's secure provider
- Event listeners properly cleaned up

⚠️ **Best Practices:**
- Never log wallet addresses or chain IDs
- Always validate user input before sending transactions
- Use HTTPS in production
- Implement rate limiting on API calls

---

## Summary

The complete MetaMask wallet connect flow is now ready to use. The implementation covers:

✅ Connection lifecycle (detect → connect → store → persist)  
✅ Dropdown UI with all required actions  
✅ Event handling for account/chain changes  
✅ Error handling and user feedback  
✅ Dark mode support  
✅ Mobile-friendly responsive design  
✅ Utilities for common operations  

**Flow:** `Connect → Verify → Store → Refresh Persist → Dropdown (Copy / Explorer / Disconnect) → Clear on Logout`
