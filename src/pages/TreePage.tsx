import TreeNode from '../components/TreeNode'
import { useState } from 'react'
import { exampleInput } from '../lib/data'
import { useParams } from 'react-router-dom'
import SelectedPathDetail from '../components/SelectedPathDetail'
import TreeSearch from '../components/TreeSearch'

export function TreePage() {

	const params = useParams()
	const nodePath = params['*'] ?? ''
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
		<section className="py-24 flex flex-wrap">
			<section className='w-full py-24'>
				<TreeSearch
					node={exampleInput}
				/>
			</section>
			<div className="w-1/2">
				<TreeNode
					node={exampleInput}
					path=""
					expandedPaths={expandedPaths}
					onToggle={handleToggle}
				/>
			</div>
			<div className="w-1/2">
				{nodePath &&
					<SelectedPathDetail
						node={exampleInput}
						path={nodePath}
					/>
				}
			</div>
		</section>
	)
}

