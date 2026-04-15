<div align="center">
  <img src="https://media.discordapp.net/attachments/1110595180630712411/1231682333069774948/DALL_E_2024-04-21_21.05.35_-_A_modern_sleek_logo_design_for_a_crypto_tool_named_BagsLaunchKit_The_logo_should_feature_a_minimalist_icon_combining_a_rocket_or_sparkle_with_a_dig.webp?ex=66258a1d&is=6624389d&hm=8d06afbb886fb5a8e0b6ed03f569f1dbfa29ed3d5964f40f28eecb5dfceaa233&=&format=webp&width=452&height=452" alt="Logo" width="100"/>
  <h1>💼 BagsLaunchKit</h1>
  <p><strong>AI-Powered Creator Token Launch on Bags.fm in Under 60 Seconds</strong></p>

  <p>
    <a href="https://bags.fm">Bags.fm</a> • 
    <a href="https://solana.com">Solana</a> • 
    <a href="https://ai.google.dev">Gemini AI</a>
  </p>
</div>

---

## 🚨 The Problem (Kyun Zaroori Hai?)

Most creators (YouTubers, musicians, writers) are **not crypto ninjas** nor **expert marketers**. 

If a creator wants to launch a token for their community on **Bags.fm**, they currently face a massive wall:
1. **The Blank Page Syndrome**: What should the token be named? What's the symbol? What's the narrative? 
2. **Marketing Paralysis**: Writing high-converting Tweets and Telegram announcements to drive initial liquidity is hard and time-consuming.
3. **Technical Friction**: The jump from "I have an idea" to "I have a token minting on Solana" takes too many fragmented steps.

## ✨ The Solution 

**BagsLaunchKit is an AI Copilot for token issuance.**

It bridges the gap between Web2 creators and Web3 liquidity by entirely automating the creative and technical friction of launching a community token.

You just provide a **1-sentence idea** (in English or Hindi). 
BagsLaunchKit uses Google's ultra-fast **Gemini AI** to automatically generate:
- Catchy Token Names & Tickers
- Compelling Lore / Token Description
- A full **Pitch Deck** format
- Ready-to-post **Twitter Threads**
- High-hype **Telegram Announcements** 

Then, via the **Bags.fm SDK**, it seamlessly connects their Phantom wallet and launches the token on the Solana blockchain exactly as generated.

---

## ⚡ How It Works (3 Simple Steps)

**1. The Idea (Input)**
Creators enter their basic information (Name, niche, and a rough idea). They can even write their prompt in **Hindi** (e.g., "Main ek tech youtuber hu, mujhe apne subscribers ke liye tech coin nikalna hai").

**2. AI Magic (Generation)**
Gemini AI processes the demographic and generates a complete, tailored "Launch Kit". The creator can inline-edit anything they want.

**3. Launch (Solana via Bags.fm)**
The user connects their Solana wallet (Phantom, Solflare) and clicks **Launch**. The kit constructs the metadata, connects to the un-published `@bagsfm/bags-sdk`, and fires the transaction natively.

---

## 🛠️ Tech Stack 

- **Frontend**: React.js, Vite, Tailwind CSS
- **Design System**: High-contrast, premium dark mode with glow interactions (CSS Variables, Lucide Icons, Canvas Confetti)
- **AI Brain**: Vercel Serverless Functions + `@google/generative-ai` (Gemini 1.5/2.5 Flash)
- **Blockchain**: `@solana/wallet-adapter-react`, Solana Web3.js
- **Ecosystem**: `@bagsfm/bags-sdk` (Official Bags.fm API)

---

## 🚀 Running Locally

1. Clone the repository:
```bash
git clone https://github.com/YousufAziz1/bagslaunchkit.git
cd bagslaunchkit
```

2. Install dependencies (requires `pnpm` or `npm`):
```bash
cd client
npm install
```

3. Setup Environment Variables:
Create a `.env` file in the `client` folder and add your Gemini AI API Key:
```env
GEMINI_API_KEY="AIzaSy...your-key..."
```

4. Run the development server:
```bash
npm run dev
```

---

<div align="center">
  <b>Built for the Bags.fm Hackathon by <a href="https://github.com/YousufAziz1">Yousuf Aziz</a></b>
</div>
