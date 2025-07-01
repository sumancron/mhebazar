/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useState } from "react";
import { Search, Mic } from "lucide-react";

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
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<null | SpeechRecognition>(null);

  // Only run in browser
  const isSpeechSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const handleMicClick = () => {
    if (!isSpeechSupported) return;
    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window.SpeechRecognition || window.webkitSpeechRecognition) as typeof window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let final = "";
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += transcript;
          else interimText += transcript;
        }
        if (final) setSearchQuery(final.trim());
        setInterim(interimText);
      };
      recognition.onend = () => {
        setListening(false);
        setInterim("");
      };
      recognitionRef.current = recognition;
    }
    if (!listening) {
      setListening(true);
      setInterim("");
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
        value={interim ? `${searchQuery} ${interim}` : searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value);
          setInterim("");
        }}
        className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        autoComplete="off"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <button
        type="button"
        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 transition
          ${listening ? "bg-green-100 shadow" : "hover:bg-gray-100"}
        `}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        onClick={handleMicClick}
        disabled={!isSpeechSupported}
      >
        <Mic className={`w-5 h-5 ${listening ? "text-green-600 animate-pulse" : "text-gray-400"}`} />
      </button>
      {listening && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-700 shadow animate-fade-in flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Listening...
        </div>
      )}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-50%) scale(0.95);}
          to { opacity: 1; transform: translateY(-50%) scale(1);}
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}