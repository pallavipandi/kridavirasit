import pyttsx3


def speak(text, language="en"):
    engine = pyttsx3.init()

    voices = engine.getProperty("voices")

    # Try to find a voice matching the requested language
    selected_voice = None

    for voice in voices:
        voice_info = str(voice).lower()

        if language.lower() in voice_info:
            selected_voice = voice.id
            break

    if selected_voice:
        engine.setProperty("voice", selected_voice)

    engine.setProperty("rate", 150)
    engine.setProperty("volume", 1.0)

    engine.say(text)
    engine.runAndWait()


if __name__ == "__main__":
    speak("Welcome to Kridavirasat", "en")