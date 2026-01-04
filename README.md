# DrizzleChat – An example of a site AI chat assistant

## Requirements

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Google Generative Language API key (Gemini v1 free tier)

---

## Setup

1. Clone the repository:

bash
git clone https://github.com/yourusername/DrizzleChat.git
cd DrizzleChat

2. Install dependencies:
bash
npm install

3. Create a .env file in the project root
with "API_KEY=YOUR_GOOGLE_API_KEY" inside
Replace YOUR_GOOGLE_API_KEY with your own key from Google Generative Language API.

To run the project
in terminal:
node server.js

Open your browser and go to:
http://localhost:3000
or
just click it in terminal :)

The chat widget will appear in the upper-right corner.

You can now interact with DrizzleChat. :)

Notes:
.env and node_modules/ are ignored by Git.
The AI assistant uses multi-turn memory and corporate instructions to stay on-topic.
If you don’t have an API key, the server will not return real AI responses.
