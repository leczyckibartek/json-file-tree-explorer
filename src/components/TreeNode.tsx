import angleIcon from '@/assets/angle-right-solid.png'
import fileIcon from '@/assets/file-regular.png'
import folderIcon from '@/assets/folder-regular.png'
import { type TreeNodeData } from '@/lib/types'
import { Link, useLocation } from 'react-router-dom'

type TreeNodeProps = {
	node: TreeNodeData,
	path: string,
	expandedPaths: Set<string>,
	onToggle: (path: string) => void
}

export default function TreeNode({ node, path, expandedPaths, onToggle }: TreeNodeProps) {

	const location = useLocation()

	if (node.type === "file") return (
		<Link
			to={`/tree${path}${location.search}`}
			className="cursor-pointer hover:bg-current/10 w-full text-left block"
		>
			<img src={fileIcon} className="inline" width="20" height="20" alt="" />
			<span>{node.name}</span>
			{/* <code>{path}</code> */}
		</Link>
	)

	const isExpanded = expandedPaths.has(path)

	return (
		<>
			<Link
				to={`/tree${path}${location.search}`}
				onClick={() => onToggle(path)}
				className="cursor-pointer hover:bg-current/10 w-full text-left block"
			>
				<img src={angleIcon}
					className={`inline ${isExpanded ? 'rotate-90' : ''}`}
					width="20"
					height="20"
					alt=""
				/>
				<img
					src={folderIcon}
					className="inline"
					width="20"
					height="20"
					alt=""
				/>
				<span>{node.name}</span>
				{/* <code>{path}</code> */}
			</Link>
			{isExpanded &&
				<div className="pl-7">
					{node.children.map((child) => (
						<TreeNode
							key={`${path}/${child.name}`}
							node={child}
							path={`${path}/${child.name}`}
							expandedPaths={expandedPaths}
							onToggle={onToggle}
						/>
					))}
				</div>
			}
		</>
	);
}