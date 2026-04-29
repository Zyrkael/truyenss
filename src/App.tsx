import { Container, Row, Col } from 'react-bootstrap'
import { ComicCard } from '~components/ComicCard'
import type { Comic } from '~types/comic'
import demoImage from '~assets/images/comic_cover_demo.png'

const DUMMY_COMICS: Comic[] = [
  {
    id: '1',
    title: 'Sự Trỗi Dậy Của Kiếm Khách Huyền Thoại',
    coverUrl: demoImage,
    latestChapter: 'Chương 128',
    viewCount: 1250000,
    status: 'ongoing',
    categories: ['Action', 'Fantasy'],
    updatedAt: '2 giờ trước',
  },
  {
    id: '2',
    title: 'Hành Trình Khám Phá Di Tích Cổ Đại Phần 2: Bí Mật Bị Lãng Quên',
    coverUrl: demoImage,
    latestChapter: 'Chương 45',
    viewCount: 850400,
    status: 'completed',
    categories: ['Adventure', 'Mystery'],
    updatedAt: '1 ngày trước',
  },
  {
    id: '3',
    title: 'Đế Vương Thức Tỉnh',
    coverUrl: demoImage,
    latestChapter: 'Chương 12',
    viewCount: 15400,
    status: 'paused',
    categories: ['Drama'],
    updatedAt: '1 tháng trước',
  },
  {
    id: '4',
    title: 'Ma Pháp Sư Cuối Cùng',
    coverUrl: demoImage,
    latestChapter: 'Chương 89',
    viewCount: 3200000,
    status: 'ongoing',
    categories: ['Magic', 'Action'],
    updatedAt: 'Vừa xong',
  },
]

function App() {
  return (
    <div style={{ padding: '40px 0', minHeight: '100vh', backgroundColor: '#0f0f1a' }}>
      <Container>
        <h1 style={{ color: '#fff', marginBottom: '30px', fontSize: '2rem' }}>
          Truyện Mới Cập Nhật
        </h1>
        <Row className="g-4">
          {DUMMY_COMICS.map(comic => (
            <Col key={comic.id} xs={6} sm={4} md={3} lg={2}>
              <ComicCard comic={comic} onClick={id => console.log('Clicked comic:', id)} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default App
