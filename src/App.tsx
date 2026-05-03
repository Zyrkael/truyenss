import { Helmet } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts'
import { Home } from './pages/Home'
import { Category } from './pages/Category'
import { Forbidden } from './pages/Forbidden'
import { NotFound } from './pages/NotFound'
import { ComicDetail } from './pages/ComicDetail'
import { ComicReader } from './pages/ComicReader'

function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>TruyenSS - Truyện Mới Cập Nhật</title>
        <meta
          name="description"
          content="Nền tảng đọc truyện trực tuyến, cập nhật truyện tranh nhanh nhất, giao diện đẹp và hiện đại."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="the-loai" element={<Category />} />
            <Route path="the-loai/:slug" element={<Category />} />
            <Route path="truyen/:slug/doc/:chapterOrder" element={<ComicReader />} />
            <Route path="truyen/:slug" element={<ComicDetail />} />
            <Route path="403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
