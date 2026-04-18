"use client";

type EmailButtonProps = {
  transcript: string;
};

export default function EmailButton({ transcript }: EmailButtonProps) {
  async function sendEmail() {
    if (!transcript.trim()) {
      alert("Add or record a transcript before sending email.");
      return;
    }

    const res = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Email sent successfully.");
      return;
    }

    alert(data.error ?? "Failed to send email.");
  }

  return (
    <button
      onClick={sendEmail}
      style={{ marginLeft: "10px" }}
      type="button"
    >
      Send Email
    </button>
  );
}
