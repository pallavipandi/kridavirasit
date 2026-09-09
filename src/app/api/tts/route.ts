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

    const body = await request.json();

    const text =
      typeof body.text === "string"
        ? body.text.trim()
        : "";

    const language =
      typeof body.language === "string"
        ? body.language
        : "Tamil";

    if (!text) {
      return NextResponse.json(
        {
          error: "No text provided.",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",

        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Speak the following ${language} text naturally and clearly.

This is for a language-learning application.

Text:
${text}`,
              },
            ],
          },
        ],

        config: {
          responseModalities: ["AUDIO"],

          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Kore",
              },
            },
          },
        },
      });

    const audioPart =
      response.candidates?.[0]?.content?.parts?.find(
        (part: any) =>
          part.inlineData?.data
      );

    if (!audioPart?.inlineData?.data) {
      return NextResponse.json(
        {
          error:
            "Gemini did not return any audio.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      audio: audioPart.inlineData.data,
      mimeType:
        audioPart.inlineData.mimeType ||
        "audio/L16;rate=24000",
    });
  } catch (error) {
    console.error(
      "TEXT TO SPEECH ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate Tamil speech.",
      },
      { status: 500 }
    );
  }
}