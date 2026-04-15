import { useState } from 'react'
import {
  Copy, Check, Edit3, Save, RefreshCw, Rocket,
  Twitter, Send, FileText, Tag, Hash, AlignLeft
} from 'lucide-react'

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard({ icon: Icon, label }) {
  return (
    <div className="card p-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg skeleton" />
        <div className="h-4 w-24 skeleton rounded" />
      </div>
      <div className="h-8 skeleton rounded" />
      <div className="h-4 w-3/4 skeleton rounded" />
    </div>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({ text, className = '' }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className={`relative ${className}`}>
      {copied && (
        <div className="copy-tooltip">Copied!</div>
      )}
      <button
        onClick={handle}
        className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

// ── Generic content card ──────────────────────────────────────────────────────
function ContentCard({ icon: Icon, label, accentColor = 'text-purple-400', children, actions }) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${accentColor}`} />
          </div>
          <span className="font-grotesk text-xs font-semibold text-text-secondary uppercase tracking-widest">
            {label}
          </span>
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}

// ── Editable text field ───────────────────────────────────────────────────────
function EditableField({ value, onChange, multiline = false, rows = 3 }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const save = () => { onChange(draft); setEditing(false) }

  if (editing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            className="input-field resize-none text-sm"
            rows={rows}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        ) : (
          <input
            className="input-field text-sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        )}
        <button onClick={save} className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1">
          <Save className="w-3 h-3" /> Save
        </button>
      </div>
    )
  }

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => { setDraft(value); setEditing(true) }}
    >
      <p className="text-text-primary text-sm leading-relaxed">{value}</p>
      <span className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit3 className="w-3.5 h-3.5 text-text-secondary" />
      </span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StepTwo({ data, loading, onRegenerate, onNext, onEdit }) {
  const skeletons = Array.from({ length: 6 })

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-purple-300 font-medium">Claude AI is generating your launch kit...</span>
          </div>
          <h2 className="font-grotesk text-3xl font-bold text-text-primary">Brewing your token magic ✨</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skeletons.map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const update = (key) => (val) => onEdit(key, val)

  const openTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.launchTweet)}`,
      '_blank'
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-sm text-green-300 font-medium">AI Generation Complete!</span>
        </div>
        <h2 className="font-grotesk text-3xl font-bold text-text-primary">
          Your <span className="text-gradient-purple">{data.tokenName}</span> Launch Kit is Ready 🚀
        </h2>
        <p className="text-text-secondary mt-2 text-sm">
          Review, edit inline, then proceed to launch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {/* Token Name */}
        <ContentCard
          icon={Tag}
          label="Token Name"
          actions={<CopyBtn text={data.tokenName} />}
        >
          <div className="animate-in">
            <p className="font-grotesk text-4xl font-extrabold text-gradient-purple tracking-tight">
              {data.tokenName}
            </p>
          </div>
        </ContentCard>

        {/* Token Symbol */}
        <ContentCard
          icon={Hash}
          label="Token Symbol"
          actions={<CopyBtn text={data.tokenSymbol} />}
        >
          <div className="flex items-center gap-3">
            <span className="font-grotesk text-4xl font-extrabold text-accent-light tracking-widest">
              ${data.tokenSymbol}
            </span>
            <span className="text-xs text-text-secondary bg-elevated px-2 py-1 rounded-lg border border-border">
              Ticker
            </span>
          </div>
        </ContentCard>

        {/* Token Description */}
        <ContentCard
          icon={AlignLeft}
          label="Token Description"
          accentColor="text-blue-400"
          actions={<CopyBtn text={data.tokenDescription} />}
        >
          <EditableField
            value={data.tokenDescription}
            onChange={update('tokenDescription')}
            multiline
            rows={3}
          />
          <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
            <Edit3 className="w-3 h-3" /> Click text to edit inline
          </p>
        </ContentCard>

        {/* Launch Tweet */}
        <ContentCard
          icon={Twitter}
          label="Launch Tweet"
          accentColor="text-sky-400"
          actions={
            <div className="flex gap-2">
              <CopyBtn text={data.launchTweet} />
              <button
                onClick={openTwitter}
                className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                Open in X
              </button>
            </div>
          }
        >
          <EditableField
            value={data.launchTweet}
            onChange={update('launchTweet')}
            multiline
            rows={3}
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Click to edit
            </p>
            <span className={`text-xs font-mono ${data.launchTweet.length > 260 ? 'text-red-400' : 'text-text-muted'}`}>
              {data.launchTweet.length}/260
            </span>
          </div>
        </ContentCard>

        {/* Telegram Post */}
        <ContentCard
          icon={Send}
          label="Telegram Post"
          accentColor="text-cyan-400"
          actions={<CopyBtn text={data.telegramPost} />}
        >
          <EditableField
            value={data.telegramPost}
            onChange={update('telegramPost')}
            multiline
            rows={5}
          />
        </ContentCard>

        {/* Full Project Pitch */}
        <ContentCard
          icon={FileText}
          label="Full Project Pitch"
          accentColor="text-amber-400"
          actions={<CopyBtn text={data.projectPitch} />}
        >
          <EditableField
            value={data.projectPitch}
            onChange={update('projectPitch')}
            multiline
            rows={6}
          />
          <p className="text-xs text-text-muted mt-1">
            {data.projectPitch.split(' ').length} words · Hackathon ready
          </p>
        </ContentCard>
      </div>

      {/* Action row */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <button
          onClick={onRegenerate}
          className="btn-secondary px-8 py-3.5 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate →
        </button>
        <button
          onClick={onNext}
          className="btn-primary px-10 py-3.5 text-base flex items-center justify-center gap-2 animate-[glowPulse_2s_ease-in-out_infinite]"
          style={{ boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
        >
          <Rocket className="w-5 h-5" />
          Launch This Token →
        </button>
      </div>
    </div>
  )
}
