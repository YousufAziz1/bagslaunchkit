import { GoogleGenerativeAI } from '@google/generative-ai'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { creatorName, projectType, projectIdea, targetAudience, language } = req.body

  if (!creatorName || !projectIdea) {
    return res.status(400).json({ error: 'creatorName and projectIdea are required' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set in environment variables.' })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Model name set to standard fast model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.9,
        responseMimeType: 'application/json',
      },
    })

    const result = await model.generateContent(buildPrompt({ creatorName, projectType, projectIdea, targetAudience, language }))
    const rawText = result.response.text().trim()
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()
      
    res.status(200).json(JSON.parse(cleaned))
  } catch (err) {
    console.error('Gemini API error:', err)
    res.status(500).json({ error: `AI generation failed: ${err.message}` })
  }
}

