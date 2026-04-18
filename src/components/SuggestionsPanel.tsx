"use client";

import { useEffect, useRef, useState } from "react";
import { useMic } from "@/hooks/useMic";
import MicButton from "@/components/MicButton";
import ExportButton from "@/components/ExportButton";
import EmailButton from "@/components/EmailButton";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  time: string;
};

type SuggestionsPanelProps = {
  setTranscript: (transcript: string) => void;
  setSelectedSuggestion: (suggestion: string) => void;
  setBatchesGlobal: (batches: string[][]) => void;
  chatMessages: ChatMessage[];
};

export default function SuggestionsPanel({
  setTranscript,
  setSelectedSuggestion,
  setBatchesGlobal,
  chatMessages,
}: SuggestionsPanelProps) {
  const [batches, setBatches] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setLocalTranscript] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const transcriptRef = useRef(transcript);

  const {
    transcript: micTranscript,
    isListening,
    startListening,
    stopListening,
  } = useMic();

  useEffect(() => {
    if (!micTranscript) {
      return;
    }

    const id = window.setTimeout(() => {
      setLocalTranscript(micTranscript);
    }, 0);

    return () => window.clearTimeout(id);
  }, [micTranscript]);

  useEffect(() => {
    transcriptRef.current = transcript;
    setTranscript(transcript);
  }, [setTranscript, transcript]);

  useEffect(() => {
    setBatchesGlobal(batches);
  }, [batches, setBatchesGlobal]);

  async function fetchSuggestions(inputTranscript: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: inputTranscript }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to fetch suggestions");
      }

      const newBatch = [...(data.suggestions || [])].slice(0, 3);

      while (newBatch.length < 3) {
        newBatch.push("No suggestion available");
      }

      setBatches((prev) => [newBatch, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const text = transcriptRef.current.trim();

      if (!text || text === lastTranscript) {
        return;
      }

      void fetchSuggestions(text);
      setLastTranscript(text);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [lastTranscript]);

  function handleManualRefresh() {
    const text = transcriptRef.current.trim();

    if (!text) {
      return;
    }

    void fetchSuggestions(text);
    setLastTranscript(text);
  }

  function handleSuggestionClick(suggestion: string) {
    setSelectedSuggestion(suggestion);
  }

  function handleTranscriptChange(value: string) {
    setLocalTranscript(value);

    if (!value.trim()) {
      setBatches([]);
      setError(null);
    }
  }

  return (
    <section className="suggestions-card">
      <div className="panel-header">
        <div>
          <h2>Live suggestions</h2>
          <p>AI suggestions based on your conversation.</p>
        </div>

        <div
          className={`status-badge${loading ? " loading" : error ? " error" : ""}`}
        >
          {loading ? "Generating..." : error ? "Error" : "Ready"}
        </div>
      </div>

      <MicButton
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />

      <textarea
        value={transcript}
        onChange={(e) => handleTranscriptChange(e.target.value)}
        placeholder="Speak or type..."
        className="transcript-input"
      />

      {loading && <div className="panel-message">Generating...</div>}
      {!loading && error && <div className="panel-message error">{error}</div>}

      {!loading && batches.length === 0 && (
        <div className="panel-message">No suggestions yet.</div>
      )}

      {batches.map((batch, batchIndex) => (
        <div key={`${batchIndex}-${batch[0] ?? "batch"}`} style={{ marginBottom: "16px" }}>
          <h4 style={{ marginBottom: "8px" }}>Batch {batches.length - batchIndex}</h4>

          <div className="suggestions-grid">
            {batch.map((suggestion, index) => (
              <div
                key={`${batchIndex}-${index}-${suggestion}`}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ cursor: "pointer" }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="panel-action">
        <button onClick={handleManualRefresh} type="button">
          Refresh
        </button>

        <ExportButton transcript={transcript} batches={batches} chat={chatMessages} />
        <EmailButton transcript={transcript} />
      </div>
    </section>
  );
}
