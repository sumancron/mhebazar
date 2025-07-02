/* eslint-disable @typescript-eslint/no-explicit-any */


import { Search, Mic } from "lucide-react";
import { useRef, useState } from "react";

// TypeScript support for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Start/stop voice recognition
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setListening(false);
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }

    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by Products, Category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
        autoComplete="off"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <button
        type="button"
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1 transition
          ${listening ? "bg-green-100 animate-pulse shadow-lg" : "hover:bg-gray-100"}
        `}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        onClick={handleMicClick}
      >
        <Mic className={`w-4 h-4 ${listening ? "text-green-600" : "text-gray-400"}`} />
        {listening && (
          <span className="absolute -top-2 -right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
        )}
      </button>
      {listening && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white border border-green-200 rounded px-2 py-1 text-xs text-green-700 shadow animate-fade-in">
          Listening...
        </div>
      )}
    </div>
  );
}