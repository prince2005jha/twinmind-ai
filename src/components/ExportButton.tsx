"use client";

import { jsPDF } from "jspdf";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  time: string;
};

type ExportButtonProps = {
  transcript: string;
  batches: string[][];
  chat: ChatMessage[];
};

export default function ExportButton({
  transcript,
  batches,
  chat,
}: ExportButtonProps) {
  // 🔥 TXT EXPORT (FULL DATA)
  function handleExportTXT() {
    const timestamp = new Date().toLocaleString();

    let content = `🧠 TwinMind Meeting Report\n`;
    content += `Generated on: ${timestamp}\n\n`;

    content += `========================\n`;
    content += `📝 TRANSCRIPT\n`;
    content += `========================\n`;
    content += (transcript || "No transcript") + "\n\n";

    content += `========================\n`;
    content += `💡 SUGGESTIONS\n`;
    content += `========================\n`;

    if (batches.length === 0) {
      content += "No suggestions available\n";
    } else {
      batches.forEach((batch, i) => {
        content += `\nBatch ${i + 1}:\n`;
        batch.forEach((s) => {
          content += `• ${s}\n`;
        });
      });
    }

    content += `\n========================\n`;
    content += `💬 CHAT HISTORY\n`;
    content += `========================\n`;

    if (chat.length === 0) {
      content += "No chat messages\n";
    } else {
      chat.forEach((msg) => {
        content += `[${msg.time}] ${msg.role.toUpperCase()}: ${msg.text}\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "twinmind-session.txt";
    a.click();
  }

  // 🔥 PDF EXPORT (CLEAN VERSION)
  function handleExportPDF() {
    const doc = new jsPDF();
    let y = 10;

    const addSection = (title: string, text: string) => {
      doc.setFontSize(14);
      doc.text(title, 10, y);
      y += 6;

      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 6;
    };

    const timestamp = new Date().toLocaleString();

    addSection("🧠 TwinMind Meeting Report", `Generated on: ${timestamp}`);

    addSection("📝 TRANSCRIPT", transcript || "No transcript");

    // Suggestions
    let suggestionText = "";
    batches.forEach((batch, i) => {
      suggestionText += `Batch ${i + 1}:\n`;
      batch.forEach((s) => {
        suggestionText += `• ${s}\n`;
      });
      suggestionText += "\n";
    });

    addSection("💡 SUGGESTIONS", suggestionText || "No suggestions");

    // Chat
    let chatText = "";
    chat.forEach((msg) => {
      chatText += `[${msg.time}] ${msg.role.toUpperCase()}: ${msg.text}\n`;
    });

    addSection("💬 CHAT HISTORY", chatText || "No chat messages");

    doc.save("twinmind-session.pdf");
  }

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <button onClick={handleExportPDF}>Export PDF 📄</button>
      <button onClick={handleExportTXT}>Export TXT 📝</button>
    </div>
  );
}