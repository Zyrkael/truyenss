import React, { useEffect, useMemo, useState } from 'react'
import BookmarkBorderOutlined from '@mui/icons-material/BookmarkBorderOutlined'
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined'
import CloseRounded from '@mui/icons-material/CloseRounded'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import HistoryOutlined from '@mui/icons-material/HistoryOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import SaveOutlined from '@mui/icons-material/SaveOutlined'
import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined'
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  type SelectChangeEvent,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'

const ROUTE_HOME = '/'

const TAB_IDS = ['profile', 'password', 'following', 'history'] as const

type TabId = (typeof TAB_IDS)[number]

function initialTabFromLocation(): TabId {
  try {
    const raw = new URLSearchParams(window.location.search).get('tab')
    if (raw && (TAB_IDS as readonly string[]).includes(raw)) return raw as TabId
  } catch {
    /* ignore */
  }
  return 'profile'
}

type Gender = 'male' | 'female' | 'other'

/** Loại cấp bậc hiển thị / bình luận (giao diện chuẩn bị API). */
type RankType = 'none' | 'game' | 'phap-su' | 'tu-tien' | 'ma-vuong' | 'tinh-khong'

const RANK_TYPE_OPTIONS: { value: RankType; label: string }[] = [
  { value: 'none', label: 'Không chọn' },
  { value: 'game', label: 'Game' },
  { value: 'phap-su', label: 'Pháp sư' },
  { value: 'tu-tien', label: 'Tu tiên' },
  { value: 'ma-vuong', label: 'Ma vương' },
  { value: 'tinh-khong', label: 'Tinh không' },
]

const MOCK_USER = {
  displayName: 'Độc Cô Cầu Bại',
  email: 'doc.co.cau.bai@example.com',
  joinDate: '01/01/2024',
  gender: 'male' as Gender,
  birthday: '2000-01-15',
  rankType: 'none' as RankType,
}

const MOCK_FOLLOWING = [
  { id: 1, title: 'Naruto', chapter: 'Chương 700', badge: 'Mới', emoji: '🍥' },
  { id: 2, title: 'One Piece', chapter: 'Chương 1115', badge: 'Hot', emoji: '⚓' },
  { id: 3, title: 'Demon Slayer', chapter: 'Chương 205', badge: null, emoji: '🗡️' },
  { id: 4, title: 'Jujutsu Kaisen', chapter: 'Chương 268', badge: 'Mới', emoji: '🌀' },
  { id: 5, title: 'Dragon Ball', chapter: 'Chương 519', badge: null, emoji: '🐉' },
  { id: 6, title: 'Attack on Titan', chapter: 'Chương 139', badge: null, emoji: '⚡' },
]

const MOCK_HISTORY = [
  { id: 1, title: 'One Piece', chapter: 'Chương 1114', time: '2 giờ trước', progress: 88, emoji: '⚓' },
  { id: 2, title: 'Naruto', chapter: 'Chương 699', time: 'Hôm qua', progress: 65, emoji: '🍥' },
  { id: 3, title: 'Demon Slayer', chapter: 'Chương 200', time: '2 ngày trước', progress: 42, emoji: '🗡️' },
  { id: 4, title: 'Jujutsu Kaisen', chapter: 'Chương 265', time: '3 ngày trước', progress: 75, emoji: '🌀' },
  { id: 5, title: 'Dragon Ball', chapter: 'Chương 510', time: '1 tuần trước', progress: 30, emoji: '🐉' },
]

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#888' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 20, label: 'Rất yếu', color: '#e53e3e' }
  if (score === 2) return { score: 40, label: 'Yếu', color: '#dd6b20' }
  if (score === 3) return { score: 60, label: 'Trung bình', color: '#d69e2e' }
  if (score === 4) return { score: 80, label: 'Mạnh', color: '#38a169' }
  return { score: 100, label: 'Rất mạnh', color: '#48bb78' }
}

const TAB_CONFIG: { id: TabId; label: string; icon: React.ReactElement }[] = [
  { id: 'profile', label: 'Thông tin', icon: <PersonOutlined fontSize="small" /> },
  { id: 'password', label: 'Đổi mật khẩu', icon: <LockOutlined fontSize="small" /> },
  { id: 'following', label: 'Theo dõi', icon: <BookmarkBorderOutlined fontSize="small" /> },
  { id: 'history', label: 'Lịch sử', icon: <HistoryOutlined fontSize="small" /> },
]

