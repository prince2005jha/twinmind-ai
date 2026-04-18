export async function POST(req: Request) {
  const { message, transcript } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
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
              "You are an AI meeting assistant. Answer questions based on the meeting transcript.",
          },
          {
            role: "user",
            content: `Transcript:\n${transcript}\n\nQuestion: ${message}`,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  const reply =
    data?.choices?.[0]?.message?.content || "No response generated";

  return Response.json({ reply });
}