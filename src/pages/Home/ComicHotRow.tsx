import React from 'react'
import { Link } from 'react-router-dom'
import type { Comic } from '~types/comic'
import styles from './ComicHotRow.module.scss'

const ROUTE_COMIC_BASE = '/truyen'
const HOT_BADGE_MAX_RANK = 3

interface ComicHotRowProps {
  comic: Comic
  rank: number
}

export const ComicHotRow: React.FC<ComicHotRowProps> = ({ comic, rank }) => {
  const showHot = rank <= HOT_BADGE_MAX_RANK

  return (
    <Link to={`${ROUTE_COMIC_BASE}/${comic.slug}`} className={styles.row}>
      <div className={styles.thumbWrap}>
        <img
          src={comic.coverUrl}
          alt={comic.title}
          className={styles.thumb}
          width={56}
          height={78}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <div className={styles.metaLine}>
          <span className={styles.time}>{comic.updatedAt}</span>
          {showHot && <span className={styles.hot}>Hot</span>}
        </div>
        <h3 className={styles.title}>{comic.title}</h3>
        <p className={styles.chapter}>{comic.latestChapter}</p>
      </div>
    </Link>
  )
}
