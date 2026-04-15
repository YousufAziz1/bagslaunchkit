import { useState } from 'react'
import { Zap, ChevronDown } from 'lucide-react'
import LanguageToggle from './LanguageToggle'

const PROJECT_TYPES = [
  'Music Artist',
  'Youtuber',
  'Developer',
  'Writer',
  'Educator',
  'Gamer',
  'Podcaster',
  'Other',
]

export default function StepOne({ formData, setFormData, onSubmit, loading }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.creatorName.trim()) e.creatorName = 'Creator name is required'
    if (!formData.projectIdea.trim()) e.projectIdea = 'Tell us about your project'
    if (!formData.targetAudience.trim()) e.targetAudience = 'Target audience is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit()
  }

  const set = (key, val) => setFormData((p) => ({ ...p, [key]: val }))

  return (
    <div className="animate-in w-full max-w-2xl mx-auto">
      {/* Header card */}
      <div className="card p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="font-grotesk text-2xl font-bold text-text-primary">
            Tell us about your project
          </h2>
        </div>
        <p className="text-text-secondary text-sm ml-13">
          Fill in a few details and our AI will generate everything you need to launch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {/* Language Toggle */}
        <div className="flex items-center justify-between">
          <label className="font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Content Language
          </label>
          <LanguageToggle
            language={formData.language}
            onChange={(lang) => set('language', lang)}
          />
        </div>

        <div className="h-px bg-border" />

        {/* Creator Name */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Your Creator Name *
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. TechBhai, SonuStar, CodeWithRaj"
            value={formData.creatorName}
            onChange={(e) => set('creatorName', e.target.value)}
          />
          {errors.creatorName && (
            <p className="text-red-400 text-xs mt-1">{errors.creatorName}</p>
          )}
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Project Type *
          </label>
          <div className="relative">
            <select
              className="select-field pr-10"
              value={formData.projectType}
              onChange={(e) => set('projectType', e.target.value)}
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
          </div>
        </div>

        {/* Project Idea */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Your Project Idea *
          </label>
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder={
              formData.language === 'Hindi'
                ? 'e.g. Main ek Hindi tech YouTube channel banata hoon jahan main coding aur AI ke baare mein sikhata hoon...'
                : 'e.g. I run a YouTube channel teaching web3 development to Indian college students with practical projects...'
            }
            value={formData.projectIdea}
            onChange={(e) => set('projectIdea', e.target.value)}
          />
          {errors.projectIdea && (
            <p className="text-red-400 text-xs mt-1">{errors.projectIdea}</p>
          )}
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="block font-grotesk text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Target Audience *
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Indian college students, Hindi-speaking developers"
            value={formData.targetAudience}
            onChange={(e) => set('targetAudience', e.target.value)}
          />
          {errors.targetAudience && (
            <p className="text-red-400 text-xs mt-1">{errors.targetAudience}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 mt-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate with AI →
            </>
          )}
        </button>

        <p className="text-center text-text-muted text-xs">
          Powered by Claude AI · Results in ~10 seconds
        </p>
      </form>
    </div>
  )
}
