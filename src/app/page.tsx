"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SuggestionsPanel from "@/components/SuggestionsPanel";
import ChatPanel from "@/components/ChatPanel";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  time: string;
};

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [batches, setBatches] = useState<string[][]>([]);

  return (
    <motion.main
      className="shell"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard">
        <motion.header
          className="topbar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="brand">
            <div className="brand-mark">TM</div>
            <div className="brand-copy">
              <h1>TwinMind</h1>
              <p>Meeting assistance workspace</p>
            </div>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            Suggestions service online
          </div>
        </motion.header>

        <motion.section
          className="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <article className="hero-panel">
            <div className="eyebrow">Conversation Guidance</div>

            <h2 className="hero-title">
              Prompt support for live business discussions.
            </h2>

            <p className="hero-description">
              Generate short, actionable prompts during meetings.
            </p>
          </article>

          <aside className="summary-panel">
            <h2>Current scope</h2>
            <p>Real-time AI meeting assistant</p>
          </aside>
        </motion.section>

        <motion.section
          className="workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="workspace-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SuggestionsPanel
              setTranscript={setTranscript}
              setSelectedSuggestion={setSelectedSuggestion}
              setBatchesGlobal={setBatches}
              chatMessages={chatMessages}
            />
          </motion.div>

          <motion.div
            className="workspace-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ChatPanel
              transcript={transcript}
              selectedSuggestion={selectedSuggestion}
              setMessagesGlobal={setChatMessages}
            />
          </motion.div>

          <motion.aside
            className="notes-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Design notes</h3>
            <p>Clean SaaS-style meeting assistant UI</p>
            <p style={{ marginTop: 12, color: "var(--text-soft)" }}>
              {chatMessages.length > 0
                ? `${chatMessages.length} chat message${chatMessages.length === 1 ? "" : "s"} in this session.`
                : "Start a chat from a suggestion or ask a direct question."}
              {batches.length > 0
                ? ` ${batches.length} suggestion batch${batches.length === 1 ? "" : "es"} generated.`
                : ""}
            </p>
          </motion.aside>
        </motion.section>
      </div>
    </motion.main>
  );
}
