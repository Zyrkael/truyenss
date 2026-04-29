import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

export const Forbidden: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>403 - Không có quyền truy cập</title>
      </Helmet>
      <Container
        className="d-flex flex-column justify-content-center align-items-center text-center py-5"
        style={{ minHeight: '60vh' }}
      >
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            color: '#e74c3c',
            textShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
          }}
        >
          403
        </h1>
        <h2 className="mb-4">Khu vực cấm thuật!</h2>
        <p style={{ color: 'var(--app-text-muted)', maxWidth: '500px', marginBottom: '30px' }}>
          Bạn không có đủ ma lực (quyền) để tiến vào khu vực này. Vui lòng đăng nhập bằng tài khoản
          có thẩm quyền cao hơn.
        </p>
        <Button
          variant="danger"
          size="lg"
          onClick={() => navigate('/')}
          style={{ borderRadius: '25px', padding: '10px 30px' }}
        >
          Trở về an toàn
        </Button>
      </Container>
    </>
  )
}
