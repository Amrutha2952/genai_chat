import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

// Theme options
const themes = [
  { name: "Purple-Pink" },
  { name: "Blue-Teal" },
  { name: "Sunset" },
  { name: "Green-Mint" },
];

// Sidebar Component
const Sidebar = ({ sessions, currentSession, setCurrentSession, createNewSession, deleteSession, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState({});
  const toggleMenu = (name) => setMenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="fixed z-20 top-0 left-0 h-full bg-black/30 backdrop-blur-xl border-r border-white/20 flex flex-col p-4 space-y-4 w-64">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-bold text-lg">Sessions</h2>
        <button onClick={createNewSession} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">+New</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {Object.keys(sessions).map((name) => (
          <div key={name} className="relative group">
            <div
              onClick={() => setCurrentSession(name)}
              className={`cursor-pointer px-3 py-2 rounded-md flex justify-between items-center ${
                name === currentSession ? "bg-pink-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span>{name}</span>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleMenu(name); }}
                  className="ml-2 text-white hover:text-gray-300 px-1"
                >
                  ⋮
                </button>
                {menuOpen[name] && (
                  <div className="absolute right-0 top-full bg-black/80 rounded-md p-1 mt-1 z-50 shadow-lg">
                    <button
                      onClick={() => { deleteSession(name); toggleMenu(name); }}
                      className="text-white px-3 py-1 hover:bg-red-600 rounded-md w-full text-left"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="text-white font-medium text-sm">Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full mt-1 rounded-md px-2 py-1 text-sm outline-none"
        >
          {themes.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
        </select>
      </div>
    </div>
  );
};

// Chat Bubble Component
const ChatBubble = ({ msg, typingDots }) => (
  <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
    <div
      style={{ maxWidth: "70%" }}
      className={`px-4 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl break-words shadow-lg font-medium ${
        msg.sender === "user"
          ? "bg-gradient-to-r from-blue-500 to-indigo-700 shadow-black/40 text-white"
          : "bg-gradient-to-r from-green-500 to-teal-700 shadow-black/40 text-white relative"
      }`}
    >
      {msg.text === "__typing__" ? typingDots : <ReactMarkdown>{msg.text}</ReactMarkdown>}

      {msg.sender === "bot" && msg.text !== "__typing__" && (
        <button
          onClick={() => navigator.clipboard.writeText(msg.text)}
          className="absolute top-1 right-1 bg-white/20 hover:bg-white/40 text-white text-lg p-2 rounded-full shadow-md transition-all duration-200"
          title="Copy Reply"
        >
          📋
        </button>
      )}
    </div>
  </div>
);

// Chat Input Component
const ChatInput = ({ input, setInput, sendMessage, setSessionInputs, currentSession }) => (
  <div className="flex items-center p-3 sm:p-5 border-t border-white/30 bg-black/30 backdrop-blur-md">
    <input
      type="text"
      placeholder="Type your message..."
      value={input}
      onChange={(e) => {
        setInput(e.target.value);
        setSessionInputs(prev => ({ ...prev, [currentSession]: e.target.value }));
      }}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      className="flex-1 px-4 py-2 sm:px-5 sm:py-3 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none shadow-lg text-gray-100 placeholder-gray-400 text-sm sm:text-base bg-black/50"
    />
    <button
      onClick={sendMessage}
      className="ml-3 sm:ml-4 px-5 py-2 sm:px-6 sm:py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-xl text-sm sm:text-base"
    >
      Send
    </button>
  </div>
);

export default function App() {
  // Load sessions from localStorage (per device)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("chatSessions");
    return saved ? JSON.parse(saved) : { default: [{ sender: "bot", text: "Hello! How can I help you today?" }] };
  });
  const [currentSession, setCurrentSession] = useState(Object.keys(sessions)[0]);
  const [messages, setMessages] = useState([...sessions[currentSession]]);
  const [sessionInputs, setSessionInputs] = useState({});
  const [input, setInput] = useState(sessionInputs[currentSession] || "");
  const [theme, setTheme] = useState(localStorage.getItem("bgTheme") || themes[0].name);
  const [typingDots, setTypingDots] = useState(".");

  const messagesEndRef = useRef(null);
  const typingInterval = useRef(null);

  // Update messages & input when switching session
  useEffect(() => {
    setMessages([...sessions[currentSession]]);
    setInput(sessionInputs[currentSession] || "");
  }, [currentSession, sessions, sessionInputs]);

  // Persist theme
  useEffect(() => localStorage.setItem("bgTheme", theme), [theme]);

  // Scroll to bottom
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typingDots]);

  // Typing animation
  useEffect(() => {
    if (messages[messages.length - 1]?.text === "__typing__") {
      typingInterval.current = setInterval(() => {
        setTypingDots(prev => (prev.length < 3 ? prev + "." : "."));
      }, 500);
    } else clearInterval(typingInterval.current);
    return () => clearInterval(typingInterval.current);
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: "user", text: input }, { sender: "bot", text: "__typing__" }];
    setMessages(updatedMessages);

    // Update session messages
    const updatedSessions = { ...sessions, [currentSession]: [...updatedMessages] };
    setSessions(updatedSessions);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botText = data.response || "Oops! Something went wrong.";

      const finalMessages = [...updatedMessages.slice(0, -1), { sender: "bot", text: botText }];
      setMessages(finalMessages);

      const finalSessions = { ...sessions, [currentSession]: [...finalMessages] };
      setSessions(finalSessions);
      localStorage.setItem("chatSessions", JSON.stringify(finalSessions));
    } catch (err) {
      const errorMessages = [...updatedMessages.slice(0, -1), { sender: "bot", text: "Oops! Something went wrong." }];
      setMessages(errorMessages);
      const errorSessions = { ...sessions, [currentSession]: [...errorMessages] };
      setSessions(errorSessions);
      localStorage.setItem("chatSessions", JSON.stringify(errorSessions));
    }

    // Clear input for this session
    setSessionInputs(prev => ({ ...prev, [currentSession]: "" }));
    setInput("");
  };

  const createNewSession = () => {
    const name = prompt("Enter session name:");
    if (!name || sessions[name]) return;
    const defaultMsg = [{ sender: "bot", text: "Hello! How can I help you today?" }];
    const updatedSessions = { ...sessions, [name]: [...defaultMsg] };
    setSessions(updatedSessions);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
    setCurrentSession(name);
    setMessages([...defaultMsg]);
    setSessionInputs(prev => ({ ...prev, [name]: "" }));
    setInput("");
  };

  const deleteSession = (name) => {
    const updated = { ...sessions };
    delete updated[name];
    setSessions(updated);
    localStorage.setItem("chatSessions", JSON.stringify(updated));

    const updatedInputs = { ...sessionInputs };
    delete updatedInputs[name];
    setSessionInputs(updatedInputs);

    if (name === currentSession) {
      const remaining = Object.keys(updated);
      if (remaining.length) {
        setCurrentSession(remaining[0]);
        setMessages([...updated[remaining[0]]]);
        setInput(updatedInputs[remaining[0]] || "");
      } else {
        const defaultMsg = [{ sender: "bot", text: "Hello! How can I help you today?" }];
        setCurrentSession("default");
        setMessages([...defaultMsg]);
        setSessions({ default: [...defaultMsg] });
        localStorage.setItem("chatSessions", JSON.stringify({ default: [...defaultMsg] }));
        setSessionInputs({ default: "" });
        setInput("");
      }
    }
  };

  const clearSession = () => {
    const defaultMsg = [{ sender: "bot", text: "Hello! How can I help you today?" }];
    setMessages([...defaultMsg]);
    const updatedSessions = { ...sessions, [currentSession]: [...defaultMsg] };
    setSessions(updatedSessions);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
    setSessionInputs(prev => ({ ...prev, [currentSession]: "" }));
    setInput("");
  };

  return (
    <div className="relative h-screen w-screen flex overflow-hidden font-sans">
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        createNewSession={createNewSession}
        deleteSession={deleteSession}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="flex-1 flex flex-col ml-64 bg-black/20 backdrop-blur-xl rounded-l-2xl shadow-xl">
        <div className="p-4 border-b border-white/30 flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">Welcome to GenAI Chat</h1>
            <p className="text-white/70 text-sm mt-1">Start chatting or select a session from the left.</p>
          </div>
          <button onClick={clearSession} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} msg={msg} typingDots={typingDots} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          setSessionInputs={setSessionInputs}
          currentSession={currentSession}
        />
      </div>
    </div>
  );
}
