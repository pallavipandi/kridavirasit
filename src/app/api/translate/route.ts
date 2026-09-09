import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, from, to } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const prompt = `
Translate the following text from ${from} to ${to}.

Rules:
- Give only the translation.
- Preserve the meaning.
- Use natural spoken Tamil when translating to Tamil.
- Do not add explanations.

Text:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      translation: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}