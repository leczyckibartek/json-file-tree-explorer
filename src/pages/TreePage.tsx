import TreeNode from '../components/TreeNode'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SelectedPathDetail from '../components/SelectedPathDetail'
import TreeSearch from '../components/TreeSearch'
import { loadTreeFromStorage } from '../lib/storage'

export function TreePage() {

	const [loadResult] = useState(() => loadTreeFromStorage())

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


	if (loadResult.status === "empty") {
		return (
			<section className="py-24 px-4 max-w-2xl">
				<h1 className="text-xl font-semibold text-(--text-h) mb-3">
					No tree loaded
				</h1>
				<p className="text-neutral-400 mb-4">
					Paste or upload JSON on the home page first.
				</p>
				<Link to="/" className="underline">
					Go to home
				</Link>
			</section>
		)
	}

	if (loadResult.status === "invalid") {
		return (
			<section className="py-24 px-4 max-w-2xl">
				<h1 className="text-xl font-semibold text-(--text-h) mb-3">
					Saved JSON is invalid
				</h1>
				<p className="text-neutral-400 mb-2">
					The data in this browser could not be turned into a tree. Fix or
					replace it on the home page.
				</p>
				<p role="alert" className="text-red-400 mb-4">
					{loadResult.message}
				</p>
				<Link to="/" className="underline">
					Go to home
				</Link>
			</section>
		)
	}

	const tree = loadResult.tree

	return (
		<section className="py-24 flex flex-wrap">
			<section className='w-full py-24'>
				<TreeSearch
					node={tree}
				/>
			</section>
			<div className="w-1/2">
				<TreeNode
					node={tree}
					path=""
					expandedPaths={expandedPaths}
					onToggle={handleToggle}
				/>
			</div>
			<div className="w-1/2">
				{nodePath &&
					<SelectedPathDetail
						node={tree}
						path={nodePath}
					/>
				}
			</div>
		</section>
	)
}

