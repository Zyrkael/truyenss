import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import cn from 'clsx'
import type { Comic } from '~types/comic'
import styles from './ComicCard.module.scss'

interface ComicCardProps {
  comic: Comic
  onClick?: (slug: string) => void
}

const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

const STATUS_LABEL: Record<Comic['status'], string> = {
  ongoing: 'Đang ra',
  completed: 'Hoàn thành',
  paused: 'Tạm dừng',
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(comic.slug)
  }

  return (
    <Card className={cn('border-0', styles.comicCard)} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <Card.Img variant="top" src={comic.coverUrl} alt={comic.title} loading="lazy" />

        {/* Status Badge */}
        <Badge
          bg={
            comic.status === 'ongoing'
              ? 'success'
              : comic.status === 'completed'
                ? 'primary'
                : 'danger'
          }
          className={styles.statusBadge}
        >
          {STATUS_LABEL[comic.status]}
        </Badge>

        {comic.viewCount > 0 ? (
          <div className={styles.viewBadge}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {formatViews(comic.viewCount)}
          </div>
        ) : (
          <div className={styles.categoryBadge}>{comic.categories[0] ?? 'Truyện mới'}</div>
        )}

        {/* Read Overlay */}
        <div className={styles.readOverlay}>
          <span>Đọc ngay</span>
        </div>
      </div>

      <Card.Body className={styles.content}>
        <Card.Title className={styles.title} title={comic.title}>
          {comic.title}
        </Card.Title>
        <div className={styles.footer}>
          <span className={styles.chapter}>{comic.latestChapter}</span>
          <span className={styles.time}>{comic.updatedAt}</span>
        </div>
      </Card.Body>
    </Card>
  )
}
