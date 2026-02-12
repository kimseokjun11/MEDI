
import { useState, useRef, useEffect } from "react";
import "../styles/ChatBot.css";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "안녕하세요 👋 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");

  /* ✅ 스크롤 기준 ref */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ✅ 메시지 갱신 시 자동 스크롤 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ✅ 약 정보 API */
  const fetchDrugInfo = async (drugName: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/drug?itemName=${encodeURIComponent(drugName)}`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        return null; // 👉 없으면 AI로 넘김
      }

      const item = data[0];

      return `📌 ${item.itemName}

🏢 제조사: ${item.entpName ?? "정보 없음"}

💊 효능:
${item.efcyQesitm ?? "정보 없음"}`;
    } catch (error) {
      return "약 정보를 불러오지 못했습니다 😢";
    }
  };

  /* ✅ Groq AI 호출 */
  const fetchAIReply = async (message: string) => {
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ***REMOVED***",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content: `
                너는 한국어로만 대화하는 챗봇이다.
                자연스러운 한국어만 사용한다.
                한자 및 다른 언어 절대절대 정말로 금한다 절대 사용 금지.
                항상 존댓말 사용. 말을 좀 간략하게해
                `,
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log("Groq 응답:", data);

      if (data.error) {
        console.error("Groq 에러:", data.error);
        return `에러: ${data.error.message}`;
      }

      return data.choices?.[0]?.message?.content ?? "응답 없음 🤖";
    } catch (error) {
      console.error("Groq 호출 실패:", error);
      return "AI 응답 실패 😢";
    }
  };

  /* ✅ 메시지 전송 */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    /* 사용자 메시지 추가 */
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    /* 1️⃣ 약 정보 먼저 확인 */
    const drugReply = await fetchDrugInfo(userText);

    if (drugReply) {
      setMessages((prev) => [...prev, { role: "bot", text: drugReply }]);
      return;
    }

    /* 2️⃣ 일반 AI 대화 */
    const aiReply = await fetchAIReply(userText);

    setMessages((prev) => [...prev, { role: "bot", text: aiReply }]);
  };

  return (
    <>
      {/* ✅ 플로팅 버튼 */}
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* ✅ 챗봇 창 */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">💊 약 상담 챗봇</div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}

            {/* ✅ 자동 스크롤 기준점 */}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
    </>
  );
}