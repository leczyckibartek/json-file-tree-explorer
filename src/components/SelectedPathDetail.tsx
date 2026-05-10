import { type TreeNodeData } from '@/lib/types'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

type SelectedPathDetailProps = {
	node: TreeNodeData
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

	const currentNode: TreeNodeData | null = path === ''
		? node
		: node.type === 'folder'
			? findNodeByRelativePath(node.children, path)
			: null

	return (
		<div className="border border-gray-600 shadow-xl rounded-md px-10 py-12 max-w-md mx-auto">
			{!currentNode ? (
				<h1>Path not found</h1>
			) : currentNode.type === 'file' ? (
				<section className="space-y-4">
					<div >
						<p className="text-neutral-400">Name</p>
						<p className="mt-1">{currentNode.name}</p>
					</div>
					<div>
						<p className="text-neutral-400">Size</p>
						<p className="mt-1">{formatSize(currentNode.size)}</p>
					</div>
					<div>
						<p className="text-neutral-400">Full path from root</p>
						<p className="mt-1 break-all">{(path === '' ? '/' : `/${path}`)}</p>
					</div>
				</section>
			) : (
				<section className="space-y-4">

					<div className="space-y-3">
						<div>
							<p className="text-neutral-400">Name</p>
							<p className="mt-1">{currentNode.name}</p>
						</div>
						<div>
							<p className="text-neutral-400">Full path from root</p>
							<p className="mt-1 break-all">{(path === '' ? '/' : `/${path}`)}</p>
						</div>
						<div>
							<p className="text-neutral-400">Number of direct children</p>
							<p className="mt-1">{currentNode.children.length}</p>
						</div>

						<div>
							<p className="text-neutral-400">
								Total size of all files in the subtree
							</p>
							<p className="mt-1">
								{formatSize(subtreeFilesTotalBytes(currentNode))}
							</p>
						</div>
					</div>

					<div>
						<p className="text-neutral-400 mb-2">List of children</p>
						<ul className="list-disc pl-5 space-y-1">
							{currentNode.children.map((child) => {
								const childPath = path === ''
									? child.name
									: `${path}/${child.name}`
								return (
									<li key={childPath}>
										<Link
											to={`/tree/${encodeURIComponent(childPath)}${location.search}`}
											className="underline"
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