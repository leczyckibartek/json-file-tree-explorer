import TreeNode from '@/components/TreeNode'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SelectedPathDetail from '@/components/SelectedPathDetail'
import TreeSearch from '@/components/TreeSearch'
import { loadTreeFromStorage } from '@/lib/storage'

export function TreePage() {

	const [loadResult] = useState(() => loadTreeFromStorage())

	const params = useParams()
	let nodePath = ''
	if (params.nodePath != null && params.nodePath !== '') {
		try {
			nodePath = decodeURIComponent(params.nodePath)
		}
		catch {
			nodePath = ''
		}
	}
	const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

	const handleToggle = (path: string) => {
		setExpandedPaths((prev) => {
			const next = new Set(prev)
			if (next.has(path)) {
				next.delete(path)
			}
			else {
				next.add(path)
			}
			return next
		})
	}


	if (loadResult.status === "empty") {
		return (
			<div className="vscode-editor-panel">
				<div className="vscode-empty-state">
					<h2 className="vscode-panel-title">No tree loaded</h2>
					<p className="vscode-paragraph-spacing">
						Paste or upload JSON on the home page first.
					</p>
					<Link to="/">← Go to home</Link>
				</div>
			</div>
		)
	}

	if (loadResult.status === "invalid") {
		return (
			<div className="vscode-editor-panel">
				<div className="vscode-empty-state">
					<h2 className="vscode-panel-title">Saved JSON is invalid</h2>
					<p className="vscode-paragraph-spacing">
						The data in this browser could not be turned into a tree. Fix or
						replace it on the home page.
					</p>
					<p role="alert" className="vscode-alert vscode-paragraph-spacing">{loadResult.message}</p>
					<Link to="/">← Go to home</Link>
				</div>
			</div>
		)
	}

	const tree = loadResult.tree

	return (
		<div className="vscode-split">
			<aside className="vscode-sidebar" aria-label="Explorer">
				<div className="vscode-sidebar-header">Explorer</div>
				<TreeSearch node={tree} />
				<div className="vscode-sidebar-scroll">
					<TreeNode
						node={tree}
						path=""
						expandedPaths={expandedPaths}
						onToggle={handleToggle}
					/>
				</div>
			</aside>
			<div className="vscode-editor-panel">
				<SelectedPathDetail
					node={tree}
					path={nodePath}
				/>
			</div>
		</div>
	)
}
