require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Anthropic = require('@anthropic-ai/sdk')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are an expert Web3 creator marketing consultant specializing in the Bags.fm platform on Solana. You help creators launch tokens and build communities. You write in a style that is energetic, credible, and community-focused. When language is "Hindi", mix Hindi and English naturally (Hinglish style). When language is "English", write in clean professional English with crypto-native tone.`

function buildUserPrompt({ creatorName, projectType, projectIdea, targetAudience, language }) {
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

async function callClaude(promptData) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(promptData) }],
  })
  const rawText = response.content[0].text.trim()
  // Strip markdown code fences if present
  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  return JSON.parse(cleaned)
}

app.post('/api/generate', async (req, res) => {
  const { creatorName, projectType, projectIdea, targetAudience, language } = req.body

  if (!creatorName || !projectIdea) {
    return res.status(400).json({ error: 'creatorName and projectIdea are required' })
  }

  let result
  try {
    result = await callClaude({ creatorName, projectType, projectIdea, targetAudience, language })
  } catch (err) {
    // Retry once
    try {
      result = await callClaude({ creatorName, projectType, projectIdea, targetAudience, language })
    } catch (retryErr) {
      console.error('Claude API failed after retry:', retryErr.message)
      return res.status(500).json({ error: 'AI generation failed. Please try again.' })
    }
  }

  res.json(result)
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok', model: 'claude-sonnet-4-20250514' }))

app.listen(PORT, () => {
  console.log(`🚀 BagsLaunchKit server running on http://localhost:${PORT}`)
})
