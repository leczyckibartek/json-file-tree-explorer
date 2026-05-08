import { Link, Route, Routes } from 'react-router-dom'
import './App.css'

import { HomePage } from './pages/HomePage'
import { TreeNodePage } from './pages/TreeNodePage'
import { TreePage } from './pages/TreePage'

function App() {
  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <nav
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/tree">Tree</Link>
          <Link to="/tree/button">Tree/Button</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/tree/*" element={<TreeNodePage />} />
      </Routes>
    </>
  )
}

export default App
