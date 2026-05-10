import type { FolderNode, TreeNodeData } from '@/lib/types'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

type SelectedPathDetailProps = {
	node: FolderNode
	path: string
}

/** Formats the size of a file in a human-readable way. */
const formatSize = (bytes: number): string => {
	if (bytes < 1024) {
		return `${bytes} B`
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(2)} KB`
	}
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** Sum of sizes of all files in this node’s subtree (recursive). */
function subtreeFilesTotalBytes(node: TreeNodeData): number {
	if (node.type === 'file') {
		return node.size
	}
	return node.children.reduce((sum, child) => sum + subtreeFilesTotalBytes(child), 0)
}

/** Finds the node at the given relative path. */
const findNodeByRelativePath = (
	siblings: TreeNodeData[],
	path: string
): TreeNodeData | null => {
	if (!path) return null
	const parts = path.split('/')
	let currentLevel = siblings

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i]
		const selected = currentLevel.find((item) => item.name === part)
		if (!selected) return null

		const isLast = i === parts.length - 1
		if (isLast) return selected

		if (selected.type === 'file') return null
		currentLevel = selected.children
	}

	return null
}

export default function SelectedPathDetail({ node, path }: SelectedPathDetailProps) {
	const location = useLocation()

	const currentNode: TreeNodeData | null =
		path === '' ? node : findNodeByRelativePath(node.children, path)

	return (
		<div className="vscode-detail">
			{!currentNode ? (
				<h2 className="vscode-panel-title">Path not found</h2>
			) : currentNode.type === 'file' ? (
				<section>
					<h2 className="vscode-panel-title">{currentNode.name}</h2>
					<div>
						<p className="vscode-kv-label">Name</p>
						<p className="vscode-kv-value">{currentNode.name}</p>
					</div>
					<div>
						<p className="vscode-kv-label">Size</p>
						<p className="vscode-kv-value">{formatSize(currentNode.size)}</p>
					</div>
					<div>
						<p className="vscode-kv-label">Full path from root</p>
						<p className="vscode-kv-value vscode-break-word">{(path === '' ? '/' : `/${path}`)}</p>
					</div>
				</section>
			) : (
				<section>
					<h2 className="vscode-panel-title">{currentNode.name}</h2>

					<div>
						<p className="vscode-kv-label">Name</p>
						<p className="vscode-kv-value">{currentNode.name}</p>
					</div>
					<div>
						<p className="vscode-kv-label">Full path from root</p>
						<p className="vscode-kv-value vscode-break-word">{(path === '' ? '/' : `/${path}`)}</p>
					</div>
					<div>
						<p className="vscode-kv-label">Number of direct children</p>
						<p className="vscode-kv-value">{currentNode.children.length}</p>
					</div>

					<div>
						<p className="vscode-kv-label">
							Total size of all files in the subtree
						</p>
						<p className="vscode-kv-value">
							{formatSize(subtreeFilesTotalBytes(currentNode))}
						</p>
					</div>

					<div>
						<p className="vscode-kv-label vscode-kv-label-list">List of children</p>
						<ul>
							{currentNode.children.map((child) => {
								const childPath = path === ''
									? child.name
									: `${path}/${child.name}`
								return (
									<li key={childPath}>
										<Link
											to={`/tree/${encodeURIComponent(childPath)}${location.search}`}
										>
											{child.name}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				</section>
			)}
		</div>
	)
}
