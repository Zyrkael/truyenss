import React, { useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { AUTH_ROUTE_LOGIN } from './constants'
import styles from './AuthForm.module.scss'

const MIN_PASSWORD_LEN = 8

export const Register: React.FC = () => {
  const [notice, setNotice] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldError(null)
    const fd = new FormData(e.currentTarget)
    const displayName = String(fd.get('displayName') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')
    const confirm = String(fd.get('confirmPassword') ?? '')
    const agree = fd.get('agree') === 'yes'
    if (!email || !password) return
    if (password.length < MIN_PASSWORD_LEN) {
      setFieldError(`Mật khẩu cần ít nhất ${MIN_PASSWORD_LEN} ký tự.`)
      return
    }
    if (password !== confirm) {
      setFieldError('Mật khẩu xác nhận không khớp.')
      return
    }
    if (!agree) {
      setFieldError('Vui lòng đồng ý điều khoản sử dụng.')
      return
    }
    setNotice(
      `Yêu cầu đăng ký cho "${displayName || email}" đã được ghi nhận trên giao diện. Backend chưa kết nối.`,
    )
  }

  return (
    <>
      <Helmet>
        <title>Đăng ký - TruyenSS</title>
      </Helmet>

      <Container className={styles.page}>
        <div className={styles.card}>
          <Link to="/" className={styles.brand}>
            Truyen<span>SS</span>
          </Link>
          <p className={styles.lead}>Tạo tài khoản để lưu truyện theo dõi và tham gia cộng đồng (khi có API).</p>
          <h1 className={styles.title}>Đăng ký</h1>

          {notice ? (
            <Alert variant="warning" className="mb-3 py-2 small" onClose={() => setNotice(null)} dismissible>
              {notice}
            </Alert>
          ) : null}
          {fieldError && !notice ? (
            <Alert variant="danger" className="mb-3 py-2 small">
              {fieldError}
            </Alert>
          ) : null}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className={styles.field} controlId="register-name">
              <Form.Label className={styles.label}>Tên hiển thị (tuỳ chọn)</Form.Label>
              <Form.Control
                className={styles.input}
                type="text"
                name="displayName"
                autoComplete="nickname"
                placeholder="Bạn đọc truyện"
              />
            </Form.Group>
            <Form.Group className={styles.field} controlId="register-email">
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
            <Form.Group className={styles.field} controlId="register-password">
              <Form.Label className={styles.label}>Mật khẩu</Form.Label>
              <Form.Control
                className={styles.input}
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder={`Tối thiểu ${MIN_PASSWORD_LEN} ký tự`}
                required
                minLength={MIN_PASSWORD_LEN}
              />
            </Form.Group>
            <Form.Group className={styles.field} controlId="register-confirm">
              <Form.Label className={styles.label}>Nhập lại mật khẩu</Form.Label>
              <Form.Control
                className={styles.input}
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                minLength={MIN_PASSWORD_LEN}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              id="register-agree"
              name="agree"
              value="yes"
              label={
                <span className={styles.check}>
                  Tôi đồng ý với <Link to="/">điều khoản sử dụng</Link> của TruyenSS.
                </span>
              }
              className="mb-3"
            />
            <Button type="submit" variant="warning" className={`text-dark ${styles.submit}`}>
              Đăng ký
            </Button>
          </Form>

          <p className={styles.switch}>
            Đã có tài khoản? <Link to={AUTH_ROUTE_LOGIN}>Đăng nhập</Link>
          </p>
        </div>
      </Container>
    </>
  )
}
