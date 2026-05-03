import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Container, Form, Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { getComicCategories } from '~services/comic'
import { useTheme } from '~/contexts/ThemeContext'
import styles from './Header.module.scss'

const ROUTE_HOME = '/'
const ROUTE_CATEGORIES = '/the-loai'
const ROUTE_RANKING = '/xep-hang'

const handlePlaceholderAuth = (e: React.MouseEvent) => {
  e.preventDefault()
}

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['comic-categories'],
    queryFn: getComicCategories,
  })

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

              <NavDropdown title={categoriesLoading ? 'Thể Loại…' : 'Thể Loại'} id="nav-categories" menuVariant="dark" align="start">
                <NavDropdown.Header className={styles.dropdownHeader}>Chọn thể loại</NavDropdown.Header>
                <NavDropdown.Item as={Link} to={ROUTE_CATEGORIES} className={styles.dropdownItem}>
                  Tất cả thể loại
                </NavDropdown.Item>
                <NavDropdown.Divider className="border-secondary opacity-25" />
                {categoriesLoading && (
                  <div className="d-flex justify-content-center py-3">
                    <Spinner animation="border" size="sm" variant="warning" />
                  </div>
                )}
                {!categoriesLoading &&
                  categories.map(cat => (
                    <NavDropdown.Item
                      key={cat.id}
                      as={Link}
                      to={`${ROUTE_CATEGORIES}/${cat.slug}`}
                      className={styles.dropdownItem}
                    >
                      {cat.name}
                    </NavDropdown.Item>
                  ))}
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
