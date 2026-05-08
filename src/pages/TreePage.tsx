import TreeNode from "../components/TreeNode";
import { useState } from "react";
import { exampleInput } from "../lib/data";

export function TreePage() {
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

	return (
		<section className="py-64">
			<TreeNode
				node={exampleInput}
				path=""
				expandedPaths={expandedPaths}
				onToggle={handleToggle} />
		</section>
	)
}

