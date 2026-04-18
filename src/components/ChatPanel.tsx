"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  time: string;
};

type ChatPanelProps = {
  transcript: string;
  selectedSuggestion: string;
  setMessagesGlobal: (msgs: ChatMessage[]) => void;
};

export default function ChatPanel({
  transcript,
  selectedSuggestion,
  setMessagesGlobal,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessagesGlobal(messages);
  }, [messages, setMessagesGlobal]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim()) {
      return;
    }

    const time = new Date().toLocaleTimeString();
    const userMessage: ChatMessage = {
      role: "user",
      text,
      time,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          transcript,
        }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        role: "bot",
        text: data.reply ?? "No response generated.",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Error getting response.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    if (!input.trim()) {
      return;
    }

    void sendMessage(input);
    setInput("");
  }

  const sendSelectedSuggestion = useEffectEvent((suggestion: string) => {
    void sendMessage(suggestion);
  });

  useEffect(() => {
    if (!selectedSuggestion) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      sendSelectedSuggestion(selectedSuggestion);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [selectedSuggestion]);

  return (
    <div className="chat-panel">
      <h2>Chat Assistant</h2>

      <div className="chat-box">
        {messages.length === 0 && (
          <div className="panel-message">Ask something or click a suggestion.</div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={message.role === "user" ? "user-msg" : "bot-msg"}
          >
            <p>{message.text}</p>
            <small style={{ opacity: 0.6 }}>{message.time}</small>
          </div>
        ))}

        {loading && <div className="bot-msg">Thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the meeting..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button onClick={handleSend} disabled={loading} type="button">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
