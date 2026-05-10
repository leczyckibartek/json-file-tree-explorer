import { Link, Route, Routes } from 'react-router-dom'

import { HomePage } from '@/pages/HomePage'
import { TreePage } from '@/pages/TreePage'

function App() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-white/8 bg-black/40 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-[960px] items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="text-(--text-h) underline underline-offset-2"
          >
            Home
          </Link>
          <Link
            to="/tree"
            className="text-(--text-h) underline underline-offset-2"
          >
            Tree
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/tree/:nodePath" element={<TreePage />} />
      </Routes>
    </>
  )
}

export default App
