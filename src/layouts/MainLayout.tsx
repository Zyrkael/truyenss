import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '~components/Header'
import styles from './MainLayout.module.scss'

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerBrand}>
            Truyen<span>SS</span>
          </p>
          <p className={styles.footerNote}>
            &copy; {new Date().getFullYear()} TruyenSS — Nền tảng đọc truyện tranh trực tuyến.
          </p>
        </div>
      </footer>
    </div>
  )
}
