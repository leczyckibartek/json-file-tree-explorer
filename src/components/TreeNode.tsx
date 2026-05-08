import { type TreeNodeData } from "../lib/types";
import folderIcon from '../assets/folder-regular.png'
import fileIcon from '../assets/file-regular.png'
import angleIcon from '../assets/angle-right-solid.png'

type TreeNodeProps = {
	node: TreeNodeData,
	path: string,
	expandedPaths: Set<string>,
	onToggle: (path: string) => void
}

export default function TreeNode({ node, path, expandedPaths, onToggle }: TreeNodeProps) {

	if (node.type === "file") return (
		<div>
			<img src={fileIcon} className="inline" width="20" height="20" alt="" />
			{node.name}
			{/* <code>{path}</code> */}
		</div>
	)

	const isExpanded = expandedPaths.has(path)

	return (
		<>
			<button
				onClick={() => onToggle(path)}
				className="cursor-pointer hover:bg-current/10 w-full text-left"
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
				{node.name}
				{/* <code>{path}</code> */}
			</button>
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