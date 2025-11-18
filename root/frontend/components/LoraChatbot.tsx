import { useState } from "react";
import axios from "axios";
import "../chatbot.css";

export default function LoraChatbot() {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [documentPath, setDocumentPath] = useState("");
  const [listening, setListening] = useState(false);

  const speakReply = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.pitch = 1.3;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const startVoiceInput = () => {
    const Recognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Recognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, `🧑 You: ${message}`]);

    const res = await axios.post("http://localhost:5000/chat", {
      message,
      documentPath,
    });

    const reply = res.data.reply;

    speakReply(reply); // TTS playback

    setChat((prev) => [...prev, `👧 Lora: ${reply}`]);
    setMessage("");
  };

  return (
    <>
      {!isOpen && (
        <div className="chat-icon" onClick={() => setOpen(true)}>
          <img src="/lora-avatar.png" alt="Lora" />
        </div>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <img src="/lora-avatar.png" alt="Lora" />
            <span>Lora — Your Contract Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {chat.map((c, i) => (
              <p key={i}>{c}</p>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask or speak to Lora..."
            />

            <button
              onClick={startVoiceInput}
              className={`voice-button ${listening ? 'listening' : ''}`}
            >
              🎙
            </button>

            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
