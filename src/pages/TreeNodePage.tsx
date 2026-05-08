import { Link, useParams } from 'react-router-dom'

export function TreeNodePage() {
  const params = useParams()
  const nodePath = params['*'] ?? ''

  return (
    <section>
      <div>
        <h1><strong>path</strong>: {nodePath || '(empty)'}</h1>
        <p>
          Go back to <Link to="/tree">/tree</Link> or <Link to="/">/</Link>.
        </p>
      </div>
    </section>
  )
}

