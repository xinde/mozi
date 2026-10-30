import { BookOpenText, Search } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="app-header">
        <NavLink className="wordmark" to="/" aria-label="墨字首页">
          <span className="wordmark-seal" aria-hidden="true">墨</span>
          <span><strong>墨字</strong><small>随身汉字课</small></span>
        </NavLink>
        <span className="offline-mark"><i aria-hidden="true" /> 可离线使用</span>
      </header>
      <main id="main-content">{children}</main>
      <nav className="bottom-nav" aria-label="主要导航">
        <NavLink to="/dictionary" className={({ isActive }) => isActive ? 'active' : ''}>
          <Search aria-hidden="true" /><span>查字典</span>
        </NavLink>
        <NavLink to="/reader" className={({ isActive }) => isActive ? 'active' : ''}>
          <BookOpenText aria-hidden="true" /><span>读文章</span>
        </NavLink>
      </nav>
    </div>
  )
}
