import React, { useEffect, useMemo } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getComicDetail } from '~services/comic'
import styles from './ComicDetail.module.scss'

const ROUTE_HOME = '/'
const ROUTE_CATEGORIES = '/the-loai'

const readerDocPath = (slug: string, order: number) => `/truyen/${slug}/doc/${order}`

const handlePlaceholderAction = (e: React.MouseEvent) => {
  e.preventDefault()
}

const introParagraphsFromText = (text: string): string[] => {
  const t = text.trim()
  if (!t) return ['Chưa có mô tả.']
  const parts = t.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
  return parts.length ? parts : [t]
}

/** Bình luận mẫu (chỉ hiển thị — chưa nối API). */
const MOCK_COMMENT_COUNT = 128

type MockComment = {
  id: string
  userName: string
  initials: string
  rank: string
  rankTone: 'pink' | 'violet'
  nameTone: 'blue' | 'gold'
  body: string | null
  stickerEmoji?: string
  likes: number
  timeLabel: string
  replyCount?: number
}

const MOCK_COMMENTS: MockComment[] = [
  {
    id: '1',
    userName: 'Nh… Hoa Cô Nương',
    initials: 'NH',
    rank: 'Hóa Thần',
    rankTone: 'pink',
    nameTone: 'blue',
    body: null,
    stickerEmoji: '🐱',
    likes: 0,
    timeLabel: '1 ngày trước',
    replyCount: 2,
  },
  {
    id: '2',
    userName: 'Vãi skibidi',
    initials: 'VS',
    rank: 'Vũ Trụ',
    rankTone: 'violet',
    nameTone: 'gold',
    body: 'Truyện ra lâu kiểu này thì chẳng bt khi nào end',
    likes: 3,
    timeLabel: '4 ngày trước',
  },
  {
    id: '3',
    userName: 'Bo Bo',
    initials: 'BB',
    rank: 'Hóa Thần',
    rankTone: 'pink',
    nameTone: 'blue',
    body: 'Với tốc độ ra chap đều ntn, khả năng end truyện mất hơn 3 năm nữa =((',
    likes: 12,
    timeLabel: '6 ngày trước',
  },
  {
    id: '4',
    userName: 'sins',
    initials: 'S',
    rank: 'Hóa Thần',
    rankTone: 'pink',
    nameTone: 'gold',
    body: 'Nvp trong đây toàn bọn thiếu năng buff iq cho main hay ho gì ko bt',
    likes: 1,
    timeLabel: '7 ngày trước',
  },
]

