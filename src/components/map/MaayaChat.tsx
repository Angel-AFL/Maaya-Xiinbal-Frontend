import { useState } from "react";

interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

export default function MaayaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "ia"; text: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: geminiHistory,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { sender: "ia", text: data.response }]);
        setGeminiHistory((prev) => [
          ...prev,
          { role: "user", parts: [{ text: userText }] },
          { role: "model", parts: [{ text: data.response }] },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ia", text: "Conexión interrumpida. Intenta de nuevo." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-maya-negro/10">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-maya-verde/10 hover:bg-maya-verde/20 transition-colors p-3 rounded-xl border border-maya-verde/20 flex items-center gap-3 text-left"
        >
          <div className="w-8 h-8 rounded-full bg-maya-verde flex items-center justify-center text-white font-bold shrink-0">
            IA
          </div>
          <div>
            <p className="text-xs font-bold text-maya-negro">
              ¡Pregúntale a Mayita!
            </p>
            <p className="text-xs text-maya-negro/60">
              Arma tu itinerario aquí
            </p>
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-maya-negro/10 flex flex-col h-72 shadow-inner">
          <div className="flex justify-between items-center p-2 border-b border-maya-negro/5 bg-maya-verde/10 rounded-t-xl">
            <span className="text-xs font-bold text-maya-verde flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-maya-verde animate-pulse"></div>
              ¡Pregúntale a Mayita!
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-maya-negro/50 hover:text-maya-rojo text-lg font-bold px-2"
            >
              &times;
            </button>
          </div>

          <div className="grow p-3 overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-xs text-maya-negro/50 text-center mt-4">
                ¡Hola! Dime qué tipo de aventura buscas en la península.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-2 rounded-lg text-xs ${msg.sender === "user" ? "bg-maya-azul text-white self-end rounded-tr-none" : "bg-maya-negro/5 text-maya-negro self-start rounded-tl-none"}`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="text-xs text-maya-negro/40 self-start">
                Consultando a Mayita...
              </div>
            )}
          </div>

          <div className="p-2 border-t border-maya-negro/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe aquí..."
              className="grow bg-transparent text-xs outline-none text-maya-negro px-2"
            />
            <button
              onClick={handleSend}
              className="bg-maya-amarillo hover:bg-maya-rojo transition-colors text-white p-1.5 rounded-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14M12 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
