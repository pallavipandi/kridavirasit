const PYTHON_SERVER = "http://127.0.0.1:5000";

export async function speakText(
  text: string,
  language: string = "en"
) {
  try {
    const response = await fetch(
      `${PYTHON_SERVER}/tts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "TTS request failed"
      );
    }

    return data;

  } catch (error) {

    console.error(
      "TTS connection error:",
      error
    );

    throw error;
  }
}


export async function listenToSpeech() {
  try {

    const response = await fetch(
      `${PYTHON_SERVER}/stt`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "STT request failed"
      );
    }

    return data;

  } catch (error) {

    console.error(
      "STT connection error:",
      error
    );

    throw error;
  }
}