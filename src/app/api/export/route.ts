export async function POST(req: Request) {
  const { transcript } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            "Summarize the meeting in clear bullet points. Keep it short and structured.",
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    }),
  });

  const data = await response.json();
  const summary = data?.choices?.[0]?.message?.content || "No summary generated";

  return Response.json({ summary });
}