export const ComicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comic-detail', slug],
    queryFn: () => getComicDetail(slug ?? ''),
    enabled: Boolean(slug),
  })

  const introParagraphs = useMemo(() => (data ? introParagraphsFromText(data.description) : []), [data])

  useEffect(() => {
    if (!data) return
    const raw = window.location.hash.replace(/^#/, '')
    if (!raw.startsWith('chapter-')) return
    const el = document.getElementById(raw)
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [data])

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
      <Container className="py-5">
        <div className={styles.errorBox}>
          <p className="mb-0">Không thể tải chi tiết truyện. Vui lòng thử lại sau.</p>
        </div>
      </Container>
    )
  }

  const firstOrder = data.firstChapter?.orderIndex
  const latestOrder = data.lastChapter?.orderIndex

  const metaDescription = (data.description || data.title).slice(0, 160)

  return (
    <>
      <Helmet>
        <title>{`${data.title} - TruyenSS`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className={styles.page}>
        <Container className="py-3">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to={ROUTE_HOME}>Trang Chủ</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{data.title}</span>
          </nav>

          <div className={styles.hero}>
            <div className={styles.coverWrap}>
              <img src={data.coverUrl} alt={data.title} className={styles.coverImage} />
            </div>
            <div className={styles.heroMain}>
              <span className={styles.latestPill}>{data.latestChapter}</span>
              <h1 className={styles.title}>{data.title}</h1>

              <dl className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <dt>Tên khác</dt>
                  <dd>{data.title}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Tác giả</dt>
                  <dd>{data.author}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Ngày cập nhật</dt>
                  <dd>{data.updatedAtCalendar}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Tổng số chương</dt>
                  <dd>{data.chapterCount}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Tình trạng</dt>
                  <dd>{data.statusLabel}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Độ tuổi</dt>
                  <dd>13+</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Lượt thích</dt>
                  <dd>—</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Lượt theo dõi</dt>
                  <dd>—</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Lượt xem</dt>
                  <dd>—</dd>
                </div>
              </dl>

              <div className={styles.actions}>
                {firstOrder != null ? (
                  <Link className="btn btn-warning fw-bold text-dark" to={readerDocPath(data.slug, firstOrder)}>
                    Đọc từ đầu
                  </Link>
                ) : (
                  <Button variant="warning" className="fw-bold text-dark" disabled>
                    Đọc từ đầu
                  </Button>
                )}
                {latestOrder != null && latestOrder !== firstOrder ? (
                  <Link className="btn btn-outline-warning" to={readerDocPath(data.slug, latestOrder)}>
                    Chương mới nhất
                  </Link>
                ) : null}
                <Button variant="outline-secondary" type="button" onClick={handlePlaceholderAction}>
                  Theo dõi
                </Button>
                <Button variant="outline-secondary" type="button" onClick={handlePlaceholderAction}>
                  Thích
                </Button>
              </div>

              {data.categories.length > 0 && (
                <div className={styles.catRow}>
                  {data.categories.map(cat => (
                    <Link key={cat.slug} className={styles.catLink} to={`${ROUTE_CATEGORIES}/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <section className={styles.section} aria-labelledby="comic-intro-heading">
            <h2 id="comic-intro-heading" className={styles.sectionHead}>
              <span className={styles.sectionHeadBar} aria-hidden />
              Giới thiệu
            </h2>
            <div className={styles.intro}>
              {introParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="comic-chapters-heading">
            <h2 id="comic-chapters-heading" className={styles.sectionHead}>
              <span className={styles.sectionHeadBar} aria-hidden />
              Danh sách chương
            </h2>
            {data.chaptersNewestFirst.length === 0 ? (
              <p className="text-muted mb-0">Chưa có dữ liệu chương.</p>
            ) : (
              <div className={styles.chapterGrid} role="list">
                {data.chaptersNewestFirst.map(ch => (
                  <Link
                    key={ch.orderIndex}
                    id={`chapter-${ch.orderIndex}`}
                    className={styles.chapterRow}
                    to={readerDocPath(data.slug, ch.orderIndex)}
                  >
                    <span className={styles.chapterName}>
                      Chương {ch.chapterName}
                      {ch.chapterTitle ? ` — ${ch.chapterTitle}` : ''}
                    </span>
                    <span className={styles.chapterDate}>{data.updatedAtCalendar}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className={styles.section} aria-labelledby="comic-comments-heading">
            <div className={styles.commentsHead}>
              <h2 id="comic-comments-heading" className={styles.commentsTitle}>
                <span className={styles.commentsTitleIcon} aria-hidden>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                </span>
                Bình luận
                <span className={styles.commentsCount}>({MOCK_COMMENT_COUNT})</span>
              </h2>
              <p className={styles.commentsFanline}>
                Đây là bình luận mẫu để xem giao diện. Tính năng gửi bình luận thật sẽ được bổ sung sau.
              </p>
            </div>

            <label htmlFor="comic-comment-draft" className="visually-hidden">
              Nội dung bình luận (chưa kích hoạt)
            </label>
            <textarea
              id="comic-comment-draft"
              className={styles.commentsTextarea}
              rows={4}
              readOnly
              placeholder="Hãy bình luận có văn hóa để tránh bị khóa tài khoản"
              aria-describedby="comic-comments-heading"
            />

            <ul className={styles.commentList} role="list">
              {MOCK_COMMENTS.map(c => (
                <li key={c.id} className={styles.commentCard}>
                  <div className={styles.commentTop}>
                    <div className={styles.commentAvatar} aria-hidden>
                      {c.initials}
                    </div>
                    <div className={styles.commentMeta}>
                      <span
                        className={`${styles.commentUser} ${c.nameTone === 'gold' ? styles.commentUserGold : styles.commentUserBlue}`}
                      >
                        {c.userName}
                      </span>
                      <span
                        className={`${styles.commentRank} ${c.rankTone === 'violet' ? styles.commentRankViolet : styles.commentRankPink}`}
                      >
                        [{c.rank}]
                      </span>
                    </div>
                  </div>
                  <div className={styles.commentDivider} aria-hidden />
                  <div className={styles.commentBody}>
                    {c.stickerEmoji ? (
                      <span className={styles.commentSticker} title="Sticker">
                        {c.stickerEmoji}
                      </span>
                    ) : (
                      <p className={styles.commentText}>{c.body}</p>
                    )}
                  </div>
                  <div className={styles.commentActions}>
                    <button type="button" className={styles.commentActionBtn} onClick={handlePlaceholderAction}>
                      <svg className={styles.commentActionSvg} viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
                        />
                      </svg>
                      {c.likes}
                    </button>
                    <button type="button" className={styles.commentActionBtn} onClick={handlePlaceholderAction}>
                      <svg className={styles.commentActionSvg} viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
                        />
                      </svg>
                      Trả lời
                    </button>
                    <span className={styles.commentTime}>{c.timeLabel}</span>
                  </div>
                  {c.replyCount != null && c.replyCount > 0 ? (
                    <p className={styles.commentRepliesHint}>
                      <strong>{c.replyCount} phản hồi</strong>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </div>
    </>
  )
}
