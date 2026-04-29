import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import cn from 'clsx'
import type { Comic } from '~types/comic'
import styles from './ComicCard.module.scss'

interface ComicCardProps {
  comic: Comic
  onClick?: (id: string) => void
}

const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(comic.id)
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
          {comic.status}
        </Badge>

        {/* View Count */}
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
          <Badge bg="info" className={styles.chapter}>
            {comic.latestChapter}
          </Badge>
          <span className={styles.time}>{comic.updatedAt}</span>
        </div>
      </Card.Body>
    </Card>
  )
}
