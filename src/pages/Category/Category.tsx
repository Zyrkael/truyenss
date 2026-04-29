import React from 'react'
import { Badge, Col, Container, Pagination, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ComicCard } from '~components/ComicCard'
import { Skeleton } from '~components/Skeleton'
import { getComicCategories, getComicsByCategory } from '~services/comic'
import styles from './Category.module.scss'

const BADGE_TONE_CLASSES = [
  styles.badgeTone0,
  styles.badgeTone1,
  styles.badgeTone2,
  styles.badgeTone3,
  styles.badgeTone4,
  styles.badgeTone5,
  styles.badgeTone6,
  styles.badgeTone7,
]

const getBadgeToneClass = (value: string) => {
  const hash = Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return BADGE_TONE_CLASSES[hash % BADGE_TONE_CLASSES.length]
}

export const Category: React.FC = () => {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const [searchParams] = useSearchParams()
  const pageParam = Number(searchParams.get('page') ?? '1')
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['comic-categories'],
    queryFn: getComicCategories,
  })

  const {
    data: categoryResult,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery({
    queryKey: ['category-comics', slug, page],
    queryFn: () => getComicsByCategory(slug ?? '', page),
    enabled: Boolean(slug),
    placeholderData: keepPreviousData,
  })

  return (
    <>
      <Helmet>
        <title>
          {slug && categoryResult
            ? `${categoryResult.title} - TruyenSS`
            : 'Thể loại truyện - TruyenSS'}
        </title>
      </Helmet>

      <Container className="py-5">
        <div className={styles.hero}>
          <h1 className={styles.title}>
            {slug && categoryResult ? categoryResult.title : 'Thể loại truyện'}
          </h1>
          <p className={styles.subtitle}>
            Khám phá thế giới truyện tranh đa dạng với hàng ngàn đầu truyện hấp dẫn được phân loại chi tiết theo từng sở
            thích.
          </p>
        </div>

        {isError && <p className="text-center">Không thể tải thể loại. Vui lòng thử lại sau.</p>}

        {isLoading && (
          <div className={styles.categoryGrid}>
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} width="110px" height="42px" borderRadius="100px" />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className={styles.categoryGrid}>
            <Badge
              as={Link}
              to="/the-loai"
              bg="secondary"
              className={`${styles.categoryBadge} ${styles.allBadge} ${!slug ? styles.activeBadge : ''}`}
            >
              Tất cả
            </Badge>
            {categories.map((category, index) => (
              <Badge
                as={Link}
                to={`/the-loai/${category.slug}`}
                key={category.id}
                bg="secondary"
                className={`${styles.categoryBadge} ${getBadgeToneClass(category.slug)} ${slug === category.slug ? styles.activeBadge : ''}`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {slug && (
          <section className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>
              {categoryResult ? `Truyện ${categoryResult.title.toLowerCase()}` : 'Đang tải...'}
            </h2>

            {isCategoryError && <p>Không thể tải truyện theo thể loại này.</p>}

            {isCategoryLoading && (
              <div className={styles.resultsWrap}>
                <Row className="g-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Col key={i} xs={6} sm={4} md={3} lg={2}>
                      <Skeleton height="320px" borderRadius="16px" />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {!isCategoryLoading && !isCategoryError && categoryResult && (
              <div className={styles.resultsWrap}>
                <Row className="g-4">
                  {categoryResult.comics.map(comic => (
                    <Col key={comic.id} xs={6} sm={4} md={3} lg={2}>
                      <ComicCard comic={comic} onClick={comicSlug => navigate(`/truyen/${comicSlug}`)} />
                    </Col>
                  ))}
                </Row>
                {categoryResult.pagination.totalItems > categoryResult.pagination.totalItemsPerPage && (
                  <div className={styles.paginationWrap}>
                    <div className={styles.pageMeta}>
                      Trang {categoryResult.pagination.currentPage} /{' '}
                      {Math.ceil(
                        categoryResult.pagination.totalItems /
                          categoryResult.pagination.totalItemsPerPage,
                      )}
                    </div>
                    <Pagination>
                      <Pagination.Prev
                        disabled={categoryResult.pagination.currentPage <= 1}
                        onClick={() =>
                          navigate(`/the-loai/${slug}?page=${categoryResult.pagination.currentPage - 1}`)
                        }
                      />

                      {(() => {
                        const totalPages = Math.ceil(
                          categoryResult.pagination.totalItems / categoryResult.pagination.totalItemsPerPage,
                        )
                        const current = categoryResult.pagination.currentPage
                        const items = []

                        // Always show first page
                        items.push(
                          <Pagination.Item
                            key={1}
                            active={current === 1}
                            onClick={() => navigate(`/the-loai/${slug}?page=1`)}
                          >
                            1
                          </Pagination.Item>,
                        )

                        if (current > 3) {
                          items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />)
                        }

                        // Pages around current
                        for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
                          items.push(
                            <Pagination.Item
                              key={i}
                              active={current === i}
                              onClick={() => navigate(`/the-loai/${slug}?page=${i}`)}
                            >
                              {i}
                            </Pagination.Item>,
                          )
                        }

                        if (current < totalPages - 2) {
                          items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />)
                        }

                        // Always show last page
                        if (totalPages > 1) {
                          items.push(
                            <Pagination.Item
                              key={totalPages}
                              active={current === totalPages}
                              onClick={() => navigate(`/the-loai/${slug}?page=${totalPages}`)}
                            >
                              {totalPages}
                            </Pagination.Item>,
                          )
                        }

                        return items
                      })()}

                      <Pagination.Next
                        disabled={
                          categoryResult.pagination.currentPage >=
                          Math.ceil(
                            categoryResult.pagination.totalItems /
                              categoryResult.pagination.totalItemsPerPage,
                          )
                        }
                        onClick={() =>
                          navigate(`/the-loai/${slug}?page=${categoryResult.pagination.currentPage + 1}`)
                        }
                      />
                    </Pagination>
                  </div>
                )}

              </div>
            )}
          </section>
        )}
      </Container>

    </>
  )
}
