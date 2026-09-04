import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// ----------------------------------------------------
// API Route 1: Camera Vision Homework Helper
// ----------------------------------------------------
app.post("/api/tutor/camera-help", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", query, mode = "problem", grade = "Grade 4-8", subject = "Math", language = "English" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const ai = getGeminiClient();

    const isChapterMode = mode === "chapter";

    const promptText = `You are Aura, an elite AI Tutor specializing in personalized learning for students.
The student is in grade level: ${grade}.
Subject: ${subject}.
Scan Mode: ${isChapterMode ? "Textbook Chapter / Page Teaching Mode" : "Problem Solution Mode"}.
User prompt/question about image: ${query || (isChapterMode ? "Scan and teach this textbook chapter section step-by-step." : "Solve and explain this problem step-by-step.")}
Preferred Language: ${language}.

Analyze the uploaded image (${isChapterMode ? "textbook chapter page, textbook diagram, or reading section" : "handwritten equation, textbook page, diagram, worksheet, or object"}).
Adapt your response strictly to the student's grade level (${grade}):
- If KG or Grade 1-3: Use super encouraging, simple words, emojis, storytelling, and an engaging visual metaphor.
- If Grade 4-8: Use clear step-by-step logic, bold headers, intuitive diagrams/explanations, and practical real-world analogies.
- If Grade 9-12 or Higher Ed: Use rigorous academic notation, clear conceptual definitions, step-by-step mathematical or scientific derivation, and theorem references.

Provide a structured JSON output matching the following schema:
{
  "problemText": "${isChapterMode ? "Title & Chapter Section Transcribed" : "Transcribed text or description of the image content"}",
  "detectedTopic": "Specific academic topic (e.g., Quadratic Equations, Photosynthesis, Chapter 4 Section 2)",
  "difficulty": "Easy | Medium | Hard",
  "explanation": "Clear main explanation or chapter summary written in ${language}",
  "stepByStep": ["Section / Step 1 breakdown...", "Section / Step 2 breakdown...", "Section / Step 3 breakdown..."],
  "keyConcepts": ["Key concept or vocabulary term 1", "Key concept or vocabulary term 2"],
  "hints": ["Review Hint 1", "Review Hint 2"],
  "practiceQuestions": [
    {
      "question": "Chapter review practice question 1",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why Option A is correct"
    },
    {
      "question": "Chapter review practice question 2",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 1,
      "explanation": "Why Option B is correct"
    }
  ],
  "audioNarrative": "A warm 2-3 sentence chapter summary written specifically to be read aloud by an audio text-to-speech voice.",
  "kgVisualMetaphor": "Only if KG or Grade 1-3: A fun, vivid story metaphor describing the chapter or problem."
}`;

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Camera Help API Error:", error);
    return res.status(500).json({
      error: "Failed to analyze homework image",
      details: error?.message || String(error),
    });
  }
});

// ----------------------------------------------------
// API Route 2: Interactive AI Tutor Chat & Q&A
// ----------------------------------------------------
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { message, history = [], grade = "Grade 4-8", subject = "Math", language = "English" } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `You are Aura, an empathetic, highly encouraging, and adaptive AI Tutor.
Target Grade Level: ${grade}
Subject Focus: ${subject}
Preferred Output Language: ${language}

Instruction Guidelines:
- Respond directly in ${language}.
- Adapt vocabulary to ${grade}. (KG: cheerful, simple, emojis; High School/Higher Ed: precise, analytical, Socratic guidance).
- Provide step-by-step breakdowns, bold key terms, and end with an encouraging follow-up check question or quick hint.`;

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
      },
    });

    // Send history context if available
    for (const msg of history) {
      if (msg.role === "user" || msg.role === "model") {
        await chat.sendMessage({ message: msg.content });
      }
    }

    const response = await chat.sendMessage({ message });

    return res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("Tutor Chat Error:", error);
    return res.status(500).json({ error: "Failed to process chat message", details: error?.message });
  }
});

// ----------------------------------------------------
// API Route 3: Generate Adaptive Quiz
// ----------------------------------------------------
app.post("/api/tutor/generate-quiz", async (req, res) => {
  try {
    const { subject = "Math", grade = "Grade 4-8", topic = "General", count = 3, language = "English" } = req.body;

    const ai = getGeminiClient();

    const prompt = `Generate ${count} interactive quiz questions for a student in grade level: ${grade}.
Subject: ${subject}
Topic: ${topic}
Language: ${language}

Return a valid JSON array of questions matching this schema:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "hint": "Constructive hint",
    "explanation": "Why option 0 is correct"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const quizData = JSON.parse(response.text || "[]");
    return res.json({ success: true, questions: quizData });
  } catch (error: any) {
    console.error("Generate Quiz Error:", error);
    return res.status(500).json({ error: "Failed to generate quiz", details: error?.message });
  }
});

// ----------------------------------------------------
// API Route 4: AI Text-to-Speech (Gemini TTS / Fallback)
// ----------------------------------------------------
app.post("/api/tutor/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const ai = getGeminiClient();

    // Use gemini-3.1-flash-tts-preview if available
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say cheerfully in clear cadence: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio, format: "audio/pcm" });
    }

    return res.json({ success: false, message: "TTS audio generation returned empty payload" });
  } catch (error: any) {
    console.warn("Gemini TTS endpoint notice (using client speech fallback):", error?.message);
    return res.json({ success: false, error: error?.message, fallbackToWebSpeech: true });
  }
});

// ----------------------------------------------------
// Start Server with Vite Middleware or Static Production
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎓 Aura AI Tutor Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
