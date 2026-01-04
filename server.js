import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config(); // Load .env file

const app = express();
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY; // Your Google API key here or change the code to work for another.

// In-memory conversation history
let conversationHistory = [];

// Route to list models (optional debug)
app.get("/models", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not list models" });
  }
});

const MAX_HISTORY = 10; // keep last 10 messages

app.post("/chat", async (req, res) => {
  const userText = req.body.text;
  if (!userText) return res.status(400).json({ reply: "Ei tekstiä" });

  // Add user message to history
  conversationHistory.push({ role: "user", parts: [{ text: userText }] });

  // Keep only last MAX_HISTORY messages
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            // Instructions for the chatbot. Alot more could be added and refined, but this is about the function more.
            {
              role: "model",
              parts: [{
                text: `
You are Drizzle AI's official chat assistant on the DrizzleChat website.
- Only answer questions about Drizzle AI, including its services, products, mission, and news.
- Do not answer questions unrelated to Drizzle AI, plant care, agriculture, or AI technology.
- If a user asks about other companies, politics, or unrelated topics, politely decline.
- Always refer to the company as 'Drizzle AI'.
- Be professional, concise, and informative.
- Drizzle AI information for reference:
  - Founded in 2025, focuses on AI-powered plant care and agriculture solutions.
  - Services:
    * DrizzleAI for plant care
    * Plant-based and agricultural data analytics
    * AI-supported customer service solutions
    * Cloud infrastructure and DevOps consulting
  - Mission: Build AI technology that is easy to use, safe, affordable, and innovative.
  - News:
    * Published the DrizzleChat customer service chatbot in 2025
    * Company launched in 2025
                `
              }]
            },
            // Include only last MAX_HISTORY messages
            ...conversationHistory
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
        })
      }
    );

    const data = await response.json();
    console.log("API vastaus:", JSON.stringify(data, null, 2));

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "AI ei vastannut.";

    // Add AI response to history
    conversationHistory.push({ role: "user", parts: [{ text: aiText }] });

    // Limit again after adding AI response
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }

    res.json({ reply: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI ei vastannut." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});