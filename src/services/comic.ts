import { get } from '~services/http'
import type { Comic } from '~types/comic'
import type {
  OTruyenCategoryComicsResponse,
  OTruyenCategoryListResponse,
  OTruyenComicDetailResponse,
  OTruyenComicItem,
  OTruyenHomeResponse,
} from '~types/otruyen'

const mapStatus = (status: string): Comic['status'] => {
  if (status === 'completed') return 'completed'
  if (status === 'ongoing') return 'ongoing'
  return 'paused'
}

const formatUpdatedAt = (updatedAt: string) => {
  const date = new Date(updatedAt)
  if (Number.isNaN(date.getTime())) return updatedAt
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)
  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

const mapComic = (item: OTruyenComicItem, cdnDomain: string): Comic => ({
  id: item._id,
  slug: item.slug,
  title: item.name,
  coverUrl: `${cdnDomain}/uploads/comics/${item.thumb_url}`,
  latestChapter: item.chaptersLatest?.[0]?.chapter_name
    ? `Chương ${item.chaptersLatest[0].chapter_name}`
    : 'Đang cập nhật',
  viewCount: 0,
  status: mapStatus(item.status),
  categories: item.category.map(category => category.name),
  updatedAt: formatUpdatedAt(item.updatedAt),
})

export const getHomeComics = async (): Promise<Comic[]> => {
  const response = await get<OTruyenHomeResponse>('/home')
  return response.data.items.map(item => mapComic(item, response.data.APP_DOMAIN_CDN_IMAGE))
}

export interface ComicDetail {
  id: string
  slug: string
  title: string
  description: string
  coverUrl: string
  status: string
  author: string
  categories: string[]
  updatedAt: string
  latestChapter: string
  chapterCount: number
}

export const getComicDetail = async (slug: string): Promise<ComicDetail> => {
  const response = await get<OTruyenComicDetailResponse>(`/truyen-tranh/${slug}`)
  const { item, APP_DOMAIN_CDN_IMAGE: cdnDomain } = response.data
  const allChapters = item.chapters.flatMap(server => server.server_data)
  const latestChapter = allChapters.at(-1)?.chapter_name ?? 'Đang cập nhật'

  return {
    id: item._id,
    slug: item.slug,
    title: item.name,
    description: item.content.replace(/<[^>]*>/g, '').trim(),
    coverUrl: `${cdnDomain}/uploads/comics/${item.thumb_url}`,
    status: mapStatus(item.status),
    author: item.author?.filter(Boolean).join(', ') || 'Đang cập nhật',
    categories: item.category.map(category => category.name),
    updatedAt: formatUpdatedAt(item.updatedAt),
    latestChapter: `Chương ${latestChapter}`,
    chapterCount: allChapters.length,
  }
}

export interface ComicCategory {
  id: string
  slug: string
  name: string
}

export const getComicCategories = async (): Promise<ComicCategory[]> => {
  const response = await get<OTruyenCategoryListResponse>('/the-loai')
  return response.data.items.map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
  }))
}

export interface CategoryComicResult {
  title: string
  comics: Comic[]
  pagination: {
    currentPage: number
    totalItems: number
    totalItemsPerPage: number
  }
}

export const getComicsByCategory = async (
  slug: string,
  page = 1,
): Promise<CategoryComicResult> => {
  const response = await get<OTruyenCategoryComicsResponse>(`/the-loai/${slug}`, {
    params: { page },
  })

  return {
    title: response.data.titlePage || slug,
    comics: response.data.items.map(item => mapComic(item, response.data.APP_DOMAIN_CDN_IMAGE)),
    pagination: {
      currentPage: response.data.params.pagination.currentPage,
      totalItems: response.data.params.pagination.totalItems,
      totalItemsPerPage: response.data.params.pagination.totalItemsPerPage,
    },
  }
}
