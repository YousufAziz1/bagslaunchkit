/**
 * Mock Bags SDK — replace with real @bagsfm/bags-sdk when published.
 * The real SDK call is attempted first in StepThree; this is the fallback.
 */
export class BagsClient {
  constructor(_config) {}

  async createToken({ name, symbol, description, wallet }) {
    // Simulate a 2-second on-chain transaction
    await new Promise((r) => setTimeout(r, 2000))
    const mockHash = `BAGS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    return { signature: mockHash, txHash: mockHash }
  }
}

export default { BagsClient }
