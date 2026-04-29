import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '~/contexts/ThemeContext'
import styles from './Header.module.scss'

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Navbar
      expand="lg"
      variant={theme === 'dark' ? 'dark' : 'light'}
      fixed="top"
      className={styles.header}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.brand}>
          Truyen<span>SS</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className={styles.navLink} end>
              Trang Chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/the-loai" className={styles.navLink}>
              Thể Loại
            </Nav.Link>
            <Nav.Link as={NavLink} to="/xep-hang" className={styles.navLink}>
              Xếp Hạng
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            <Button
              variant="link"
              onClick={toggleTheme}
              className="text-decoration-none me-3"
              style={{ fontSize: '1.2rem', color: 'var(--app-text)' }}
              title={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <Button variant="outline-primary" className="rounded-pill px-4">
              Đăng nhập
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
