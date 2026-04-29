export interface OTruyenCategory {
  id: string
  name: string
  slug: string
}

export interface OTruyenLatestChapter {
  chapter_name: string
}

export interface OTruyenComicItem {
  _id: string
  name: string
  slug: string
  status: string
  thumb_url: string
  category: OTruyenCategory[]
  updatedAt: string
  chaptersLatest: OTruyenLatestChapter[] | null
}

export interface OTruyenHomeData {
  items: OTruyenComicItem[]
  APP_DOMAIN_CDN_IMAGE: string
}

export interface OTruyenHomeResponse {
  status: string
  message: string
  data: OTruyenHomeData
}

export interface OTruyenCategoryListData {
  items: OTruyenCategory[]
}

export interface OTruyenCategoryListResponse {
  status: string
  message: string
  data: OTruyenCategoryListData
}

export interface OTruyenPagination {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  pageRanges: number
}

export interface OTruyenCategoryComicsData {
  titlePage: string
  items: OTruyenComicItem[]
  APP_DOMAIN_CDN_IMAGE: string
  params: {
    pagination: OTruyenPagination
  }
}

export interface OTruyenCategoryComicsResponse {
  status: string
  message: string
  data: OTruyenCategoryComicsData
}

export interface OTruyenChapter {
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
}

export interface OTruyenChapterServer {
  server_name: string
  server_data: OTruyenChapter[]
}

export interface OTruyenComicDetailItem {
  _id: string
  name: string
  slug: string
  content: string
  status: string
  thumb_url: string
  author: string[]
  category: OTruyenCategory[]
  chapters: OTruyenChapterServer[]
  updatedAt: string
}

export interface OTruyenComicDetailData {
  item: OTruyenComicDetailItem
  APP_DOMAIN_CDN_IMAGE: string
}

export interface OTruyenComicDetailResponse {
  status: string
  message: string
  data: OTruyenComicDetailData
}
