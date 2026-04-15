import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Wallet } from 'lucide-react'

export default function WalletButton() {
  return (
    <div className="wallet-btn-wrapper">
      <WalletMultiButton
        startIcon={<Wallet className="w-4 h-4" />}
      />
    </div>
  )
}
