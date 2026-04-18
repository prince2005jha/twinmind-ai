export async function POST() {
  return Response.json(
    {
      error: "Transcribe API is not implemented yet.",
    },
    { status: 501 }
  );
}
