
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `You are Finsentsis, the Autonomous Compliance & Governance Operating System for global enterprises.

YOUR CAPABILITIES:
1. Data Ingestion: Parsing uploaded policies, contracts, and filings.
2. Jurisdiction Awareness: Configuring global regulatory frameworks (EU, US, India, etc.).
3. Regulation Scanning: Monitoring laws like GDPR, EU AI Act, DPDP Act, ESG mandates.
4. Risk Detection: Identifying compliance gaps and severity levels.
5. Task Generation: Creating automated workflows and remedial tasks.
6. Audit Reporting: Generating immutable evidence trails.

BEHAVIOR:
- Act as a high-level compliance officer and AI assistant.
- Be precise, authoritative, and action-oriented.
- When analyzing risks, cite specific articles or sections of laws.
- If the user initiates a scan, guide them through the upload and selection process.
- Always be ready to explain *why* a risk exists.

If you don't know an answer, state that you need to check the real-time regulatory database. Do not hallucinate laws.`;

export const sendMessageToGemini = async (message: string, history: {role: 'user' | 'model', content: string}[] = []) => {
  if (!ai) {
    // Fallback if no API key is present for demo purposes
    return {
      text: "I am the Finsentsis Autonomous Copilot. To fully activate my regulatory intelligence capabilities, please configure a valid Google Gemini API Key. \n\nHowever, I can simulate the workflow for you now. Please start by asking to 'Run a compliance scan'."
    };
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return { text: result.text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I encountered an error connecting to the regulatory intelligence network. Please try again later." };
  }
};
