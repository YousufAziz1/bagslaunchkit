import { useState, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import confetti from 'canvas-confetti'
import { BagsClient } from '../lib/bags-sdk-mock.js'
import {
  Rocket, Wallet, ExternalLink, Twitter,
  CheckCircle, ArrowLeft, X, ImageIcon
} from 'lucide-react'

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ txHash, tokenName, launchTweet, onReset }) {
  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(launchTweet)}`,
      '_blank'
    )
  }

  return (
    <div className="animate-in text-center max-w-lg mx-auto py-8">
      {/* Glow ring */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full bg-green-400/20 blur-2xl animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center relative z-10">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
      </div>

      <h2 className="font-grotesk text-4xl font-extrabold text-text-primary mb-2">
        Token Launched! 🎉
      </h2>
      <p className="text-text-secondary mb-6">
        <span className="font-semibold text-green-400">${tokenName}</span> is now live on Bags.fm
      </p>

      {txHash && (
        <div className="card p-4 mb-6 text-left">
          <p className="text-xs text-text-muted mb-1 font-grotesk uppercase tracking-wider">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs text-purple-300 truncate flex-1">{txHash}</p>
            <a
              href={`https://solscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost px-2 py-1 text-xs flex items-center gap-1 whitespace-nowrap"
            >
              <ExternalLink className="w-3 h-3" /> View
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <button
          onClick={shareOnX}
          className="btn-secondary px-6 py-3 flex items-center justify-center gap-2"
        >
          <Twitter className="w-4 h-4 text-sky-400" />
          Share on X
        </button>
        <a
          href="https://bags.fm"
          target="_blank"
          rel="noreferrer"
          className="btn-primary px-6 py-3 flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View on Bags.fm
        </a>
      </div>

      <button onClick={onReset} className="btn-ghost px-5 py-2.5 text-sm mx-auto flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Start a New Project
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StepThree({ data, onBack, onReset }) {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const [form, setForm] = useState({
    tokenName: data?.tokenName || '',
    tokenSymbol: data?.tokenSymbol || '',
    description: data?.tokenDescription || '',
    bagsUrl: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [launching, setLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef()

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#7c3aed', '#10b981', '#a78bfa', '#34d399'] })
    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 }, angle: 60 }), 400)
    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 }, angle: 120 }), 800)
  }

  const handleLaunch = async () => {
    if (!connected) {
      setVisible(true)
      return
    }

    setError('')
    setLaunching(true)

    try {
      const client = new BagsClient({ network: 'mainnet-beta' })
      const result = await client.createToken({
        name: form.tokenName,
        symbol: form.tokenSymbol,
        description: form.description,
        image: imageFile || undefined,
        wallet: publicKey?.toBase58(),
      })
      const hash = result?.signature || result?.txHash || ''
      setTxHash(hash)
      setLaunched(true)
      fireConfetti()
    } catch (err) {
      setError(err.message || 'Launch failed. Please try again.')
    } finally {
      setLaunching(false)
    }
  }

  if (launched) {
    return (
      <SuccessScreen
        txHash={txHash}
        tokenName={form.tokenSymbol}
        launchTweet={data?.launchTweet || ''}
        onReset={onReset}
      />
    )
  }

  return (
    <div className="animate-in w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="card p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary">Launch on Bags.fm</h2>
        </div>
        <p className="text-text-secondary text-sm">
          Review your token details, connect your Solana wallet, and deploy to the chain.
        </p>
      </div>

      <div className="card p-8 space-y-6">
        {/* Wallet banner */}
        {!connected && (
          <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-amber-400" />
              <div>
                <p className="font-grotesk font-semibold text-amber-300 text-sm">Wallet not connected</p>
                <p className="text-text-muted text-xs">Connect your Solana wallet to launch</p>
              </div>
            </div>
            <button onClick={() => setVisible(true)} className="btn-primary px-4 py-2 text-sm">
              Connect
            </button>
          </div>
        )}

        {connected && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-green-500/30 bg-green-500/5">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-green-300 text-sm font-medium">
              Wallet connected: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-6)}
            </p>
          </div>
        )}

        {/* Token Name */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Token Name
          </label>
          <input
            className="input-field"
            value={form.tokenName}
            onChange={(e) => set('tokenName', e.target.value)}
            placeholder="e.g. TECHBHAI"
          />
        </div>

        {/* Token Symbol */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Token Symbol
          </label>
          <input
            className="input-field font-mono"
            value={form.tokenSymbol}
            onChange={(e) => set('tokenSymbol', e.target.value.toUpperCase())}
            placeholder="e.g. TBHAI"
            maxLength={5}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Description
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Token Image <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-8 text-center transition-all duration-200 hover:bg-accent/5 group"
          >
            {imagePreview ? (
              <div className="flex items-center justify-center gap-4">
                <img src={imagePreview} alt="token" className="w-16 h-16 rounded-xl object-cover" />
                <div className="text-left">
                  <p className="text-text-primary text-sm font-medium">{imageFile?.name}</p>
                  <p className="text-text-muted text-xs">Click to change</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                  className="ml-auto p-1 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-8 h-8 text-text-muted mx-auto group-hover:text-purple-400 transition-colors" />
                <p className="text-text-secondary text-sm">
                  <span className="text-purple-400 font-medium">Click to upload</span> or drag & drop
                </p>
                <p className="text-text-muted text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        {/* Bags URL */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Bags Platform URL <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <input
            className="input-field"
            value={form.bagsUrl}
            onChange={(e) => set('bagsUrl', e.target.value)}
            placeholder="https://bags.fm/your-profile"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Launch button */}
        <button
          onClick={handleLaunch}
          disabled={launching}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
          style={{ boxShadow: launching ? 'none' : '0 0 30px rgba(124,58,237,0.4)' }}
        >
          {launching ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Launching on chain...
            </>
          ) : !connected ? (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet First
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Launch on Bags →
            </>
          )}
        </button>

        <button onClick={onBack} className="w-full btn-ghost py-2.5 text-sm flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to AI Output
        </button>
      </div>
    </div>
  )
}
