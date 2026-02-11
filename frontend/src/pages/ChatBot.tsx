import { useState } from "react";
import "../styles/ChatBot.css";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "안녕하세요 👋 약 이름을 입력해 주세요." },
  ]);
  const [input, setInput] = useState("");

  const fetchDrugInfo = async (drugName: string) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/drug-info?itemName=${encodeURIComponent(drugName)}`
    );
    const data = await res.json(); // JSON으로 바로 받음

    const item = data.body.items[0]; // 첫 번째 약 정보 가져오기
    if (!item) return "정보가 없습니다 😢";

    return `
📌 ${item.itemName} 정보

💊 효능
${item.efcyQesitm ?? "정보 없음"}

📖 사용법
${item.useMethodQesitm ?? "정보 없음"}

⚠️ 주의사항
${item.atpnQesitm ?? "정보 없음"}
    `;
  } catch (error) {
    return "약 정보를 불러오지 못했습니다 😢";
  }
};

  // ✅ 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    // 사용자 메시지 먼저 추가
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // API 호출
    const replyText = await fetchDrugInfo(input);

    const botReply = {
      role: "bot",
      text: replyText,
    };

    setMessages((prev) => [...prev, botReply]);
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* 챗봇 창 */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            💊 약 상담 챗봇
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="약 이름을 입력하세요..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
    </>
  );
}