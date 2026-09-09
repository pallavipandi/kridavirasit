import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is missing. Add it to .env.local and restart the server.",
        },
        { status: 500 }
      );
    }

    const formData =
      await request.formData();

    const audio = formData.get(
      "audio"
    ) as File | null;

    const languageValue =
      formData.get("language");

    const language =
      typeof languageValue === "string" &&
      languageValue.trim()
        ? languageValue.trim()
        : "Tamil";

    if (!audio) {
      return NextResponse.json(
        {
          error:
            "No audio file received.",
        },
        { status: 400 }
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error:
            "The recorded audio is empty.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer =
      await audio.arrayBuffer();

    const base64Audio =
      Buffer.from(
        arrayBuffer
      ).toString("base64");

    /*
     * The browser normally records
     * using WebM/Opus in Chrome.
     */
    const mimeType =
      audio.type || "audio/webm";

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: [
          {
            role: "user",

            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Audio,
                },
              },

              {
                text: `You are a speech recognition assistant for a language-learning website.

The target language is ${language}.

Listen carefully to the uploaded audio.

Transcribe exactly what the user said.

Return ONLY the transcription in ${language}.

Do not explain anything.
Do not translate it.
Do not add quotation marks.

If the speech is unclear, return the closest understandable transcription.`,
              },
            ],
          },
        ],
      });

    const text =
      response.text?.trim() || "";

    console.log(
      "Tamil STT result:",
      text
    );

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error: unknown) {
    console.error(
      "Tamil STT API error:",
      error
    );

    let message =
      "Could not recognize Tamil speech.";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}