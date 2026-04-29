import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ComicCard } from '~components/ComicCard'
import { getHomeComics } from '~services/comic'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const {
    data: comics = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['home-comics'],
    queryFn: getHomeComics,
  })

  return (
    <>
      <Helmet>
        <title>TruyenSS - Trang Chủ</title>
      </Helmet>

      <Container className="py-4">
        <h1 style={{ marginBottom: '30px', fontSize: '2rem' }}>Truyện Mới Cập Nhật</h1>
        {isLoading && <p>Đang tải dữ liệu truyện...</p>}
        {isError && <p>Không thể tải danh sách truyện. Vui lòng thử lại sau.</p>}
        <Row className="g-4">
          {comics.map(comic => (
            <Col key={comic.id} xs={6} sm={4} md={3} lg={2}>
              <ComicCard comic={comic} onClick={slug => navigate(`/truyen/${slug}`)} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}
