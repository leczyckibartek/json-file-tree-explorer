
import { useSearchParams } from "react-router-dom";
import { type TreeNodeData } from '@/lib/types'
import { useEffect, useState } from "react";

type TreeSearchProps = {
	node: TreeNodeData
}

type SearchResult = {
	node: TreeNodeData
	path: string
}

const searchNodes = (query: string, root: TreeNodeData): SearchResult[] => {
	const q = query.trim().toLowerCase()
	if (q.length === 0) return []

	const foundNodes: SearchResult[] = []

	const recursiveSearch = (node: TreeNodeData, pathPrefix: string) => {
		const fullPath = `${pathPrefix}/${node.name}`

		if (node.name.toLowerCase().includes(q)) {
			foundNodes.push({ node, path: fullPath })
		}

		if (node.type === 'folder') {
			node.children.forEach((childNode) => {
				recursiveSearch(childNode, fullPath)
			})
		}
	}

	recursiveSearch(root, '')

	return foundNodes
}

export default function TreeSearch({ node }: TreeSearchProps) {
	const [searchParams, setSearchParams] = useSearchParams();

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
	return (
		<>
			<div className="relative">
				<input
					type="text"
					value={String(searchParams.get('s') ?? '')}
					className="border-2 w-full text-2xl"
					onChange={(e) => handleInputChange(e.currentTarget.value)}
				/>
				<button
					className="absolute bg-(--bg) right-0 top-0 block px-5 h-full cursor-pointer hover:bg-gray-800 border-2"
					onClick={() => setSearchParams()}
				>
					Clear
				</button>
			</div>

			{foundNodes.length > 0 ?
				<ul>
					{foundNodes.map(({ node, path }) => (
						<li key={`${path}::${node.name}`}>
							{node.name} <code className="text-xs">{path}</code>
						</li>
					))}
				</ul>
				: String(searchParams.get("s") ?? "").length > 0 ?
					<p className="text-center text-2xl">No results found</p>
					: null
			}
		</>
	)
}