function TabPanel({ children, value, id }: { children: React.ReactNode; value: TabId; id: TabId }) {
  if (value !== id) return null
  return (
    <Box
      role="tabpanel"
      id={`tab-panel-${id}`}
      aria-labelledby={`tab-${id}`}
      sx={{ pt: 2 }}
    >
      {children}
    </Box>
  )
}

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabId>(initialTabFromLocation)

  useEffect(() => {
    const raw = searchParams.get('tab')
    if (raw != null && raw !== '' && !(TAB_IDS as readonly string[]).includes(raw)) {
      setSearchParams({}, { replace: true })
      setActiveTab('profile')
      return
    }
    if (raw && (TAB_IDS as readonly string[]).includes(raw)) {
      setActiveTab(raw as TabId)
      return
    }
    setActiveTab('profile')
  }, [searchParams, setSearchParams])

  const selectTab = (id: TabId) => {
    setActiveTab(id)
    if (id === 'profile') setSearchParams({}, { replace: true })
    else setSearchParams({ tab: id }, { replace: true })
  }

  const handleTabsChange = (_: React.SyntheticEvent, newValue: TabId) => {
    selectTab(newValue)
  }

  const [displayName, setDisplayName] = useState(MOCK_USER.displayName)
  const [gender, setGender] = useState<Gender>(MOCK_USER.gender)
  const [birthday, setBirthday] = useState(MOCK_USER.birthday)
  const [rankType, setRankType] = useState<RankType>(MOCK_USER.rankType)

  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const pwStrength = getPasswordStrength(newPw)

  const [following, setFollowing] = useState(MOCK_FOLLOWING)

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
  }

  const handleCloseToast = () => {
    setToast(null)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Đã cập nhật thông tin cá nhân.')
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!curPw || !newPw || !confirmPw) {
      showToast('Vui lòng điền đầy đủ các trường mật khẩu.', 'error')
      return
    }
    if (newPw !== confirmPw) {
      showToast('Mật khẩu xác nhận không khớp.', 'error')
      return
    }
    if (newPw.length < 8) {
      showToast('Mật khẩu mới phải có ít nhất 8 ký tự.', 'error')
      return
    }
    showToast('Đã đổi mật khẩu thành công.')
    setCurPw('')
    setNewPw('')
    setConfirmPw('')
  }

  const handleUnfollow = (id: number) => {
    setFollowing(prev => prev.filter(c => c.id !== id))
    showToast('Đã bỏ theo dõi truyện.')
  }

  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?'

  const onGenderChange = (e: SelectChangeEvent<Gender>) => {
    setGender(e.target.value as Gender)
  }

  /**
   * Tiến độ tu luyện (0–100%): mẫu tính từ % đọc chương trong lịch sử + chút điểm theo dõi.
   * Khi có API, thay bằng exp / cảnh giới từ máy chủ.
   */
  const cultivationProgressPct = useMemo(() => {
    if (MOCK_HISTORY.length === 0) return 0
    const avgRead = Math.round(MOCK_HISTORY.reduce((a, h) => a + h.progress, 0) / MOCK_HISTORY.length)
    const daoHeart = Math.min(18, following.length * 3)
    return Math.min(100, avgRead + daoHeart)
  }, [following.length])

  return (
    <>
      <Helmet>
        <title>Quản lý tài khoản - TruyenSS</title>
        <meta
          name="description"
          content="Quản lý thông tin cá nhân, đổi mật khẩu, truyện theo dõi và lịch sử đọc trên TruyenSS."
        />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 3, pb: 8 }}>
        <Breadcrumbs sx={{ mb: 2, color: 'text.secondary', '& a': { color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main' } } }}>
          <RouterLink to={ROUTE_HOME}>Trang chủ</RouterLink>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            Quản lý tài khoản
          </Typography>
        </Breadcrumbs>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
          Giao diện quản lý tài khoản (dữ liệu mẫu). Sau khi có API đăng nhập, các thao tác lưu / đổi mật khẩu sẽ đồng bộ với máy chủ.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 3,
            textAlign: { xs: 'center', sm: 'left' },
            border: 1,
            borderColor: 'divider',
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(245,165,36,0.08) 0%, transparent 55%)'
                : 'linear-gradient(135deg, rgba(245,165,36,0.06) 0%, transparent 55%)',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              sx={{
                width: 88,
                height: 88,
                fontSize: '2rem',
                fontWeight: 800,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                border: 3,
                borderColor: 'primary.dark',
              }}
            >
              {initial}
            </Avatar>
            <IconButton
              size="small"
              aria-label="Đổi ảnh đại diện"
              title="Đổi ảnh đại diện"
              sx={{
                position: 'absolute',
                right: -4,
                bottom: -4,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                border: 2,
                borderColor: 'background.paper',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <EditOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {MOCK_USER.email}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip size="small" icon={<StarBorderOutlined />} label="Thành viên" variant="outlined" color="primary" />
              <Chip size="small" icon={<CalendarMonthOutlined />} label={`Từ ${MOCK_USER.joinDate}`} variant="outlined" />
              <Chip size="small" icon={<BookmarkBorderOutlined />} label={`${following.length} theo dõi`} variant="outlined" />
            </Stack>

            <Box sx={{ mt: 2.5, width: '100%', maxWidth: { xs: '100%', sm: 440 } }}>
              <Stack direction="row" sx={{ mb: 0.75, justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Tiến độ tu luyện
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
                  {cultivationProgressPct}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={cultivationProgressPct}
                aria-label={`Tiến độ tu luyện ${cultivationProgressPct} phần trăm`}
                sx={{
                  height: 8,
                  borderRadius: 99,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 99,
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabsChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              px: { xs: 0.5, sm: 1 },
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { minHeight: 48, textTransform: 'none', fontWeight: 700 },
            }}
          >
            {TAB_CONFIG.map(t => (
              <Tab
                key={t.id}
                id={`tab-${t.id}`}
                value={t.id}
                label={t.label}
                icon={t.icon}
                iconPosition="start"
                disableRipple
              />
            ))}
          </Tabs>

          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
            <TabPanel value={activeTab} id="profile">
              <Stack component="form" spacing={3} onSubmit={handleSaveProfile}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      borderRadius: 0.5,
                      background: t => `linear-gradient(180deg, ${t.palette.primary.light}, ${t.palette.primary.dark})`,
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Thông tin cá nhân
                  </Typography>
                </Stack>

                <Stack spacing={2.5}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Tên hiển thị"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Nhập tên hiển thị"
                    />
                    <TextField fullWidth label="Email" value={MOCK_USER.email} disabled helperText="Email không thể thay đổi." />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id="acc-gender-label">Giới tính</InputLabel>
                      <Select<Gender> labelId="acc-gender-label" label="Giới tính" value={gender} onChange={onGenderChange}>
                        <MenuItem value="male">Nam</MenuItem>
                        <MenuItem value="female">Nữ</MenuItem>
                        <MenuItem value="other">Khác</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      type="date"
                      value={birthday}
                      onChange={e => setBirthday(e.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Stack>

                  <Box sx={{ pt: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                      Chọn loại cấp bậc
                    </Typography>
                    <RadioGroup
                      value={rankType}
                      onChange={e => setRankType(e.target.value as RankType)}
                      aria-label="Chọn loại cấp bậc"
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          columnGap: 3,
                          rowGap: 0.25,
                        }}
                      >
                        {RANK_TYPE_OPTIONS.map(opt => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio size="small" color="primary" />}
                            label={opt.label}
                            sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: '0.9375rem' } }}
                          />
                        ))}
                      </Box>
                    </RadioGroup>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      size="medium"
                      sx={{ mt: 2, minWidth: 100 }}
                      onClick={() => showToast('Đã lưu loại cấp bậc.')}
                    >
                      Lưu
                    </Button>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setDisplayName(MOCK_USER.displayName)
                      setGender(MOCK_USER.gender)
                      setBirthday(MOCK_USER.birthday)
                      setRankType(MOCK_USER.rankType)
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />}>
                    Lưu thay đổi
                  </Button>
                </Stack>

                <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 800 }}>
                    Vùng nguy hiểm
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Một khi tài khoản bị xóa, tất cả dữ liệu liên quan (theo dõi, lịch sử) sẽ bị mất vĩnh viễn và không thể phục hồi.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteOutlined />}
                    onClick={() => showToast('Chức năng chưa khả dụng.', 'error')}
                  >
                    Xóa tài khoản
                  </Button>
                </Alert>
              </Stack>
            </TabPanel>

            <TabPanel value={activeTab} id="password">
              <Stack component="form" spacing={3} onSubmit={handleChangePassword} sx={{ maxWidth: 480 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      borderRadius: 0.5,
                      background: t => `linear-gradient(180deg, ${t.palette.primary.light}, ${t.palette.primary.dark})`,
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Đổi mật khẩu
                  </Typography>
                </Stack>

                <TextField
                  fullWidth
                  type="password"
                  label="Mật khẩu hiện tại"
                  value={curPw}
                  onChange={e => setCurPw(e.target.value)}
                  autoComplete="current-password"
                />

                <Divider />

                <TextField
                  fullWidth
                  type="password"
                  label="Mật khẩu mới"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  autoComplete="new-password"
                  helperText={newPw ? pwStrength.label : ' '}
                />
                {newPw ? (
                  <LinearProgress
                    variant="determinate"
                    value={pwStrength.score}
                    sx={{
                      height: 6,
                      borderRadius: 99,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: pwStrength.color, borderRadius: 99 },
                    }}
                  />
                ) : null}

                <TextField
                  fullWidth
                  type="password"
                  label="Xác nhận mật khẩu mới"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  error={Boolean(confirmPw && newPw !== confirmPw)}
                  helperText={
                    confirmPw && newPw !== confirmPw
                      ? 'Mật khẩu không khớp'
                      : confirmPw && newPw === confirmPw
                        ? 'Mật khẩu khớp'
                        : ' '
                  }
                />

                <Button type="submit" variant="contained" color="primary" startIcon={<LockOutlined />} sx={{ alignSelf: 'flex-start' }}>
                  Đổi mật khẩu
                </Button>
              </Stack>
            </TabPanel>

            <TabPanel value={activeTab} id="following">
              <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 4,
                    height: 22,
                    borderRadius: 0.5,
                    background: t => `linear-gradient(180deg, ${t.palette.primary.light}, ${t.palette.primary.dark})`,
                  }}
                />
                <Typography variant="subtitle1" component="span" sx={{ fontWeight: 800 }}>
                  Truyện đang theo dõi
                </Typography>
                <Chip size="small" label={following.length} color="primary" variant="outlined" />
              </Stack>

              {following.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                  Bạn chưa theo dõi truyện nào. Hãy khám phá kho truyện ngay!
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
                    gap: 2,
                  }}
                >
                  {following.map(comic => (
                    <Card
                      key={comic.id}
                      variant="outlined"
                      sx={{
                        position: 'relative',
                        borderRadius: 2,
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                      }}
                    >
                      <Box sx={{ position: 'relative', aspectRatio: '2/3', bgcolor: 'action.hover' }}>
                        <Typography
                          component="div"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          {comic.emoji}
                        </Typography>
                        {comic.badge ? (
                          <Chip label={comic.badge} size="small" color="primary" sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 800 }} />
                        ) : null}
                        <IconButton
                          size="small"
                          aria-label={`Bỏ theo dõi ${comic.title}`}
                          onClick={() => handleUnfollow(comic.id)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.55)',
                            color: 'common.white',
                            '&:hover': { bgcolor: 'error.main' },
                          }}
                        >
                          <CloseRounded fontSize="small" />
                        </IconButton>
                      </Box>
                      <CardContent sx={{ py: 1.25, px: 1.5 }}>
                        <Typography variant="body2" noWrap title={comic.title} sx={{ fontWeight: 700 }}>
                          {comic.title}
                        </Typography>
                        <Typography variant="caption" color="primary" noWrap sx={{ fontWeight: 600 }}>
                          {comic.chapter}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={activeTab} id="history">
              <Stack direction="row" sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      borderRadius: 0.5,
                      background: t => `linear-gradient(180deg, ${t.palette.primary.light}, ${t.palette.primary.dark})`,
                    }}
                  />
                  <Typography variant="subtitle1" component="span" sx={{ fontWeight: 800 }}>
                    Lịch sử đọc
                  </Typography>
                  <Chip size="small" label={MOCK_HISTORY.length} color="primary" variant="outlined" />
                </Stack>
                <Button variant="outlined" size="small" color="inherit" startIcon={<DeleteOutlined />} onClick={() => showToast('Đã xóa toàn bộ lịch sử.')}>
                  Xóa tất cả
                </Button>
              </Stack>

              {MOCK_HISTORY.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                  Chưa có lịch sử đọc. Bắt đầu đọc truyện ngay!
                </Typography>
              ) : (
                <List disablePadding>
                  {MOCK_HISTORY.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 ? <Divider component="li" /> : null}
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar variant="rounded" sx={{ width: 48, height: 64, bgcolor: 'action.selected', fontSize: '1.25rem' }}>
                            {item.emoji}
                          </Avatar>
                        </ListItemAvatar>
                        <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                          <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="caption" color="primary" noWrap sx={{ fontWeight: 600, display: 'block' }}>
                            {item.chapter}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.time}
                          </Typography>
                        </Box>
                        <Box sx={{ width: 72, flexShrink: 0, textAlign: 'right' }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.progress}
                            sx={{ height: 4, borderRadius: 99, mb: 0.5, bgcolor: 'action.hover' }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                            {item.progress}%
                          </Typography>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: { xs: 16, sm: 24 } }}
      >
        <Alert severity={toast?.type === 'error' ? 'error' : 'success'} variant="filled" onClose={handleCloseToast} sx={{ width: '100%', maxWidth: 420 }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </>
  )
}
