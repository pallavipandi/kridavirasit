from flask import Flask, request, jsonify
from flask_cors import CORS

from tts import speak
from stt import listen


app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "KRIDAVIRASAT Python server is running",
        "status": "success"
    })


@app.route("/tts", methods=["POST"])
def text_to_speech():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No JSON data received"
        }), 400

    text = data.get("text", "")
    language = data.get("language", "en")

    if not text:
        return jsonify({
            "error": "Text is required"
        }), 400

    try:

        speak(text, language)

        return jsonify({
            "success": True,
            "message": "Speech completed"
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


@app.route("/stt", methods=["POST"])
def speech_to_text():

    try:

        text = listen()

        return jsonify({
            "success": True,
            "text": text
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


if __name__ == "__main__":

    print("----------------------------------------")
    print(" KRIDAVIRASAT PYTHON SERVER")
    print("----------------------------------------")
    print("TTS endpoint: http://127.0.0.1:5000/tts")
    print("STT endpoint: http://127.0.0.1:5000/stt")
    print("----------------------------------------")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )