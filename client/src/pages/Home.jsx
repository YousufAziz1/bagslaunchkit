import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Zap, Sparkles, Rocket, Github, ExternalLink,
  BookOpen, Users, Globe, ChevronRight
} from 'lucide-react'
import WalletButton from '../components/WalletButton'
import StepOne from '../components/StepOne'
import StepTwo from '../components/StepTwo'
import StepThree from '../components/StepThree'

// ── Progress Indicator ────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  const steps = [
    { num: 1, label: 'Your Idea', icon: Zap },
    { num: 2, label: 'AI Magic', icon: Sparkles },
    { num: 3, label: 'Launch 🚀', icon: Rocket },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((s, i) => {
        const isDone = step > s.num
        const isActive = step === s.num
        return (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-grotesk font-semibold transition-all duration-300
              ${isActive ? 'step-active' : isDone ? 'step-done' : 'step-inactive'}`}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span>{s.num}. {s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className={`w-4 h-4 ${isActive || isDone ? 'text-accent' : 'text-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('in-view') },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const steps = [
    {
      icon: '✍️',
      title: 'Describe Your Project',
      desc: 'Fill in your creator name, project type, idea, and target audience in Hindi or English.',
      color: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/30',
    },
    {
      icon: '🤖',
      title: 'AI Generates Everything',
      desc: 'Claude AI crafts your token name, symbol, description, tweet, Telegram post, and full pitch in seconds.',
      color: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/30',
    },
    {
      icon: '🚀',
      title: 'Launch on Bags.fm',
      desc: 'Connect your Solana wallet and deploy your token directly on the Bags.fm platform with one click.',
      color: 'from-green-500/20 to-green-600/5',
      border: 'border-green-500/30',
    },
  ]

  return (
    <section id="how-it-works" className="mt-24 scroll-hidden" ref={ref}>
      <div className="text-center mb-10">
        <p className="text-xs font-grotesk font-semibold text-accent uppercase tracking-widest mb-2">Process</p>
        <h2 className="font-grotesk text-3xl font-bold text-text-primary">How It Works</h2>
        <p className="text-text-secondary mt-2 text-sm max-w-md mx-auto">
          From idea to on-chain token in under a minute.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`relative p-6 rounded-2xl border bg-gradient-to-br ${s.color} ${s.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
          >
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-border">
              <span className="text-xs font-grotesk font-bold text-text-secondary">{i + 1}</span>
            </div>
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="font-grotesk text-lg font-bold text-text-primary mb-2">{s.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-10 text-center">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-grotesk font-bold text-text-primary text-lg">
          Bags<span className="text-gradient-purple">LaunchKit</span>
        </p>
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <a href="https://bags.fm" target="_blank" rel="noreferrer"
            className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            <Globe className="w-3.5 h-3.5" /> Bags.fm
          </a>
          <a href="https://docs.bags.fm" target="_blank" rel="noreferrer"
            className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            <BookOpen className="w-3.5 h-3.5" /> Docs
          </a>
          <a href="https://github.com/YousufAziz1/bagslaunchkit" target="_blank" rel="noreferrer"
            className="flex items-center gap-1 hover:text-purple-400 transition-colors">
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>
        <p className="text-text-muted text-xs">© 2025 BagsLaunchKit · Built on Solana</p>
      </div>
    </footer>
  )
}

// ── Main Home Page ─────────────────────────────────────────────────────────────
export default function Home({
  step, setStep,
  formData, setFormData,
  generatedData, setGeneratedData,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/api/generate', formData)
      setGeneratedData(data)
      setStep(2)
    } catch (err) {
      setError(err?.response?.data?.error || 'Generation failed. Check your server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/api/generate', formData)
      setGeneratedData(data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Regeneration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (key, val) => {
    setGeneratedData((prev) => ({ ...prev, [key]: val }))
  }

  const handleReset = () => {
    setStep(1)
    setGeneratedData(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-mesh relative overflow-x-hidden">
      {/* Background */}
      <div className="bg-dots fixed inset-0 pointer-events-none opacity-40" />
      <div className="orb orb-purple pointer-events-none" />
      <div className="orb orb-green pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-grotesk text-2xl font-extrabold text-text-primary">
              Bags<span className="text-gradient-purple">LaunchKit</span>
            </h1>
            <p className="text-text-secondary text-xs mt-0.5">
              AI-Powered Creator Token Launch on Bags.fm
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/YousufAziz1/bagslaunchkit"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-border hover:border-accent/40 hover:bg-accent/10 transition-colors group"
            >
              <Github className="w-5 h-5 text-text-secondary group-hover:text-purple-400" />
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:flex btn-ghost px-4 py-2 text-sm items-center gap-1.5"
            >
              How It Works
            </a>
            <WalletButton />
          </div>
        </header>

        {/* ── Hero (only on step 1) ────────────────────────────────────────── */}
        {step === 1 && !loading && (
          <div className="text-center mb-12 animate-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 text-sm text-purple-300 font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Gemini AI · Built for Bags.fm Hackathon
            </div>
            <h2 className="font-grotesk text-4xl sm:text-6xl font-extrabold text-text-primary leading-tight mb-4">
              Launch Your Creator <br />
              <span className="text-gradient">Token in Minutes</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Enter your idea in Hindi or English. AI generates your token name, description,<br className="hidden sm:block" />
              launch tweet, Telegram post & full pitch — ready to deploy on Solana.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
              {['🎵 Music Artists', '📱 YouTubers', '💻 Developers', '✍️ Writers', '🎓 Educators'].map((t) => (
                <span key={t} className="flex items-center gap-1">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Progress ─────────────────────────────────────────────────────── */}
        {(step > 1 || loading) && <ProgressBar step={loading && step === 1 ? 2 : step} />}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── Step Content ─────────────────────────────────────────────────── */}
        <main>
          {(step === 1) && (
            <StepOne
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGenerate}
              loading={loading}
            />
          )}

          {(step === 2 || (step === 1 && loading)) && (
            <StepTwo
              data={generatedData}
              loading={loading}
              onRegenerate={handleRegenerate}
              onNext={() => setStep(3)}
              onEdit={handleEdit}
            />
          )}

          {step === 3 && (
            <StepThree
              data={generatedData}
              onBack={() => setStep(2)}
              onReset={handleReset}
            />
          )}
        </main>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <HowItWorks />

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '< 30s', label: 'Average Generation' },
            { value: '6', label: 'Assets Generated' },
            { value: '2', label: 'Languages Supported' },
            { value: '100%', label: 'On-chain via Solana' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center hover:-translate-y-1 transition-transform">
              <p className="font-grotesk text-2xl font-extrabold text-gradient-purple">{stat.value}</p>
              <p className="text-text-muted text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  )
}
