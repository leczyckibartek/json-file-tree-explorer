import angleIcon from '@/assets/angle-right-solid.png'
import fileIcon from '@/assets/file-regular.png'
import folderIcon from '@/assets/folder-regular.png'
import { type TreeNodeData } from '@/lib/types'
import { NavLink, useLocation } from 'react-router-dom'

type TreeNodeProps = {
	node: TreeNodeData,
	path: string,
	depth?: number,
	expandedPaths: Set<string>,
	onToggle: (path: string) => void
}

function treeHref(path: string, search: string): string {
	return path === ''
		? `/tree${search}`
		: `/tree/${encodeURIComponent(path.slice(1))}${search}`
}

export default function TreeNode({ node, path, depth = 0, expandedPaths, onToggle }: TreeNodeProps) {

	const location = useLocation()
	const href = treeHref(path, location.search)
	const indentPx = 6 + depth * 14

	if (node.type === "file") return (
		<NavLink
			to={href}
			end
			style={{ paddingLeft: indentPx }}
			className={({ isActive }) =>
				`vscode-tree-row${isActive ? ' is-selected' : ''}`
			}
		>
			<img src={fileIcon} width="16" height="16" alt="" />
			<span>{node.name}</span>
		</NavLink>
	)

	const isExpanded = expandedPaths.has(path)

	return (
		<>
			<NavLink
				to={href}
				end
				onClick={() => onToggle(path)}
				style={{ paddingLeft: indentPx }}
				className={({ isActive }) =>
					`vscode-tree-row${isActive ? ' is-selected' : ''}`
				}
			>
				<img
					src={angleIcon}
					className={`vscode-tree-twistie${isExpanded ? ' is-open' : ''}`}
					width="16"
					height="16"
					alt=""
				/>
				<img
					src={folderIcon}
					width="16"
					height="16"
					alt=""
				/>
				<span>{node.name}</span>
			</NavLink>
			{isExpanded &&
				node.children.map((child) => (
					<TreeNode
						key={`${path}/${child.name}`}
						node={child}
						path={`${path}/${child.name}`}
						depth={depth + 1}
						expandedPaths={expandedPaths}
						onToggle={onToggle}
					/>
				))}
		</>
	);
}
