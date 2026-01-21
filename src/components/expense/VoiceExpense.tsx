// export default function VoiceExpense() {
//   return (
//     <div className="voice-box">
//       <button>🎙 Start Recording</button>
//       <p>
//         Example: “Lunch 50 dollars today”
//       </p>
//     </div>
//   );
// }
// import { useRef, useState } from "react";
// import type { Expense } from "../../types/expense";

// interface Props {
//   onAdd: (expense: Expense) => void;
//   onBack: () => void;
// }

// export default function VoiceExpense({ onAdd, onBack }: Props) {
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const chunks = useRef<Blob[]>([]);
//   const [recording, setRecording] = useState(false);

//   const startRecording = async () => {
//     console.log("START RECORD CLICKED");

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     chunks.current = [];

//     recorder.ondataavailable = (e) => {
//       console.log("DATA AVAILABLE", e.data.size);
//       chunks.current.push(e.data);
//     };

//     recorder.onstop = async () => {
//       console.log("ON STOP FIRED");

//       const blob = new Blob(chunks.current, { type: "audio/webm" });
//       console.log("FINAL BLOB SIZE:", blob.size);

//       if (blob.size === 0) {
//         alert("No audio recorded");
//         return;
//       }

//       const fd = new FormData();
//       fd.append("file", blob);

//       const res = await fetch("http://localhost:8000/voice-expense", {
//         method: "POST",
//         body: fd,
//       });

//       const expense: Expense = await res.json();
//       console.log("VOICE EXPENSE:", expense);

//       onAdd(expense);
//     };

//     recorder.start();
//     mediaRecorder.current = recorder;
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     console.log("STOP RECORD CLICKED");

//     if (!mediaRecorder.current) {
//       console.error("NO MEDIA RECORDER");
//       return;
//     }

//     mediaRecorder.current.stop();
//     mediaRecorder.current.stream.getTracks().forEach((t) => t.stop());

//     setRecording(false);
//   };

//   return (
//     <div>
//       <button onClick={onBack}>Back</button>

//       {!recording ? (
//         <button onClick={startRecording}>🎙 Start</button>
//       ) : (
//         <button onClick={stopRecording}>⏹ Stop</button>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import type { Expense } from "../../types/expense";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Props {
  onAdd: (expense: Expense) => void;
  onBack: () => void;
}

export default function VoiceExpense({ onAdd, onBack }: Props) {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return <p>Speech recognition not supported</p>;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  const startRecording = () => {
    setListening(true);
    recognition.start();
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setText(transcript);
    setListening(false);

    const expense = parseExpense(transcript);
    if (expense) {
      console.log("VOICE EXPENSE:", expense);
      onAdd(expense); // 🔥 ĐẨY LÊN PAGE
    }
  };

  recognition.onerror = () => {
    setListening(false);
    alert("Voice recognition error");
  };

  // 🧠 Parse speech → Expense (PHẢI ĐỦ FIELD)
  const parseExpense = (speech: string): Expense | null => {
    const amountMatch = speech.match(/\d+(\.\d+)?/);
    if (!amountMatch) return null;

    const amount = -Number(amountMatch[0]); // expense = âm
    const name = speech.replace(amountMatch[0], "").trim();

    return {
      id: Date.now(),
      name: name || "Voice Expense",
      category: "Others",
      amount,
      date: new Date().toISOString().slice(0, 10),
      voiceText: speech,
      icon: "🎤",
    };
  };

  return (
    <div className="voice-box">
      <button onClick={onBack}>Back</button>

      <button onClick={startRecording} disabled={listening}>
        {listening ? "🎙 Listening..." : "🎙 Start Recording"}
      </button>

      <p>Example: “Lunch 50 dollars today”</p>

      {text && (
        <p>
          <b>You said:</b> {text}
        </p>
      )}
    </div>
  );
}
