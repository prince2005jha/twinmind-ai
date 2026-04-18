import nodemailer from "nodemailer";

function getEmailErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const message = "message" in error ? error.message : null;
    const code = "code" in error ? error.code : null;
    const response = "response" in error ? error.response : null;

    const combinedMessage = [code, message, response]
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .join(" | ");

    if (
      combinedMessage.includes("Invalid login") ||
      combinedMessage.includes("Username and Password not accepted") ||
      combinedMessage.includes("EAUTH")
    ) {
      return "Gmail rejected the login. Use a Gmail App Password in EMAIL_PASS, not your normal Gmail password.";
    }

    if (typeof message === "string" && typeof code === "string") {
      return `${code}: ${message}`;
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Failed to send email.";
}

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || !String(transcript).trim()) {
      return Response.json({ error: "Transcript is required." }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return Response.json(
        {
          error:
            "Missing email configuration. Add EMAIL_USER and EMAIL_PASS to .env.local.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `TwinMind <${emailUser}>`,
      to: emailUser,
      subject: "Meeting Transcript",
      text: `Meeting Transcript:\n\n${transcript}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: getEmailErrorMessage(error) }, { status: 500 });
  }
}
