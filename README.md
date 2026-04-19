# 🧠 TwinMind — AI Meeting Copilot

TwinMind is a real-time AI assistant that listens to conversations, generates actionable suggestions, and helps users make better decisions during meetings.  
It combines live transcription, contextual AI reasoning, and structured outputs into a single workflow.

---

## 🚀 Live Demo
👉 https://twinmind-8e3cf55gl-prince2005jhas-projects.vercel.app/

---

## 🎯 Problem Statement

In real meetings:
- Important ideas get missed  
- Discussions are unstructured  
- Decisions are not clearly tracked  

This project solves that by acting as a **real-time decision-support system**.

---

## 🧩 Solution Overview

The system:

1. Captures conversation (speech or text)  
2. Maintains a live transcript  
3. Generates contextual suggestions  
4. Enables deeper reasoning via chat  
5. Exports a structured meeting report  

---

## ✨ Core Features

### 🎤 Live Transcription
- Speech → text using Web Speech API  
- Continuous updates  
- Editable transcript  

---

### 💡 AI Suggestions (Core System)
- Generates **exactly 3 concise suggestions**  
- Context-aware (based on transcript)  
- Triggered:
  - manually (refresh)
  - periodically (~30 seconds)

#### Design choice:
Limiting to 3 suggestions improves **clarity and usability during live discussions**

---

### 🧱 Batch-Based Suggestion System
- Each AI response is stored as a **batch**  
- New batches appear on top  
- Old batches are preserved  

#### Why?
To track how suggestions evolve as the conversation changes

---

### 🖱️ Suggestion → Chat Flow
- Click any suggestion  
- Automatically sent to chat  
- AI expands it into detailed reasoning  

---

### 💬 Context-Aware Chat Assistant
- Uses:
  - user input  
  - full transcript  

- Produces:
  - relevant  
  - contextual  
  - meeting-aware responses  

---

### ⏱️ Timestamps
- Every chat message includes time  
- Used for structured export  

---

### 📤 Export System
Exports complete session:

- Transcript  
- Suggestion batches  
- Chat history  
- Timestamps  

Formats:
- TXT  
- PDF  

---

## 🧠 Prompt Engineering Strategy

### Suggestions API
Goal:
- concise  
- actionable  
- no formatting noise

Return exactly 3 concise business suggestions.
No numbering, no markdown, no intro.


---

### Chat API
Input:
- user query  
- transcript  

Goal:
- expand ideas  
- provide reasoning  
- stay context-aware  

---

## ⚙️ Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | Next.js, React, TypeScript |
| Backend      | Next.js API Routes |
| AI           | Groq API (LLaMA 3) |
| Speech       | Web Speech API |
| Animation    | Framer Motion |
| Export       | jsPDF, Blob API |
| Deployment   | Vercel |

---

## 🏗️ Architecture

```mermaid
flowchart TD

A[User Input (Speech/Text)] --> B[Transcript State]

B --> C[SuggestionsPanel]
B --> D[ChatPanel]

C --> E[/api/suggestions]
D --> F[/api/chat]

E --> G[Groq LLM]
F --> G

G --> E
G --> F

E --> H[Suggestion Batches]
F --> I[Chat Messages]

H --> C
I --> D

H --> J[Export System]
I --> J
B --> J

J --> K[TXT / PDF Output]

⚡ Performance & UX Decisions
Debounce (500ms): avoids excessive API calls
Batch updates (~30s): reduces noise
Loading states: clear feedback
Error handling: graceful UI

🔐 Environment Variables

Create .env.local:
GROQ_API_KEY=your_api_key_here

🛠️ Local Setup
git clone https://github.com/prince2005jha/twinmind-ai.git
cd twinmind-ai

npm install
npm run dev

Open:http://localhost:3000

📬 Author

Prince Jha
Open to Full Stack / AI roles 🚀
     

Example:
