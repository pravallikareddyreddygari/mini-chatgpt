import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const provider = process.env.API_PROVIDER || "openrouter";

    if (provider === "openrouter") {
      return await handleOpenRouter(message, req);
    } else {
      return await handleOpenAI(message);
    }

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleOpenRouter(message: string, req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  
  console.log("API Key exists:", !!apiKey);
  console.log("API Key length:", apiKey?.length || 0);
  console.log("Environment:", process.env.NODE_ENV);
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured. Please add OPENROUTER_API_KEY in Vercel environment variables." },
      { status: 500 }
    );
  }

  // Get the site URL dynamically
  const siteUrl = req.headers.get('origin') || req.headers.get('referer') || 'https://your-app.vercel.app';

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": "Mini ChatGPT"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter Error:", data);
    return NextResponse.json(
      { error: data?.error?.message || "OpenRouter API failed" },
      { status: response.status }
    );
  }

  const reply = data?.choices?.[0]?.message?.content || "No response generated";
  return NextResponse.json({ reply });
}

async function handleOpenAI(message: string) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenAI Error:", data);
    return NextResponse.json(
      { error: data?.error?.message || "OpenAI API failed" },
      { status: response.status }
    );
  }

  const reply = data?.choices?.[0]?.message?.content || "No response generated";
  return NextResponse.json({ reply });
}
