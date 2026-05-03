import React, { useCallback, useMemo } from 'react'
import { Container, Pagination, Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Skeleton } from '~components/Skeleton'
import { getComicCategories, getComicsByCategory } from '~services/comic'
import type { Comic } from '~types/comic'
import styles from './Category.module.scss'

const ROUTE_CATEGORIES = '/the-loai'

const STATUS_OPTIONS = [
  { key: '', label: 'Tất cả' },
  { key: '0', label: 'Đang tiến hành' },
  { key: '2', label: 'Hoàn thành' },
] as const

const COUNTRY_OPTIONS = [
  { key: '', label: 'Tất cả' },
  { key: '1', label: 'Trung Quốc' },
  { key: '2', label: 'Việt Nam' },
  { key: '3', label: 'Hàn Quốc' },
  { key: '4', label: 'Nhật Bản' },
  { key: '5', label: 'Mỹ' },
] as const

const SORT_OPTIONS = [
  { key: '', label: 'Mặc định' },
  { key: 'updated_at.desc', label: 'Ngày cập nhật giảm dần' },
  { key: 'updated_at.asc', label: 'Ngày cập nhật tăng dần' },
  { key: 'created_at.desc', label: 'Ngày đăng giảm dần' },
  { key: 'created_at.asc', label: 'Ngày đăng tăng dần' },
  { key: 'view.desc', label: 'Lượt xem giảm dần' },
  { key: 'view.asc', label: 'Lượt xem tăng dần' },
] as const

const comicStatusVi = (s: Comic['status']) => {
  if (s === 'completed') return 'Hoàn thành'
  if (s === 'ongoing') return 'Đang cập nhật'
  return 'Tạm ngưng'
}

