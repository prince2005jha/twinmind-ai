# 🧠 TwinMind AI Meeting Copilot

A real-time AI assistant that helps during live meetings by converting conversations into actionable insights.

---

## 🚀 Live Demo
👉 https://twinmind-8e3cf55gl-prince2005jhas-projects.vercel.app/

## 💻 GitHub Repository
👉 https://github.com/prince2005jha/twinmind-ai

---

## 🎯 Overview

TwinMind is a **real-time meeting copilot** that:

- Captures live conversation (speech or text)
- Generates contextual AI suggestions
- Enables deeper reasoning via chat
- Exports structured meeting reports

The goal is to assist **decision-making during meetings**, not just generate generic AI responses.

---

## ✨ Features

### 🎤 Live Transcription
- Speech → text using browser API
- Continuous transcript updates

### 💡 AI Suggestions
- Generates **3 concise suggestions**
- Updates periodically (~30s)
- Context-aware (based on transcript)

### 🧱 Batch System
- Each AI response stored as a batch
- New suggestions appear on top
- Old suggestions preserved for context

### 🖱️ Suggestion → Chat
- Click any suggestion
- Automatically sent to chat
- AI expands it into detailed reasoning

### 💬 Context-Aware Chat
- Uses:
  - User query
  - Full transcript
- Produces intelligent responses

### 📤 Export System
- Export full meeting session:
  - Transcript
  - Suggestion batches
  - Chat history
  - Timestamps
- Formats:
  - TXT
  - PDF

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, React, TypeScript  
- **AI:** Groq API (LLaMA 3)  
- **Speech:** Web Speech API  
- **Animations:** Framer Motion  
- **Export:** jsPDF  
- **Deployment:** Vercel  

---

## 🏗️ Architecture

Frontend (React / Next.js)
↓
API Routes (/api/suggestions, /api/chat)
↓
Groq LLM API
↓
Processed Response
↓
UI (Suggestions + Chat + Export)


---

## 🧠 Prompt Engineering Strategy

### Suggestions API
- Returns exactly 3 concise suggestions
- No formatting noise (no numbering, no markdown)
- Focus: actionable business insights

### Chat API
- Uses:
  - User message
  - Full transcript context
- Goal: expand suggestions into deeper reasoning

---

## ⚡ Performance & UX Decisions

- **Debounce (500ms):** avoids excessive API calls  
- **Batch updates (~30s):** prevents spam, improves relevance  
- **Loading states:** clear feedback during AI calls  
- **Error handling:** graceful fallback messages  

---

## 🔐 Environment Variables

Create `.env.local`:

```env
GROQ_API_KEY=your_api_key_here

