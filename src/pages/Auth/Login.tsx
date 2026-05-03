import React, { useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { AUTH_ROUTE_REGISTER } from './constants'
import styles from './AuthForm.module.scss'

export const Login: React.FC = () => {
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')
    if (!email || !password) return
    setNotice('Backend đăng nhập chưa được kết nối. Đây là giao diện chuẩn bị cho API.')
  }

  return (
    <>
      <Helmet>
        <title>Đăng nhập - TruyenSS</title>
      </Helmet>

      <Container className={styles.page}>
        <div className={styles.card}>
          <Link to="/" className={styles.brand}>
            Truyen<span>SS</span>
          </Link>
          <p className={styles.lead}>Đăng nhập để đồng bộ theo dõi và bình luận (khi có API).</p>
          <h1 className={styles.title}>Đăng nhập</h1>

          {notice ? (
            <Alert variant="warning" className="mb-3 py-2 small" onClose={() => setNotice(null)} dismissible>
              {notice}
            </Alert>
          ) : null}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className={styles.field} controlId="login-email">
              <Form.Label className={styles.label}>Email</Form.Label>
              <Form.Control
                className={styles.input}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </Form.Group>
            <Form.Group className={styles.field} controlId="login-password">
              <Form.Label className={styles.label}>Mật khẩu</Form.Label>
              <Form.Control
                className={styles.input}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </Form.Group>
            <Form.Check type="checkbox" id="login-remember" label="Ghi nhớ đăng nhập" className={`mb-3 ${styles.check}`} />
            <Button type="submit" variant="warning" className={`text-dark ${styles.submit}`}>
              Đăng nhập
            </Button>
          </Form>

          <p className={styles.switch}>
            Chưa có tài khoản? <Link to={AUTH_ROUTE_REGISTER}>Đăng ký</Link>
          </p>
        </div>
      </Container>
    </>
  )
}