export const Category: React.FC = () => {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const [searchParams] = useSearchParams()

  const pageParam = Number(searchParams.get('page') ?? '1')
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const statusFilter = searchParams.get('status') ?? ''
  const countryFilter = searchParams.get('country') ?? ''
  const sortFilter = searchParams.get('sort') ?? ''

  const mergeSearch = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams(searchParams)
      const touchedPage = Object.prototype.hasOwnProperty.call(updates, 'page')
      if (!touchedPage) p.delete('page')
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === undefined || v === '') p.delete(k)
        else p.set(k, v)
      }
      return p.toString()
    },
    [searchParams],
  )

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['comic-categories'],
    queryFn: getComicCategories,
  })

  const apiFilters = useMemo(
    () => ({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(countryFilter ? { country: countryFilter } : {}),
      ...(sortFilter ? { sort: sortFilter } : {}),
    }),
    [statusFilter, countryFilter, sortFilter],
  )

  const {
    data: categoryResult,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery({
    queryKey: ['category-comics', slug, page, statusFilter, countryFilter, sortFilter],
    queryFn: () => getComicsByCategory(slug ?? '', page, apiFilters),
    enabled: Boolean(slug),
    placeholderData: keepPreviousData,
  })

  const totalPages = categoryResult
    ? Math.ceil(categoryResult.pagination.totalItems / categoryResult.pagination.totalItemsPerPage) || 1
    : 1

  const goPage = (n: number) => {
    if (!slug) return
    const s = mergeSearch({ page: n <= 1 ? null : String(n) })
    navigate({ pathname: `${ROUTE_CATEGORIES}/${slug}`, search: s })
  }

  const listSkeleton = (
    <div className={styles.list}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.comicRow}>
          <Skeleton width="112px" height="149px" borderRadius="8px" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton height="14px" width="40%" borderRadius="4px" />
            <Skeleton height="22px" width="85%" borderRadius="4px" />
            <Skeleton height="14px" width="60%" borderRadius="4px" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <Helmet>
        <title>
          {slug && categoryResult
            ? `${categoryResult.title} - TruyenSS`
            : 'Thể loại truyện - TruyenSS'}
        </title>
      </Helmet>

      <Container className="py-3 py-md-4">
        {!slug && (
          <>
            <div className={styles.hero}>
              <h1 className={styles.title}>Thể loại truyện</h1>
              <p className={styles.subtitle}>
                Chọn thể loại để xem danh sách truyện. Giao diện danh sách theo từng thể loại được làm tương tự TruyenQQ.
              </p>
            </div>

            {isError && <p className={styles.errorText}>Không thể tải thể loại. Vui lòng thử lại sau.</p>}

            {isLoading && (
              <div className={styles.categoryGrid}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <Skeleton key={i} width="100px" height="36px" borderRadius="999px" />
                ))}
              </div>
            )}

            {!isLoading && !isError && (
              <div className={styles.categoryGrid}>
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`${ROUTE_CATEGORIES}/${category.slug}`}
                    className={styles.categoryBadge}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {slug && (
          <>
            <header className={styles.pageHead}>
              <h1 className={styles.pageTitle}>
                Truyện {categoryResult?.title ?? '…'}
              </h1>
              <p className={styles.pageLead}>
                Danh sách truyện thuộc thể loại này. Dùng bộ lọc bên dưới để thu hẹp (nếu API hỗ trợ tham số tương
                ứng).
              </p>
            </header>

            <div className={styles.filterPanel}>
              <div className={styles.filterRow}>
                <div className={styles.filterKey}>Thể loại truyện</div>
                <div className={styles.filterVal}>
                  {isLoading ? (
                    <Spinner animation="border" size="sm" variant="warning" />
                  ) : (
                    <>
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          to={`${ROUTE_CATEGORIES}/${cat.slug}`}
                          className={`${styles.filterLink} ${styles.catPill} ${cat.slug === slug ? styles.filterLinkActive : ''}`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.filterRow}>
                <div className={styles.filterKey}>Tình trạng</div>
                <div className={styles.filterVal}>
                  {STATUS_OPTIONS.map(opt => (
                    <Link
                      key={`st-${opt.key}`}
                      to={{
                        pathname: `${ROUTE_CATEGORIES}/${slug}`,
                        search: mergeSearch({ status: opt.key || null }),
                      }}
                      className={`${styles.filterLink} ${statusFilter === opt.key ? styles.filterLinkActive : ''}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.filterRow}>
                <div className={styles.filterKey}>Quốc gia</div>
                <div className={styles.filterVal}>
                  {COUNTRY_OPTIONS.map(opt => (
                    <Link
                      key={`ct-${opt.key}`}
                      to={{
                        pathname: `${ROUTE_CATEGORIES}/${slug}`,
                        search: mergeSearch({ country: opt.key || null }),
                      }}
                      className={`${styles.filterLink} ${countryFilter === opt.key ? styles.filterLinkActive : ''}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.filterRow}>
                <div className={styles.filterKey}>Sắp xếp</div>
                <div className={styles.filterVal}>
                  {SORT_OPTIONS.map(opt => (
                    <Link
                      key={`so-${opt.key}`}
                      to={{
                        pathname: `${ROUTE_CATEGORIES}/${slug}`,
                        search: mergeSearch({ sort: opt.key || null }),
                      }}
                      className={`${styles.filterLink} ${sortFilter === opt.key ? styles.filterLinkActive : ''}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {isCategoryError && <p className={styles.errorText}>Không thể tải truyện theo thể loại này.</p>}

            <div className={styles.resultsWrap}>
              {isCategoryLoading && !categoryResult && listSkeleton}

              {!isCategoryLoading && !isCategoryError && categoryResult && (
                <>
                  <div className={styles.list}>
                    {categoryResult.comics.map(comic => (
                      <article key={comic.id} className={styles.comicRow}>
                        <Link to={`/truyen/${comic.slug}`} className={styles.rowCover}>
                          <img src={comic.coverUrl} alt="" loading="lazy" />
                        </Link>
                        <div className={styles.rowBody}>
                          <div className={styles.rowTime}>{comic.updatedAt}</div>
                          <h2 className={styles.rowTitle}>
                            <Link to={`/truyen/${comic.slug}`}>{comic.title}</Link>
                          </h2>
                          <div className={styles.rowStats}>
                            Lượt xem:{' '}
                            {comic.viewCount > 0 ? comic.viewCount.toLocaleString('vi-VN') : '—'}
                            <span aria-hidden> · </span>
                            Lượt theo dõi: —
                          </div>
                          <div className={styles.rowChapter}>{comic.latestChapter}</div>
                          <div className={styles.rowStatus}>Tình trạng: {comicStatusVi(comic.status)}</div>
                          {comic.categories.length > 0 && (
                            <div className={styles.rowTags}>
                              {comic.categories.map(name => (
                                <span key={name} className={styles.tag}>
                                  {name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className={styles.paginationWrap}>
                      <div className={styles.pageMeta}>
                        Trang {categoryResult.pagination.currentPage} / {totalPages}
                      </div>
                      <Pagination>
                        <Pagination.Prev disabled={page <= 1} onClick={() => goPage(page - 1)} />
                        {(() => {
                          const current = categoryResult.pagination.currentPage
                          const items: React.ReactNode[] = []

                          items.push(
                            <Pagination.Item key={1} active={current === 1} onClick={() => goPage(1)}>
                              1
                            </Pagination.Item>,
                          )

                          if (current > 3) {
                            items.push(<Pagination.Ellipsis key="e1" disabled />)
                          }

                          for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
                            items.push(
                              <Pagination.Item key={i} active={current === i} onClick={() => goPage(i)}>
                                {i}
                              </Pagination.Item>,
                            )
                          }

                          if (current < totalPages - 2) {
                            items.push(<Pagination.Ellipsis key="e2" disabled />)
                          }

                          if (totalPages > 1) {
                            items.push(
                              <Pagination.Item
                                key={totalPages}
                                active={current === totalPages}
                                onClick={() => goPage(totalPages)}
                              >
                                {totalPages}
                              </Pagination.Item>,
                            )
                          }

                          return items
                        })()}
                        <Pagination.Next disabled={page >= totalPages} onClick={() => goPage(page + 1)} />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </Container>
    </>
  )
}
