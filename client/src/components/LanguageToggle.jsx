export default function LanguageToggle({ language, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-elevated border border-border">
      {['English', 'Hindi'].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold font-grotesk transition-all duration-200 ${
            language === lang
              ? 'bg-accent text-white shadow-lg shadow-accent/30'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {lang === 'Hindi' ? '🇮🇳 Hindi' : '🇺🇸 English'}
        </button>
      ))}
    </div>
  )
}
