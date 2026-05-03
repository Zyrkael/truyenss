import React, { useEffect, useMemo } from 'react'
import {
  Avatar,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ChatBubbleOutlineOutlined from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom'
import { getComicDetail } from '~services/comic'

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

const userNameSx = (tone: MockComment['nameTone']) =>
  tone === 'gold'
    ? { color: '#e8c547' }
    : { color: '#5b9fd8' }

const rankSx = (tone: MockComment['rankTone']) =>
  tone === 'violet'
    ? {
        color: '#c4a8ff',
        bgcolor: 'rgba(138, 92, 246, 0.14)',
        border: '1px solid rgba(138, 92, 246, 0.35)',
      }
    : {
        color: '#f0a8d8',
        bgcolor: 'rgba(224, 64, 150, 0.12)',
        border: '1px solid rgba(224, 64, 150, 0.35)',
      }

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
      <Backdrop open sx={{ color: '#fff', zIndex: theme => theme.zIndex.modal }}>
        <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography>Đang tải thông tin truyện...</Typography>
        </Stack>
      </Backdrop>
    )
  }

  if (isError || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <AlertBox>Không thể tải chi tiết truyện. Vui lòng thử lại sau.</AlertBox>
      </Container>
    )
  }

  const firstOrder = data.firstChapter?.orderIndex
  const latestOrder = data.lastChapter?.orderIndex

  const metaDescription = (data.description || data.title).slice(0, 160)

  const sectionPaperSx = {
    mb: 3.5,
    p: { xs: 2, sm: 2.75 },
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.75,
  }

  return (
    <>
      <Helmet>
        <title>{`${data.title} - TruyenSS`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Box sx={{ pb: 6 }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 2, flexWrap: 'wrap', '& a': { color: 'text.secondary' } }}>
            <Link component={RouterLink} to={ROUTE_HOME} underline="hover" color="inherit" variant="body2">
              Trang Chủ
            </Link>
            <Typography color="text.primary" variant="body2" sx={{ fontWeight: 600 }}>
              {data.title}
            </Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'stretch' },
              overflow: 'hidden',
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: theme =>
                theme.palette.mode === 'dark' ? '0 8px 40px rgba(0,0,0,0.45)' : '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Cột trái: ảnh bìa + vùng nền phía dưới (layout thẻ ngang) */}
            <Box
              sx={{
                width: { xs: '100%', md: 260 },
                maxWidth: { xs: 280, md: 'none' },
                mx: { xs: 'auto', md: 0 },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme => (theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#f5f5f7'),
                borderRight: { md: 1 },
                borderColor: 'divider',
              }}
            >
              <Box sx={{ p: { xs: 2.5, md: 2.5 }, pb: { xs: 2, md: 0 } }}>
                <Box
                  component="img"
                  src={data.coverUrl}
                  alt={data.title}
                  sx={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '3/4',
                    objectFit: 'cover',
                    borderRadius: '12px 12px 0 0',
                    boxShadow: theme => (theme.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.12)'),
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minHeight: { xs: 0, md: 32 } }} aria-hidden />
            </Box>

            {/* Cột phải: chip chương, tiêu đề, meta dọc, nút, thể loại */}
            <Stack
              spacing={2.25}
              sx={{
                flex: 1,
                minWidth: 0,
                p: { xs: 2.5, sm: 3, md: 3.5 },
                pt: { xs: 2, md: 3.5 },
                textAlign: 'left',
                alignItems: 'flex-start',
              }}
            >
              <Chip
                label={data.latestChapter}
                size="small"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  height: 28,
                  color: 'primary.contrastText',
                  background: theme =>
                    `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.2, m: 0, fontSize: { xs: '1.35rem', sm: '1.65rem' } }}>
                {data.title}
              </Typography>

              <Stack component="dl" spacing={1.35} sx={{ m: 0, p: 0, width: '100%', maxWidth: 520 }}>
                {[
                  ['Tên khác', data.title],
                  ['Tác giả', data.author],
                  ['Ngày cập nhật', data.updatedAtCalendar],
                  ['Tổng số chương', String(data.chapterCount)],
                  ['Tình trạng', data.statusLabel],
                  ['Độ tuổi', '13+'],
                  ['Lượt thích', '—'],
                  ['Lượt theo dõi', '—'],
                  ['Lượt xem', '—'],
                ].map(([k, v]) => (
                  <Box key={k} component="div" sx={{ display: 'grid', gap: 0.125 }}>
                    <Typography component="dt" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.02em' }}>
                      {k}
                    </Typography>
                    <Typography component="dd" variant="body2" sx={{ m: 0, fontWeight: 600, color: 'text.primary' }}>
                      {v}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" sx={{ gap: 1.25, flexWrap: 'wrap', pt: 0.5 }}>
                {firstOrder != null ? (
                  <Button
                    component={RouterLink}
                    to={readerDocPath(data.slug, firstOrder)}
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{ borderRadius: 999, px: 2.5, fontWeight: 800, letterSpacing: '0.06em' }}
                  >
                    Đọc từ đầu
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" size="medium" disabled sx={{ borderRadius: 999, px: 2.5, fontWeight: 800 }}>
                    Đọc từ đầu
                  </Button>
                )}
                {latestOrder != null && latestOrder !== firstOrder ? (
                  <Button
                    component={RouterLink}
                    to={readerDocPath(data.slug, latestOrder)}
                    variant="outlined"
                    color="primary"
                    size="medium"
                    sx={{ borderRadius: 999, px: 2.5, fontWeight: 800, letterSpacing: '0.06em' }}
                  >
                    Chương mới nhất
                  </Button>
                ) : null}
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  onClick={handlePlaceholderAction}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    fontWeight: 700,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
                  }}
                >
                  Theo dõi
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  onClick={handlePlaceholderAction}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    fontWeight: 700,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
                  }}
                >
                  Thích
                </Button>
              </Stack>

              {data.categories.length > 0 ? (
                <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', pt: 0.5 }}>
                  {data.categories.map(cat => (
                    <Chip
                      key={cat.slug}
                      component={RouterLink}
                      to={`${ROUTE_CATEGORIES}/${cat.slug}`}
                      label={cat.name}
                      clickable
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Paper>

          <Box component="section" aria-labelledby="comic-intro-heading" sx={sectionPaperSx}>
            <Stack direction="row" spacing={1.25} sx={{ mb: 2, alignItems: 'center' }}>
              <Box
                aria-hidden
                sx={{
                  width: 4,
                  height: '1.1em',
                  borderRadius: 0.5,
                  background: theme => `linear-gradient(180deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                }}
              />
              <Typography id="comic-intro-heading" variant="h6" component="h2" sx={{ fontWeight: 800, m: 0 }}>
                Giới thiệu
              </Typography>
            </Stack>
            <Box sx={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'text.secondary' }}>
              {introParagraphs.map((para, i) => (
                <Typography key={i} component="p" sx={{ m: 0, mb: 1.5, '&:last-child': { mb: 0 } }}>
                  {para}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box component="section" aria-labelledby="comic-chapters-heading" sx={sectionPaperSx}>
            <Stack direction="row" spacing={1.25} sx={{ mb: 2, alignItems: 'center' }}>
              <Box
                aria-hidden
                sx={{
                  width: 4,
                  height: '1.1em',
                  borderRadius: 0.5,
                  background: theme => `linear-gradient(180deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                }}
              />
              <Typography id="comic-chapters-heading" variant="h6" component="h2" sx={{ fontWeight: 800, m: 0 }}>
                Danh sách chương
              </Typography>
            </Stack>
            {data.chaptersNewestFirst.length === 0 ? (
              <Typography color="text.secondary">Chưa có dữ liệu chương.</Typography>
            ) : (
              <Box
                role="list"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 1,
                  maxHeight: 'min(70vh, 560px)',
                  overflowY: 'auto',
                  pr: 0.5,
                }}
              >
                {data.chaptersNewestFirst.map(ch => (
                  <Box
                    key={ch.orderIndex}
                    component={RouterLink}
                    id={`chapter-${ch.orderIndex}`}
                    to={readerDocPath(data.slug, ch.orderIndex)}
                    role="listitem"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      p: '10px 14px',
                      textDecoration: 'none',
                      color: 'inherit',
                      bgcolor: theme => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1.25,
                      transition: theme => theme.transitions.create(['background-color', 'border-color']),
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'rgba(245, 165, 36, 0.35)',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Chương {ch.chapterName}
                      {ch.chapterTitle ? ` — ${ch.chapterTitle}` : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {data.updatedAtCalendar}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box component="section" aria-labelledby="comic-comments-heading" sx={sectionPaperSx}>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center', color: 'primary.main' }}>
                <ChatBubbleOutlineOutlined sx={{ fontSize: 20 }} />
                <Typography id="comic-comments-heading" variant="h6" component="h2" sx={{ fontWeight: 800, m: 0, color: 'primary.main' }}>
                  Bình luận
                </Typography>
                <Typography component="span" variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ({MOCK_COMMENT_COUNT})
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Đây là bình luận mẫu để xem giao diện. Tính năng gửi bình luận thật sẽ được bổ sung sau.
              </Typography>
            </Stack>

            <TextField
              id="comic-comment-draft"
              fullWidth
              multiline
              minRows={4}
              placeholder="Hãy bình luận có văn hóa để tránh bị khóa tài khoản"
              slotProps={{ htmlInput: { readOnly: true, 'aria-describedby': 'comic-comments-heading' } }}
              sx={{ mb: 2.25 }}
            />

            <Stack component="ul" role="list" spacing={2} sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {MOCK_COMMENTS.map(c => (
                <Box
                  key={c.id}
                  component="li"
                  role="listitem"
                  sx={{
                    p: '14px 14px 12px',
                    bgcolor: theme => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'primary.contrastText',
                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        border: '1px solid rgba(245, 165, 36, 0.35)',
                      }}
                    >
                      {c.initials}
                    </Avatar>
                    <Stack direction="row" sx={{ gap: 1, minWidth: 0, pt: 0.25, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, ...userNameSx(c.nameTone) }}>
                        {c.userName}
                      </Typography>
                      <Typography component="span" variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.04em', borderRadius: 0.75, px: 1, py: 0.25, ...rankSx(c.rankTone) }}>
                        [{c.rank}]
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box
                    aria-hidden
                    sx={{
                      height: 1,
                      mt: '10px',
                      mb: '12px',
                      ml: { xs: 0, sm: 7 },
                      background: 'linear-gradient(90deg, rgba(245, 165, 36, 0.55), rgba(245, 165, 36, 0.08))',
                      borderRadius: 0.5,
                    }}
                  />
                  <Box sx={{ mb: 1.25, ml: { xs: 0, sm: 7 } }}>
                    {c.stickerEmoji ? (
                      <Typography component="span" sx={{ fontSize: '2.5rem', lineHeight: 1, userSelect: 'none' }} title="Sticker">
                        {c.stickerEmoji}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ m: 0, lineHeight: 1.65 }}>
                        {c.body}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" sx={{ ml: { xs: 0, sm: 7 }, flexWrap: 'wrap', alignItems: 'center', gap: { xs: '14px 18px', sm: '14px 18px' } }}>
                    <Button
                      type="button"
                      size="small"
                      startIcon={<ThumbUpAltOutlined sx={{ fontSize: 16 }} />}
                      onClick={handlePlaceholderAction}
                      sx={{ color: '#6eb5e8', minWidth: 0, p: 0, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                    >
                      {c.likes}
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      startIcon={<ChatBubbleOutlineOutlined sx={{ fontSize: 16 }} />}
                      onClick={handlePlaceholderAction}
                      sx={{ color: '#6eb5e8', minWidth: 0, p: 0, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                    >
                      Trả lời
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}>
                      {c.timeLabel}
                    </Typography>
                  </Stack>
                  {c.replyCount != null && c.replyCount > 0 ? (
                    <Typography variant="body2" sx={{ mt: 1.25, mb: 0, ml: { xs: 0, sm: 7 } }}>
                      <strong>{c.replyCount} phản hồi</strong>
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  )
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: 560,
        mx: 'auto',
        p: 3,
        textAlign: 'center',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.75,
      }}
    >
      <Typography sx={{ m: 0 }}>{children}</Typography>
    </Box>
  )
}
