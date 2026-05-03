import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup, Container, Form, Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getChapterRead, getComicDetail } from '~services/comic'
import styles from './ComicReader.module.scss'

const ROUTE_HOME = '/'

const readerDocPath = (slug: string, order: number) => `/truyen/${slug}/doc/${order}`

export const ComicReader: React.FC = () => {
  const { slug, chapterOrder: chapterOrderParam } = useParams<{ slug: string; chapterOrder: string }>()
  const navigate = useNavigate()
  const [serverIdx, setServerIdx] = useState(0)

  const order = chapterOrderParam != null ? Number.parseInt(chapterOrderParam, 10) : Number.NaN

  const {
    data: comic,
    isLoading: comicLoading,
    isError: comicError,
  } = useQuery({
    queryKey: ['comic-detail', slug],
    queryFn: () => getComicDetail(slug ?? ''),
    enabled: Boolean(slug),
  })

  const chapterCount = comic?.chapterCount ?? 0
  const safeOrder = useMemo(() => {
    if (!Number.isFinite(order) || order < 0) return 0
    if (chapterCount > 0 && order >= chapterCount) return chapterCount - 1
    return order
  }, [order, chapterCount])

  const servers = comic?.chapterServers ?? []
  const activeServer = servers[serverIdx] ?? servers[0]
  const currentChapter = activeServer?.chapters[safeOrder]
  const chapterApiData = currentChapter?.chapterApiData

  const {
    data: chapterPayload,
    isLoading: pagesLoading,
    isError: pagesError,
    refetch: refetchPages,
  } = useQuery({
    queryKey: ['chapter-read', chapterApiData],
    queryFn: () => getChapterRead(chapterApiData!),
    enabled: Boolean(chapterApiData),
    retry: 1,
  })

  const goPrev = useCallback(() => {
    if (!slug || safeOrder <= 0) return
    navigate(readerDocPath(slug, safeOrder - 1))
  }, [navigate, slug, safeOrder])

  const goNext = useCallback(() => {
    if (!slug || chapterCount < 1 || safeOrder >= chapterCount - 1) return
    navigate(readerDocPath(slug, safeOrder + 1))
  }, [navigate, slug, safeOrder, chapterCount])

  const onChapterSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!slug) return
      const next = Number.parseInt(e.target.value, 10)
      if (!Number.isFinite(next) || next < 0 || next >= chapterCount) return
      navigate(readerDocPath(slug, next))
    },
    [navigate, slug, chapterCount],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug, safeOrder, serverIdx])

  if (!slug) return <Navigate to="/404" replace />

  if (!Number.isFinite(order) || order < 0) {
    return <Navigate to={readerDocPath(slug, 0)} replace />
  }

  if (comicLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" role="status" />
        <p className="text-muted mt-3 mb-0">Đang tải truyện…</p>
      </Container>
    )
  }

  if (comicError || !comic) {
    return (
      <Container className="py-5">
        <div className={styles.errorBox}>Không tải được dữ liệu truyện.</div>
      </Container>
    )
  }

  if (chapterCount === 0) {
    return <Navigate to={`/truyen/${slug}`} replace />
  }

  if (Number.isFinite(order) && order !== safeOrder) {
    return <Navigate to={readerDocPath(comic.slug, safeOrder)} replace />
  }

  const detailPath = `/truyen/${comic.slug}`
  const chName = currentChapter?.chapterName ?? String(safeOrder + 1)
  const chTitle = currentChapter?.chapterTitle
  const nextCh = comic.chaptersAscending[safeOrder + 1]
  const pageUrls = chapterPayload?.pageUrls ?? []

  const helmetTitle = `${comic.title} - Chương ${chName} - TruyenSS`

  return (
    <>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={`Đọc ${comic.title} chương ${chName} tại TruyenSS.`} />
      </Helmet>

      <div className={styles.page}>
        <Container className="py-2">
          <div className={styles.toolbar}>
            {servers.length > 1 && (
              <div className={styles.serverRow}>
                <span className={styles.serverLabel}>Server ảnh</span>
                <ButtonGroup size="sm">
                  {servers.map((s, i) => (
                    <Button
                      key={s.serverName}
                      type="button"
                      variant={i === serverIdx ? 'warning' : 'outline-secondary'}
                      className={i === serverIdx ? 'text-dark fw-bold' : ''}
                      onClick={() => setServerIdx(i)}
                    >
                      {s.serverName || `Server ${i + 1}`}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            )}
            <p className={styles.hint}>Nếu không xem được ảnh, hãy thử đổi &quot;Server ảnh&quot; phía trên.</p>
          </div>

          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to={ROUTE_HOME}>Trang Chủ</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link to={detailPath}>{comic.title}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Chương {chName}</span>
          </nav>

          <div className={styles.titleBlock}>
            <h1 className={styles.title}>
              {comic.title} — Chapter {chName}
            </h1>
            <p className={styles.subMeta}>
              {chapterPayload?.updatedAtLabel
                ? `(Cập nhật lúc: ${chapterPayload.updatedAtLabel})`
                : pagesLoading
                  ? '(Đang tải thông tin chương…)'
                  : `(Truyện cập nhật: ${comic.updatedAtCalendar})`}
            </p>
          </div>

          <div className={styles.navRow}>
            <Button type="button" variant="outline-warning" disabled={safeOrder <= 0} onClick={goPrev}>
              ← Chap trước
            </Button>
            <Button type="button" variant="outline-warning" disabled={safeOrder >= chapterCount - 1} onClick={goNext}>
              Chap sau →
            </Button>
            <Button type="button" variant="link" size="sm" className="text-muted text-decoration-none" disabled>
              Báo lỗi chương
            </Button>
          </div>

          <p className={styles.nextHint}>
            <em>Dùng phím ← hoặc → để chuyển chương.</em>
            {nextCh ? ` Tiếp theo: Chương ${nextCh.chapterName}.` : ' Đây là chương mới nhất.'}
          </p>

          {pagesLoading && (
            <div className={styles.loadingBox}>
              <Spinner animation="border" variant="warning" />
              <p className="mt-2 mb-0 text-muted">Đang tải ảnh chương…</p>
            </div>
          )}

          {pagesError && (
            <div className={styles.errorBox}>
              <p className="mb-2">Không tải được ảnh chương.</p>
              <Button type="button" size="sm" variant="warning" onClick={() => refetchPages()}>
                Thử lại
              </Button>
            </div>
          )}

          {!pagesLoading && !pagesError && pageUrls.length === 0 && chapterApiData && (
            <div className={styles.errorBox}>
              <p className="mb-2">Chương không có dữ liệu ảnh.</p>
              {servers.length > 1 ? <p className="small text-muted mb-0">Thử đổi server ảnh khác.</p> : null}
            </div>
          )}

          {!pagesLoading && !pagesError && pageUrls.length > 0 && (
            <div className={styles.images}>
              {pageUrls.map((src, i) => (
                <img key={i} src={src} alt={chTitle ? `${comic.title} — ${chTitle} — trang ${i + 1}` : `${comic.title} chương ${chName} trang ${i + 1}`} className={styles.pageImg} loading={i < 3 ? 'eager' : 'lazy'} />
              ))}
            </div>
          )}

          <div className={styles.bottomBar}>
            <div className={styles.chapterPicker}>
              <label htmlFor="reader-chapter-select" className={styles.chapterPickerLabel}>
                Chọn chương
              </label>
              <Form.Select
                id="reader-chapter-select"
                size="sm"
                className={styles.chapterSelect}
                value={safeOrder}
                onChange={onChapterSelect}
              >
                {comic.chaptersAscending.map(ch => {
                  const label = ch.chapterTitle?.trim()
                    ? `${ch.chapterName} — ${ch.chapterTitle.trim()}`
                    : `Chương ${ch.chapterName}`
                  return (
                    <option key={ch.orderIndex} value={ch.orderIndex}>
                      {label}
                    </option>
                  )
                })}
              </Form.Select>
              <span className={styles.chapterPickerMeta}>
                {safeOrder + 1} / {chapterCount}
              </span>
            </div>
            <div className={styles.bottomNav}>
              <Button type="button" variant="outline-secondary" disabled={safeOrder <= 0} onClick={goPrev}>
                Chap trước
              </Button>
              <Button type="button" variant="outline-secondary" disabled={safeOrder >= chapterCount - 1} onClick={goNext}>
                Chap sau
              </Button>
              <Button type="button" variant="outline-warning" disabled>
                Theo dõi
              </Button>
            </div>
          </div>

          <section className="mt-4 py-3 border-top border-secondary">
            <h2 className="h6 fw-bold mb-2">Bình luận</h2>
            <p className="text-muted small mb-0">Tính năng bình luận sẽ được bổ sung sau.</p>
          </section>
        </Container>
      </div>
    </>
  )
}
