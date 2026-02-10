//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode> 태그 삭제함(이렇게 하면 게시판 조회수 증가 시 2번씩 호출되는 문제 해결됨)
    <App />
  // </StrictMode> 태그 삭제함
)
