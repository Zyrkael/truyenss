import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '~components/Header'

export const MainLayout: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '76px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer can be added here later */}
      <footer
        className="py-4 text-center mt-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p style={{ color: 'var(--app-text-muted)', margin: 0, fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} TruyenSS. Nền tảng đọc truyện trực tuyến.
        </p>
      </footer>
    </div>
  )
}
