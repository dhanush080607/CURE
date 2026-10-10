import { useState, useRef, useEffect, useCallback } from "react";
import { AI_KNOWLEDGE_BASE } from "../data/mockWeatherData";

export default function AiAssistantPanel({ onClose, initialPrompt }) {
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "ai",
      text: AI_KNOWLEDGE_BASE.greetings,
      bullets: AI_KNOWLEDGE_BASE.defaultBullets,
      time: "17:30 UTC",
      sources: ["NOAA GOES-16", "GFS 0.25°", "ECMWF IFS"]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSendPrompt = useCallback((textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: "Just now"
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Generate intelligent contextual response
    setTimeout(() => {
      let responseText = AI_KNOWLEDGE_BASE.qaResponses.default;
      const lower = query.toLowerCase();

      if (lower.includes("evelyn") || lower.includes("storm") || lower.includes("hurricane") || lower.includes("track")) {
        responseText = AI_KNOWLEDGE_BASE.qaResponses.evelyn;
      } else if (lower.includes("rain") || lower.includes("precip") || lower.includes("flood")) {
        responseText = AI_KNOWLEDGE_BASE.qaResponses.rainfall;
      } else if (lower.includes("wind") || lower.includes("gust") || lower.includes("shear")) {
        responseText = AI_KNOWLEDGE_BASE.qaResponses.wind;
      } else if (lower.includes("aviation") || lower.includes("flight") || lower.includes("airport")) {
        responseText = AI_KNOWLEDGE_BASE.qaResponses.aviation;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: responseText,
          time: "Just now",
          sources: ["NOAA NHC", "High-Resolution Ensemble Forecast (HREF)"]
        }
      ]);
      setIsTyping(false);
    }, 600);
  }, []);

  const lastPromptRef = useRef("");

  // Handle incoming initialPrompt if triggered from outside
  useEffect(() => {
    if (initialPrompt && initialPrompt !== lastPromptRef.current) {
      lastPromptRef.current = initialPrompt;
      const timer = setTimeout(() => {
        handleSendPrompt(initialPrompt);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, handleSendPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  return (
    <div className="rounded-3xl bg-[#090f1f]/90 border border-violet-500/30 p-5 shadow-2xl backdrop-blur-2xl flex flex-col h-[380px] relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-600/10 via-cyan-500/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-xs shadow-md">
            ✨
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
              AI Climate Intelligence Assistant
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                ONLINE
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Predictive risk synthesis & meteorological telemetry
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Conversation Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-md"
                  : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-sm"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.bullets && (
                <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-300">
                  {msg.bullets.map((b, i) => (
                    <li key={i} className="text-[11px] leading-tight">
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {msg.sources && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[9px] font-mono text-cyan-300/80">
                  <span>🛰️ Sources:</span>
                  <span>{msg.sources.join(" · ")}</span>
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 font-mono">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 p-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            <span className="text-[10px] ml-1">Analyzing meteorological telemetry...</span>
          </div>
        )}
      </div>

      {/* Suggested Question Chips */}
      <div className="shrink-0 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {AI_KNOWLEDGE_BASE.suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(q)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 whitespace-nowrap transition-colors font-medium shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field & Send Button */}
      <form onSubmit={handleSubmit} className="shrink-0 flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask anything about weather or operational risks..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 text-white shadow-md transition-all shrink-0"
          title="Send query"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}
