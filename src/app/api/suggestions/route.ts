const FALLBACK_SUGGESTIONS = [
  "Ask for the timeline and immediate next step.",
  "Clarify who owns the decision after this meeting.",
  "Surface any cost, risk, or dependency before closing.",
];

function normalizeSuggestion(line: string) {
  return line
    .replace(/^\d+[\).\s-]*/, "")
    .replace(/^[-*•]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

export async function GET() {
  return Response.json({ suggestions: FALLBACK_SUGGESTIONS });
}

export async function POST(req: Request) {
  const apiKey =
    process.env.GROQ_API_KEY ?? process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing Groq API key. Add GROQ_API_KEY to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  let transcript = "";

  try {
    const body = await req.json();
    transcript = body?.transcript || "";
  } catch {
    transcript = "";
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a smart business meeting assistant. Return exactly 3 concise suggestions based on the conversation. No numbering, no markdown, one per line.",
          },
          {
            role: "user",
            content: transcript
              ? `Conversation:\n${transcript}\n\nGive 3 smart suggestions.`
              : "Give 3 smart meeting suggestions for a business discussion.",
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      {
        error: data?.error?.message ?? "Groq request failed.",
        details: data,
      },
      { status: response.status }
    );
  }

  const text = data.choices?.[0]?.message?.content ?? "";
  const suggestions = text
    .split("\n")
    .map((line: string) => normalizeSuggestion(line))
    .filter((line: string) => Boolean(line))
    .slice(0, 3);

  return Response.json({
    suggestions: suggestions.length > 0 ? suggestions : FALLBACK_SUGGESTIONS,
  });
}
