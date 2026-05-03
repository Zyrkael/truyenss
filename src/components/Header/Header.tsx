import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Container, Form, Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getComicCategories } from '~services/comic'
import { useTheme } from '~/contexts/ThemeContext'
import styles from './Header.module.scss'

const ROUTE_HOME = '/'
const ROUTE_CATEGORIES = '/the-loai'
const ROUTE_RANKING = '/xep-hang'

/** Máy có chuột + hover thật (giống TruyenQQ: mở menu Thể loại khi hover). */
const MEDIA_HOVER_FINE_POINTER = '(hover: hover) and (pointer: fine)' as const
const CATEGORY_DROPDOWN_CLOSE_DELAY_MS = 220
/** Sau khi đóng bằng click/Escape/chọn mục, tạm không mở lại bằng hover (tránh mouseenter “dính” mở lại ngay). */
const CATEGORY_HOVER_REOPEN_BLOCK_MS = 320

const handlePlaceholderAuth = (e: React.MouseEvent) => {
  e.preventDefault()
}

export const Header: React.FC = () => {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['comic-categories'],
    queryFn: getComicCategories,
  })

  const categoryNavActive = pathname === ROUTE_CATEGORIES || pathname.startsWith(`${ROUTE_CATEGORIES}/`)

  const [categoryMenuHoverUi, setCategoryMenuHoverUi] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const categoryCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const categoryHoverOpenBlockedUntilRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia(MEDIA_HOVER_FINE_POINTER)
    const sync = () => {
      const next = mq.matches
      setCategoryMenuHoverUi(next)
      if (!next) {
        if (categoryCloseTimerRef.current != null) {
          clearTimeout(categoryCloseTimerRef.current)
          categoryCloseTimerRef.current = null
        }
        setCategoryMenuOpen(false)
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const clearCategoryCloseTimer = useCallback(() => {
    if (categoryCloseTimerRef.current != null) {
      clearTimeout(categoryCloseTimerRef.current)
      categoryCloseTimerRef.current = null
    }
  }, [])

  const openCategoryMenuHover = useCallback(() => {
    if (performance.now() < categoryHoverOpenBlockedUntilRef.current) return
    clearCategoryCloseTimer()
    setCategoryMenuOpen(true)
  }, [clearCategoryCloseTimer])

  const handleCategoryDropdownToggle = useCallback(
    (open: boolean) => {
      setCategoryMenuOpen(open)
      clearCategoryCloseTimer()
      if (!open) {
        categoryHoverOpenBlockedUntilRef.current = performance.now() + CATEGORY_HOVER_REOPEN_BLOCK_MS
      } else {
        categoryHoverOpenBlockedUntilRef.current = 0
      }
    },
    [clearCategoryCloseTimer],
  )

  const scheduleCloseCategoryMenuHover = useCallback(() => {
    clearCategoryCloseTimer()
    categoryCloseTimerRef.current = window.setTimeout(() => {
      setCategoryMenuOpen(false)
      categoryCloseTimerRef.current = null
    }, CATEGORY_DROPDOWN_CLOSE_DELAY_MS)
  }, [clearCategoryCloseTimer])

  useEffect(() => () => clearCategoryCloseTimer(), [clearCategoryCloseTimer])

  const categoryNavDropdownHoverProps = categoryMenuHoverUi
    ? {
        show: categoryMenuOpen,
        onToggle: handleCategoryDropdownToggle,
        onMouseEnter: openCategoryMenuHover,
        onMouseLeave: scheduleCloseCategoryMenuHover,
      }
    : {}

  return (
    <header className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.topInner}>
          <a href="#" className={styles.topLink} onClick={handlePlaceholderAuth}>
            Đăng ký
          </a>
          <span className={styles.topSep}>|</span>
          <a href="#" className={styles.topLink} onClick={handlePlaceholderAuth}>
            Đăng nhập
          </a>
        </div>
      </div>

      <Navbar expand="lg" variant="dark" className={styles.navMain}>
        <Container className={styles.navInner}>
          <Navbar.Brand as={Link} to={ROUTE_HOME} className={styles.brand}>
            Truyen<span>SS</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="qq-navbar" className="border-secondary" />

          <Navbar.Collapse id="qq-navbar">
            <Nav className="me-auto align-items-lg-center flex-wrap">
              <Nav.Link as={NavLink} to={ROUTE_HOME} className={styles.navLink} end>
                Trang Chủ
              </Nav.Link>

              <NavDropdown
                title={categoriesLoading ? 'Thể loại…' : 'Thể loại'}
                id="nav-categories"
                menuVariant="dark"
                align="start"
                className={styles.categoryDropdown}
                active={categoryNavActive}
                rootCloseEvent="mousedown"
                {...categoryNavDropdownHoverProps}
              >
                <div className={styles.categoryMenuInner}>
                  <NavDropdown.Header key="category-menu-head" className={styles.categoryMenuHead}>
                    Thể loại truyện
                  </NavDropdown.Header>
                  <NavDropdown.Item key="category-all" as={Link} to={ROUTE_CATEGORIES} className={styles.allCategoryItem}>
                    Xem tất cả
                  </NavDropdown.Item>
                  <NavDropdown.Divider key="category-divider" className={styles.categoryDivider} />
                  {categoriesLoading && (
                    <div key="category-loading" className={styles.categoryLoading}>
                      <Spinner animation="border" size="sm" variant="warning" />
                    </div>
                  )}
                  {categoriesError && (
                    <div key="category-error" className={styles.categoryError}>
                      <span>Không tải được danh sách.</span>
                      <Button type="button" variant="link" size="sm" className={styles.retryBtn} onClick={() => refetchCategories()}>
                        Thử lại
                      </Button>
                    </div>
                  )}
                  {!categoriesLoading && !categoriesError &&
                    categories.map(cat => (
                      <NavDropdown.Item
                        key={cat.id}
                        as={Link}
                        to={`${ROUTE_CATEGORIES}/${cat.slug}`}
                        className={styles.categoryCell}
                      >
                        {cat.name}
                      </NavDropdown.Item>
                    ))}
                </div>
              </NavDropdown>

              <Nav.Link as={NavLink} to={ROUTE_RANKING} className={styles.navLink}>
                Xếp Hạng
              </Nav.Link>
            </Nav>

            <Form className={styles.searchForm}>
              <Form.Control type="search" placeholder="Tìm truyện…" className={styles.searchInput} aria-label="Tìm truyện" />
            </Form>

            <Nav className="align-items-center ms-lg-2">
              <Button
                type="button"
                variant="link"
                onClick={toggleTheme}
                className={`text-decoration-none ${styles.themeBtn}`}
                title={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
              <Button type="button" variant="outline-warning" className={styles.loginBtn} onClick={handlePlaceholderAuth}>
                Đăng nhập
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
