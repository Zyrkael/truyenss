import React from 'react'
import { Badge, Col, Container, Pagination, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ComicCard } from '~components/ComicCard'
import { getComicCategories, getComicsByCategory } from '~services/comic'
import styles from './Category.module.scss'

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

      <Container className="py-4">
        <h1 className={styles.title}>{slug && categoryResult ? categoryResult.title : 'Thể loại'}</h1>

        {isError && <p>Không thể tải thể loại. Vui lòng thử lại sau.</p>}

        {!isLoading && !isError && (
          <div className={styles.categoryGrid}>
            {categories.map(category => (
              <Badge
                as={Link}
                to={`/the-loai/${category.slug}`}
                key={category.id}
                bg="secondary"
                className={styles.categoryBadge}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {slug && (
          <section className={styles.categorySection}>
            {isCategoryError && <p>Không thể tải truyện theo thể loại này.</p>}

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
                    <Pagination>
                      <Pagination.Prev
                        disabled={categoryResult.pagination.currentPage <= 1}
                        onClick={() =>
                          navigate(`/the-loai/${slug}?page=${categoryResult.pagination.currentPage - 1}`)
                        }
                      />
                      <Pagination.Item active>{categoryResult.pagination.currentPage}</Pagination.Item>
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
