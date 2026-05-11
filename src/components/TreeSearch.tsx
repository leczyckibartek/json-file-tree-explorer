import { Link, useLocation, useSearchParams } from 'react-router-dom'
import type { FolderNode, TreeNodeData } from '@/lib/types'
import { useEffect, useState } from 'react'

/** Same URL shape as `TreeNode` `treeHref` (paths here have no leading slash). */
function searchResultHref(nodePath: string, search: string): string {
	return nodePath === ''
		? `/tree${search}`
		: `/tree/${encodeURIComponent(nodePath)}${search}`
}

type TreeSearchProps = {
	node: FolderNode
}

type SearchResult = {
	node: TreeNodeData
	path: string
}

const searchNodes = (query: string, root: FolderNode): SearchResult[] => {
	const q = query.trim().toLowerCase()
	if (q.length === 0) return []

	const foundNodes: SearchResult[] = []

	const recursiveSearch = (node: TreeNodeData, currentPath: string) => {
		if (node.name.toLowerCase().includes(q)) {
			foundNodes.push({ node, path: currentPath })
		}

		if (node.type === 'folder') {
			node.children.forEach((childNode) => {
				const childPath = currentPath === ''
					? childNode.name
					: `${currentPath}/${childNode.name}`
				recursiveSearch(childNode, childPath)
			})
		}
	}

	recursiveSearch(root, '')

	return foundNodes
}

export default function TreeSearch({ node }: TreeSearchProps) {
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()

	const [foundNodes, setFoundNodes] = useState<SearchResult[]>([]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const search = String(searchParams.get("s") ?? "");
			const result = searchNodes(search, node);

			setFoundNodes(result);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchParams, node]);

	const handleInputChange = (input: string) => {
		if (input.length > 0)
			setSearchParams({ s: input })
		else
			setSearchParams()
	}
	const query = String(searchParams.get('s') ?? '')

	return (
		<div className="vscode-sidebar-search">
			<div className="vscode-search-wrap">
				<div className="vscode-search-input-wrap">
					<input
						type="text"
						placeholder="Filter (search by name)"
						aria-label="Filter explorer"
						value={query}
						className="vscode-search-input"
						onChange={(e) => handleInputChange(e.currentTarget.value)}
					/>
					{query.length > 0 && (
						<button
							type="button"
							className="vscode-search-clear"
							onClick={() => setSearchParams()}
						>
							Clear
						</button>
					)}
				</div>
			</div>

			{foundNodes.length > 0 ? (
				<div className="vscode-search-results-scroll">
					<ul className="vscode-search-results">
						{foundNodes.map(({ node: hit, path }) => {
							const displayPath = path === '' ? '/' : `/${path}`
							const to = searchResultHref(path, location.search)
							return (
								<li key={`${path}::${hit.name}`}>
									<Link
										to={to}
										className="vscode-search-hit"
										title={displayPath}
									>
										{hit.name} <code>{displayPath}</code>
									</Link>
								</li>
							)
						})}
					</ul>
				</div>
			) : query.length > 0 ? (
				<p className="vscode-hint vscode-search-empty">No results found</p>
			) : null}
		</div>
	)
}
