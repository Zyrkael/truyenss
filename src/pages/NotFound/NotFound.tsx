import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>404 - Không tìm thấy trang</title>
      </Helmet>
      <Container
        className="d-flex flex-column justify-content-center align-items-center text-center py-5"
        style={{ minHeight: '60vh' }}
      >
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            color: '#3498db',
            textShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
          }}
        >
          404
        </h1>
        <h2 className="mb-4">Ối! Trang này không tồn tại.</h2>
        <p style={{ color: 'var(--app-text-muted)', maxWidth: '500px', marginBottom: '30px' }}>
          Có vẻ như bạn đã đi lạc vào một không gian rạn nứt. Trang bạn đang tìm kiếm đã bị dịch
          chuyển hoặc chưa từng tồn tại.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
          style={{ borderRadius: '25px', padding: '10px 30px' }}
        >
          Trở về trang chủ
        </Button>
      </Container>
    </>
  )
}
