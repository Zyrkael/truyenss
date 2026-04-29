import React from 'react'
import { Badge, Col, Container, Row, Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useParams } from 'react-router-dom'
import { getComicDetail } from '~services/comic'
import styles from './ComicDetail.module.scss'

export const ComicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comic-detail', slug],
    queryFn: () => getComicDetail(slug ?? ''),
    enabled: Boolean(slug),
  })

  if (!slug) return <Navigate to="/404" replace />

  if (isLoading) {
    return (
      <div className={styles.loadingOverlay}>
        <Spinner animation="border" variant="light" role="status" />
        <p className={styles.loadingText}>Đang tải thông tin truyện...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Container className="py-4">
        <p>Không thể tải chi tiết truyện. Vui lòng thử lại sau.</p>
      </Container>
    )
  }

  return (
    <>
      <Helmet>
        <title>{data.title} - TruyenSS</title>
        <meta name="description" content={data.description.slice(0, 160)} />
      </Helmet>

      <Container className="py-4">
        <Row className="g-4">
          <Col xs={12} md={4} lg={3}>
            <img src={data.coverUrl} alt={data.title} className={styles.coverImage} />
          </Col>

          <Col xs={12} md={8} lg={9}>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.description}>
              {data.description || 'Chưa có mô tả.'}
            </p>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {data.categories.map(category => (
                <Badge key={category} bg="secondary">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="d-grid gap-2">
              <div>
                <strong>Tác giả:</strong> {data.author}
              </div>
              <div>
                <strong>Trạng thái:</strong> {data.status}
              </div>
              <div>
                <strong>Chương mới nhất:</strong> {data.latestChapter}
              </div>
              <div>
                <strong>Tổng số chương:</strong> {data.chapterCount}
              </div>
              <div>
                <strong>Cập nhật:</strong> {data.updatedAt}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
