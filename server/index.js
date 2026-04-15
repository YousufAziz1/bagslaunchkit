require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SYSTEM_INSTRUCTION = `You are an expert Web3 creator marketing consultant specializing in the Bags.fm platform on Solana. You help creators launch tokens and build communities. You write in a style that is energetic, credible, and community-focused. When language is "Hindi", mix Hindi and English naturally (Hinglish style). When language is "English", write in clean professional English with crypto-native tone.`

function buildPrompt({ creatorName, projectType, projectIdea, targetAudience, language }) {
  return `A creator wants to launch their project on Bags.fm. Here are their details:
- Creator Name: ${creatorName}
- Project Type: ${projectType}
- Project Idea: ${projectIdea}
- Target Audience: ${targetAudience}
- Language Preference: ${language}

Generate the following in JSON format only (no markdown, no explanation):
{
  "tokenName": "uppercase single word or compound word, max 12 chars, catchy and memorable",
  "tokenSymbol": "3-5 uppercase letters",
  "tokenDescription": "2-3 sentence description for Bags.fm platform page, professional, mentions community funding and creator royalties",
  "launchTweet": "Twitter post max 260 chars, includes token name, project idea, and call to action to buy on Bags.fm. Add 2-3 relevant hashtags. High energy.",
  "telegramPost": "Telegram community post, 4-6 lines, use relevant emojis, explain what the token is, why to buy, link placeholder as [BAGS_LINK]",
  "projectPitch": "150-200 word hackathon submission pitch explaining the project, the problem it solves, how it uses Bags.fm platform, and the creator's vision"
}

Return ONLY valid JSON. No explanation text before or after.`
}

async function callGemini(promptData) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-04-17',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.9,
      responseMimeType: 'application/json',
    },
  })

  const result = await model.generateContent(buildPrompt(promptData))
  const rawText = result.response.text().trim()
  // Strip markdown fences if present
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  return JSON.parse(cleaned)
}

app.post('/api/generate', async (req, res) => {
  const { creatorName, projectType, projectIdea, targetAudience, language } = req.body

  if (!creatorName || !projectIdea) {
    return res.status(400).json({ error: 'creatorName and projectIdea are required' })
  }

  let result
  try {
    result = await callGemini({ creatorName, projectType, projectIdea, targetAudience, language })
  } catch (err) {
    console.error('Gemini API error (attempt 1):', err.message)
    // Retry once
    try {
      result = await callGemini({ creatorName, projectType, projectIdea, targetAudience, language })
    } catch (retryErr) {
      console.error('Gemini API failed after retry:', retryErr.message)
      return res.status(500).json({ error: 'AI generation failed. Please check your GEMINI_API_KEY and try again.' })
    }
  }

  res.json(result)
})

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', model: 'gemini-2.5-flash-preview-04-17' })
)

app.listen(PORT, () => {
  console.log(`🚀 BagsLaunchKit server running on http://localhost:${PORT}`)
  console.log(`🤖 Using model: gemini-2.5-flash-preview-04-17`)
})
