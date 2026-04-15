import { useState } from 'react'
import Home from './pages/Home'

export default function App() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    creatorName: '',
    projectType: 'Music Artist',
    projectIdea: '',
    targetAudience: '',
    language: 'English',
  })
  const [generatedData, setGeneratedData] = useState(null)

  return (
    <Home
      step={step}
      setStep={setStep}
      formData={formData}
      setFormData={setFormData}
      generatedData={generatedData}
      setGeneratedData={setGeneratedData}
    />
  )
}
