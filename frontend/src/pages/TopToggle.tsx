import { useLocation, useNavigate } from "react-router-dom";
import "../styles/TopToggle.css";

type ToggleItem = {
  label: string;
  path: string;
};

const items: ToggleItem[] = [
  { label: "건강", path: "/medicine" },
  { label: "의약", path: "/drug" },
];

export default function TopToggle() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 현재 경로가 /medicine 으로 시작하면 "건강", 아니면 "의약" 활성화(원하면 로직 바꿔도 됨)
  const activePath = pathname.startsWith("/medicine") ? "/medicine" : "/drug";

  return (
    <div className="toggleWrap" role="tablist" aria-label="페이지 토글">
      {items.map((it) => {
        const active = activePath === it.path;
        return (
          <button
            key={it.path}
            type="button"
            className={`toggleBtn ${active ? "active" : ""}`}
            role="tab"
            aria-selected={active}
            onClick={() => navigate(it.path)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}