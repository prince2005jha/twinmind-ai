"use client";

type MicButtonProps = {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
};

export default function MicButton({
  isListening,
  startListening,
  stopListening,
}: MicButtonProps) {
  return (
    <button
      onClick={isListening ? stopListening : startListening}
      style={{
        padding: "10px",
        marginBottom: "10px",
        background: isListening ? "red" : "green",
        color: "white",
      }}
      type="button"
    >
      {isListening ? "Stop Mic" : "Start Mic"}
    </button>
  );
}
