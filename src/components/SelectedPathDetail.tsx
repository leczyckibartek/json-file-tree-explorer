import type { ReactNode } from 'react'
import { formatFileSize } from '@/lib/formatFileSize'
import type { FolderNode, TreeNodeData } from '@/lib/types'
import { Link, useLocation } from 'react-router-dom'

type SelectedPathDetailProps = {
	node: FolderNode
	path: string
}

type DetailRowProps = {
	label: string
	value: ReactNode
}

function DetailRow({ label, value }: DetailRowProps) {
	return (
		<div>
			<p className="vscode-kv-label">{label}</p>
			<p className="vscode-kv-value">{value}</p>
		</div>
	)
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
	const parts = path.split('/').filter(Boolean)
	if (parts.length === 0) return null
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
	const fullPath = path === '' ? '/' : `/${path}`

	return (
		<div className="vscode-detail">
			{!currentNode ? (
				<h2 className="vscode-panel-title">Path not found</h2>
			) : currentNode.type === 'file' ? (
				<section>
					<h2 className="vscode-panel-title">{currentNode.name}</h2>
					<DetailRow label="Name" value={currentNode.name} />
					<DetailRow label="Size" value={formatFileSize(currentNode.size)} />
					<div>
						<p className="vscode-kv-label">Full path from root</p>
						<p className="vscode-kv-value vscode-break-word">{fullPath}</p>
					</div>
				</section>
			) : (
				<section>
					<h2 className="vscode-panel-title">{currentNode.name}</h2>

					<DetailRow label="Name" value={currentNode.name} />
					<div>
						<p className="vscode-kv-label">Full path from root</p>
						<p className="vscode-kv-value vscode-break-word">{fullPath}</p>
					</div>
					<DetailRow
						label="Number of direct children"
						value={currentNode.children.length}
					/>

					<DetailRow
						label="Total size of all files in the subtree"
						value={formatFileSize(subtreeFilesTotalBytes(currentNode))}
					/>

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
