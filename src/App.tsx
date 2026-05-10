import { NavLink, Route, Routes } from 'react-router-dom'
import '@/styles/index.css'

import { HomePage } from '@/pages/HomePage'
import { TreePage } from '@/pages/TreePage'

function App() {
  return (
    <div className="vscode-workbench">
      <header className="vscode-titlebar">
        <div className="vscode-titlebar-drag">JSON File Tree Explorer</div>
        <nav className="vscode-titlebar-nav" aria-label="Window">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `vscode-titlebar-link${isActive ? ' is-active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/tree"
            className={({ isActive }) =>
              `vscode-titlebar-link${isActive ? ' is-active' : ''}`
            }
          >
            Explorer
          </NavLink>
        </nav>
      </header>

      <div className="vscode-main">
        <aside className="vscode-activitybar" aria-label="Activity">
          <NavLink
            to="/"
            end
            title="Home"
            className={({ isActive }) =>
              `vscode-activity-item${isActive ? ' is-active' : ''}`
            }
          >
            <span className="vscode-activity-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" opacity="0.9" />
              </svg>
            </span>
          </NavLink>
          <NavLink
            to="/tree"
            end={false}
            title="Explorer"
            className={({ isActive }) =>
              `vscode-activity-item${isActive ? ' is-active' : ''}`
            }
          >
            <span className="vscode-activity-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 5h6l1 2h7v11H5V5z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </NavLink>
        </aside>

        <div className="vscode-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tree" element={<TreePage />} />
            <Route path="/tree/:nodePath" element={<TreePage />} />
          </Routes>
        </div>
      </div>

      <footer className="vscode-statusbar" role="status">
        <span className="vscode-statusbar-item">Dark+</span>
        <span className="vscode-statusbar-item">UTF-8</span>
        <span className="vscode-statusbar-item">JSON tree</span>
      </footer>
    </div>
  )
}

export default App
