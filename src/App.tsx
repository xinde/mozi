import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { DictionaryPage } from './pages/DictionaryPage'
import { ReaderPage } from './pages/ReaderPage'

function NotFound() {
  return (
    <div className="page not-found">
      <span>迷</span>
      <h1>这一页走丢了</h1>
      <p>回到字典，继续认识一个新字。</p>
      <Link className="primary-button" to="/dictionary">回到字典</Link>
    </div>
  )
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dictionary" replace />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/reader" element={<ReaderPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}
